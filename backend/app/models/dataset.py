"""
Dataset & DatasetColumn SQLAlchemy Models.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size_bytes = Column(Integer, default=0)
    rows_count = Column(Integer, default=0)
    cols_count = Column(Integer, default=0)
    quality_score = Column(Float, default=100.0)
    status = Column(String, default="ready")  # 'processing', 'ready', 'error'
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="datasets")
    columns = relationship("DatasetColumn", back_populates="dataset", cascade="all, delete-orphan")
    analysis_results = relationship("AnalysisResult", back_populates="dataset", cascade="all, delete-orphan")
    algorithm_runs = relationship("AlgorithmRun", back_populates="dataset", cascade="all, delete-orphan")


class DatasetColumn(Base):
    __tablename__ = "dataset_columns"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False)  # 'number', 'string', 'date', 'boolean'
    missing_count = Column(Integer, default=0)
    unique_count = Column(Integer, default=0)

    dataset = relationship("Dataset", back_populates="columns")
