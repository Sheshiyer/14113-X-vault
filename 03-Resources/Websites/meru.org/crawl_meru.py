#!/usr/bin/env python3
"""Crawl meru.org (and discovered subdomains) and produce a verified URL inventory.

- Respects robots.txt for each (sub)domain.
- Starts from a seed list, does a BFS crawl for HTML pages.
- Extracts: <a href>, <img src>, <script src>, <link href>, <source src/srcset>, <video src>, <audio src>, <iframe src>
- Collects YouTube/Vimeo links.

Usage:
  source /Volumes/madara/2026/twc-vault/.venv-meru/bin/activate
  python crawl_meru.py
"""

from __future__ import annotations

import csv
import re
import sys
import time
import json
from collections import deque, defaultdict
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag
from urllib import robotparser

import requests
from bs4 import BeautifulSoup

OUT_DIR = Path(__file__).resolve().parent

USER_AGENT = "OpenClawMeruCrawler/1.0 (+https://docs.openclaw.ai)"
TIMEOUT = 20
CRAWL_DELAY_S = 0.2
MAX_PAGES_PER_HOST = 400   # safety (tune upward after first pass)
MAX_TOTAL_PAGES = 2000     # safety (tune upward after first pass)

VIDEO_HOSTS = {
    "www.youtube.com",
    "youtube.com",
    "youtu.be",
    "m.youtube.com",
    "vimeo.com",
    "www.vimeo.com",
}

ASSET_EXTS = {
    ".pdf": "pdf",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".webp": "image",
    ".svg": "image",
    ".mp3": "audio",
    ".wav": "audio",
    ".ogg": "audio",
    ".opus": "audio",
    ".mp4": "video",
    ".mov": "video",
    ".webm": "video",
    ".m4v": "video",
    ".zip": "archive",
}

HTML_LIKE = {"text/html", "application/xhtml+xml"}

@dataclass
class UrlRow:
    url: str
    host: str
    path: str
    kind: str
    status: int | None
    content_type: str | None
    discovered_from: str | None


def norm_url(base: str, link: str) -> str | None:
    if not link:
        return None
    link = link.strip()
    if link.startswith("mailto:") or link.startswith("tel:") or link.startswith("javascript:"):
        return None
    absu = urljoin(base, link)
    absu, _frag = urldefrag(absu)
    p = urlparse(absu)
    if p.scheme not in ("http", "https"):
        return None
    # normalize: force https when possible
    if p.scheme == "http":
        absu = absu.replace("http://", "https://", 1)
    return absu


def classify(url: str) -> str:
    p = urlparse(url)
    path = p.path.lower()
    for ext, kind in ASSET_EXTS.items():
        if path.endswith(ext):
            return kind
    if p.netloc.lower() in VIDEO_HOSTS:
        return "video_link"
    return "html_or_other"


def get_robot(host_base: str) -> robotparser.RobotFileParser:
    rp = robotparser.RobotFileParser()
    robots_url = urljoin(host_base, "/robots.txt")
    try:
        r = requests.get(robots_url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True)
        rp.parse(r.text.splitlines())
    except Exception:
        # If robots fails, default allow.
        rp.parse([])
    return rp


def allowed(rp: robotparser.RobotFileParser, url: str) -> bool:
    try:
        return rp.can_fetch(USER_AGENT, url)
    except Exception:
        return True


def head_or_get(url: str) -> tuple[int | None, str | None]:
    # Prefer HEAD, fall back to GET when needed.
    try:
        rh = requests.head(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True)
        status = rh.status_code
        ctype = rh.headers.get("content-type")
        if status in (405, 403) or (ctype is None and status == 200):
            raise RuntimeError("head-insufficient")
        return status, ctype
    except Exception:
        try:
            rg = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True, stream=True)
            status = rg.status_code
            ctype = rg.headers.get("content-type")
            # don't download entire body
            rg.close()
            return status, ctype
        except Exception:
            return None, None


def fetch_html(url: str) -> tuple[int | None, str | None, str | None]:
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True)
        status = r.status_code
        ctype = r.headers.get("content-type")
        if status != 200:
            return status, ctype, None
        if ctype and ctype.split(";")[0].strip().lower() not in HTML_LIKE:
            return status, ctype, None
        r.encoding = r.encoding or "utf-8"
        return status, ctype, r.text
    except Exception:
        return None, None, None


def extract_links(page_url: str, html: str) -> set[str]:
    soup = BeautifulSoup(html, "lxml")
    out: set[str] = set()

    # a/link
    for tag in soup.find_all(["a", "link"]):
        attr = "href" if tag.name in ("a", "link") else "href"
        val = tag.get(attr)
        nu = norm_url(page_url, val) if val else None
        if nu:
            out.add(nu)

    # scripts
    for tag in soup.find_all("script"):
        nu = norm_url(page_url, tag.get("src") or "")
        if nu:
            out.add(nu)

    # images
    for tag in soup.find_all("img"):
        for a in ("src", "data-src"):
            nu = norm_url(page_url, tag.get(a) or "")
            if nu:
                out.add(nu)
        # srcset
        srcset = tag.get("srcset")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                nu = norm_url(page_url, u)
                if nu:
                    out.add(nu)

    # media/source/iframe
    for tag in soup.find_all(["source", "video", "audio", "iframe"]):
        for a in ("src",):
            nu = norm_url(page_url, tag.get(a) or "")
            if nu:
                out.add(nu)
        srcset = tag.get("srcset")
        if srcset:
            for part in srcset.split(","):
                u = part.strip().split(" ")[0]
                nu = norm_url(page_url, u)
                if nu:
                    out.add(nu)

    return out


def same_reg_domain(host: str, reg: str) -> bool:
    host = host.lower()
    return host == reg or host.endswith("." + reg)


def main():
    base_hosts = [
        "https://www.meru.org",
        "https://meru.org",
    ]

    # Seeds (start points). We'll discover additional subdomains via link extraction.
    seeds = [
        "https://www.meru.org/",
    ]

    # Preload robots for known hosts
    robots = {}
    for h in base_hosts:
        robots[urlparse(h).netloc.lower()] = get_robot(h)

    q = deque()
    discovered_from = {}
    enqueued = set()

    def enqueue(u: str, src: str | None):
        if u in enqueued:
            return
        enqueued.add(u)
        discovered_from[u] = src
        q.append(u)

    for s in seeds:
        enqueue(s, None)

    rows: dict[str, UrlRow] = {}
    host_page_counts = defaultdict(int)

    youtube_links: set[str] = set()
    errors: list[dict] = []

    total_pages = 0

    last_print = time.time()
    while q and total_pages < MAX_TOTAL_PAGES:
        url = q.popleft()
        if time.time() - last_print > 2:
            print(f"... crawled pages={total_pages} queued={len(q)} urls_recorded={len(rows)}", flush=True)
            last_print = time.time()
        p = urlparse(url)
        host = p.netloc.lower()

        if not same_reg_domain(host, "meru.org"):
            # record external video links separately
            if host in VIDEO_HOSTS:
                youtube_links.add(url)
            continue

        # ensure robot rules loaded for this host
        if host not in robots:
            robots[host] = get_robot(f"https://{host}")

        if not allowed(robots[host], url):
            rows[url] = UrlRow(url=url, host=host, path=p.path, kind=classify(url), status=None, content_type=None, discovered_from=discovered_from.get(url))
            continue

        kind = classify(url)

        # Crawl HTML pages; for assets, just verify with HEAD/GET.
        if kind == "html_or_other":
            if host_page_counts[host] >= MAX_PAGES_PER_HOST:
                continue
            host_page_counts[host] += 1
            total_pages += 1

            status, ctype, html = fetch_html(url)
            rows[url] = UrlRow(url=url, host=host, path=p.path, kind="html", status=status, content_type=ctype, discovered_from=discovered_from.get(url))

            if status == 200 and html:
                try:
                    links = extract_links(url, html)
                except Exception as e:
                    errors.append({"url": url, "err": str(e)})
                    links = set()

                for link in links:
                    lp = urlparse(link)
                    lhost = lp.netloc.lower()
                    if same_reg_domain(lhost, "meru.org"):
                        enqueue(link, url)
                    else:
                        if lhost in VIDEO_HOSTS:
                            youtube_links.add(link)

            time.sleep(CRAWL_DELAY_S)
        else:
            status, ctype = head_or_get(url)
            rows[url] = UrlRow(url=url, host=host, path=p.path, kind=kind, status=status, content_type=ctype, discovered_from=discovered_from.get(url))

    # Write outputs
    all_rows = list(rows.values())
    all_rows.sort(key=lambda r: (r.host, r.path, r.url))

    csv_path = OUT_DIR / "urls_all_verified.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "host", "path", "kind", "status", "content_type", "discovered_from"])
        for r in all_rows:
            w.writerow([r.url, r.host, r.path, r.kind, r.status if r.status is not None else "", r.content_type or "", r.discovered_from or ""])

    # Grouped markdown
    groups = defaultdict(list)
    for r in all_rows:
        # top-level section by first path segment
        seg = r.path.strip("/").split("/")[0] if r.path else ""
        sec = "/" + seg if seg else "/"
        groups[(r.host, sec)].append(r)

    md_path = OUT_DIR / "urls_by_section.md"
    with md_path.open("w", encoding="utf-8") as f:
        f.write("# meru.org — URLs by section (verified where possible)\n\n")
        for (host, sec) in sorted(groups.keys()):
            f.write(f"## {host} · {sec}\n\n")
            for r in groups[(host, sec)]:
                st = r.status if r.status is not None else ""
                f.write(f"- [{st}] ({r.kind}) {r.url}\n")
            f.write("\n")

    yt_path = OUT_DIR / "urls_youtube.txt"
    with yt_path.open("w", encoding="utf-8") as f:
        for u in sorted(youtube_links):
            f.write(u + "\n")

    # Report
    report = {
        "started": seeds,
        "max_pages_per_host": MAX_PAGES_PER_HOST,
        "max_total_pages": MAX_TOTAL_PAGES,
        "crawl_delay_s": CRAWL_DELAY_S,
        "robots_disallow_from_root": "https://www.meru.org/robots.txt",
        "robots_text": requests.get("https://www.meru.org/robots.txt", headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT).text,
        "counts": {
            "total_urls": len(all_rows),
            "hosts": sorted(set(r.host for r in all_rows)),
            "youtube_links": len(youtube_links),
        },
        "errors_sample": errors[:50],
    }

    (OUT_DIR / "crawl_report.md").write_text(
        "# meru.org — Crawl Report\n\n"
        + "## Summary\n\n"
        + f"- Seeds: {', '.join(seeds)}\n"
        + f"- Total URLs recorded: {report['counts']['total_urls']}\n"
        + f"- Hosts discovered: {', '.join(report['counts']['hosts'])}\n"
        + f"- YouTube/Vimeo links: {report['counts']['youtube_links']}\n\n"
        + "## robots.txt (www.meru.org)\n\n"
        + "```\n" + report["robots_text"].strip() + "\n```\n\n"
        + "## Notes\n\n"
        + "- URLs are verified via HEAD (fallback GET).\n"
        + "- HTML pages are crawled and parsed; assets are included when discovered via HTML.\n"
        + "- Disallowed URLs are recorded but not fetched.\n"
        + ("\n## Crawl errors (sample)\n\n```json\n" + json.dumps(report["errors_sample"], indent=2) + "\n```\n" if errors else ""),
        encoding="utf-8",
    )

    print(f"Wrote: {csv_path}")
    print(f"Wrote: {md_path}")
    print(f"Wrote: {yt_path}")
    print(f"Wrote: {OUT_DIR / 'crawl_report.md'}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
