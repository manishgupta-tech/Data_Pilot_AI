"""
DSA Engine Request and Response Schemas.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class SearchRequest(BaseModel):
    dataset_id: int
    column_name: str
    target_value: Any
    algorithm: str = "binary"  # 'linear', 'binary', 'hash'


class SearchResponse(BaseModel):
    algorithm: str
    column_name: str
    target_value: str
    match_count: int
    execution_time_seconds: float
    time_complexity: str
    results: List[Dict[str, Any]]


class SortRequest(BaseModel):
    dataset_id: int
    column_name: str
    algorithm: str = "quick"  # 'quick', 'merge', 'heap', 'bubble', 'insertion', 'selection'
    ascending: bool = True


class SortResponse(BaseModel):
    algorithm: str
    column_name: str
    ascending: bool
    total_records: int
    execution_time_seconds: float
    time_complexity: str
    sorted_preview: List[Dict[str, Any]]


class TopKRequest(BaseModel):
    dataset_id: int
    column_name: str
    k: int = 5


class TopKResponse(BaseModel):
    column_name: str
    k: int
    top_k: List[Dict[str, Any]]
    total_items: int
    execution_time_seconds: float
    time_complexity: str


class DSACardSchema(BaseModel):
    name: str
    purpose: str
    time_complexity: str
    status: str
    dataset_operation: str


class BenchmarkItemSchema(BaseModel):
    algorithm: str
    operation: str
    input_size: int
    execution_time: str
    time_complexity: str
    status: str
