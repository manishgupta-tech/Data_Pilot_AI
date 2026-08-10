"""
Analysis & Data Quality Schemas.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AnalysisSummaryOut(BaseModel):
    dataset_id: int
    quality_score: float
    grade: str
    total_rows: int
    total_cols: int
    missing_percentage: float
    duplicate_rows_count: int
    executive_findings: List[str]
    suggested_operations: List[Dict[str, Any]]
