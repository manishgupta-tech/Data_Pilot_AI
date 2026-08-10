"""
AlgorithmRun SQLAlchemy Model for tracking DSA execution history.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database.database import Base


class AlgorithmRun(Base):
    __tablename__ = "algorithm_runs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=True)
    algorithm = Column(String, index=True, nullable=False)  # 'Quick Sort', 'Binary Search', 'Max Heap', etc.
    operation = Column(String, nullable=False)
    input_size = Column(Integer, default=0)
    execution_time_ms = Column(Float, default=0.0)
    comparisons = Column(Integer, default=0)
    swaps = Column(Integer, default=0)
    time_complexity = Column(String, nullable=False)
    space_complexity = Column(String, nullable=True)
    status = Column(String, default="Completed")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="algorithm_runs")
    dataset = relationship("Dataset", back_populates="algorithm_runs")
