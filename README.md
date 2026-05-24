# Arrow POC Backend

NestJS REST API for the Arrow Maze inspired semester project.

## Current Phase

Phase 2 implements the API core:

- User registration and login.
- JWT authentication.
- `PLAYER` and `ADMIN` roles.
- Graph-based level read/write API.
- 15 deterministic manual graph-based levels seeded into PostgreSQL.
- Progress synchronization.
- Leaderboard with explicit best-score semantics.
- Swagger at `/api/docs`.
- Docker Compose local backend support.

The Flutter application owns gameplay logic. The backend stores and serves users, graph-based level definitions, progress, and leaderboard data; it does not process every move, solve puzzles, or validate gameplay paths.

## Architecture Direction

The backend follows Clean Architecture:

- `domain`: pure entities, value objects, validators, and policies.
- `application`: use cases and repository/service ports.
- `infrastructure`: Prisma, password hashing, JWT signing, and adapters.
- `interfaces`: NestJS controllers, DTOs, guards, filters, and interceptors.

Cross-cutting concerns are registered globally in `src/main.ts`:

- Validation pipe.
- Consistent HTTP exception filter.
- Logging/performance interceptor.
- Swagger setup.

## Local Setup

Create a local `.env` from `.env.example`.

```powershell
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run build
npm run test
npm run test:e2e
docker compose up --build
```

Swagger:

```text
http://localhost:3000/api/docs
```

Health check:

```text
GET http://localhost:3000/health
```

## Docker

The intended local backend command is:

```powershell
docker compose up --build
```

The API container runs Prisma migrations and seed before starting:

```text
npx prisma migrate deploy && npm run prisma:seed && npm run start:prod
```

If automatic startup is fragile on a local machine, use this manual sequence:

```powershell
docker compose up -d postgres
npm run prisma:deploy
npm run prisma:seed
docker compose up --build api
```

## Environment Variables

- `PORT`: API port. Default: `3000`.
- `DATABASE_URL`: PostgreSQL connection string.
- `DATABASE_URL_TEST`: separate database URL for future DB-backed e2e tests.
- `JWT_SECRET`: JWT signing secret.
- `CORS_ORIGIN`: allowed frontend origin.
- `NODE_ENV`: runtime environment.
- `ADMIN_EMAIL`: optional local/demo admin seed email.
- `ADMIN_PASSWORD`: optional local/demo admin seed password.

Admin seeding only runs when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are present.

## API Endpoints

Auth:

- `POST /auth/register`
- `POST /auth/login`

Levels:

- `GET /levels`
- `GET /levels/:id`
- `POST /levels` requires JWT plus `ADMIN`.
- `PUT /levels/:id` requires JWT plus `ADMIN`.

Progress:

- `POST /progress/sync` requires JWT.
- `GET /progress/me` requires JWT.

Leaderboard:

- `GET /leaderboard/:levelId`
- `POST /leaderboard` requires JWT.

Health:

- `GET /health`

## Level Definition Shape

The backend validates only the required graph-based structure:

```json
{
  "nodes": [],
  "edges": [],
  "arrows": [],
  "blockedEdges": [],
  "metadata": {}
}
```

This is structural validation only. Gameplay movement, puzzle solving, arrow collision behavior, and move validation belong to the Flutter game engine.

## Leaderboard Rules

Best-score semantics:

- Higher score is better.
- If score is tied, fewer moves is better.
- If moves are tied, lower `timeSeconds` is better.

This rule lives in a domain/application policy, not in the controller.

## Seed Data

The 15 required manual levels live in:

```text
prisma/levels/manual-levels.ts
```

The seed script upserts them by level number. Levels 1-5 are easy, 6-10 medium, and 11-15 hard. No random level generation is implemented in Phase 2.

## Testing

```powershell
npm run lint
npm run test
npm run test:e2e
npm run build
```

The current e2e suite uses in-memory repositories to avoid destructive setup against the normal development database. Use `DATABASE_URL_TEST` for future DB-backed e2e tests.

## Git Checklist Before First Push

Do not change Git remotes automatically. Before pushing from a new environment, verify remotes:

```powershell
git remote -v
git status --short --branch
```

## Commit Convention

Use Conventional Commits in English, for example:

```text
feat(auth): implement jwt login
feat(levels): add admin level management endpoints
test(api): add backend api core e2e tests
docs(readme): document phase 2 backend api
```
