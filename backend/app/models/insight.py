"""
Insight Model for storing generated dataset findings.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from backend.app.database.database import Base


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 'Quality', 'Financial', 'Performance', 'Anomaly'
    impact = Column(String, default="Medium")  # 'High', 'Medium', 'Low'
    type = Column(String, default="positive")  # 'positive', 'negative', 'warning'
    summary = Column(String, nullable=False)
    action = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
