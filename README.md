# TalentSYNC - Recruitment Management System

A modern, full-stack recruitment management platform built with **React**, **Express.js**, **PostgreSQL**, and **TypeScript**. Features JWT-based authentication, role-based access control, and a responsive UI.

---

## Features

### Authentication & Authorization
- User registration with email validation
- Secure login with JWT tokens (httpOnly cookies)
- Password reset with OTP via email
- Role-based access control (Admin, Manager, Interviewer, Candidate)
- Protected routes with automatic authentication verification
- Auto-refresh tokens for seamless user experience

### User Management
- User profile management
- Password update functionality
- Role assignment and permissions

### Frontend
- Responsive design with TailwindCSS
- Modern UI with Shadcn components
- Form validation with Zod
- Toast notifications
- Role-based navigation menus
- Protected and public route guards

### Security
- httpOnly cookies (XSS protection)
- CORS configuration
- Password hashing with bcrypt
- JWT token expiration
- Environment variable security

---

### Frontend Architecture
```
apps/web-app/src/
├── lib/
│   ├── api/
│   │   ├── config.ts          - API base URL + endpoints
│   │   ├── client.ts          - Axios instance + interceptors
│   │   └── auth.service.ts    - Authentication API methods
│   └── validations/
│       └── auth.schema.ts     - Zod validation schemas
├── stores/
│   └── authStore.ts           - Zustand global state
├── components/
│   ├── ProtectedRoute.tsx     - Auth guard for protected pages
│   ├── PublicRoute.tsx        - Redirect authenticated users
│   ├── loginForm.tsx          - Login UI + logic
│   ├── signupForm.tsx         - Registration UI + logic
│   └── dashBoard/
│       ├── appSidebar.tsx     - Role-based navigation
│       └── navUser.tsx        - User dropdown + logout
├── pages/                     - Page components
└── App.tsx                    - Route configuration
```

### Backend Architecture
```
apps/auth-service/src/
├── config/
│   ├── env.ts                 - Environment configuration
│   ├── sequelize.ts           - Database connection
│   └── sequelize-cli-config.cjs - Sequelize CLI config
├── models/                    - Sequelize models
│   ├── User.ts
│   ├── Role.ts
│   ├── Permission.ts
│   ├── RefreshToken.ts
│   └── ...
├── routes/                    - API routes
├── controllers/               - Route handlers
├── services/                  - Business logic
├── middlewares/               - Auth & validation middleware
├── migrations/                - Database migrations
├── seeders/                   - Seed data
└── app.ts                     - Express app setup
└── server.ts                  - Run server
```

---

## Project Structure

```
TalentSYNC-development/
├── apps/
│   ├── auth-service/          # Backend Express API
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web-app/               # Frontend React App
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
│
├── package.json               
├── pnpm-workspace.yaml        
├── docker-compose.yml         
├── commitlint.config.js       
└── eslint.config.ts           
```

---

## Authentication Flow

### Route Protection
- **ProtectedRoute**: Verifies authentication before rendering protected pages
  - If not authenticated → Redirect to `/signin`
  - If authenticated → Dashboard
  
- **PublicRoute**: Prevents authenticated users from accessing auth pages
  - If not authenticated → SignIn Page
  - If authenticated → Redirect to `/home`

### Cookie-Based Authentication
- Access Token: 15 minutes (httpOnly, secure)
- Refresh Token: 30 days (httpOnly, secure, path=/auth/refresh-token)
- Automatically sent with every request (withCredentials: true)

---

## 🔌 API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user (sets cookies) | ❌ |
| POST | `/auth/logout` | Logout user (clears cookies) | ✔️ |
| POST | `/auth/refresh-token` | Refresh access token | ✔️ |
| POST | `/auth/forgot-password` | Request password reset OTP | ❌ |
| POST | `/auth/reset-password` | Reset password with OTP | ❌ |

### User Profile (`/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | ✔️ |
| PUT | `/users/me` | Update user profile | ✔️ |
| PATCH | `/users/me/password` | Update password | ✔️ |

## 🔧 Environment Variables

### Backend (`.env` in `apps/auth-service/`)

```bash
# Server
PORT=4001
NODE_ENV=development

# JWT Secrets (use strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=15m

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=talentsync_db

# Email Configuration (for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=NAME <noreply@talentsync.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env` in `apps/web-app/`)

```bash
# Backend API URL
VITE_API_URL=http://localhost:4001
```

---

## Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/dev-ansuman/TalentSYNC
cd TalentSYNC
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Database Setup
```bash
docker-compose up -d
```

## Running the Project

#### Run Both Services Simultaneously
```bash
# Terminal 1: Backend
cd apps/auth-service
pnpm run dev
# Backend runs on http://localhost:4001

# Terminal 2: Frontend
cd apps/web-app
pnpm run dev
# Frontend runs on http://localhost:5173
```