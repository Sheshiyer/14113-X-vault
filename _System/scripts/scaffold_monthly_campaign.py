#!/usr/bin/env python3
"""
scaffold_monthly_campaign.py — Generate coordinated daily briefs from one meta-theme.

Usage:
  python scaffold_monthly_campaign.py --meta-theme "Runtime Authorship"
  python scaffold_monthly_campaign.py --meta-theme "Runtime Authorship" --days 30 --channel X
"""

from __future__ import annotations

import argparse
import os
import re
from datetime import date, datetime, timedelta

import yaml


VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BRIEF_DIR = os.path.join(VAULT_ROOT, "01-Projects", "Content-Engine", "_processing", "content-briefs")

DEFAULT_ANGLES = [
    "First-principles definition",
    "Most common misconception",
    "Failure mode map",
    "Diagnostic checklist",
    "Operator protocol",
    "Real-world case study",
    "Historical lineage lens",
    "Technical systems analogy",
    "Embodied practice bridge",
    "Daily ritual application",
    "Mistake audit framework",
    "Decision-making filter",
    "Tradeoff analysis",
    "Counterargument and rebuttal",
    "Myth vs mechanism",
    "Beginner pathway",
    "Intermediate progression",
    "Advanced pattern synthesis",
    "Tooling stack recommendation",
    "Metrics and signal tracking",
    "Leadership application",
    "Team operating model",
    "Personal operating model",
    "Ethics and guardrails",
    "Edge-case handling",
    "Anti-pattern teardown",
    "Field notes narrative",
    "Practice Q&A format",
    "Summary and integration",
    "30-day consolidation review",
]

ROLE_SEQUENCE = [
    "hook",
    "problem",
    "diagnostic",
    "protocol",
    "proof",
    "integration",
]


def slugify(text: str) -> str:
    text = re.sub(r"[^a-zA-Z0-9]+", "-", str(text).strip().lower())
    return text.strip("-") or "campaign"


def build_topic(meta_theme: str, angle: str, day_num: int) -> str:
    return f"{meta_theme} — Day {day_num:02d}: {angle}"


def build_brief(topic: str, channel: str, publish_date: date, meta_theme: str, day_num: int) -> dict:
    role = ROLE_SEQUENCE[(day_num - 1) % len(ROLE_SEQUENCE)]
    return {
        "topic": topic,
        "date": publish_date.isoformat(),
        "channel": channel,
        "status": "draft",
        "campaign": {
            "meta_theme": meta_theme,
            "day": day_num,
            "role": role,
            "series_length": None,  # populated later
        },
        "source_lattice": {
            "areas": [],
            "resources": [],
            "projects": [],
        },
        "depth_gates": {
            "runtime_claim": "pending",
            "pattern_claim": "pending",
            "embodied_intervention": "pending",
            "non_pitch_closure": "pending",
        },
        "evidence_chunks": [],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate coordinated daily campaign briefs.")
    parser.add_argument("--meta-theme", required=True, help="Single campaign theme for all briefs")
    parser.add_argument("--days", type=int, default=30, help="Number of briefs to generate (default: 30)")
    parser.add_argument(
        "--channel",
        default="X",
        choices=["X", "Substack", "LinkedIn", "IG"],
        help="Default channel for all generated briefs",
    )
    parser.add_argument(
        "--start-date",
        default=date.today().isoformat(),
        help="Campaign start date (YYYY-MM-DD). Default: today.",
    )
    parser.add_argument(
        "--output-dir",
        help="Optional output directory (defaults to content-briefs/series/<slug>-<date>)",
    )
    args = parser.parse_args()

    if args.days <= 0:
        raise SystemExit("--days must be > 0")

    try:
        start_date = datetime.strptime(args.start_date, "%Y-%m-%d").date()
    except ValueError as exc:
        raise SystemExit(f"Invalid --start-date: {args.start_date}") from exc

    campaign_slug = slugify(args.meta_theme)
    default_output = os.path.join(
        BRIEF_DIR,
        "series",
        f"{campaign_slug}-{start_date.strftime('%Y%m%d')}",
    )
    output_dir = os.path.abspath(args.output_dir or default_output)
    os.makedirs(output_dir, exist_ok=True)

    manifest = {
        "meta_theme": args.meta_theme,
        "slug": campaign_slug,
        "channel": args.channel,
        "start_date": start_date.isoformat(),
        "days": args.days,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "briefs": [],
    }

    for idx in range(args.days):
        day_num = idx + 1
        angle = DEFAULT_ANGLES[idx % len(DEFAULT_ANGLES)]
        topic = build_topic(args.meta_theme, angle, day_num)
        brief = build_brief(
            topic=topic,
            channel=args.channel,
            publish_date=start_date + timedelta(days=idx),
            meta_theme=args.meta_theme,
            day_num=day_num,
        )
        brief["campaign"]["series_length"] = args.days
        brief["campaign"]["angle"] = angle

        file_slug = f"{campaign_slug}-day-{day_num:02d}"
        file_path = os.path.join(output_dir, f"{file_slug}.yaml")
        with open(file_path, "w", encoding="utf-8") as f:
            yaml.dump(brief, f, sort_keys=False, allow_unicode=True)

        manifest["briefs"].append({
            "day": day_num,
            "date": brief["date"],
            "topic": topic,
            "file": file_path,
        })

    manifest_path = os.path.join(output_dir, "campaign_manifest.yaml")
    with open(manifest_path, "w", encoding="utf-8") as f:
        yaml.dump(manifest, f, sort_keys=False, allow_unicode=True)

    print(f"✅ Generated {args.days} coordinated briefs from meta-theme: {args.meta_theme}")
    print(f"Output directory: {output_dir}")
    print(f"Manifest: {manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

