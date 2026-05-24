# AI Usage

This file documents AI-assisted work for the backend repository.

## Entry Template

- Date:
- AI tool/model:
- Role of the tool:
- Task or problem addressed:
- Prompt or faithful paraphrase:
- Result obtained:
- Modifications made by the team:
- Lessons learned:
- Limitations found:
- Approximate percentage of AI-assisted code:
- Critical reflection:

## Initial Bootstrap Entry

- Date: 2026-05-23
- AI tool/model: Codex coding agent
- Role of the tool: Planning and initial backend bootstrap support.
- Task or problem addressed: Create the Phase 1 NestJS backend foundation with Docker, Prisma schema, health endpoint, Swagger, validation, error handling, and AOP shells.
- Prompt or faithful paraphrase: Implement only Phase 1 backend bootstrap; do not modify frontend except for its `AI_USAGE.md`; keep Swagger at `/api/docs`; do not change Git remotes.
- Result obtained: Pending team review after bootstrap verification.
- Modifications made by the team: Pending.
- Lessons learned: Pending.
- Limitations found: Pending.
- Approximate percentage of AI-assisted code: Pending.
- Critical reflection: Pending.

## Phase 2 API Core Entry

- Date: 2026-05-23
- AI tool/model: Codex coding agent
- Role of the tool: Backend API implementation support.
- Task or problem addressed: Implement Phase 2 API core for auth, users, graph-based levels, progress sync, leaderboard, admin guards, Prisma seed, tests, and documentation.
- Prompt or faithful paraphrase: Work only inside `backend-poc-arrow`; keep Swagger at `/api/docs`; implement JWT auth, admin-only level writes, structural graph JSON validation, 15 deterministic manual levels in `prisma/levels/manual-levels.ts`, progress, leaderboard, tests, docs, and Docker support; do not touch frontend or Git remotes.
- Result obtained: Pending team review after Phase 2 verification.
- Modifications made by the team: Pending.
- Lessons learned: Pending.
- Limitations found: Pending.
- Approximate percentage of AI-assisted code: Pending.
- Critical reflection: Pending.

## Phase 2 Handoff Documentation Entry

- Date: 2026-05-23
- AI tool/model: Codex coding agent
- Role of the tool: Documentation and continuity support.
- Task or problem addressed: Create a concise handoff file so a future Codex session can continue safely if conversation context is lost.
- Prompt or faithful paraphrase: Add `docs/CODEX_HANDOFF.md` summarizing project state, completed phases, constraints, Prisma migration, seed strategy, endpoints, auth roles, validation, leaderboard policy, commands, known issues, and next recommended phase.
- Result obtained: Generated `docs/CODEX_HANDOFF.md` as Phase 2 documentation.
- Modifications made by the team: Pending.
- Lessons learned: Handoff docs should explicitly preserve responsibility boundaries, especially that Flutter owns gameplay logic.
- Limitations found: The handoff is a snapshot and should be updated after major future phases.
- Approximate percentage of AI-assisted code: Documentation entry only.
- Critical reflection: This file supports continuity but does not replace README or AI usage documentation.
