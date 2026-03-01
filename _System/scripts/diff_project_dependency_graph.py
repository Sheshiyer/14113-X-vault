#!/usr/bin/env python3
"""
diff_project_dependency_graph.py — Compare two project dependency graph snapshots.

Issue #81 acceptance:
- Report added/removed nodes and edges.
- Report rank deltas when centrality ranking is available in both snapshots.
"""

from __future__ import annotations

import argparse
import json
import os
import sys


def _load_graph(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError(f"Graph snapshot must be a JSON object: {path}")
    return data


def _node_names(graph: dict) -> set[str]:
    names: set[str] = set()
    for row in graph.get("nodes") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("project") or "").strip()
        if name:
            names.add(name)
    return names


def _edge_map(graph: dict) -> dict[tuple[str, str], float]:
    edge_map: dict[tuple[str, str], float] = {}
    for row in graph.get("edges") or []:
        if not isinstance(row, dict):
            continue
        a = str(row.get("source") or "").strip()
        b = str(row.get("target") or "").strip()
        if not a or not b:
            continue
        key = tuple(sorted((a, b)))
        edge_map[key] = float(row.get("similarity") or 0.0)
    return edge_map


def _rank_map(graph: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for row in graph.get("centrality_ranking") or []:
        if not isinstance(row, dict):
            continue
        name = str(row.get("project") or "").strip()
        rank = row.get("rank")
        if not name:
            continue
        try:
            out[name] = int(rank)
        except Exception:
            continue
    return out


def build_diff(before: dict, after: dict, *, before_path: str, after_path: str) -> dict:
    nodes_before = _node_names(before)
    nodes_after = _node_names(after)
    added_nodes = sorted(nodes_after - nodes_before)
    removed_nodes = sorted(nodes_before - nodes_after)

    edges_before = _edge_map(before)
    edges_after = _edge_map(after)
    added_edge_keys = sorted(set(edges_after.keys()) - set(edges_before.keys()))
    removed_edge_keys = sorted(set(edges_before.keys()) - set(edges_after.keys()))
    added_edges = [
        {"source": a, "target": b, "similarity": round(float(edges_after[(a, b)]), 4)}
        for a, b in added_edge_keys
    ]
    removed_edges = [
        {"source": a, "target": b, "similarity": round(float(edges_before[(a, b)]), 4)}
        for a, b in removed_edge_keys
    ]

    rank_before = _rank_map(before)
    rank_after = _rank_map(after)
    common_ranked = sorted(set(rank_before.keys()).intersection(rank_after.keys()))
    rank_changes = []
    for name in common_ranked:
        b_rank = int(rank_before[name])
        a_rank = int(rank_after[name])
        delta = b_rank - a_rank
        if delta == 0:
            continue
        rank_changes.append(
            {
                "project": name,
                "before_rank": b_rank,
                "after_rank": a_rank,
                "rank_delta": delta,
            }
        )
    rank_changes.sort(key=lambda r: (-abs(int(r["rank_delta"])), str(r["project"]).lower()))

    return {
        "summary": {
            "before_snapshot": os.path.abspath(before_path),
            "after_snapshot": os.path.abspath(after_path),
            "nodes_before": len(nodes_before),
            "nodes_after": len(nodes_after),
            "nodes_added": len(added_nodes),
            "nodes_removed": len(removed_nodes),
            "edges_before": len(edges_before),
            "edges_after": len(edges_after),
            "edges_added": len(added_edges),
            "edges_removed": len(removed_edges),
            "rank_changes": len(rank_changes),
        },
        "nodes_added": added_nodes,
        "nodes_removed": removed_nodes,
        "edges_added": added_edges,
        "edges_removed": removed_edges,
        "centrality_rank_changes": rank_changes,
    }


def _print_human(diff: dict) -> None:
    summary = diff.get("summary") or {}
    print("Project Graph Snapshot Diff")
    print(f"- Before: {summary.get('before_snapshot')}")
    print(f"- After: {summary.get('after_snapshot')}")
    print(
        f"- Nodes: {summary.get('nodes_before')} -> {summary.get('nodes_after')} "
        f"(+{summary.get('nodes_added')}, -{summary.get('nodes_removed')})"
    )
    print(
        f"- Edges: {summary.get('edges_before')} -> {summary.get('edges_after')} "
        f"(+{summary.get('edges_added')}, -{summary.get('edges_removed')})"
    )
    if diff.get("nodes_added"):
        print("- Added nodes:")
        for name in diff["nodes_added"][:10]:
            print(f"  - {name}")
    if diff.get("nodes_removed"):
        print("- Removed nodes:")
        for name in diff["nodes_removed"][:10]:
            print(f"  - {name}")
    if diff.get("centrality_rank_changes"):
        print("- Top rank shifts:")
        for row in diff["centrality_rank_changes"][:10]:
            print(
                f"  - {row['project']}: {row['before_rank']} -> {row['after_rank']} "
                f"(delta={row['rank_delta']:+d})"
            )


def main() -> int:
    parser = argparse.ArgumentParser(description="Diff two project dependency graph snapshots.")
    parser.add_argument("--before", required=True, help="Path to older graph JSON snapshot.")
    parser.add_argument("--after", required=True, help="Path to newer graph JSON snapshot.")
    parser.add_argument("--output", help="Optional path to write diff JSON.")
    parser.add_argument("--json", action="store_true", help="Print diff JSON to stdout.")
    args = parser.parse_args()

    before_path = os.path.abspath(args.before)
    after_path = os.path.abspath(args.after)
    if not os.path.exists(before_path):
        print(f"Error: before snapshot not found: {before_path}", file=sys.stderr)
        return 1
    if not os.path.exists(after_path):
        print(f"Error: after snapshot not found: {after_path}", file=sys.stderr)
        return 1

    try:
        before = _load_graph(before_path)
        after = _load_graph(after_path)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    diff = build_diff(before, after, before_path=before_path, after_path=after_path)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(diff, f, indent=2, ensure_ascii=False)

    if args.json:
        print(json.dumps(diff, indent=2, ensure_ascii=False))
    else:
        _print_human(diff)
        if args.output:
            print(f"- JSON: {os.path.abspath(args.output)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
