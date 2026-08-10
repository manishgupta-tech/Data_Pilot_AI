"""
Custom Schema Tree Representation for Dataset Organization in DataPilot AI.
Includes Depth-First Search (DFS) and Breadth-First Search (BFS) traversals.
"""

from typing import Any, List, Dict, Optional
from collections import deque


class TreeNode:
    def __init__(self, name: str, node_type: str = "folder", data: Optional[Dict[str, Any]] = None):
        self.name = name
        self.node_type = node_type  # 'root', 'category', 'column', 'leaf'
        self.data = data or {}
        self.children: List['TreeNode'] = []

    def add_child(self, child: 'TreeNode') -> 'TreeNode':
        self.children.append(child)
        return child


class SchemaTree:
    """
    Dataset Schema Tree representation.
    Organizes columns into Numeric, Categorical, Date, and Identifier branches.
    """

    def __init__(self, dataset_name: str):
        self.root = TreeNode(dataset_name, node_type="root")

    def build_from_columns(self, columns_info: List[Dict[str, Any]]) -> None:
        numeric_branch = TreeNode("Numeric Columns", node_type="category")
        categorical_branch = TreeNode("Categorical Columns", node_type="category")
        date_branch = TreeNode("Date & Time Columns", node_type="category")
        id_branch = TreeNode("Identifiers", node_type="category")

        self.root.add_child(numeric_branch)
        self.root.add_child(categorical_branch)
        self.root.add_child(date_branch)
        self.root.add_child(id_branch)

        for col in columns_info:
            col_name = col.get("name", "unnamed")
            col_type = col.get("type", "string").lower()

            col_node = TreeNode(col_name, node_type="column", data=col)

            if "id" in col_name.lower() or "code" in col_name.lower():
                id_branch.add_child(col_node)
            elif col_type in ["int", "integer", "float", "number", "numeric"]:
                numeric_branch.add_child(col_node)
            elif col_type in ["date", "datetime", "timestamp"]:
                date_branch.add_child(col_node)
            else:
                categorical_branch.add_child(col_node)

    def bfs_traversal(self) -> List[Dict[str, Any]]:
        """Breadth-First Search Traversal using Queue."""
        result = []
        queue = deque([self.root])
        while queue:
            node = queue.popleft()
            result.append({
                "name": node.name,
                "type": node.node_type,
                "children_count": len(node.children),
                "data": node.data,
            })
            for child in node.children:
                queue.append(child)
        return result

    def dfs_traversal(self) -> List[Dict[str, Any]]:
        """Depth-First Search Traversal using Stack/Recursion."""
        result = []

        def _dfs(node: TreeNode, depth: int):
            result.append({
                "name": node.name,
                "type": node.node_type,
                "depth": depth,
                "children_count": len(node.children),
                "data": node.data,
            })
            for child in node.children:
                _dfs(child, depth + 1)

        _dfs(self.root, 0)
        return result

    def to_dict(self) -> Dict[str, Any]:
        """Convert tree structure to nested dict for frontend UI rendering."""
        def _node_to_dict(node: TreeNode) -> Dict[str, Any]:
            return {
                "name": node.name,
                "type": node.node_type,
                "data": node.data,
                "children": [_node_to_dict(c) for c in node.children],
            }
        return _node_to_dict(self.root)
