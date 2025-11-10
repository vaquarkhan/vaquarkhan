# Premium Mobility Platform – Architecture Overview

## System Topology
- **Frontend** (`frontend/`)
  - Vite + React TypeScript SPA served via `vite preview` (Docker) or `npm run dev` locally.
  - Communicates with backend over REST using the `VITE_API_BASE` environment variable.
  - Provides rich concierge UI: bookings, secure chat, translator, analytics dashboards, premium experiences.
- **Backend** (`backend/`)
  - Spring Boot 3 application exposing REST APIs, secured with JWT-based role-aware RBAC (`ADMIN`, `CONCIERGE`, `ANALYST`).
  - Modules: authentication, bookings/concierge, services/experiences, communications, analytics, AI logging.
  - Flyway manages schema migrations located in `backend/src/main/resources/db/migration`.
  - Scheduled analytics aggregation job persists KPIs hourly to `analytics_snapshots`.
- **Database** (`mysql:8.0` via Docker Compose)
  - Stores normalized domain data (customers, services, bookings, concierge, communications, analytics, AI audit).
  - Seeded with representative demo data through Flyway baseline + supplemental inserts (`database/dml.sql`).

## Deployment Footprint
- **Docker Compose** (`docker-compose.yml`)
  - `db`: MySQL with health checks & persisted volume.
  - `backend`: builds Spring Boot image, waits for DB readiness, runs Flyway on startup.
  - `frontend`: builds React SPA, exposes port `5173`.
  - `adminer`: optional DB UI for manual inspection.
- **Local Development**
  - Backend: `mvn spring-boot:run`
  - Frontend: `npm run dev`
  - Requires external MySQL or Docker Compose DB; configure with env vars.

## Request & Data Flow
1. User (browser/mobile) hits SPA served from `frontend`.
2. SPA calls backend REST endpoints with JWT tokens issued by `/api/auth/login`.
3. Backend service layer handles domain logic, persists via Spring Data JPA repositories to MySQL.
4. Analytics job (`AnalyticsAggregationJob`) aggregates metrics and stores snapshots every hour.
5. Adminer (optional) offers database visibility for debugging.

## Security & Roles
- JWT payload contains `role`; `SecurityConfig` maps HTTP endpoints to roles.
  - `ADMIN`: full access (services, partner offers, analytics, AI logs).
  - `CONCIERGE`: concierge requests, bookings, secure chat, translator, customer ops.
  - `ANALYST`: read analytics & AI interaction data.
- Default credentials (dev only):
  - `admin/adminpass`
  - `concierge/conciergepass`
  - `analyst/analystpass`

## Background & Integrations
- **Analytics Aggregation**: hourly cron (`app.analytics.snapshot-cron`) capturing bookings totals, loyalty deltas, AI usage, feedback averages, concierge load.
- **GeminiService**: abstraction for AI interactions (Gemini API key injected via `GEMINI_API_KEY`).
- **Flyway**: baseline + future migrations ensure deterministic schema evolution across environments.

## Extensibility Notes
- Add new microservices by extending docker-compose and linking via shared network.
- Introduce messaging/queue (Kafka/SQS) for concierge notifications without touching existing modules.
- Promote to Kubernetes by converting compose services to Deployments/StatefulSets and using ConfigMaps/Secrets for env vars.
