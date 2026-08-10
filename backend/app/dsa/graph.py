"""
Custom Graph Implementation (Adjacency List) for Column Relationship & Correlation Mapping.
"""

from typing import Any, List, Dict, Set, Tuple
from collections import deque
import pandas as pd


class Graph:
    """
    Adjacency List Graph representation for dataset column relationships.
    Nodes represent dataset columns; edges represent relationships or correlations.
    """

    def __init__(self):
        self.adjacency_list: Dict[str, List[Dict[str, Any]]] = {}
        self.nodes: Dict[str, str] = {}

    def add_vertex(self, vertex: str) -> None:
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
            self.nodes[vertex] = vertex

    def add_edge(self, source: str, target: str, weight: float = 1.0, relation_type: str = "related") -> None:
        self.add_vertex(source)
        self.add_vertex(target)

        if not any(e["target"] == target for e in self.adjacency_list[source]):
            self.adjacency_list[source].append({"target": target, "weight": weight, "type": relation_type})
        if not any(e["target"] == source for e in self.adjacency_list[target]):
            self.adjacency_list[target].append({"target": source, "weight": weight, "type": relation_type})

    def bfs(self, start_vertex: str) -> List[str]:
        """Breadth-First Search Traversal O(V + E)."""
        visited: Set[str] = set()
        order: List[str] = []
        if start_vertex not in self.adjacency_list:
            return order

        queue = deque([start_vertex])
        visited.add(start_vertex)

        while queue:
            v = queue.popleft()
            order.append(v)
            for neighbor in self.adjacency_list[v]:
                t = neighbor["target"]
                if t not in visited:
                    visited.add(t)
                    queue.append(t)
        return order

    def dfs(self, start_vertex: str) -> List[str]:
        """Depth-First Search Traversal O(V + E)."""
        visited: Set[str] = set()
        order: List[str] = []

        def _dfs_rec(v: str):
            visited.add(v)
            order.append(v)
            for neighbor in self.adjacency_list.get(v, []):
                t = neighbor["target"]
                if t not in visited:
                    _dfs_rec(t)

        if start_vertex in self.adjacency_list:
            _dfs_rec(start_vertex)
        return order

    def build_from_dataframe(self, df: pd.DataFrame, correlation_threshold: float = 0.2):
        num_cols = df.select_dtypes(include=['number']).columns
        for c in num_cols:
            self.add_vertex(str(c))

        if len(num_cols) >= 2:
            corr_matrix = df[num_cols].corr()
            for i in range(len(num_cols)):
                for j in range(i + 1, len(num_cols)):
                    val = corr_matrix.iloc[i, j]
                    if pd.notnull(val) and abs(val) >= correlation_threshold:
                        self.add_edge(str(num_cols[i]), str(num_cols[j]), weight=round(float(val), 4))

    def to_dict(self) -> Dict[str, Any]:
        return self.to_cytoscape_format()

    def to_cytoscape_format(self) -> Dict[str, Any]:
        nodes = [{"id": v, "label": v} for v in self.adjacency_list.keys()]
        edges = []
        seen_edges = set()

        for source, neighbors in self.adjacency_list.items():
            for edge in neighbors:
                target = edge["target"]
                edge_id = tuple(sorted([source, target]))
                if edge_id not in seen_edges:
                    seen_edges.add(edge_id)
                    edges.append({
                        "source": source,
                        "target": target,
                        "weight": edge["weight"],
                        "type": edge.get("type", "correlation"),
                    })

        return {
            "nodes": nodes,
            "edges": edges,
            "vertex_count": len(nodes),
            "edge_count": len(edges),
        }


CorrelationGraph = Graph
