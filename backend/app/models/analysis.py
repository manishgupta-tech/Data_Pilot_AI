"""
Analysis Results, Statistics & Data Quality Models.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database.database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    summary = Column(String, nullable=True)
    executive_findings = Column(JSON, nullable=True)
    anomalies_json = Column(JSON, nullable=True)
    correlations_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    dataset = relationship("Dataset", back_populates="analysis_results")


class DatasetStatistic(Base):
    __tablename__ = "dataset_statistics"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    stats_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DataQualityResult(Base):
    __tablename__ = "data_quality_results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    score = Column(Float, default=100.0)
    grade = Column(String, default="A")
    metrics_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
