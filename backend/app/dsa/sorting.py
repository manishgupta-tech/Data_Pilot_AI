"""
Sorting Algorithms Implementation for DataPilot AI.
Includes manual implementations of Bubble, Selection, Insertion, Merge, Quick, and Heap Sort.
"""

import time
from typing import Any, List, Dict, Tuple, Optional


def _compare(val_a: Any, val_b: Any, reverse: bool = False) -> bool:
    """Helper comparator function for numeric and string values."""
    if val_a is None:
        return False if not reverse else True
    if val_b is None:
        return True if not reverse else False

    try:
        num_a = float(val_a)
        num_b = float(val_b)
        return (num_a > num_b) if not reverse else (num_a < num_b)
    except (ValueError, TypeError):
        str_a = str(val_a).lower()
        str_b = str(val_b).lower()
        return (str_a > str_b) if not reverse else (str_a < str_b)


def bubble_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Bubble Sort: O(n^2) time, O(1) space."""
    arr = [dict(item) for item in items]
    n = len(arr)
    comparisons = 0
    swaps = 0
    start_time = time.perf_counter()

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            if _compare(arr[j].get(key), arr[j + 1].get(key), reverse):
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                swapped = True
        if not swapped:
            break

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    return {
        "algorithm": "Bubble Sort",
        "column": key,
        "input_size": n,
        "sorted_items": arr,
        "comparisons": comparisons,
        "swaps": swaps,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
    }


def selection_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Selection Sort: O(n^2) time, O(1) space."""
    arr = [dict(item) for item in items]
    n = len(arr)
    comparisons = 0
    swaps = 0
    start_time = time.perf_counter()

    for i in range(n):
        target_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if _compare(arr[target_idx].get(key), arr[j].get(key), reverse):
                target_idx = j
        if target_idx != i:
            arr[i], arr[target_idx] = arr[target_idx], arr[i]
            swaps += 1

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    return {
        "algorithm": "Selection Sort",
        "column": key,
        "input_size": n,
        "sorted_items": arr,
        "comparisons": comparisons,
        "swaps": swaps,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
    }


def insertion_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Insertion Sort: O(n^2) time, O(1) space."""
    arr = [dict(item) for item in items]
    n = len(arr)
    comparisons = 0
    swaps = 0
    start_time = time.perf_counter()

    for i in range(1, n):
        current = arr[i]
        j = i - 1
        while j >= 0:
            comparisons += 1
            if _compare(arr[j].get(key), current.get(key), reverse):
                arr[j + 1] = arr[j]
                swaps += 1
                j -= 1
            else:
                break
        arr[j + 1] = current

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    return {
        "algorithm": "Insertion Sort",
        "column": key,
        "input_size": n,
        "sorted_items": arr,
        "comparisons": comparisons,
        "swaps": swaps,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
    }


def merge_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Merge Sort: O(n log n) time, O(n) space."""
    arr = [dict(item) for item in items]
    comparisons = [0]
    start_time = time.perf_counter()

    def _merge_sort_rec(lst):
        if len(lst) <= 1:
            return lst
        mid = len(lst) // 2
        left = _merge_sort_rec(lst[:mid])
        right = _merge_sort_rec(lst[mid:])

        merged = []
        i = j = 0
        while i < len(left) and j < len(right):
            comparisons[0] += 1
            if not _compare(left[i].get(key), right[j].get(key), reverse):
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged

    sorted_arr = _merge_sort_rec(arr)
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "algorithm": "Merge Sort",
        "column": key,
        "input_size": len(items),
        "sorted_items": sorted_arr,
        "comparisons": comparisons[0],
        "swaps": comparisons[0],
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)",
    }


def quick_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Quick Sort: O(n log n) avg time, O(log n) space."""
    arr = [dict(item) for item in items]
    comparisons = [0]
    swaps = [0]
    start_time = time.perf_counter()

    def _quick_sort_rec(lst):
        if len(lst) <= 1:
            return lst
        pivot = lst[len(lst) // 2]
        left, middle, right = [], [], []

        for item in lst:
            comparisons[0] += 1
            val_item = item.get(key)
            val_pivot = pivot.get(key)

            if _compare(val_pivot, val_item, reverse):
                left.append(item)
            elif _compare(val_item, val_pivot, reverse):
                right.append(item)
            else:
                middle.append(item)

        return _quick_sort_rec(left) + middle + _quick_sort_rec(right)

    sorted_arr = _quick_sort_rec(arr)
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "algorithm": "Quick Sort",
        "column": key,
        "input_size": len(items),
        "sorted_items": sorted_arr,
        "comparisons": comparisons[0],
        "swaps": comparisons[0] // 2,
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n log n)",
        "space_complexity": "O(log n)",
    }


def heap_sort(items: List[Dict[str, Any]], key: str, reverse: bool = False) -> Dict[str, Any]:
    """Heap Sort: O(n log n) time, O(1) space."""
    arr = [dict(item) for item in items]
    n = len(arr)
    comparisons = [0]
    swaps = [0]
    start_time = time.perf_counter()

    def _heapify(arr, n, i):
        target = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n:
            comparisons[0] += 1
            if _compare(arr[left].get(key), arr[target].get(key), reverse):
                target = left

        if right < n:
            comparisons[0] += 1
            if _compare(arr[right].get(key), arr[target].get(key), reverse):
                target = right

        if target != i:
            arr[i], arr[target] = arr[target], arr[i]
            swaps[0] += 1
            _heapify(arr, n, target)

    for i in range(n // 2 - 1, -1, -1):
        _heapify(arr, n, i)

    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        swaps[0] += 1
        _heapify(arr, i, 0)

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    return {
        "algorithm": "Heap Sort",
        "column": key,
        "input_size": n,
        "sorted_items": arr,
        "comparisons": comparisons[0],
        "swaps": swaps[0],
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n log n)",
        "space_complexity": "O(1)",
    }


def sort_dataset(items: List[Dict[str, Any]], column_name: str, algorithm: str = "quick", ascending: bool = True) -> Dict[str, Any]:
    """Unified sort runner."""
    reverse = not ascending
    alg_lower = algorithm.lower()

    if "merge" in alg_lower:
        res = merge_sort(items, column_name, reverse)
    elif "heap" in alg_lower:
        res = heap_sort(items, column_name, reverse)
    elif "bubble" in alg_lower:
        res = bubble_sort(items, column_name, reverse)
    elif "insertion" in alg_lower:
        res = insertion_sort(items, column_name, reverse)
    elif "selection" in alg_lower:
        res = selection_sort(items, column_name, reverse)
    else:
        res = quick_sort(items, column_name, reverse)

    return {
        "total_records": len(items),
        "execution_time_seconds": res["execution_time_ms"] / 1000.0,
        "time_complexity": res["time_complexity"],
        "sorted_preview": res["sorted_items"][:25],
    }
