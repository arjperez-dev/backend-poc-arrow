# Nodus Backend

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue)

REST API for the **Nodus** puzzle game client. Server-side context only — see [`frontend-poc-arrow`](https://github.com/arjperez-dev/frontend-poc-arrow) for the Flutter app.

---

## Description

Nodus Backend provides the HTTP services that support the Nodus mobile game: user registration and authentication, a catalog of graph-based levels, player progress persistence and synchronisation, and per-level leaderboards. The backend stores and serves data; **it does not run gameplay logic** — that responsibility belongs entirely to the Flutter client.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js · TypeScript |
| Framework | NestJS 11 (`@nestjs/*`, `@nestjs/jwt`) — Express under the hood |
| ORM / DB | Prisma 6 · PostgreSQL 17 |
| Auth | JWT bearer tokens · bcryptjs password hashing |
| Docs | Swagger / OpenAPI (`@nestjs/swagger`) at `/api/docs` |
| Testing | Jest · Supertest |
| DevOps | Docker · Docker Compose |

---

## Architecture — Clean Architecture

The project follows a **layered / ports-and-adapters (hexagonal)** architecture: domain rules are framework-free, the application layer defines ports (interfaces) that infrastructure adapters implement, and interfaces (HTTP controllers) are the only entry point.

```text
src/
  domain/            entities, value objects, pure rules (no framework imports)
  application/
    ports/            abstract interfaces implemented by infrastructure
    <feature>/        use cases (orchestrate domain + ports)
  infrastructure/
    database/         Prisma client / module
    repositories/     port implementations (Prisma adapters)
    security/         hashing (bcrypt), JWT signing
  interfaces/
    http/
      <feature>/
        <feature>.controller.ts
        dto/
      filters/        global exception filter
      interceptors/   logging & performance interceptor
      health/
  modules/            NestJS module wiring
prisma/
  schema.prisma
  migrations/
  levels/             manual-levels.ts (seed data)
  seed.ts
test/
```

---

### Class Diagram
![Class Diagram](./docs/backend_class_diagram.svg)

### Clean Architecture Layers Diagram
![Clean Architecture](./docs/backend_clean_architecture.svg)

**[View diagrams in Lucidchart](https://lucid.app/lucidchart/5c09fbb7-74be-4dc2-89c5-af638b2b2b71/edit?invitationId=inv_7c5f886f-d720-4be1-86f9-55d565e84361&page=p1#)**

---

## SOLID Principles

The codebase is designed around the five SOLID principles. Below are concrete examples from the source code:

### S — Single Responsibility Principle

Each class has one reason to change.

- [`RegisterUserUseCase`](src/application/auth/register-user.use-case.ts) orchestrates only the registration flow (validate uniqueness → hash → persist → sign token). It does not handle HTTP parsing (that is the controller's job) nor database queries (that is the repository's job).
- [`LeaderboardScorePolicy`](src/domain/leaderboard/leaderboard-score.policy.ts) encapsulates only the comparison rule for determining if a candidate score is better than the current best. No persistence, no HTTP concerns.
- [`HttpExceptionFilter`](src/interfaces/http/filters/http-exception.filter.ts) has the sole responsibility of catching any exception thrown in the application and normalising it into a consistent JSON error response.

### O — Open/Closed Principle

Classes are open for extension but closed for modification.

- [`RolesGuard`](src/interfaces/http/auth/roles.guard.ts) never names a route. It reads the roles a handler declared through NestJS's `Reflector`, so protecting a new endpoint means adding `@Roles(UserRole.ADMIN)` to it — the guard's own source is never edited. Behaviour extends to N endpoints while the enforcing class stays closed.
- Adding a new feature (e.g. achievements) means adding new ports, use cases, and a NestJS module without modifying existing ones.
- The scoring comparison logic lives in a standalone policy class (`LeaderboardScorePolicy`). Changing the ranking criteria (e.g. adding a `combo` tiebreaker) touches only that class — the use case, controller, and repository remain untouched. Note this is isolation rather than textbook OCP: [`SubmitLeaderboardScoreUseCase`](src/application/leaderboard/submit-leaderboard-score.use-case.ts) constructs the policy with `new`, so *substituting* a different policy at runtime would require editing the use case.

### L — Liskov Substitution Principle

Any implementation of a port can replace any other without breaking use cases.

- [`PrismaUserRepository`](src/infrastructure/repositories/prisma-user.repository.ts) implements the [`UserRepository`](src/application/ports/user.repository.ts) interface. In end-to-end tests, an in-memory repository is substituted seamlessly — the use cases never know the difference.

### I — Interface Segregation Principle

Ports are small and focused — no client is forced to implement methods it does not need.

- Four separate repository interfaces exist: `UserRepository`, `LevelRepository`, `ProgressRepository`, `LeaderboardRepository` — each with only the methods its consumers require.
- Two security ports exist: `PasswordHasher` (`hash` / `compare`) and `TokenService` (`sign`), rather than a single "SecurityService" interface.
- `TokenService` deliberately exposes `sign` only, because signing is the sole token operation any use case performs ([`LoginUserUseCase`](src/application/auth/login-user.use-case.ts) must mint a token without knowing the algorithm). Verification is a transport concern that runs in [`JwtAuthGuard`](src/interfaces/http/auth/jwt-auth.guard.ts) before any use case is reached, so the guard injects `JwtService` directly rather than widening the port with a method no use case would call. The trade-off is that `@nestjs/jwt` is imported in two places (the guard and [`JwtTokenService`](src/infrastructure/security/jwt-token.service.ts)) instead of one.

### D — Dependency Inversion Principle

High-level modules depend on abstractions, not on low-level modules.

- [`RegisterUserUseCase`](src/application/auth/register-user.use-case.ts) injects `UserRepository`, `PasswordHasher`, and `TokenService` via NestJS `@Inject()` tokens — it never imports Prisma, bcrypt, or `@nestjs/jwt` directly.
- The NestJS IoC container binds concrete implementations (e.g. `PrismaUserRepository`) to abstract tokens at module-wiring time in the `modules/` layer, keeping the application layer completely decoupled from infrastructure.

---

## Design Patterns (GoF)

Patterns are a response to forces, not a checklist. The forces in this codebase were swappable persistence and cross-cutting concerns; no Abstract Factory or Observer appears because there is no second product family and no event fan-out to justify one.

| Pattern | Category | Where | Purpose |
|---|---|---|---|
| **Repository** + **Adapter** | Structural | `application/ports/*.repository.ts` → `infrastructure/repositories/prisma-*.repository.ts` | Repository is Fowler (PoEAA) rather than GoF, but the Prisma classes are textbook Adapter: each translates Prisma row types into domain entities via a private `mapUser`/`mapLevel`/`mapEntry`, so no Prisma type escapes infrastructure. Calling Prisma straight from a use case would nail every use case to Postgres and make the in-memory e2e suite impossible. |
| **Singleton** | Creational | `PrismaService` (NestJS default scope) | One `PrismaService` per application, so all four repositories share a single connection pool — Postgres connections are finite. Container-scoped, *not* the GoF private-constructor form, which is why it stays testable and can `$disconnect()` via `OnModuleDestroy`. |
| **Factory Method** | Creational | [`auth.module.ts`](src/modules/auth.module.ts) — `JwtModule.registerAsync({ useFactory })` | The JWT secret is unknown at compile time and arrives from `ConfigService` at boot. A factory defers construction until config resolves; `new JwtService()` cannot express "build once the environment has loaded". The `useClass` token bindings in every module are the same family. |
| **Builder** | Creational | [`main.ts`](src/main.ts) — `new DocumentBuilder().setTitle()…build()` | Fluent step-by-step construction of the OpenAPI config, terminated by `build()`. A telescoping constructor with five optional arguments would be unreadable. |
| **Decorator** | Structural | [`roles.decorator.ts`](src/interfaces/http/auth/roles.decorator.ts), `@ApiProperty`/`@IsEmail` on DTOs | Annotation-style, not GoF's wrapper-object Decorator: `Roles()` attaches metadata via `SetMetadata`, adding responsibility to a handler without subclassing. The wrapper-object variant does occur at runtime — the interceptor wraps the handler's return stream. |
| **Chain of Responsibility** | Behavioural | `ValidationPipe` → `JwtAuthGuard` → `RolesGuard` → interceptor → controller → filter | Each link handles its concern and either passes control on or terminates the request — a failing `JwtAuthGuard` stops the chain before `RolesGuard` runs. Adding a rate limiter means inserting a link, not editing existing ones. |
| **Policy object** *(partial Strategy)* | Behavioural | [`LeaderboardScorePolicy`](src/domain/leaderboard/leaderboard-score.policy.ts) | Encapsulates the best-score comparison (score → moves → time) in its own framework-free class. Only half of Strategy: there is no `ScorePolicy` interface and the use case does `new LeaderboardScorePolicy()`, so the algorithm cannot be substituted at runtime. |
| **Command object** *(partial)* | Behavioural | `RegisterUserCommand`, `LoginUserCommand`, `SubmitLeaderboardScoreData` | Package a request's parameters into one object — the data half of Command, in the CQRS sense. Not full GoF Command: these are plain types with no `execute()`, no invoker, and no undo; the `execute()` lives on the use case. |

---

## AOP — Aspect-Oriented Programming

Cross-cutting concerns are separated from business logic using NestJS's built-in AOP mechanisms (interceptors, filters, guards):

### Logging & Performance Monitoring

[`LoggingPerformanceInterceptor`](src/interfaces/http/interceptors/logging-performance.interceptor.ts) wraps every HTTP handler without modifying any controller code. It records `METHOD /path STATUS TIMEms` on success and logs a warning on failure — a textbook cross-cutting concern applied declaratively.

### Centralised Exception Handling

[`HttpExceptionFilter`](src/interfaces/http/filters/http-exception.filter.ts) catches **any** exception (NestJS `HttpException` or unexpected `Error`) thrown anywhere in the request lifecycle and normalises it into a consistent `{ statusCode, timestamp, path, method, message, errorCode }` JSON response. Controllers never need try/catch blocks for error formatting.

### Security & Authorisation

- **`JwtAuthGuard`** — intercepts protected routes to validate the JWT bearer token before the controller method executes.
- **`RolesGuard`** — checks the authenticated user's role (e.g. `ADMIN`) against the required role declared via a `@Roles()` decorator. Both guards are applied as metadata-driven aspects, keeping controllers free of authorisation logic.

---

## Key Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Create a new user account |
| `POST` | `/auth/login` | No | Authenticate and receive a JWT |
| `GET` | `/levels` | No | List the level catalog |
| `GET` | `/levels/:id` | No | Get a single level by ID |
| `POST` | `/levels` | Admin | Create a new level |
| `PUT` | `/levels/:id` | Admin | Update an existing level |
| `GET` | `/progress/me` | Yes | Get the authenticated user's progress |
| `POST` | `/progress/sync` | Yes | Sync client progress to the server |
| `DELETE` | `/progress` | Yes | Delete the authenticated user's progress |
| `GET` | `/leaderboard/:levelId` | No | Get leaderboard entries for a level |
| `POST` | `/leaderboard` | Yes | Submit a leaderboard score |
| `GET` | `/health` | No | Health check |

Interactive Swagger docs available at **`/api/docs`** when the server is running.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Docker** and **Docker Compose** (for PostgreSQL)
- **npm** (comes with Node.js)

### Installation

```powershell
# 1. Clone the repository
git clone https://github.com/arjperez-dev/backend-poc-arrow.git
cd backend-poc-arrow

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 4. Start PostgreSQL via Docker and the API
docker compose up --build

# 5. Run migrations and seed (in a separate terminal if needed)
npx prisma migrate dev
npm run prisma:seed
```

### Run

```powershell
npm run start:dev   # watch mode (hot reload)
npm test            # unit tests
npm run test:e2e    # end-to-end tests
```

> **Note:** There is no `npm run dev` — the dev script is `start:dev`.

---

## Environment Variables

Create a `.env` file from `.env.example`:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/arrow_poc?schema=public` |
| `JWT_SECRET` | Secret key for JWT signing | `change-me-in-local-env` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL_TEST` | Test database URL | `postgresql://...` |
| `ADMIN_EMAIL` | Optional admin seed email | `admin@example.com` |
| `ADMIN_PASSWORD` | Optional admin seed password | `change-me-admin-password` |

---

## Seed Data

`prisma/levels/manual-levels.ts` seeds 30 rows, and the two halves are not alike:

- **1–15** are deterministic, hand-authored, graph-based levels, built from a `LevelSpec` through the shared `buildLevel()` grid builder.
- **16–30** are *generated placeholders*, not real boards. Their authoritative playable definitions live in the frontend's local assets (`manual_levels_2d.json` / `manual_levels_3d.json`) and are never rendered from the backend. These rows exist only so every local level number resolves to a backend `Level.id` — progress and leaderboard flows map number → id via `GET /levels`, and without a row the lookup returns null, which previously left every 3D level's leaderboard permanently empty.

The seed script (`prisma/seed.ts`) upserts by `Level.number`, ensuring stable `levelId`s the Flutter client maps to.

If both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, the seed also creates or updates an admin user for testing admin-only endpoints via Swagger.

---

## Testing

```powershell
npm run lint         # static analysis
npm run test         # unit tests (Jest) — 12 tests / 5 suites
npm run test:e2e     # HTTP tests over in-memory repositories (Supertest) — 10 tests / 2 suites
npm run build        # verify production build
```

The e2e suite substitutes in-memory repositories for the Prisma ones (Liskov Substitution in action) — the real use cases, controllers, guards, interceptor, and filter all run, only persistence is swapped. This avoids destructive operations against the development database.

They are best described as **full-stack HTTP tests**, not integration tests: no test executes a Prisma query. What they do verify is routing, `ValidationPipe` rejecting a malformed graph with a 400, `JwtAuthGuard` returning 401 on a missing token, `RolesGuard` returning 403 for a PLAYER and 201 for an ADMIN on `POST /levels`, the exception filter's error shape, and the 204 on progress reset. What they do **not** cover is the SQL boundary: no test exercises the Prisma repositories, so the `map*()` mappings, compound-unique upserts, cascade deletes, and the `orderBy` driving leaderboard ranking are unverified. `.env.example` reserves `DATABASE_URL_TEST` on port 5433 for a future database-backed suite.

---

## AI Usage

AI-assisted development is documented in [`AI_USAGE.md`](AI_USAGE.md). Each entry records the date, tool/model, task, prompt, result, team modifications, lessons learned, and critical reflection.

---

## Contributing

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat:`, `fix:`, `docs:`, etc.)
3. Run `npm run lint` and `npm test` before pushing.
4. Open a Pull Request and request review.

---

## License

This project is licensed under the [MIT License](LICENSE).
