"""
Custom Linked List Implementation for Dataset Stream Operations & Analysis History.
"""

from typing import Any, List, Optional, Dict


class Node:
    def __init__(self, data: Any):
        self.data = data
        self.next: Optional['Node'] = None


class LinkedList:
    """
    Singly Linked List Class.
    Supports insert, delete, search, traverse, and conversion to list.
    """

    def __init__(self):
        self.head: Optional[Node] = None
        self._size = 0

    def insert(self, data: Any) -> None:
        """Insert node at head O(1)."""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self._size += 1

    def append(self, data: Any) -> None:
        """Append node at tail O(n)."""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self._size += 1
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node
        self._size += 1

    def delete(self, key_name: str, target_val: Any) -> bool:
        """Delete first matching node."""
        curr = self.head
        prev = None
        while curr:
            val = curr.data.get(key_name) if isinstance(curr.data, dict) else curr.data
            if str(val) == str(target_val):
                if prev:
                    prev.next = curr.next
                else:
                    self.head = curr.next
                self._size -= 1
                return True
            prev = curr
            curr = curr.next
        return False

    def search(self, key_name: str, target_val: Any) -> Optional[Any]:
        curr = self.head
        while curr:
            val = curr.data.get(key_name) if isinstance(curr.data, dict) else curr.data
            if str(val) == str(target_val):
                return curr.data
            curr = curr.next
        return None

    def traverse(self) -> List[Any]:
        result = []
        curr = self.head
        while curr:
            result.append(curr.data)
            curr = curr.next
        return result

    def size(self) -> int:
        return self._size
