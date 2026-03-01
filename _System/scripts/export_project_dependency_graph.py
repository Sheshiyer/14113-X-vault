#!/usr/bin/env python3
"""
export_project_dependency_graph.py — Export semantic dependency graph across 01-Projects.

Issue #57 acceptance:
- Visualize how projects share foundational knowledge via embedding similarity.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter, defaultdict

import numpy as np


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_INDEX_DIR = os.path.join(VAULT_ROOT, "_System", "memory")
MEMORY_SCRIPTS_DIR = os.path.join(VAULT_ROOT, "_System", "scripts", "memory")
sys.path.insert(0, MEMORY_SCRIPTS_DIR)

from incremental import load_embeddings  # type: ignore  # noqa: E402


def iter_meta_records(index_dir: str, max_records: int | None = None):
    jsonl_path = os.path.join(index_dir, "meta.jsonl")
    if os.path.exists(jsonl_path):
        with open(jsonl_path, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
                if max_records is not None and idx >= max_records:
                    return
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if isinstance(rec, dict):
                    yield idx, rec
        return

    json_path = os.path.join(index_dir, "meta.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        return
    for idx, rec in enumerate(data):
        if max_records is not None and idx >= max_records:
            return
        if isinstance(rec, dict):
            yield idx, rec


def _project_name_from_path(path: str) -> str | None:
    parts = str(path or "").split("/")
    if len(parts) < 2:
        return None
    if parts[0] != "01-Projects":
        return None
    return parts[1].strip() or None


def collect_project_samples(
    index_dir: str,
    *,
    max_projects: int,
    max_chunks_per_project: int,
    max_records: int | None,
):
    project_rows = {}
    for idx, rec in iter_meta_records(index_dir, max_records=max_records):
        path = str(rec.get("path") or "")
        project = _project_name_from_path(path)
        if not project:
            continue

        row = project_rows.setdefault(project, {
            "project": project,
            "chunk_count": 0,
            "indices": [],
            "domain_counter": Counter(),
            "path_samples": [],
        })
        row["chunk_count"] += 1
        if len(row["indices"]) < max_chunks_per_project:
            row["indices"].append(idx)
        domain = str(rec.get("domain") or "").strip()
        if domain:
            row["domain_counter"][domain] += 1
        if len(row["path_samples"]) < 3 and path not in row["path_samples"]:
            row["path_samples"].append(path)

    rows = sorted(project_rows.values(), key=lambda r: r["chunk_count"], reverse=True)
    return rows[:max(2, max_projects)]


def _load_embeddings(index_dir: str):
    emb_path = os.path.join(index_dir, "embeddings.npy")
    if not os.path.exists(emb_path):
        raise FileNotFoundError(f"embeddings.npy not found in {index_dir}")
    return load_embeddings(emb_path, expected_rows=None)


def build_nodes_and_centroids(project_rows: list[dict], embeddings) -> tuple[list[dict], np.ndarray]:
    nodes = []
    vecs = []

    for row in project_rows:
        idxs = [i for i in row["indices"] if 0 <= i < embeddings.shape[0]]
        if not idxs:
            continue

        mat = np.asarray(embeddings[idxs], dtype=np.float32)
        centroid = mat.mean(axis=0)
        norm = float(np.linalg.norm(centroid))
        if norm <= 1e-9:
            continue
        centroid = centroid / norm

        domains = [d for d, _ in row["domain_counter"].most_common(3)]
        nodes.append({
            "project": row["project"],
            "chunk_count": int(row["chunk_count"]),
            "sampled_chunks": len(idxs),
            "top_domains": domains,
            "sample_paths": row["path_samples"],
        })
        vecs.append(centroid)

    if not vecs:
        return nodes, np.zeros((0, 0), dtype=np.float32)
    return nodes, np.vstack(vecs).astype(np.float32)


def build_edges(
    nodes: list[dict],
    unit_vecs: np.ndarray,
    *,
    min_similarity: float,
    top_links_per_project: int,
) -> list[dict]:
    if unit_vecs.shape[0] < 2:
        return []

    sim = np.matmul(unit_vecs, unit_vecs.T)
    per_node = defaultdict(list)

    n = sim.shape[0]
    for i in range(n):
        for j in range(i + 1, n):
            score = float(sim[i, j])
            if score < min_similarity:
                continue
            per_node[i].append((score, j))
            per_node[j].append((score, i))

    picked = {}
    for i, links in per_node.items():
        links = sorted(links, key=lambda x: x[0], reverse=True)[:max(1, top_links_per_project)]
        for score, j in links:
            a, b = sorted((i, j))
            key = (a, b)
            if key not in picked or score > picked[key]:
                picked[key] = score

    edges = []
    for (a, b), score in sorted(picked.items(), key=lambda kv: kv[1], reverse=True):
        edges.append({
            "source": nodes[a]["project"],
            "target": nodes[b]["project"],
            "similarity": round(float(score), 4),
            "shared_domains_hint": sorted(
                set(nodes[a]["top_domains"]).intersection(nodes[b]["top_domains"])
            )[:3],
        })
    return edges


def compute_centrality_rankings(nodes: list[dict], edges: list[dict], *, top_n: int = 20) -> list[dict]:
    degree_counts = Counter()
    weight_sums = defaultdict(float)

    for edge in edges:
        src = str(edge.get("source") or "")
        dst = str(edge.get("target") or "")
        w = float(edge.get("similarity") or 0.0)
        if not src or not dst:
            continue
        degree_counts[src] += 1
        degree_counts[dst] += 1
        weight_sums[src] += w
        weight_sums[dst] += w

    denom = max(1, len(nodes) - 1)
    ranking_rows = []
    for row in nodes:
        project = str(row.get("project") or "")
        degree = int(degree_counts.get(project, 0))
        weight_sum = float(weight_sums.get(project, 0.0))
        degree_centrality = float(degree) / float(denom) if len(nodes) > 1 else 0.0
        weighted_centrality = weight_sum / float(denom) if len(nodes) > 1 else 0.0
        row["link_degree"] = degree
        row["link_weight_sum"] = round(weight_sum, 4)
        row["degree_centrality"] = round(degree_centrality, 4)
        row["weighted_centrality"] = round(weighted_centrality, 4)
        ranking_rows.append(
            {
                "project": project,
                "link_degree": degree,
                "link_weight_sum": round(weight_sum, 4),
                "degree_centrality": round(degree_centrality, 4),
                "weighted_centrality": round(weighted_centrality, 4),
            }
        )

    ranking_rows.sort(
        key=lambda r: (
            -float(r["weighted_centrality"]),
            -int(r["link_degree"]),
            str(r["project"]).lower(),
        )
    )
    return [
        {
            "rank": idx,
            **row,
        }
        for idx, row in enumerate(ranking_rows[: max(1, int(top_n))], start=1)
    ]


def _mermaid_id(name: str) -> str:
    clean = "".join(ch if ch.isalnum() else "_" for ch in name)
    return f"p_{clean}"


def to_mermaid(nodes: list[dict], edges: list[dict]) -> str:
    lines = ["graph LR"]
    for n in nodes:
        nid = _mermaid_id(n["project"])
        lines.append(f'  {nid}["{n["project"]}"]')
    for e in edges:
        a = _mermaid_id(e["source"])
        b = _mermaid_id(e["target"])
        label = f'{e["similarity"]:.3f}'
        lines.append(f'  {a} -- "{label}" --> {b}')
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Export semantic dependency graph across 01-Projects.")
    parser.add_argument("--index-dir", default=DEFAULT_INDEX_DIR, help="Index dir with embeddings/meta.")
    parser.add_argument("--max-projects", type=int, default=60, help="Max number of projects in graph.")
    parser.add_argument("--max-chunks-per-project", type=int, default=64, help="Max sampled chunks per project.")
    parser.add_argument("--top-links-per-project", type=int, default=5, help="Keep top-N links per project.")
    parser.add_argument("--min-similarity", type=float, default=0.45, help="Edge similarity threshold.")
    parser.add_argument("--max-records", type=int, help="Optional metadata scan cap for faster runs.")
    parser.add_argument("--output-json", default=None, help="Path for graph JSON output.")
    parser.add_argument("--output-mermaid", default=None, help="Path for Mermaid graph output.")
    parser.add_argument("--json", action="store_true", help="Print summary JSON to stdout.")
    args = parser.parse_args()

    index_dir = os.path.abspath(args.index_dir)
    if not os.path.isdir(index_dir):
        print(f"Error: index directory not found: {index_dir}", file=os.sys.stderr)
        return 1

    project_rows = collect_project_samples(
        index_dir,
        max_projects=max(2, int(args.max_projects)),
        max_chunks_per_project=max(1, int(args.max_chunks_per_project)),
        max_records=args.max_records if args.max_records and args.max_records > 0 else None,
    )
    embeddings = _load_embeddings(index_dir)
    nodes, unit_vecs = build_nodes_and_centroids(project_rows, embeddings)
    edges = build_edges(
        nodes,
        unit_vecs,
        min_similarity=float(args.min_similarity),
        top_links_per_project=max(1, int(args.top_links_per_project)),
    )
    centrality_ranking = compute_centrality_rankings(nodes, edges, top_n=max(5, min(50, int(args.max_projects))))

    graph = {
        "summary": {
            "index_dir": index_dir,
            "projects_considered": len(project_rows),
            "projects_in_graph": len(nodes),
            "edges": len(edges),
            "min_similarity": float(args.min_similarity),
            "centrality_ranked": len(centrality_ranking),
        },
        "nodes": nodes,
        "edges": edges,
        "centrality_ranking": centrality_ranking,
    }

    json_path = args.output_json or os.path.join(index_dir, "project_dependency_graph.json")
    mermaid_path = args.output_mermaid or os.path.join(index_dir, "project_dependency_graph.mmd")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    with open(mermaid_path, "w", encoding="utf-8") as f:
        f.write(to_mermaid(nodes, edges))

    if args.json:
        print(json.dumps(graph["summary"], indent=2, ensure_ascii=False))
    else:
        print("Cross-Project Dependency Graph")
        print(f"- Projects in graph: {graph['summary']['projects_in_graph']}")
        print(f"- Edges: {graph['summary']['edges']}")
        if graph.get("centrality_ranking"):
            print("- Top central projects:")
            for row in graph["centrality_ranking"][:5]:
                print(
                    f"  {row['rank']}. {row['project']} "
                    f"(weighted={row['weighted_centrality']}, degree={row['link_degree']})"
                )
        print(f"- JSON: {json_path}")
        print(f"- Mermaid: {mermaid_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
