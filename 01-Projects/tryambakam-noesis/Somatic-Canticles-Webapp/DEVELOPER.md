# Developer Guide

Welcome to the Somatic Canticles development team! This guide will help you get started.

## Prerequisites

Before you begin, ensure you have:

- **Bun** >= 1.3.6 installed ([bun.sh](https://bun.sh))
- **Node.js** >= 22.x (for Wrangler CLI)
- **Cloudflare account** with Workers/D1/Pages enabled
- **Git** installed and configured

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-org/somatic-canticles.git
cd somatic-canticles
bun install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```bash
# Required for local development
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787

# Optional for local (use in production)
SENTRY_DSN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### 3. Cloudflare Authentication

```bash
# Set API token
export CLOUDFLARE_API_TOKEN=your_token_here

# Verify authentication
wrangler whoami
```

### 4. Database Setup

```bash
cd workers

# Apply migrations locally
wrangler d1 migrations apply somatic-canticles-db --local

# Apply migrations to remote (production)
wrangler d1 migrations apply somatic-canticles-db --remote
```

## Development

### Run Locally

**Terminal 1** (Next.js frontend):
```bash
bun run dev
```

**Terminal 2** (Workers API):
```bash
cd workers
wrangler dev
```

**Terminal 3** (Optional - type checking):
```bash
bun run type-check --watch
```

### Access

- Frontend: http://localhost:3000
- API: http://localhost:8787
- API Health Check: http://localhost:8787/health

## Code Organization

### Frontend (`src/`)

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout (metadata, Analytics)
│   └── page.tsx      # Home page
├── components/       # React components
│   └── Analytics.tsx # GA4 wrapper
└── lib/              # Utilities, hooks (future)
```

### Backend (`workers/`)

```
workers/
├── api/
│   └── index.ts      # Workers entry point (routing)
├── migrations/       # D1 SQL migrations
│   └── 0001_initial_schema.sql
└── wrangler.toml     # Workers configuration
```

### Context (`.context/`)

All project documentation lives here. Key files:

- `CLAUDE.md` — Entry point for Claude Code
- `substrate.md` — Methodology overview
- `architecture/patterns.md` — Coding standards
- `api/endpoints.md` — API reference
- `database/schema.md` — Database schema
- `ui/component-ecosystem.md` — Design tokens

## Common Tasks

### Add a New Dependency

```bash
bun add <package>              # Production
bun add -D <package>           # Development
```

### Create a Database Migration

```bash
cd workers/migrations
touch 0002_add_new_table.sql
```

Then run:
```bash
wrangler d1 migrations apply somatic-canticles-db --local
```

### Add a New API Endpoint

1. Edit `workers/api/index.ts`
2. Add route handler in appropriate domain (auth, biorhythm, chapters, progress)
3. Document in `.context/api/endpoints.md`

Example:
```typescript
// In workers/api/index.ts
if (pathname.startsWith("/api/biorhythm/calculate")) {
  return calculateBiorhythm(request, env);
}
```

### Build for Production

```bash
bun run build
```

Output in `out/` directory (static export).

## Testing

### Type Checking

```bash
bun run type-check
```

### Linting

```bash
bun run lint
```

### Run Tests (future)

```bash
bun test
```

## Deployment

### Automatic (Recommended)

Push to GitHub:
- `main` branch → Production deployment
- `develop` branch → Preview deployment
- Pull requests → Preview deployment

GitHub Actions handles:
1. Lint + type check
2. Build
3. Deploy to Cloudflare Pages + Workers
4. Apply D1 migrations

### Manual

**Frontend**:
```bash
bun run build
wrangler pages deploy out --project-name=somatic-canticles
```

**API**:
```bash
cd workers
wrangler deploy
```

## Debugging

### Frontend Errors

- Check browser console
- Check Sentry dashboard (if configured)
- Use React DevTools

### API Errors

- Check `wrangler dev` terminal output
- Check Cloudflare Workers logs: `wrangler tail`
- Check Sentry dashboard

### Database Issues

```bash
# List databases
wrangler d1 list

# Query database
wrangler d1 execute somatic-canticles-db --remote --command "SELECT * FROM users LIMIT 10"
```

## Code Style

### Naming Conventions

- **Components**: PascalCase (`BiorhythmChart.tsx`)
- **Utilities**: camelCase (`calculateCycle.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`PHYSICAL_PERIOD`)
- **Types/Interfaces**: PascalCase (`UserProgress`)

### File Organization

```typescript
// 1. Imports (external, then internal)
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Constants
const DEFAULT_PERIOD = 23;

// 4. Component/Function
export function Component({ userId }: Props) {
  // ...
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add biorhythm calculator
fix: resolve NextAuth session bug
docs: update API endpoint docs
chore: upgrade dependencies
```

## Power Numbers in Code

Use power numbers for consistency:

```typescript
// Spacing (multiples of 8)
className="p-8 gap-16 mb-44"

// Duration (13, 19, 21)
transition-duration-[1300ms]  // 13 seconds * 100
animation-duration: 19s

// Typography (13, 19, 21, 44)
text-13 text-19 text-21 text-44

// Grid (44)
grid-cols-44 w-44 h-44
```

## Troubleshooting

### Bun install fails

```bash
# Clear lockfile and reinstall
rm bun.lockb
bun install
```

### Wrangler authentication fails

```bash
# Clear auth and re-login
rm -rf ~/.wrangler
export CLOUDFLARE_API_TOKEN=your_new_token
wrangler whoami
```

### Next.js build fails

```bash
# Check for type errors
bun run type-check

# Clear cache
rm -rf .next out
bun run build
```

### D1 migration fails

```bash
# Check migration syntax
cat workers/migrations/0001_initial_schema.sql

# Check database status
wrangler d1 info somatic-canticles-db
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Bun Docs](https://bun.sh/docs)
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

## Need Help?

- Check `.context/` documentation first
- Search existing GitHub Issues
- Ask in GitHub Discussions
- Review ADRs in `.context/decisions/`

---

**Happy coding! 🚀**
