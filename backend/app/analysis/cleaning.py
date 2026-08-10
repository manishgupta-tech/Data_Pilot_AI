"""
Data Cleaning and Validation Operations.
Does not mutate original dataset files; returns clean preview suggestions & operational metrics.
"""

from typing import Any, List, Dict, Tuple
import pandas as pd
import numpy as np


def analyze_dataset_cleanliness(df: pd.DataFrame) -> Dict[str, Any]:
    """Analyzes missing values, duplicate rows, invalid records, and potential type issues."""
    total_rows = len(df)
    total_cols = len(df.columns)
    total_cells = total_rows * total_cols if total_rows > 0 else 1

    missing_by_col = df.isnull().sum().to_dict()
    total_missing_cells = int(df.isnull().sum().sum())
    missing_pct = round((total_missing_cells / total_cells) * 100, 2)

    duplicate_rows_count = int(df.duplicated().sum())
    duplicate_pct = round((duplicate_rows_count / total_rows * 100) if total_rows > 0 else 0, 2)

    column_types = {col: str(df[col].dtype) for col in df.columns}

    suggested_operations = []
    if total_missing_cells > 0:
        suggested_operations.append({
            "type": "fill_missing",
            "description": f"Fill missing values across {sum(1 for v in missing_by_col.values() if v > 0)} columns using mean or mode imputation.",
        })
    if duplicate_rows_count > 0:
        suggested_operations.append({
            "type": "remove_duplicates",
            "description": f"Deduplicate {duplicate_rows_count} exact duplicate rows ({duplicate_pct}% of dataset).",
        })

    return {
        "total_rows": total_rows,
        "total_cols": total_cols,
        "total_missing_cells": total_missing_cells,
        "missing_percentage": missing_pct,
        "missing_by_column": missing_by_col,
        "duplicate_rows_count": duplicate_rows_count,
        "duplicate_percentage": duplicate_pct,
        "column_types": column_types,
        "suggested_operations": suggested_operations,
    }
