"""
Statistical Analysis Calculation Utilities for DataPilot AI.
"""

from typing import Any, List, Dict
import pandas as pd
import numpy as np


def calculate_descriptive_statistics(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates comprehensive statistics for numeric and categorical columns."""
    stats: Dict[str, Any] = {"numeric": {}, "categorical": {}}

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) == 0:
            continue
        stats["numeric"][col] = {
            "count": int(series.count()),
            "mean": round(float(series.mean()), 4),
            "median": round(float(series.median()), 4),
            "std": round(float(series.std()), 4) if len(series) > 1 else 0.0,
            "min": round(float(series.min()), 4),
            "max": round(float(series.max()), 4),
            "range": round(float(series.max() - series.min()), 4),
            "q25": round(float(series.quantile(0.25)), 4),
            "q75": round(float(series.quantile(0.75)), 4),
            "iqr": round(float(series.quantile(0.75) - series.quantile(0.25)), 4),
        }

    categorical_cols = df.select_dtypes(include=['object', 'category', 'string']).columns
    for col in categorical_cols:
        series = df[col].dropna().astype(str)
        if len(series) == 0:
            continue
        val_counts = series.value_counts()
        most_common = val_counts.index[0] if len(val_counts) > 0 else ""
        stats["categorical"][col] = {
            "count": int(series.count()),
            "unique_count": int(series.nunique()),
            "most_common": str(most_common),
            "most_common_freq": int(val_counts.iloc[0]) if len(val_counts) > 0 else 0,
            "frequencies": {str(k): int(v) for k, v in val_counts.head(10).items()},
        }

    return stats
