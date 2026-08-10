"""
DSA Router: Search, Sort, Hash Tables, BST, Graph, Stack, Queue, Heap, and Benchmarks.
"""

import os
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.models.dataset import Dataset
from backend.app.models.algorithm_run import AlgorithmRun
from backend.app.schemas.dsa import (
    SearchRequest, SearchResponse,
    SortRequest, SortResponse,
    DSACardSchema, BenchmarkItemSchema
)
from backend.app.api.deps import get_current_user
from backend.app.dsa.searching import search_dataset
from backend.app.dsa.sorting import sort_dataset
from backend.app.dsa.bst import DatasetBST
from backend.app.dsa.graph import CorrelationGraph
from backend.app.dsa.heap import MinHeap, MaxHeap, extract_top_k
from backend.app.dsa.stack import DataTransformStack
from backend.app.dsa.queue import ProcessingQueue
from backend.app.dsa.hash_table import CustomHashTable
from backend.app.dsa.complexity import estimate_time_complexity

router = APIRouter(prefix="/dsa", tags=["Data Structures & Algorithms"])


def _load_df(dataset_id: int, user_id: int, db: Session) -> pd.DataFrame:
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, (Dataset.user_id == user_id) | (Dataset.user_id == 1)).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="Dataset file missing")
    if dataset.filename.endswith('.csv'):
        return pd.read_csv(dataset.file_path)
    elif dataset.filename.endswith(('.xlsx', '.xls')):
        return pd.read_excel(dataset.file_path)
    else:
        return pd.read_json(dataset.file_path)


@router.post("/search", response_model=SearchResponse)
def execute_search(
    req: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    df = _load_df(req.dataset_id, current_user.id, db)
    records = df.to_dict(orient="records")

    res = search_dataset(records, req.column_name, req.target_value, req.algorithm)

    run = AlgorithmRun(
        user_id=current_user.id,
        dataset_id=req.dataset_id,
        algorithm=f"{req.algorithm.title()} Search",
        operation=f"Search {req.column_name}",
        input_size=len(records),
        execution_time_ms=res["execution_time_seconds"] * 1000.0,
        time_complexity=res["time_complexity"],
        status="Completed"
    )
    db.add(run)
    db.commit()

    return SearchResponse(
        algorithm=req.algorithm,
        column_name=req.column_name,
        target_value=str(req.target_value),
        match_count=res["match_count"],
        execution_time_seconds=res["execution_time_seconds"],
        time_complexity=res["time_complexity"],
        results=res["results"],
    )


@router.post("/sort", response_model=SortResponse)
def execute_sort(
    req: SortRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    df = _load_df(req.dataset_id, current_user.id, db)
    records = df.to_dict(orient="records")

    res = sort_dataset(records, req.column_name, req.algorithm, req.ascending)

    run = AlgorithmRun(
        user_id=current_user.id,
        dataset_id=req.dataset_id,
        algorithm=f"{req.algorithm.title()} Sort",
        operation=f"Sort {req.column_name}",
        input_size=len(records),
        execution_time_ms=res["execution_time_seconds"] * 1000.0,
        time_complexity=res["time_complexity"],
        status="Completed"
    )
    db.add(run)
    db.commit()

    return SortResponse(
        algorithm=req.algorithm,
        column_name=req.column_name,
        ascending=req.ascending,
        total_records=res["total_records"],
        execution_time_seconds=res["execution_time_seconds"],
        time_complexity=res["time_complexity"],
        sorted_preview=res["sorted_preview"],
    )


@router.get("/overview", response_model=List[DSACardSchema])
def get_dsa_overview():
    """Returns the 10 core Data Structures & Algorithms cards for the DSA Engine view."""
    return [
        DSACardSchema(
            name="Arrays / Lists",
            purpose="Contiguous memory layout for fast sequential dataset iteration and random indexing.",
            time_complexity="O(1) Access, O(n) Insertion",
            status="Active",
            dataset_operation="Storing tabular rows and column field vectors in memory."
        ),
        DSACardSchema(
            name="Hash Tables",
            purpose="Key-value bucketing using dynamic hashing functions for constant-time lookups.",
            time_complexity="O(1) Average Lookup / Insertion",
            status="Active",
            dataset_operation="Indexed categorical search and group-by aggregations."
        ),
        DSACardSchema(
            name="Stack (LIFO)",
            purpose="Last-In-First-Out container for transformation history and undo operations.",
            time_complexity="O(1) Push / Pop",
            status="Active",
            dataset_operation="Reversible data cleaning, normalization steps, and transform rollback."
        ),
        DSACardSchema(
            name="Queue (FIFO)",
            purpose="First-In-First-Out task queue for batch processing dataset chunks.",
            time_complexity="O(1) Enqueue / Dequeue",
            status="Active",
            dataset_operation="Asynchronous row processing, export pipelines, and stream buffering."
        ),
        DSACardSchema(
            name="Linked List",
            purpose="Pointer-based sequential elements enabling instant node insertion and removal.",
            time_complexity="O(1) Head Insertion, O(n) Search",
            status="Active",
            dataset_operation="Dynamic stream ingestion and live record insertion."
        ),
        DSACardSchema(
            name="Sorting Algorithms",
            purpose="QuickSort, MergeSort, HeapSort & BubbleSort for ordered analysis and ranking.",
            time_complexity="O(n log n) Best / Average",
            status="Active",
            dataset_operation="Ranking revenue, sorting timestamp series, and percentile analysis."
        ),
        DSACardSchema(
            name="Searching Algorithms",
            purpose="Binary Search, Linear Search & Hash Indexing for rapid record retrieval.",
            time_complexity="O(log n) Binary, O(1) Hash",
            status="Active",
            dataset_operation="Locating record IDs, filtering thresholds, and anomaly lookups."
        ),
        DSACardSchema(
            name="Heap / Priority Queue",
            purpose="Binary heap property maintenance for instantaneous top-K selection.",
            time_complexity="O(log k) Top-K Extraction",
            status="Active",
            dataset_operation="Finding top 10 highest revenue rows and outlier extreme detection."
        ),
        DSACardSchema(
            name="Binary Search Tree (BST)",
            purpose="Hierarchical tree node layout enabling balanced range queries and in-order traversal.",
            time_complexity="O(log n) Average Search / Insert",
            status="Active",
            dataset_operation="Numeric range queries (e.g., price between $100 and $500)."
        ),
        DSACardSchema(
            name="Graph",
            purpose="Adjacency matrix & list node connections for feature relationship mapping.",
            time_complexity="O(V + E) Traversal (BFS / DFS)",
            status="Active",
            dataset_operation="Column correlation graph network, dependency trees, and cluster paths."
        ),
    ]


@router.get("/performance", response_model=List[BenchmarkItemSchema])
def get_dsa_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    runs = db.query(AlgorithmRun).filter(AlgorithmRun.user_id == current_user.id).order_by(AlgorithmRun.created_at.desc()).limit(20).all()
    if not runs:
        # Provide sample default benchmark entries
        return [
            BenchmarkItemSchema(
                algorithm="Quick Sort",
                operation="Sort Revenue",
                input_size=25430,
                execution_time="0.032s",
                time_complexity="O(n log n)",
                status="Completed"
            ),
            BenchmarkItemSchema(
                algorithm="Binary Search",
                operation="Find Customer ID",
                input_size=25430,
                execution_time="0.001s",
                time_complexity="O(log n)",
                status="Completed"
            ),
            BenchmarkItemSchema(
                algorithm="Hash Table Lookup",
                operation="Group By Region",
                input_size=25430,
                execution_time="0.004s",
                time_complexity="O(1)",
                status="Completed"
            ),
            BenchmarkItemSchema(
                algorithm="Heap Extract Top-K",
                operation="Top 10 Transactions",
                input_size=25430,
                execution_time="0.006s",
                time_complexity="O(n log k)",
                status="Completed"
            ),
            BenchmarkItemSchema(
                algorithm="BST Range Query",
                operation="Filter Profit Range",
                input_size=25430,
                execution_time="0.009s",
                time_complexity="O(log n + k)",
                status="Completed"
            ),
        ]

    res = []
    for r in runs:
        res.append(BenchmarkItemSchema(
            algorithm=r.algorithm,
            operation=r.operation,
            input_size=r.input_size,
            execution_time=f"{(r.execution_time_ms / 1000.0):.4f}s",
            time_complexity=r.time_complexity,
            status=r.status
        ))
    return res


@router.get("/{dataset_id}/bst")
def get_dataset_bst(
    dataset_id: int,
    column_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    df = _load_df(dataset_id, current_user.id, db)
    if column_name not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column_name}' not found")

    bst = DatasetBST()
    records = df.to_dict(orient="records")
    for row in records[:500]:  # Cap for tree depth display
        val = row.get(column_name)
        if pd.notnull(val):
            try:
                numeric_val = float(val)
                bst.insert(numeric_val, row)
            except (ValueError, TypeError):
                pass

    return {
        "dataset_id": dataset_id,
        "column_name": column_name,
        "tree_structure": bst.to_dict(),
        "inorder_sample": bst.inorder_traversal()[:50]
    }


@router.get("/{dataset_id}/graph")
def get_dataset_graph(
    dataset_id: int,
    threshold: float = 0.2,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    df = _load_df(dataset_id, current_user.id, db)
    graph = CorrelationGraph()
    graph.build_from_dataframe(df, correlation_threshold=threshold)

    return {
        "dataset_id": dataset_id,
        "correlation_graph": graph.to_dict(),
        "bfs_nodes": graph.bfs("Revenue") if "Revenue" in df.columns else graph.bfs(list(graph.nodes.keys())[0]) if graph.nodes else [],
    }
