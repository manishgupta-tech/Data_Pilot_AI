"""
Correlation Analysis Engine for Dataset Features.
Calculates Pearson Correlation Matrix for numeric variables.
"""

from typing import Any, List, Dict
import pandas as pd
import numpy as np


def calculate_correlation_matrix(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates pairwise Pearson correlation for numeric columns."""
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.empty or len(numeric_df.columns) < 2:
        return {"columns": [], "matrix": [], "strong_correlations": []}

    corr = numeric_df.corr().fillna(0)
    cols = list(corr.columns)
    matrix = corr.round(3).values.tolist()

    strong_correlations = []
    for i in range(len(cols)):
        for j in range(i + 1, len(cols)):
            val = float(corr.iloc[i, j])
            if abs(val) >= 0.5:
                strong_correlations.append({
                    "col1": cols[i],
                    "col2": cols[j],
                    "correlation": round(val, 3),
                    "relationship": "Strong Positive" if val > 0 else "Strong Negative",
                })

    return {
        "columns": cols,
        "matrix": matrix,
        "strong_correlations": strong_correlations,
    }
