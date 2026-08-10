"""
Custom Hash Table Implementation with Chaining Collision Handling for DataPilot AI.
"""

from typing import Any, List, Optional, Tuple, Dict


class HashNode:
    def __init__(self, key: str, value: Any):
        self.key = key
        self.value = value
        self.next: Optional['HashNode'] = None


class HashTable:
    """
    Custom Hash Table Class.
    Uses polynomial rolling hash and separate chaining with linked list nodes.
    Supports insert, get, delete, contains, and metrics calculation.
    """

    def __init__(self, capacity: int = 64):
        self.capacity = capacity
        self.size = 0
        self.buckets: List[Optional[HashNode]] = [None] * capacity
        self.collisions = 0

    def _hash(self, key: str) -> int:
        hash_val = 0
        p = 31
        m = self.capacity
        p_pow = 1
        for char in str(key):
            hash_val = (hash_val + (ord(char) - ord('a') + 1) * p_pow) % m
            p_pow = (p_pow * p) % m
        return abs(hash_val) % self.capacity

    def insert(self, key: str, value: Any) -> None:
        index = self._hash(key)
        head = self.buckets[index]

        if head is None:
            self.buckets[index] = HashNode(key, value)
            self.size += 1
            return

        curr = head
        while curr:
            if curr.key == key:
                curr.value = value
                return
            if curr.next is None:
                break
            curr = curr.next

        self.collisions += 1
        curr.next = HashNode(key, value)
        self.size += 1

    def get(self, key: str) -> Optional[Any]:
        index = self._hash(key)
        curr = self.buckets[index]
        while curr:
            if curr.key == key:
                return curr.value
            curr = curr.next
        return None

    def delete(self, key: str) -> bool:
        index = self._hash(key)
        curr = self.buckets[index]
        prev = None
        while curr:
            if curr.key == key:
                if prev:
                    prev.next = curr.next
                else:
                    self.buckets[index] = curr.next
                self.size -= 1
                return True
            prev = curr
            curr = curr.next
        return False

    def contains(self, key: str) -> bool:
        return self.get(key) is not None

    def get_metrics(self) -> Dict[str, Any]:
        load_factor = round(self.size / self.capacity if self.capacity > 0 else 0, 4)
        return {
            "capacity": self.capacity,
            "size": self.size,
            "collisions": self.collisions,
            "load_factor": load_factor,
            "collision_strategy": "Separate Chaining (Linked Nodes)",
            "average_lookup": "O(1)",
        }


CustomHashTable = HashTable
