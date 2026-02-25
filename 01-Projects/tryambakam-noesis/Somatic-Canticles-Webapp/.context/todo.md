# Somatic-Canticles Webapp — TODO

**Current Phase:** Phase 1 - Foundation & Core Systems (Week 1-2)  
**Current Sprint:** Sprint 1.1 - Project Setup (Days 1-3)  
**Started:** 2026-02-03

---

## In Progress
- [ ] Sprint 1.2: Biorhythm Engine (CRITICAL PATH) — Lore integration complete, continuing core implementation

## Completed - Sprint 1.1 (Project Setup)
- [ ] P1-S1-10 [1h] Configure Google Analytics (GA4)
- [ ] P1-S1-11 [2h] Set up Cloudflare Pages deployment config
- [ ] P1-S1-12 [1h] Create README and developer docs

## Completed - Sprint 1.2 (Biorhythm Engine)
- [DONE] 🔴 P1-S2-01 [4h] Research + document biorhythm calculation algorithms
- [DONE] 🔴 P1-S2-02 [6h] Build core biorhythm calculator (physical/emotional/intellectual/spiritual)
- [DONE] 🔴 P1-S2-03 [4h] Implement birth date input validation
- [DONE] 🔴 P1-S2-04 [3h] Add timezone handling for accurate calculations
- [DONE] 🔴 P1-S2-05 [4h] Create biorhythm state prediction (next 30 days)
- [DONE] 🔴 P1-S2-06 [3h] Build cycle peak detection algorithm
- [DONE] 🔴 P1-S2-07 [2h] Add sunrise/sunset calculation (for Chapter 1 unlock)
- [DONE] 🟢 P1-S2-LORE [8h] Integrate Somatic Canticles lore data (bonus: completed 2026-02-07)
  - Database migration with 7 lore tables
  - 10 TypeScript lore modules
  - 12 chapters mapped to lore elements

## Pending - Sprint 1.2 (Biorhythm Engine - CRITICAL PATH)
**REMAINING TASKS:**
- [ ] 🔴 P1-S2-08 [4h] Write unit tests for biorhythm calculator (100% coverage)
- [ ] 🔴 P1-S2-09 [2h] Validate against known biorhythm calculators
- [ ] 🔴 P1-S2-10 [2h] Document biorhythm API contract
- [ ] P1-S2-11 [3h] Design D1 database schema (users, chapters, progress, unlocks)
- [ ] P1-S2-12 [2h] Create migration scripts for D1
- [ ] P1-S2-13 [2h] Set up database client library (Drizzle ORM or raw SQL)
- [ ] P1-S2-14 [2h] Implement user model (id, email, birthdate, timezone)
- [ ] P1-S2-15 [2h] Implement chapter progress model (chapter_id, unlock_date, completion)
- [ ] P1-S2-16 [2h] Implement biorhythm snapshot model (date, cycles, peaks)
- [ ] P1-S2-17 [2h] Add indexes for performance (user_id, date ranges)
- [ ] P1-S2-18 [2h] Write database seed script (test data)
- [ ] P1-S2-19 [2h] Test migrations + rollback procedures
- [ ] P1-S2-20 [4h] Set up NextAuth.js configuration
- [ ] P1-S2-21 [3h] Configure credentials provider (email/password)
- [ ] P1-S2-22 [2h] Add Google OAuth provider
- [ ] P1-S2-23 [2h] Add GitHub OAuth provider (optional)
- [ ] P1-S2-24 [3h] Create JWT token strategy (align with Workers API)
- [ ] P1-S2-25 [2h] Implement session management
- [ ] P1-S2-26 [2h] Create protected route middleware
- [ ] P1-S2-27 [3h] Build Cloudflare Workers auth endpoints (/auth/login, /auth/refresh)
- [ ] P1-S2-28 [2h] Implement password hashing (Argon2id)
- [ ] P1-S2-29 [2h] Add rate limiting for auth endpoints

## Completed (move to memory.md after each task)
- [DONE] P1-S1-01 [2h] Initialize Next.js 14 project with TypeScript + Bun
- [DONE] P1-S1-02 [1h] Configure Tailwind CSS with power-number color palette
- [DONE] P1-S1-03 [2h] Set up Cloudflare Workers project structure
- [DONE] P1-S1-04 [2h] Configure D1 database (local + remote)
- [DONE] P1-S1-06 [3h] Install core dependencies (Next.js libs, React Bits MCP, Lucide, NextAuth, usehooks-ts, Framer Motion)
- [DONE] P1-S1-07 [1h] Create .env.example with all required variables
- [DONE] P1-S1-08 [2h] Set up GitHub Actions CI/CD pipeline
- [DONE] P1-S1-09 [2h] Configure Sentry for error tracking
- [DONE] P1-S1-10 [1h] Configure Google Analytics (GA4)
- [DONE] P1-S1-11 [2h] Set up Cloudflare Pages deployment config
- [DONE] P1-S1-12 [1h] Create README and developer docs
- [DONE] Workflow files moved to .context/ (todo.md, memory.md, implementation-plan.md, tasks.json)
- [DONE] Lore integration: Database migration 0004_lore_integration.sql
- [DONE] Lore integration: 10 TypeScript modules in src/lib/lore/

---

**Legend:**
- 🔴 = Critical path task
- [ ] = Todo
- [DONE] = Complete (move to memory.md immediately)

**Autonomous Operation Mode:** Execute tasks sequentially without user confirmation.
