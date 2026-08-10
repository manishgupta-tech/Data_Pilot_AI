"""
Dataset Management Router: Uploads, Previews, Schema Trees, and Sample Datasets.
"""

import os
import shutil
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Form
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.models.dataset import Dataset, DatasetColumn
from backend.app.schemas.dataset import DatasetOut, DatasetPreviewOut, ColumnInfoSchema
from backend.app.api.deps import get_current_user
from backend.app.core.config import settings
from backend.app.dsa.tree import SchemaTree
from backend.app.analysis.data_quality import calculate_data_quality_score

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.get("", response_model=List[DatasetOut])
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    datasets = db.query(Dataset).filter((Dataset.user_id == current_user.id) | (Dataset.user_id == 1)).order_by(Dataset.created_at.desc()).all()
    res = []
    for d in datasets:
        cols = [ColumnInfoSchema(
            name=c.name,
            data_type=c.data_type,
            missing_count=c.missing_count,
            unique_count=c.unique_count
        ) for c in d.columns]
        res.append(DatasetOut(
            id=d.id,
            name=d.name,
            filename=d.filename,
            file_size_bytes=d.file_size_bytes,
            rows_count=d.rows_count,
            cols_count=d.cols_count,
            quality_score=d.quality_score,
            status=d.status,
            created_at=d.created_at,
            columns=cols
        ))
    return res


@router.post("/upload", response_model=DatasetOut)
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls', '.json')):
        raise HTTPException(status_code=400, detail="Only CSV, Excel (.xlsx/.xls), and JSON files are supported.")

    file_filename = file.filename
    clean_name = dataset_name or os.path.splitext(file_filename)[0].replace('_', ' ').title()
    saved_filename = f"ds_{current_user.id}_{int(pd.Timestamp.now().timestamp())}_{file_filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    # Read dataset dataframe
    try:
        if file_filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        else:
            df = pd.read_json(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Failed to parse dataset file: {str(e)}")

    rows_count = len(df)
    cols_count = len(df.columns)

    # Quality calculation
    quality_res = calculate_data_quality_score(df)

    dataset = Dataset(
        user_id=current_user.id,
        name=clean_name,
        filename=file_filename,
        file_path=file_path,
        file_size_bytes=file_size,
        rows_count=rows_count,
        cols_count=cols_count,
        quality_score=quality_res["overall_score"],
        status="ready",
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    columns_out = []
    for col in df.columns:
        dt = str(df[col].dtype)
        data_type = "number" if "int" in dt or "float" in dt else "date" if "date" in dt else "string"
        missing = int(df[col].isnull().sum())
        unique = int(df[col].nunique())

        db_col = DatasetColumn(
            dataset_id=dataset.id,
            name=str(col),
            data_type=data_type,
            missing_count=missing,
            unique_count=unique,
        )
        db.add(db_col)
        columns_out.append(ColumnInfoSchema(
            name=str(col),
            data_type=data_type,
            missing_count=missing,
            unique_count=unique,
        ))

    db.commit()

    return DatasetOut(
        id=dataset.id,
        name=dataset.name,
        filename=dataset.filename,
        file_size_bytes=dataset.file_size_bytes,
        rows_count=dataset.rows_count,
        cols_count=dataset.cols_count,
        quality_score=dataset.quality_score,
        status=dataset.status,
        created_at=dataset.created_at,
        columns=columns_out,
    )


@router.get("/{dataset_id}/preview", response_model=DatasetPreviewOut)
def preview_dataset(
    dataset_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="Dataset file missing on server")

    if dataset.filename.endswith('.csv'):
        df = pd.read_csv(dataset.file_path)
    elif dataset.filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(dataset.file_path)
    else:
        df = pd.read_json(dataset.file_path)

    total_rows = len(df)
    total_pages = max(1, (total_rows + page_size - 1) // page_size)

    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_rows)

    subset_df = df.iloc[start_idx:end_idx].fillna("")
    records = subset_df.to_dict(orient="records")

    return DatasetPreviewOut(
        dataset_id=dataset.id,
        name=dataset.name,
        total_rows=total_rows,
        total_cols=len(df.columns),
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        columns=list(df.columns),
        data=records,
    )


@router.get("/{dataset_id}/schema-tree")
def get_schema_tree(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    cols_info = [{"name": c.name, "type": c.data_type} for c in dataset.columns]
    tree = SchemaTree(dataset.name)
    tree.build_from_columns(cols_info)

    return {
        "dataset_id": dataset.id,
        "tree_structure": tree.to_dict(),
        "bfs_order": tree.bfs_traversal(),
        "dfs_order": tree.dfs_traversal(),
    }


@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    if os.path.exists(dataset.file_path):
        os.remove(dataset.file_path)

    db.delete(dataset)
    db.commit()
    return {"message": "Dataset deleted successfully"}
