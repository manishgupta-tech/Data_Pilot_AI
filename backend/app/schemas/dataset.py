"""
Dataset Request & Response Schemas.
"""

from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel


class ColumnInfoSchema(BaseModel):
    name: str
    data_type: str
    missing_count: int = 0
    unique_count: int = 0


class DatasetOut(BaseModel):
    id: int
    name: str
    filename: str
    file_size_bytes: int
    rows_count: int
    cols_count: int
    quality_score: float
    status: str
    created_at: datetime
    columns: List[ColumnInfoSchema] = []

    class Config:
        from_attributes = True


class DatasetPreviewOut(BaseModel):
    dataset_id: int
    name: str
    total_rows: int
    total_cols: int
    page: int
    page_size: int
    total_pages: int
    columns: List[str]
    data: List[Dict[str, Any]]
