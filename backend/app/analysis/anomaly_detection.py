"""
Statistical Anomaly and Outlier Detection Engine.
Uses IQR (Interquartile Range) and Z-Score thresholding for anomaly detection.
"""

from typing import Any, List, Dict
import pandas as pd
import numpy as np


def detect_anomalies_iqr(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Detects numerical anomalies using IQR thresholds (1.5 * IQR)."""
    anomalies = []
    numeric_cols = df.select_dtypes(include=[np.number]).columns

    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) < 5:
            continue

        q25 = series.quantile(0.25)
        q75 = series.quantile(0.75)
        iqr = q75 - q25

        if iqr == 0:
            continue

        lower_bound = q25 - (1.5 * iqr)
        upper_bound = q75 + (1.5 * iqr)

        outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]

        for idx, row in outliers.head(5).iterrows():
            val = row[col]
            severity = "High" if abs(val - series.mean()) > 3 * series.std() else "Medium"
            anomalies.append({
                "row_index": int(idx),
                "column": str(col),
                "value": float(val),
                "expected_range": f"[{round(lower_bound, 2)}, {round(upper_bound, 2)}]",
                "severity": severity,
                "description": f"Outlier detected in {col}: value {val} is outside valid IQR bounds.",
            })

    return anomalies
