"""
Arrays and List Manipulation DSA Operations.
"""

from typing import Any, List, Dict


def slice_contiguous(items: List[Any], start: int, end: int) -> List[Any]:
    """Contiguous array slicing in linear time O(k)."""
    start = max(0, start)
    end = min(len(items), end)
    return items[start:end]


def calculate_memory_estimate(items_count: int, cols_count: int) -> Dict[str, Any]:
    """Calculates approximate contiguous memory array allocation in bytes."""
    bytes_per_cell = 32  # Average string/number reference size in Python
    total_cells = items_count * cols_count
    total_bytes = total_cells * bytes_per_cell

    return {
        "items_count": items_count,
        "cols_count": cols_count,
        "total_cells": total_cells,
        "estimated_bytes": total_bytes,
        "estimated_mb": round(total_bytes / (1024 * 1024), 3),
        "access_complexity": "O(1) index lookup",
    }
