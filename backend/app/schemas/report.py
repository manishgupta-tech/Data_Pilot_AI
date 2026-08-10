"""
Report Request and Response Schemas.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ReportGenerateRequest(BaseModel):
    dataset_id: int
    title: Optional[str] = "Dataset Analysis Report"
    report_type: Optional[str] = "PDF"  # 'PDF', 'Excel', 'CSV'


CreateReportRequest = ReportGenerateRequest


class ReportOut(BaseModel):
    id: int
    dataset_id: Optional[int] = None
    title: str
    report_type: str
    file_size_bytes: Optional[int] = 1024
    status: str
    download_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
