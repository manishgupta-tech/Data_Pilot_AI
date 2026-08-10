"""
Big-O Complexity Calculations and Algorithm Benchmark Comparison utilities.
"""

import math
from typing import Any, List, Dict


def estimate_time_complexity(algorithm: str) -> str:
    alg_lower = algorithm.lower()
    if "hash" in alg_lower:
        return "O(1)"
    elif "binary" in alg_lower or "bst" in alg_lower:
        return "O(log n)"
    elif "linear" in alg_lower:
        return "O(n)"
    elif "quick" in alg_lower or "merge" in alg_lower or "heap" in alg_lower:
        return "O(n log n)"
    elif "bubble" in alg_lower or "insertion" in alg_lower or "selection" in alg_lower:
        return "O(n²)"
    return "O(n)"


def get_complexity_curves(input_size_n: int = 1000) -> List[Dict[str, Any]]:
    """Generates Big-O theoretical operations points for comparison chart."""
    points = []
    step = max(1, input_size_n // 10)
    for n in range(10, input_size_n + 1, step):
        log_n = math.log2(n) if n > 0 else 1
        points.append({
            "n": n,
            "O(1)": 1,
            "O(log n)": round(log_n, 2),
            "O(n)": n,
            "O(n log n)": round(n * log_n),
            "O(n²)": n * n if n <= 1000 else None,
        })
    return points
