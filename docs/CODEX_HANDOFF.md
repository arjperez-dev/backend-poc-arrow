# Codex Handoff

## 1. Project Overview

This repository is the NestJS backend for a semester project inspired by "Arrow Maze — Escape Puzzle". It provides REST APIs for users, authentication, graph-based level definitions, progress synchronization, leaderboard, persistence, validation, Swagger documentation, and Dockerized local execution.

The project has two independent repositories:

- `backend-poc-arrow`: NestJS REST API.
- `frontend-poc-arrow`: future Flutter mobile game app.

## 2. Current Repository And Branch

- Repository: `backend-poc-arrow`
- Current branch during Phase 2 work: `feat/backend-api-core`
- Swagger path: `/api/docs`
- Git remotes must not be modified automatically.

## 3. Completed Phases

- Phase 1 backend bootstrap: NestJS app, TypeScript, lint/test/build scripts, Dockerfile, Docker Compose, Prisma foundation, `.env.example`, health endpoint, global validation pipe, HTTP exception filter, logging/performance interceptor, README stub, and AI usage stub.
- Phase 2 backend API core: auth, users, levels, progress, leaderboard, JWT guard, ADMIN role guard, Prisma migration, deterministic level seed, docs, and tests.

## 4. Current Tech Stack

- NestJS 11
- TypeScript
- Prisma 6
- PostgreSQL
- Docker / Docker Compose
- JWT auth via `@nestjs/jwt`
- Password hashing via `bcryptjs`
- Swagger / OpenAPI via `@nestjs/swagger`
- Jest and Supertest

## 5. Clean Architecture Structure

Current backend structure:

```text
src/
  domain/
  application/
  infrastructure/
  interfaces/
  modules/
  main.ts
  app.module.ts
```

- `domain`: pure entities, policies, and validators.
- `application`: use cases and ports.
- `infrastructure`: Prisma repositories, Prisma service, hashing, JWT adapter.
- `interfaces`: controllers, DTOs, guards, filters, interceptors.
- `modules`: NestJS composition modules.

## 6. Backend Responsibilities

- Users.
- Authentication and JWT.
- Role-based authorization.
- Remote graph-based level definitions.
- Progress synchronization.
- Leaderboard persistence.
- Swagger documentation.
- Consistent HTTP errors.
- Dockerized local backend.

## 7. Frontend Responsibilities

- Flutter mobile app.
- Playable game engine.
- Board graph runtime.
- Arrow movement, collision, exit detection, victory/defeat.
- Score calculation in the local game session.
- UI, animation, audio, i18n, local progress, and backend integration.

## 8. Critical Gameplay Constraints

- Flutter owns gameplay logic.
- The backend must not process every player move.
- The backend must not implement puzzle solving, arrow movement validation, or collision rules.
- Levels are graph-based JSON, not matrix-only.
- A matrix may only be used later as an authoring/helper format, not as the runtime game model.

## 9. Prisma Models And Migration

Current Prisma models:

- `User`
- `Level`
- `PlayerProgress`
- `LeaderboardEntry`

Current enums:

- `Difficulty`
- `GenerationType`
- `UserRole`

Migration created:

```text
prisma/migrations/20260524000100_api_core/migration.sql
```

## 10. Seed Strategy

- Manual level source: `prisma/levels/manual-levels.ts`
- Seed script: `prisma/seed.ts`
- Seeds 15 deterministic, hand-authored, graph-based manual levels.
- Levels are upserted by `Level.number`.
- No random level generation exists in Phase 2.
- Optional admin seed uses:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
- Admin user is only created/updated when both variables are set.

## 11. Implemented Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /levels`
- `GET /levels/:id`
- `POST /levels`
- `PUT /levels/:id`
- `POST /progress/sync`
- `GET /progress/me`
- `GET /leaderboard/:levelId`
- `POST /leaderboard`
- `GET /health`

## 12. Authentication And Roles

- JWT bearer authentication is used.
- JWT payload includes `sub`, `email`, and `role`.
- Users default to `PLAYER`.
- `ADMIN` role is required for:
  - `POST /levels`
  - `PUT /levels/:id`
- Optional local/demo admin can be seeded with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## 13. Level JSON Validation

The backend performs structural validation only. Required top-level keys:

- `nodes`
- `edges`
- `arrows`
- `blockedEdges`
- `metadata`

The backend does not validate gameplay movement, solve levels, or determine whether a puzzle is playable.

## 14. Leaderboard Best-Score Policy

Best-score policy:

- Higher score is better.
- If score is tied, fewer moves is better.
- If moves are tied, lower `timeSeconds` is better.

Policy location:

```text
src/domain/leaderboard/leaderboard-score.policy.ts
```

## 15. Docker Commands

Primary local command:

```powershell
docker compose up --build
```

Manual fallback:

```powershell
docker compose up -d postgres
npm run prisma:deploy
npm run prisma:seed
docker compose up --build api
```

Stop containers:

```powershell
docker compose down
```

## 16. Test Commands

```powershell
npm run lint
npm run test
npm run test:e2e
npm run build
```

Useful Prisma commands:

```powershell
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

## 17. Verified Commands And Results

Verified during Phase 2:

- `npm.cmd install`: passed, 0 vulnerabilities.
- `npx.cmd prisma generate`: passed.
- `npx.cmd prisma validate`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run test`: passed, 4 suites / 9 tests.
- `npm.cmd run test:e2e`: passed, 2 suites / 8 tests.
- `npm.cmd run build`: passed.
- `docker compose config`: passed.
- `docker compose up --build -d`: passed.
- `GET http://localhost:3000/health`: returned `ok`.
- `GET http://localhost:3000/api/docs`: returned HTTP 200.
- `GET http://localhost:3000/levels`: returned 15 seeded levels.

Docker containers were stopped after verification with `docker compose down`.

## 18. Known Issues Or Manual Steps

- Prisma 6 warns that `package.json#prisma` seed config is deprecated for Prisma 7. This is non-blocking for the current Prisma 6 setup.
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before running seed if admin-only endpoints need to be tested through Swagger.
- `DATABASE_URL_TEST` is documented for future DB-backed e2e tests; current API e2e tests use in-memory repositories to avoid destructive operations against the development database.

## 19. Next Recommended Phase

Recommended next phase: frontend bootstrap and graph-based game engine foundation.

Suggested focus:

- Initialize Flutter app in `frontend-poc-arrow`.
- Establish Clean Architecture folders.
- Define graph-based domain model.
- Implement local manual level assets mirroring backend JSON shape.
- Add unit tests for graph persistence, arrow exit behavior, and score logic.

Do not make the backend responsible for gameplay moves in future phases.

## 20. Files Future Codex Sessions Should Inspect First

- `README.md`
- `AI_USAGE.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/levels/manual-levels.ts`
- `src/app.module.ts`
- `src/main.ts`
- `src/domain/levels/graph-level-definition.ts`
- `src/domain/leaderboard/leaderboard-score.policy.ts`
- `src/interfaces/http/auth/jwt-auth.guard.ts`
- `src/interfaces/http/auth/roles.guard.ts`
- `src/interfaces/http/levels/levels.controller.ts`
- `test/api-core.e2e-spec.ts`
