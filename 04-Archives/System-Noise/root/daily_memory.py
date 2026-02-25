#!/usr/bin/env python3
"""daily_memory.py

Create (or reuse) a daily markdown note at memory/YYYY-MM-DD.md.

Design goals:
- zero external deps
- safe by default (won't overwrite existing files)
- supports running against an alternate base dir for testing
"""

from __future__ import annotations

import argparse
import datetime as _dt
from pathlib import Path


TEMPLATE = """# {date}
{prev_link}

## Morning Intentions

- 

## Notes

- 

## Evening Reflection

- 

"""


def _parse_date(s: str) -> _dt.date:
    try:
        return _dt.date.fromisoformat(s)
    except ValueError as e:
        raise argparse.ArgumentTypeError(f"Invalid date '{s}'. Use YYYY-MM-DD.") from e


def build_note_text(date: _dt.date, prev_exists: bool) -> str:
    prev = date - _dt.timedelta(days=1)
    prev_link = f"Previous: [[{prev.isoformat()}]]" if prev_exists else ""
    return TEMPLATE.format(date=date.isoformat(), prev_link=prev_link).rstrip() + "\n"


def create_daily_note(base_dir: Path, date: _dt.date) -> Path:
    base_dir = base_dir.expanduser().resolve()
    base_dir.mkdir(parents=True, exist_ok=True)

    path = base_dir / f"{date.isoformat()}.md"
    if path.exists():
        return path

    prev = base_dir / f"{(date - _dt.timedelta(days=1)).isoformat()}.md"
    text = build_note_text(date, prev_exists=prev.exists())
    path.write_text(text, encoding="utf-8")
    return path


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="daily-memory",
        description="Create/reuse memory/YYYY-MM-DD.md with a simple template.",
    )
    parser.add_argument(
        "--dir",
        default=str(Path(__file__).resolve().parent / "memory"),
        help="Base memory directory (default: <repo>/memory)",
    )
    parser.add_argument(
        "--date",
        type=_parse_date,
        default=_dt.date.today(),
        help="Date for the note (YYYY-MM-DD). Default: today.",
    )

    args = parser.parse_args(argv)
    note_path = create_daily_note(Path(args.dir), args.date)
    print(str(note_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
