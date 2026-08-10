"""
Searching Algorithms Implementation for DataPilot AI.
Includes Linear Search O(n), Binary Search O(log n), and Hash-based Search O(1) avg.
"""

import time
from typing import Any, List, Dict, Optional, Tuple


def linear_search(items: List[Dict[str, Any]], key: str, target: Any) -> Dict[str, Any]:
    """
    Linear Search Algorithm:
    Iterates sequentially through the list until target is found or end is reached.
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    start_time = time.perf_counter()
    comparisons = 0
    target_str = str(target).lower().strip()
    found_item = None
    found_index = -1

    for idx, item in enumerate(items):
        comparisons += 1
        val = str(item.get(key, '')).lower().strip()
        if target_str in val or val == target_str:
            found_item = item
            found_index = idx
            break

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "algorithm": "Linear Search",
        "found": found_item is not None,
        "index": found_index,
        "result": found_item,
        "comparisons": comparisons,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
    }


def binary_search(items: List[Dict[str, Any]], key: str, target: Any) -> Dict[str, Any]:
    """
    Binary Search Algorithm:
    Requires pre-sorted data. Repeatedly divides the search interval in half.
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    start_time = time.perf_counter()
    target_str = str(target).lower().strip()

    sorted_items = sorted(
        items, key=lambda x: str(x.get(key, '')).lower().strip()
    )

    low = 0
    high = len(sorted_items) - 1
    comparisons = 0
    found_item = None
    found_index = -1

    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        mid_val = str(sorted_items[mid].get(key, '')).lower().strip()

        if mid_val == target_str or target_str in mid_val:
            found_item = sorted_items[mid]
            found_index = mid
            break
        elif mid_val < target_str:
            low = mid + 1
        else:
            high = mid - 1

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "algorithm": "Binary Search",
        "found": found_item is not None,
        "index": found_index,
        "result": found_item,
        "comparisons": comparisons,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)",
    }


def hash_search(items: List[Dict[str, Any]], key: str, target: Any) -> Dict[str, Any]:
    """
    Hash-based Search Algorithm:
    Builds or utilizes a hash table index for O(1) constant time average lookup.
    Time Complexity: O(1) average
    Space Complexity: O(n)
    """
    start_time = time.perf_counter()
    target_str = str(target).lower().strip()
    comparisons = 0

    hash_table: Dict[str, List[Dict[str, Any]]] = {}
    for item in items:
        comparisons += 1
        k_val = str(item.get(key, '')).lower().strip()
        if k_val not in hash_table:
            hash_table[k_val] = []
        hash_table[k_val].append(item)

    comparisons += 1  # 1 hash lookup
    matched_list = hash_table.get(target_str)
    if not matched_list:
        for k, lst in hash_table.items():
            comparisons += 1
            if target_str in k:
                matched_list = lst
                break

    found_item = matched_list[0] if matched_list else None
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "algorithm": "Hash Search",
        "found": found_item is not None,
        "index": 0 if found_item else -1,
        "result": found_item,
        "comparisons": comparisons,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(1) average",
        "space_complexity": "O(n)",
    }


def search_dataset(items: List[Dict[str, Any]], column_name: str, target_value: Any, algorithm: str = "binary") -> Dict[str, Any]:
    """Unified search runner."""
    start_time = time.perf_counter()
    matches = []
    target_str = str(target_value).lower().strip()

    if algorithm.startswith("binary"):
        res = binary_search(items, column_name, target_value)
        if res["found"] and res["result"]:
            matches.append(res["result"])
        complexity = "O(log n)"
    elif algorithm.startswith("hash"):
        res = hash_search(items, column_name, target_value)
        if res["found"] and res["result"]:
            matches.append(res["result"])
        complexity = "O(1)"
    else:
        res = linear_search(items, column_name, target_value)
        if res["found"] and res["result"]:
            matches.append(res["result"])
        complexity = "O(n)"

    exec_sec = time.perf_counter() - start_time

    return {
        "match_count": len(matches),
        "execution_time_seconds": max(0.0001, exec_sec),
        "time_complexity": complexity,
        "results": matches,
    }
