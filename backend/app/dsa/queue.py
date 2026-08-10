"""
Custom Queue Implementation (FIFO) for Analysis Task Processing.
"""

from typing import Any, List, Optional
from collections import deque


class Queue:
    """
    Custom Queue Class (First-In First-Out).
    Supports enqueue, dequeue, front, is_empty, size, and list items.
    """

    def __init__(self):
        self._items = deque()

    def enqueue(self, item: Any) -> None:
        self._items.append(item)

    def dequeue(self) -> Optional[Any]:
        if self.is_empty():
            return None
        return self._items.popleft()

    def front(self) -> Optional[Any]:
        if self.is_empty():
            return None
        return self._items[0]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)

    def to_list(self) -> List[Any]:
        return list(self._items)


ProcessingQueue = Queue
