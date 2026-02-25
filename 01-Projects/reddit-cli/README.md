# reddit-cli

Deterministic Reddit CLI for OpenClaw workflows.
Supports public read-only mode without OAuth.

## Public read-only mode (no OAuth)

Set:

- `REDDIT_PUBLIC_ONLY=1`
- optional `REDDIT_USER_AGENT` (recommended)

Then read commands work without `client_id`/`client_secret`:
- `subreddit posts|hot|new|top`
- `post thread`
- `search`
- `user profile|comments|posts`

Write commands and user mailbox actions remain OAuth-only.

## Auth env vars

Required:
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USER_AGENT`

For authenticated user actions (`whoami`, inbox, posting, commenting, voting, save/unsave, messages):
- `REDDIT_REFRESH_TOKEN`

Optional:
- `REDDIT_USERNAME`
- `REDDIT_PASSWORD`

## Install

```bash
cd /Volumes/madara/2026/twc-vault/01-Projects/reddit-cli
python3 -m venv .venv-codex
source .venv-codex/bin/activate
pip install -e .
```

## Quick checks

```bash
reddit-cli --help
reddit-cli auth check --json
reddit-cli subreddit posts python --limit 3 --json
```
