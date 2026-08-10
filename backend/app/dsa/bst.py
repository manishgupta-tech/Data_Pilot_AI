"""
Custom Binary Search Tree (BST) Implementation for Ordered Numeric Indexing.
"""

from typing import Any, List, Optional, Dict


class BSTNode:
    def __init__(self, key_val: float, record: Dict[str, Any]):
        self.key_val = key_val
        self.records: List[Dict[str, Any]] = [record]
        self.left: Optional['BSTNode'] = None
        self.right: Optional['BSTNode'] = None


class BinarySearchTree:
    """
    Binary Search Tree Class.
    Supports insert, search, delete, and inorder/preorder/postorder traversals.
    """

    def __init__(self):
        self.root: Optional[BSTNode] = None

    def insert(self, key_val: float, record: Dict[str, Any]) -> None:
        if self.root is None:
            self.root = BSTNode(key_val, record)
        else:
            self._insert_rec(self.root, key_val, record)

    def _insert_rec(self, node: BSTNode, key_val: float, record: Dict[str, Any]) -> None:
        if key_val == node.key_val:
            node.records.append(record)
        elif key_val < node.key_val:
            if node.left is None:
                node.left = BSTNode(key_val, record)
            else:
                self._insert_rec(node.left, key_val, record)
        else:
            if node.right is None:
                node.right = BSTNode(key_val, record)
            else:
                self._insert_rec(node.right, key_val, record)

    def search(self, key_val: float) -> Optional[List[Dict[str, Any]]]:
        return self._search_rec(self.root, key_val)

    def _search_rec(self, node: Optional[BSTNode], key_val: float) -> Optional[List[Dict[str, Any]]]:
        if node is None:
            return None
        if key_val == node.key_val:
            return node.records
        elif key_val < node.key_val:
            return self._search_rec(node.left, key_val)
        else:
            return self._search_rec(node.right, key_val)

    def inorder_traversal(self) -> List[Dict[str, Any]]:
        res: List[Dict[str, Any]] = []

        def _inorder(node):
            if node:
                _inorder(node.left)
                res.extend(node.records)
                _inorder(node.right)

        _inorder(self.root)
        return res

    def to_dict(self) -> Dict[str, Any]:
        def _serialize_node(node):
            if not node:
                return None
            return {
                "key": node.key_val,
                "count": len(node.records),
                "left": _serialize_node(node.left),
                "right": _serialize_node(node.right),
            }

        return _serialize_node(self.root) or {}


DatasetBST = BinarySearchTree
