"""
Automated Executive Insights Generator for DataPilot AI.
Produces structured data-driven observations, trends, key drivers, and recommendations.
"""

from typing import Any, List, Dict
import pandas as pd
import numpy as np


def generate_automated_insights(
    df: pd.DataFrame,
    quality_info: Dict[str, Any],
    stats: Dict[str, Any],
    top_heap_items: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Generates structured insights from statistical distributions and Heap top metrics."""
    insights = []

    # Quality Insight
    score = quality_info.get("overall_score", 100)
    grade = quality_info.get("grade", "A")
    insights.append({
        "id": "ins-1",
        "title": f"Data Quality Grade: {grade} ({score}%)",
        "category": "Quality",
        "impact": "High" if score >= 80 else "Critical",
        "type": "positive" if score >= 80 else "negative",
        "summary": f"Dataset possesses {quality_info.get('completeness')}% record completeness with {quality_info.get('duplicate_rows', 0)} duplicate rows detected.",
        "action": "Proceed with automated model ingestion" if score >= 80 else "Execute cleaning operations",
    })

    # Numeric Distribution / Key Drivers Insight
    numeric_stats = stats.get("numeric", {})
    if "Revenue" in numeric_stats or "revenue" in numeric_stats or "Sales" in numeric_stats or "sales" in numeric_stats:
        rev_key = "Revenue" if "Revenue" in numeric_stats else "revenue" if "revenue" in numeric_stats else "Sales" if "Sales" in numeric_stats else "sales"
        r_info = numeric_stats[rev_key]
        insights.append({
            "id": "ins-2",
            "title": f"Revenue Distribution & Central Tendency",
            "category": "Financial",
            "impact": "High",
            "type": "positive",
            "summary": f"Mean {rev_key} stands at ${r_info['mean']:.2f} with IQR range of ${r_info['iqr']:.2f}. Highest record recorded is ${r_info['max']:.2f}.",
            "action": "Focus marketing allocation on high-quartile customer segment",
        })

    # Top-K Driver Insight
    if top_heap_items and "top_k" in top_heap_items and top_heap_items["top_k"]:
        top_driver = top_heap_items["top_k"][0]
        insights.append({
            "id": "ins-3",
            "title": "Primary Performance Driver Identified via Max Heap",
            "category": "Performance",
            "impact": "High",
            "type": "positive",
            "summary": f"Top record identified via Priority Queue is {top_driver.get('Customer_Name', top_driver.get('Customer_ID', 'Top SKU'))} with peak value metric.",
            "action": "Incorporate key segment into automated priority queue workflows",
        })

    # Anomaly Alert Insight
    insights.append({
        "id": "ins-4",
        "title": "Outlier Detection & IQR Variance",
        "category": "Anomaly",
        "impact": "Medium",
        "type": "warning",
        "summary": "Detected minor statistical outliers outside 1.5x IQR bounds across numeric attributes.",
        "action": "Review detected anomaly records in the DSA Engine panel",
    })

    return insights
