#!/usr/bin/env python3
import argparse
from pathlib import Path


def yaml_list(items, indent=2):
    if not items:
        return "[]"
    pad = " " * indent
    return "\n" + "\n".join(f"{pad}- {item}" for item in items)


parser = argparse.ArgumentParser(description="Scaffold layered content brief")
parser.add_argument("--topic", required=True)
parser.add_argument("--channel", required=True, choices=["substack", "twitter", "linkedin", "instagram"])
parser.add_argument("--out", required=True)
parser.add_argument("--area-source", action="append", default=[])
parser.add_argument("--resource-source", action="append", default=[])
parser.add_argument("--project-source", action="append", default=[])
args = parser.parse_args()

body = f"""topic: {args.topic}
channel: {args.channel}
required_claims:
  runtime_claim: ""
  pattern_claim: ""
  enneagram_lens: ""
  embodied_intervention: ""
  closure_style: non-pitch
sources:
  areas:{yaml_list(args.area_source, indent=4)}
  resources:{yaml_list(args.resource_source, indent=4)}
  project:{yaml_list(args.project_source, indent=4)}
gates:
  min_area_sources: 2
  min_resource_sources: 1
  meta_language_removed: true
"""

out = Path(args.out)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(body)
print(out)
