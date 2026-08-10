"""
Analysis Router: Statistics, Quality Scores, Anomaly Detection, Correlations, and Executive Insights.
"""

import os
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.models.dataset import Dataset
from backend.app.api.deps import get_current_user
from backend.app.analysis.cleaning import analyze_dataset_cleanliness
from backend.app.analysis.statistics import calculate_descriptive_statistics
from backend.app.analysis.data_quality import calculate_data_quality_score
from backend.app.analysis.anomaly_detection import detect_anomalies_iqr
from backend.app.analysis.correlation import calculate_correlation_matrix
from backend.app.analysis.insights import generate_automated_insights
from backend.app.dsa.heap import extract_top_k

router = APIRouter(prefix="/analysis", tags=["Analysis"])


def _load_dataset_df(dataset: Dataset) -> pd.DataFrame:
    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="Dataset file missing on server")
    if dataset.filename.endswith('.csv'):
        return pd.read_csv(dataset.file_path)
    elif dataset.filename.endswith(('.xlsx', '.xls')):
        return pd.read_excel(dataset.file_path)
    else:
        return pd.read_json(dataset.file_path)


@router.get("/{dataset_id}/summary")
def get_analysis_summary(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, (Dataset.user_id == current_user.id) | (Dataset.user_id == 1)).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = _load_dataset_df(dataset)
    clean_info = analyze_dataset_cleanliness(df)
    quality_info = calculate_data_quality_score(df)
    stats_info = calculate_descriptive_statistics(df)

    # Pick top column for heap
    numeric_cols = df.select_dtypes(include=['number']).columns
    top_heap = {}
    if len(numeric_cols) > 0:
        top_heap = extract_top_k(df.to_dict(orient='records'), numeric_cols[0], k=3)

    insights = generate_automated_insights(df, quality_info, stats_info, top_heap)

    return {
        "dataset_id": dataset.id,
        "name": dataset.name,
        "quality": quality_info,
        "cleanliness": clean_info,
        "statistics": stats_info,
        "insights": insights,
    }


@router.get("/{dataset_id}/correlations")
def get_correlations(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = _get_dataset(dataset_id, current_user.id, db)

    df = _load_dataset_df(dataset)
    return calculate_correlation_matrix(df)


@router.get("/{dataset_id}/anomalies")
def get_anomalies(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = _get_dataset(dataset_id, current_user.id, db)

    df = _load_dataset_df(dataset)
    anomalies = detect_anomalies_iqr(df)
    return {
        "dataset_id": dataset.id,
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
    }


@router.get("/{dataset_id}/insights")
def get_insights(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dataset = _get_dataset(dataset_id, current_user.id, db)

    df = _load_dataset_df(dataset)
    quality_info = calculate_data_quality_score(df)
    stats_info = calculate_descriptive_statistics(df)

    numeric_cols = df.select_dtypes(include=['number']).columns
    top_heap = {}
    if len(numeric_cols) > 0:
        top_heap = extract_top_k(df.to_dict(orient='records'), numeric_cols[0], k=3)

    return generate_automated_insights(df, quality_info, stats_info, top_heap)
