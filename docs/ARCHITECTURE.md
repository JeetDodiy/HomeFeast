# HomeFeast — Technical Architecture & Deployment Guide

## 1. System Architecture Overview

HomeFeast is engineered as a modern, high-performance web platform combining Next.js App Router, PostgreSQL (Prisma ORM), and stateful design token styling.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│   (SSR / Client Components / Turbopack / SEO Optimized)│
├───────────────┬────────────────────────┬───────────────┤
│ Customer Web  │ Cook Dashboard Engine  │ Admin Portal  │
└───────┬───────┴───────────┬────────────┴───────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌────────────────────────────────────────────────────────┐
│                  Next.js Route Handlers                │
│       /api/cooks   /api/orders   /api/cities           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                      Prisma ORM                        │
│            Type-safe PostgreSQL Data Layer             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                   │
│     (Hosted on Neon / Supabase / AWS RDS / Local)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Security Architecture

1. **Password Hashing:**
   - User and Cook credentials hashed using **bcrypt (salt cost 12)** or **Argon2id**.
2. **Access Control (RBAC):**
   - Strictly enforced roles: `CUSTOMER`, `COOK`, and `ADMIN`.
   - Ownership checks on every update/cancel operation to prevent Insecure Direct Object References (IDOR).
3. **Transport Security:**
   - Enforced HTTPS with HSTS headers.
   - Content Security Policy (CSP) blocking unauthorized script injection.
4. **Input Sanitation & Validation:**
   - Zod schema validation applied to API payloads.
   - HTML sanitization on customer comments and cook biographies.

---

## 3. Production Deployment Guide

### Option A: Vercel (Frontend & Serverless APIs) + Neon / Supabase (PostgreSQL)

1. **Database Setup (Neon or Supabase):**
   - Create a free project at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
   - Copy the PostgreSQL connection string.
2. **Configure Environment Variables:**
   - In Vercel Project Settings, add:
     - `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string.
     - `NEXT_PUBLIC_APP_URL`: Your production Vercel URL.
     - `JWT_SECRET`: 32+ character random string.
3. **Deploy:**
   - Push repository to GitHub.
   - Import repository into Vercel.
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

### Option B: Docker Container Deployment (Self-Hosted / Render / AWS EC2)

```bash
# 1. Clone the project
git clone <your-repo-url>
cd homefeast

# 2. Setup environment
cp .env.example .env

# 3. Launch full stack (Next.js + PostgreSQL + Redis)
docker compose up -d --build

# 4. Access the application
http://localhost:3000
```
