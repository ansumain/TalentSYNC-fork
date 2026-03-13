# TalentSYNC - Recruitment Management System

A full-stack recruitment platform built as a **pnpm monorepo** with three independent microservices, a React frontend, PostgreSQL.


---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 7, TailwindCSS 4, shadcn/ui, Zustand 5, Axios |
| Backend | Express 5, TypeScript 5.9, tsx, esbuild |
| Database | PostgreSQL 15, Sequelize 6 |
| Queue | RabbitMQ 4 |
| Infrastructure | Docker Compose, Nginx |
| Monorepo | pnpm workspaces, TurboRepo |

---

## Monorepo Structure

```
TalentSYNC-DEVELOPMENT/
├── apps/
│   ├── auth-service/           # Identity & access management  
│   ├── resume-parser-service/  # Resume upload + parsing    
│   ├── application-service/    # Jobs, applications, interviews
│   └── web-app/                # React webapp
├── packages/
│   ├── config/                 # Shared Sequelize + DB config
│   ├── models/                 # Shared Sequelize models
│   └── types/                  # Shared TypeScript types
├── infra/
│   ├── migrations/             # All DB migrations (sequelize-cli)
│   └── seeders/                # Data seeders
├── nginx.conf                  # Reverse proxy config
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## Features

### Authentication & Access Control
- Registration, login, logout with httpOnly cookie-based JWT
- Access token (15 min) + refresh token (30 days) with silent auto-refresh
- Password reset via OTP email (Nodemailer + Gmail)
- Role-based access control - **Admin**, **Manager**, **Interviewer**, **Candidate**

### Resume Management
- Resume upload (PDF/DOCX/image) with Multer
- Async parsing via RabbitMQ worker - Tesseract OCR + pdf-parse + mammoth
- Parsed JSON stored per candidate (name, email, phone, education, skills, experience)
- Authenticated file download via `/files/:filename`
- Candidate "My Resumes" page with status tracking

### Jobs & Applications
- Full CRUD for job postings with skill tagging
- Candidate job applications with lifecycle tracking (applied → shortlisted → interviewing → hired/rejected)
- Interview scheduling
- Ranked applicant matching by skills

### API Documentation
- Unified Swagger UI at `http://localhost/docs` (dev mode)
- All three services documented in a single merged spec
- Cookie-based auth (`access_token`) works automatically in Swagger

---

## Architecture

```
Browser
  │
  ▼
Nginx (:80)          ← single entry point
  ├── /api/auth/*    → auth-service 
  ├── /api/users/*   → auth-service 
  ├── /api/admin/*   → auth-service
  ├── /api/resume/*  → resume-parser-service
  ├── /files/*       → resume-parser-service
  ├── /api/candidate/* → application-service
  ├── /api/jobs/*    → application-service
  ├── /api/applications/* → application-service
  ├── /api/skills/*  → application-service
  ├── /api/interviews/* → application-service
  ├── /docs          → application-service
  └── /*             → web-app
```

---

## API Endpoints

### Auth Service - `/api/auth`, `/api/users`, `/api/admin`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login (sets cookies) | ❌ |
| POST | `/api/auth/logout` | Logout (clears cookies) | ✔ |
| POST | `/api/auth/refresh-token` | Refresh access token | ✔ |
| POST | `/api/auth/forgot-password` | Send OTP to email | ❌ |
| POST | `/api/auth/reset-password` | Reset password with OTP | ❌ |
| GET | `/api/users/me` | Get own profile | ✔ |
| PUT | `/api/users/me` | Update profile | ✔ |
| PATCH | `/api/users/me/password` | Change password | ✔ |
| GET | `/api/admin/roles` | List all roles | Admin |
| GET | `/api/admin/permissions` | List all permissions | Admin |
| POST | `/api/admin/user-roles` | Assign role to user | Admin |

### Resume Parser Service - `/api/resume`, `/files`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/resume/upload` | Upload resume file | ✔ |
| GET | `/api/resume/parsed/userId` | Get parsed data for user | Admin/Manager |
| GET | `/files/:filename` | Download resume file | ✔ |

### Application Service - `/api/candidate`, `/api/jobs`, `/api/applications`, `/api/skills`, `/api/interviews`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/candidate/parsed` | List all candidates (paginated) | Admin/Manager |
| GET | `/api/candidate/my-resumes` | Get own resume list | Candidate |
| GET | `/api/candidate/resume-status` | Check if resume uploaded | ✔ |
| GET | `/api/jobs` | List all jobs (paginated) | ✔ |
| POST | `/api/jobs` | Create job | Admin/Manager |
| DELETE | `/api/jobs/:jobId` | Delete job | Admin/Manager |
| GET | `/api/skills` | List all skills | ✔ |
| POST | `/api/applications/:jobId` | Apply to job | Candidate |
| GET | `/api/applications/user/me` | My applications | Candidate |
| GET | `/api/applications` | All applications | Admin/Manager |
| PATCH | `/api/applications/:id` | Update status | Admin/Manager |
| GET | `/api/applications/job/:jobId/ranked` | Ranked applicants by skill match | Admin/Manager |

---

## Authentication Flow

- **httpOnly cookies** - browser sends them automatically on every request, no localStorage reducing XSS risk
- Access token expires in **15 minutes**; frontend silently refreshes every **13 minutes**
- Refresh token is **path-restricted** to `/api/auth/refresh-token` only
- `ProtectedRoute`- redirects unauthenticated users to `/signin`
- `PublicRoute` - redirects already-authenticated users away from auth pages

---

## Running with Docker (recommended)

**Prerequisites:** Docker Desktop installed and running.

```bash
# 1. Clone
git clone https://github.com/dev-ansuman/TalentSYNC
cd TalentSYNC-DEVELOPMENT

# 2. Install dependencies (locks pnpm-lock.yaml for Docker)
pnpm install

# 3. Build and start all containers
docker compose up --build -d

# 4. Open in browser
open http://localhost
```

Docker Compose starts these containers in order:

| Container | Role |
|---|---|
| `postgres` | PostgreSQL 15 database |
| `rabbitmq` | Message queue (management UI at `:15672`) |
| `db-migrate` | Runs all Sequelize migrations once, then exits |
| `auth-service` | Identity service on port 4001 |
| `resume-parser-api` | Resume upload API on port 4002 |
| `resume-parser-worker` | Background OCR/parsing worker |
| `application-service` | Jobs/applications API on port 4003 |
| `web-app` | React app (vite preview) on port 5173 |
| `nginx` | Reverse proxy, serves everything on port 80 |

---

## Running Locally (without Docker)

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL, RabbitMQ running locally.

```bash
pnpm install

# Run all services in parallel (via TurboRepo)
pnpm dev
```

Individual services:
```bash
pnpm --filter @talentsync/auth-service dev        # :4001
pnpm --filter @talentsync/resume-parser-service dev  # :4002
pnpm --filter @talentsync/resume-parser-service worker:dev
pnpm --filter @talentsync/application-service dev  # :4003
pnpm --filter @talentsync/web-app dev             # :5173
```

---

## Environment Variables

Each service reads its own `.env` file. Example for **auth-service** (`apps/auth-service/.env`):

```bash
PORT=4001
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_strong_secret_here
REFRESH_TOKEN_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=15m

DB_HOST=localhost
DB_PORT=5432
DB_USER=rms_user
DB_PASSWORD=rms_password
DB_NAME=rms_db

EMAIL_SERVICE=gmail
EMAIL_USER=you@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="TalentSYNC <noreply@talentsync.com>"

FRONTEND_URL=http://localhost:5173
```

For **resume-parser-service** and **application-service**, the same `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and DB variables apply. No separate `.env` is needed for the frontend when running against Docker/Nginx.

---

## Database Migrations & Seeding

Migrations live in `infra/migrations/` and are managed with `sequelize-cli`.

```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Seed default roles, permissions, and an admin user
npx sequelize-cli db:seed:all

# Undo last migration
npx sequelize-cli db:migrate:undo
```

In Docker, migrations run automatically via the `db-migrate` container on every `docker compose up`.

---

## Time Estimate

https://docs.google.com/spreadsheets/d/1JFqGcp4_5iVs1nwu_vNscRIF5giJ6EcFSDzm9W8GkjE/edit?gid=0#gid=0
