"""
Base metadata declaration importing all SQLAlchemy ORM Models.
"""

from backend.app.database.database import Base
from backend.app.models.user import User
from backend.app.models.dataset import Dataset, DatasetColumn
from backend.app.models.analysis import AnalysisResult, DatasetStatistic, DataQualityResult
from backend.app.models.algorithm_run import AlgorithmRun
from backend.app.models.insight import Insight
from backend.app.models.report import Report
from backend.app.models.chat import ChatSession, ChatMessage
