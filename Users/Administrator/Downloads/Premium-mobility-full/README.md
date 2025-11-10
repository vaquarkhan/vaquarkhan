## Premium Mobility Platform

End-to-end microservice-style demo that showcases a premium mobility concierge experience. The stack includes a React frontend, Spring Boot backend, and MySQL database, all runnable locally with Docker Compose.

### Documentation Map
- [Architecture Overview](ARCHITECTURE.md)
- [Database Reference](database/README.md)

### Architecture Overview
- `frontend/`: Vite + React TypeScript single-page application.
- `backend/`: Spring Boot REST API with JWT auth, AI-integrated endpoints, and MySQL persistence.
- `database/`: SQL assets (DDL+DML) for provisioning or refreshing the schema.
- `docker-compose.yml`: Spins up MySQL, backend API, frontend SPA, and Adminer for DB inspection.

### Prerequisites
- Docker Desktop 4.x (or Docker Engine + Compose Plugin)
- 6+ GB free disk space for images and build context
- Optional: Node.js 18+ and Java 17+ if you plan to run components outside Docker

### Environment Setup
Set the following environment variables before running locally or in Docker:
- `GEMINI_API_KEY` – optional, enables AI concierge calls.
- `WEATHER_API_KEY` – OpenWeather API key used by `/api/integrations/weather`.

### Quick Start (Docker)
1. Copy `.env.example` to `.env` (if present) and fill secrets like `GEMINI_API_KEY`.
2. Build and start the stack:
   ```bash
   docker compose up -d --build
   ```
3. Verify containers:
   ```bash
   docker compose ps
   ```
4. Access services:
   - Frontend app: `http://localhost:5173`
   - Backend API (Swagger via Springdoc): `http://localhost:8080/swagger-ui.html`
   - Health endpoint: `http://localhost:8080/actuator/health`
   - Adminer (DB console): `http://localhost:8081`

### Credentials & Test Data
- Admin login: `admin` / `adminpass`
- Concierge login: `concierge` / `conciergepass`
- Analyst login: `analyst` / `analystpass`
- Default chauffeur list and booking samples are seeded via backend `data.sql`.
- MySQL connection (inside Docker): host `db`, port `3306`, user `root`, password `rootpass`, database `premium`.
- External MySQL access: `localhost:33306` with same credentials.

### Running Without Docker
- **Backend**
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```
  Ensure a MySQL instance is reachable and configure `SPRING_DATASOURCE_*` env vars or update `application.properties`.
- **Frontend**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
  Set `VITE_API_BASE` in `.env` to the backend URL.

### Database Assets
- `database/ddl.sql` provisions core entities:  
  `admin_users`, `customers`, `services`, `chauffeurs`, `bookings`, `concierge_requests`, `insurance_products`, `insurance_quotes`, `esim_packages`, `esim_orders`, `partner_offers`, `experience_bookings`, `loyalty_transactions`, `feedback_entries`, `secure_chat_threads`, `secure_chat_messages`, `translator_sessions`, `biometric_preferences`, `analytics_snapshots`, `ai_interactions`.
- `database/dml.sql` seeds the full stack: traveller profiles, service catalog (mobility, concierge, premium experiences), chauffeurs with contact details, bookings, concierge tickets, insurance quotes, eSIM orders, partner offers, experience reservations, loyalty ledger, feedback sentiment, secure chat transcripts, translator logs, biometric settings, analytics metrics, and AI interaction history.
- Run both scripts via Adminer or the MySQL CLI to bootstrap environments outside Docker, or wire them into your migration tool of choice.
- The Spring Boot service now manages schema via Flyway migrations (`db/migration`). Run `mvn -pl backend flyway:migrate` (or `./mvnw`) when deploying to managed databases.

### REST API Highlights
- `GET/POST /api/customers` – manage traveller profiles, loyalty tiers, preferred languages.
- `GET/POST /api/services` – curate premium service catalog with pricing and SLAs.
- `GET/POST/PUT /api/bookings` – create or amend chauffeur & concierge bookings with payment tracking.
- `GET/POST/PUT /api/concierge/requests` – orchestrate concierge task pipeline with SLA dates and assignments.
- `GET/POST/PUT /api/insurance/products` & `/api/insurance/quotes` – manage travel insurance catalog and issued quotes.
- `GET/POST/PUT /api/esim/packages` & `/api/esim/orders` – handle global data package inventory and activations.
- `GET/POST/PUT /api/experiences` – book helicopters, yachts, private jets with detailed itineraries.
- `GET/POST/PUT /api/partner-offers` – publish loyalty-tier gated partner perks.
- `GET/POST/PUT /api/loyalty/transactions` – record accruals/redemptions; filter by customer via `?customerId=`.
- `GET/POST/PUT /api/feedback` – capture multi-channel sentiment tied to bookings or experiences.
- `GET/POST/PUT /api/secure-chat/threads` & `/api/secure-chat/messages` – manage end-to-end encrypted concierge conversations.
- `GET/POST/PUT /api/translator/sessions` – persist offline translation transcripts per customer.
- `GET/POST/PUT /api/biometrics/preferences` – store biometric opt-ins with metadata for personalised security flows.
- `GET/POST/PUT /api/analytics/snapshots` – maintain travel program KPIs with optional time-window filtering.
- `GET/POST/PUT /api/ai/interactions` – audit AI usage metrics, latency, and outcomes across channels.
- `GET /api/integrations/weather/current` – fetch live weather by `lat`/`lon` or `q` (city query) via OpenWeather.
- Legacy endpoints (`/api/chauffeurs`, `/api/admin/bookings`, AI routes, auth) remain intact.

### Operations Notes
- Automated analytics snapshots run hourly (`app.analytics.snapshot-cron`) and persist metrics to `analytics_snapshots`.
- Flyway manages schema evolution; disable `spring.jpa.hibernate.ddl-auto` overrides when adding new migrations.

### Testing Notes
- Backend tests: `cd backend && ./mvnw test`
- Frontend lint/tests: `cd frontend && npm run lint` or `npm run test`
- Manual QA:
  - Book a chauffeur and verify persistence via `GET /api/bookings`
  - Use the AI endpoints (requires valid `GEMINI_API_KEY`)
  - Inspect DB tables through Adminer to confirm data writes

### Deployment Hints
- Container images are built via service Dockerfiles—push to a registry and reuse the same `docker-compose.yml` or convert to Kubernetes manifests.
- For production, secure secrets (Vault/KMS), switch to managed MySQL, and tighten CORS/JWT expiry policies.

### Troubleshooting
- `frontend` healthcheck failing: ensure port 5173 is free, check logs with `docker compose logs frontend`.
- MySQL not healthy: delete `db_data` volume (`docker compose down -v`) and restart.
- Need to update schema: edit `database/ddl.sql`, run migrations, and keep entities in sync.

### Privacy, Convenience & Trading Highlights
- **Hide & Unhide Payments:** Industry-first control over payment history visibility.
- **Personalised UPI ID:** Use `yourname@ptyes` instead of exposing mobile numbers.
- **Receive-Money QR Widget:** Pin your QR code to the home screen for instant collections.
- **Coin-Drop Sound:** Audible confirmation whenever money lands in your account.
- **UPI Lite Auto Top-Up:** Automatically replenishes the lite balance when it dips below threshold.
- **Downloadable Statements:** Export UPI transactions in PDF or Excel for reconciliation.
- **Spend Analytics:** Categorised insights that illuminate trends across merchants and categories.
- **Total UPI Bank Balance:** View aggregate balances of all linked accounts in one glance.
- **Option Chain Power Tools:** ATM highlighting, illiquidity alerts, and rich option metrics (LTP, OI, IV, Greeks) covering NSE and BSE F&O (SENSEX, BANKEX).

