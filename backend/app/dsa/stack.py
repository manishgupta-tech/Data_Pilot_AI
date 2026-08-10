"""
Custom Stack Implementation (LIFO) for Analysis Operations & History.
"""

from typing import Any, List, Optional


class Stack:
    """
    Custom Stack Class (Last-In First-Out).
    Supports push, pop, peek, is_empty, size, and history snapshot.
    """

    def __init__(self):
        self._items: List[Any] = []

    def push(self, item: Any) -> None:
        self._items.append(item)

    def pop(self) -> Optional[Any]:
        if self.is_empty():
            return None
        return self._items.pop()

    def peek(self) -> Optional[Any]:
        if self.is_empty():
            return None
        return self._items[-1]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)

    def get_history(self) -> List[Any]:
        return list(reversed(self._items))


DataTransformStack = Stack
