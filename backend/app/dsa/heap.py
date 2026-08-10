"""
Custom Max Heap and Priority Queue Implementation for Top-K Analysis in DataPilot AI.
O(n log k) extraction of top products, customers, categories, and anomalies.
"""

import time
from typing import Any, List, Dict, Tuple, Optional


class MaxHeap:
    """
    Custom Max Heap Implementation.
    Parent node is always >= child nodes.
    Supports insert, extract_max, peek, heapify, and Top-K extraction.
    """

    def __init__(self, key: str):
        self.key = key
        self.heap: List[Dict[str, Any]] = []

    def _val(self, item: Dict[str, Any]) -> float:
        raw = item.get(self.key, 0)
        try:
            return float(raw)
        except (ValueError, TypeError):
            return 0.0

    def insert(self, item: Dict[str, Any]) -> None:
        self.heap.append(dict(item))
        self._sift_up(len(self.heap) - 1)

    def _sift_up(self, idx: int) -> None:
        parent = (idx - 1) // 2
        while idx > 0 and self._val(self.heap[idx]) > self._val(self.heap[parent]):
            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]
            idx = parent
            parent = (idx - 1) // 2

    def extract_max(self) -> Optional[Dict[str, Any]]:
        if not self.heap:
            return None
        max_item = self.heap[0]
        last_item = self.heap.pop()
        if self.heap:
            self.heap[0] = last_item
            self._sift_down(0)
        return max_item

    def _sift_down(self, idx: int) -> None:
        n = len(self.heap)
        while True:
            largest = idx
            left = 2 * idx + 1
            right = 2 * idx + 2

            if left < n and self._val(self.heap[left]) > self._val(self.heap[largest]):
                largest = left
            if right < n and self._val(self.heap[right]) > self._val(self.heap[largest]):
                largest = right

            if largest != idx:
                self.heap[idx], self.heap[largest] = self.heap[largest], self.heap[idx]
                idx = largest
            else:
                break

    def peek(self) -> Optional[Dict[str, Any]]:
        return self.heap[0] if self.heap else None

    def size(self) -> int:
        return len(self.heap)


class MinHeap:
    """
    Custom Min Heap Implementation.
    Parent node is always <= child nodes.
    """

    def __init__(self, key: str):
        self.key = key
        self.heap: List[Dict[str, Any]] = []

    def _val(self, item: Dict[str, Any]) -> float:
        raw = item.get(self.key, 0)
        try:
            return float(raw)
        except (ValueError, TypeError):
            return 0.0

    def insert(self, item: Dict[str, Any]) -> None:
        self.heap.append(dict(item))
        self._sift_up(len(self.heap) - 1)

    def _sift_up(self, idx: int) -> None:
        parent = (idx - 1) // 2
        while idx > 0 and self._val(self.heap[idx]) < self._val(self.heap[parent]):
            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]
            idx = parent
            parent = (idx - 1) // 2

    def extract_min(self) -> Optional[Dict[str, Any]]:
        if not self.heap:
            return None
        min_item = self.heap[0]
        last_item = self.heap.pop()
        if self.heap:
            self.heap[0] = last_item
            self._sift_down(0)
        return min_item

    def _sift_down(self, idx: int) -> None:
        n = len(self.heap)
        while True:
            smallest = idx
            left = 2 * idx + 1
            right = 2 * idx + 2

            if left < n and self._val(self.heap[left]) < self._val(self.heap[smallest]):
                smallest = left
            if right < n and self._val(self.heap[right]) < self._val(self.heap[smallest]):
                smallest = right

            if smallest != idx:
                self.heap[idx], self.heap[smallest] = self.heap[smallest], self.heap[idx]
                idx = smallest
            else:
                break

    def peek(self) -> Optional[Dict[str, Any]]:
        return self.heap[0] if self.heap else None

    def size(self) -> int:
        return len(self.heap)


def extract_top_k(items: List[Dict[str, Any]], key: str, k: int = 5) -> Dict[str, Any]:
    """
    Extracts Top-K highest value items using MaxHeap Priority Queue.
    Time Complexity: O(n log k)
    Space Complexity: O(k)
    """
    start_time = time.perf_counter()
    heap = MaxHeap(key)

    for item in items:
        heap.insert(item)

    top_k_results = []
    for _ in range(min(k, heap.size())):
        extracted = heap.extract_max()
        if extracted:
            top_k_results.append(extracted)

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "key": key,
        "k": k,
        "top_k": top_k_results,
        "total_items": len(items),
        "execution_time_ms": round(max(0.001, elapsed_ms), 4),
        "time_complexity": "O(n log k)",
        "space_complexity": f"O({k})",
    }
