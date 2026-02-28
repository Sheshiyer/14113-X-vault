#!/usr/bin/env python3
"""
validate_meta_schema.py - Validate chunk-level metadata schema in _System/memory/meta.json.

Checks:
  - required fields at chunk level
  - field types
  - allowed PARA values
  - non-empty required string values
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter
from typing import Any

from pydantic import BaseModel, ConfigDict, StrictInt, StrictStr, ValidationError
from pydantic import field_validator
from pydantic_core import PydanticCustomError


REQUIRED_FIELDS: dict[str, str] = {
    "path": "str",
    "para": "str",
    "domain": "str",
    "chunk_index": "int",
    "enneagram_uuid": "str",
    "text": "str",
    "file_format": "str",
}

REQUIRED_STRING_FIELDS = {
    "path",
    "para",
    "domain",
    "enneagram_uuid",
    "text",
    "file_format",
}

ALLOWED_PARA_VALUES = {
    "Projects",
    "Areas",
    "Resources",
    "Archives",
    "System",
    "Root",
    "Annamaya",
}

DEFAULT_VAULT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)
DEFAULT_META_PATH = os.path.join(DEFAULT_VAULT, "_System", "memory", "meta.json")


def _skip_ws(buffer: str, pos: int) -> int:
    while pos < len(buffer) and buffer[pos].isspace():
        pos += 1
    return pos


def _read_more(
    handle: Any, buffer: str, pos: int, read_size: int
) -> tuple[str, int, bool]:
    more = handle.read(read_size)
    if not more:
        return buffer, pos, False
    if pos > 0:
        return buffer[pos:] + more, 0, True
    return buffer + more, pos, True


def iter_json_array(path: str, read_size: int = 1_048_576):
    """
    Stream a top-level JSON array from disk without loading the full file.
    """
    decoder = json.JSONDecoder()

    with open(path, "r", encoding="utf-8") as handle:
        buffer = handle.read(read_size)
        if not buffer:
            raise ValueError("Empty file.")

        pos = 0
        pos = _skip_ws(buffer, pos)

        while pos >= len(buffer):
            buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
            if not ok:
                raise ValueError("File contains only whitespace.")
            pos = _skip_ws(buffer, pos)

        if buffer[pos] != "[":
            raise ValueError("Top-level JSON value must be an array.")
        pos += 1

        while True:
            while True:
                pos = _skip_ws(buffer, pos)
                if pos < len(buffer):
                    break
                buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
                if not ok:
                    raise ValueError("Unexpected EOF while reading array.")

            if buffer[pos] == "]":
                pos += 1
                while True:
                    pos = _skip_ws(buffer, pos)
                    if pos < len(buffer):
                        raise ValueError("Trailing content after JSON array.")
                    buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
                    if not ok:
                        return

            while True:
                try:
                    value, end = decoder.raw_decode(buffer, pos)
                    pos = end
                    break
                except json.JSONDecodeError as exc:
                    buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
                    if not ok:
                        raise ValueError(
                            f"Invalid JSON near character {exc.pos}: {exc.msg}"
                        ) from exc

            yield value

            while True:
                pos = _skip_ws(buffer, pos)
                if pos < len(buffer):
                    break
                buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
                if not ok:
                    raise ValueError("Unexpected EOF after array element.")

            if buffer[pos] == ",":
                pos += 1
                if pos > read_size * 4:
                    buffer = buffer[pos:]
                    pos = 0
                continue

            if buffer[pos] == "]":
                pos += 1
                while True:
                    pos = _skip_ws(buffer, pos)
                    if pos < len(buffer):
                        raise ValueError("Trailing content after JSON array.")
                    buffer, pos, ok = _read_more(handle, buffer, pos, read_size)
                    if not ok:
                        return

            raise ValueError(f"Expected ',' or ']' near character {pos}.")


class ChunkSchema(BaseModel):
    """
    Strict schema for one meta.json chunk.
    """

    model_config = ConfigDict(extra="ignore", strict=True)

    path: StrictStr
    para: StrictStr
    domain: StrictStr
    chunk_index: StrictInt
    enneagram_uuid: StrictStr
    text: StrictStr
    file_format: StrictStr

    @field_validator(
        "path",
        "para",
        "domain",
        "enneagram_uuid",
        "text",
        "file_format",
    )
    @classmethod
    def _validate_required_string(cls, value: str) -> str:
        if not value.strip():
            raise PydanticCustomError(
                "required_string_empty",
                "String value cannot be empty.",
            )
        return value

    @field_validator("para")
    @classmethod
    def _validate_para(cls, value: str) -> str:
        if value not in ALLOWED_PARA_VALUES:
            raise PydanticCustomError("para_invalid", "Invalid PARA value.")
        return value

    @field_validator("chunk_index")
    @classmethod
    def _validate_chunk_index(cls, value: int) -> int:
        if value < 0:
            raise PydanticCustomError(
                "chunk_index_negative",
                "chunk_index must be non-negative.",
            )
        return value


def _map_chunk_error(error: dict[str, Any]) -> str:
    loc = error.get("loc", ())
    field_name = str(loc[0]) if loc else "chunk"
    error_type = str(error.get("type", "unknown"))

    if error_type == "missing":
        return f"missing:{field_name}"

    if error_type in {"int_type", "int_parsing"}:
        return f"type:{field_name}:expected_int"

    if error_type in {"string_type", "string_sub_type"}:
        return f"type:{field_name}:expected_str"

    if error_type == "required_string_empty":
        return f"value:{field_name}:empty"

    if error_type == "para_invalid":
        return "value:para:invalid"

    if error_type == "chunk_index_negative":
        return "value:chunk_index:negative"

    return f"validation:{field_name}:{error_type}"


def _validate_chunk(chunk: Any) -> list[str]:
    if not isinstance(chunk, dict):
        return [f"type:chunk:expected_object:{type(chunk).__name__}"]

    try:
        ChunkSchema.model_validate(chunk)
    except ValidationError as exc:
        return [_map_chunk_error(error) for error in exc.errors()]

    return []


def validate_meta_schema(meta_path: str, max_examples: int = 5) -> dict[str, Any]:
    report: dict[str, Any] = {
        "meta_path": meta_path,
        "success": False,
        "total_chunks": 0,
        "invalid_chunks": 0,
        "issue_count": 0,
        "error_counts": {},
        "examples": [],
        "allowed_para_values": sorted(ALLOWED_PARA_VALUES),
        "required_fields": REQUIRED_FIELDS,
        "parse_error": None,
    }

    if not os.path.exists(meta_path):
        report["parse_error"] = f"File not found: {meta_path}"
        return report

    error_counts: Counter[str] = Counter()
    examples: list[dict[str, Any]] = []
    total_chunks = 0
    invalid_chunks = 0

    try:
        for chunk_number, chunk in enumerate(iter_json_array(meta_path), start=1):
            total_chunks += 1
            issues = _validate_chunk(chunk)
            if not issues:
                continue

            invalid_chunks += 1
            error_counts.update(issues)

            if len(examples) < max_examples:
                sample_path = ""
                if isinstance(chunk, dict):
                    raw_path = chunk.get("path")
                    if isinstance(raw_path, str):
                        sample_path = raw_path

                examples.append(
                    {
                        "chunk_number": chunk_number,
                        "path": sample_path,
                        "issues": issues,
                    }
                )
    except Exception as exc:  # noqa: BLE001
        report["parse_error"] = str(exc)

    sorted_errors = dict(sorted(error_counts.items(), key=lambda kv: (-kv[1], kv[0])))

    report["total_chunks"] = total_chunks
    report["invalid_chunks"] = invalid_chunks
    report["issue_count"] = int(sum(error_counts.values()))
    report["error_counts"] = sorted_errors
    report["examples"] = examples

    report["success"] = report["parse_error"] is None and invalid_chunks == 0
    return report


def print_human_report(report: dict[str, Any]) -> None:
    if report["success"]:
        print(f"OK: schema valid for {report['total_chunks']:,} chunks.")
        return

    if report.get("parse_error"):
        print(f"FAIL: unable to complete validation ({report['parse_error']})")
        if report["total_chunks"] > 0:
            print(f"Validated before failure: {report['total_chunks']:,} chunks.")
        return

    print(
        f"FAIL: schema violations in {report['invalid_chunks']:,}/"
        f"{report['total_chunks']:,} chunks ({report['issue_count']:,} issues)."
    )

    if report["error_counts"]:
        print("Top issues:")
        for issue, count in list(report["error_counts"].items())[:8]:
            print(f"  - {issue}: {count:,}")

    if report["examples"]:
        print("Examples:")
        for example in report["examples"]:
            issue_preview = ", ".join(example["issues"][:3])
            if len(example["issues"]) > 3:
                issue_preview += ", ..."
            location = f"chunk {example['chunk_number']}"
            if example.get("path"):
                location += f" ({example['path']})"
            print(f"  - {location}: {issue_preview}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate schema for _System/memory/meta.json"
    )
    parser.add_argument(
        "--meta-path",
        default=DEFAULT_META_PATH,
        help="Path to meta.json file",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Emit machine-readable JSON report",
    )
    parser.add_argument(
        "--max-examples",
        type=int,
        default=5,
        help="Maximum invalid chunk examples to include in report",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    report = validate_meta_schema(args.meta_path, max_examples=max(0, args.max_examples))

    if args.json_output:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_human_report(report)

    sys.exit(0 if report["success"] else 1)


if __name__ == "__main__":
    main()
