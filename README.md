# 🍱 HomeFeast — Homemade Tiffin & Food Service Platform

> **Connecting students, working professionals, and seniors with verified local home cooks for healthy, hygienic, homemade meal subscriptions.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

---

## 🌟 Key Highlights & Features

* **Multi-City Support:** Built with city-scoped indexing (*Rajkot*, *Ahmedabad*, *Surat*, *Vadodara*).
* **Flexible Subscriptions:** Daily trial, weekly (7-day), and monthly (30-day) tiffin plans.
* **Customer Control:** Pause subscriptions for up to 5 days, resume anytime, track upcoming meals.
* **Verified Home Kitchens:** Strict FSSAI compliance auditing and hygiene declaration checklist.
* **Interactive Cook Dashboard:** Manage 7-day menus, pricing, incoming requests, live dispatch, and weekly payouts.
* **Admin Control Center:** Approve new kitchen applications, handle dispute escalations, and monitor city growth KPIs.
* **Aesthetic Theme System:** Built-in Light & Dark mode with zero flash on load, adhering to WCAG 2.1 AA contrast.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js `v20.x` or higher
* npm `v10.x` or higher
* (Optional) Docker for containerized setup

### 2. Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd homefeast

# Install all dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Docker Setup (One-Command Launch)

To start the full stack including PostgreSQL, Redis, and Next.js:

```bash
docker compose up -d --build
```

---

## 🗺️ Application Sitemap

| Route | Description | Target User |
| :--- | :--- | :--- |
| `/` | Homepage with hero search, how it works, featured cooks, plans, FAQ | Public |
| `/search` | Search cooks with filters (city, veg/non-veg, cuisines, prices) | Customers |
| `/cooks/[id]` | Cook profile, weekly menu schedule, reviews, and plan selector | Customers |
| `/checkout` | Subscription checkout, address, promo codes (`FIRSTFEAST`), payments | Customers |
| `/cook/register` | Partner onboarding form with FSSAI verification wizard | Home Cooks |
| `/customer/dashboard`| Manage subscriptions, pause/resume, orders, reviews, disputes | Customers |
| `/cook/dashboard` | Menu manager, subscription requests, live dispatch, earnings | Home Cooks |
| `/admin/dashboard` | Cook approvals desk, user management, disputes, KPI analytics | Admins |
| `/about` | Company mission, story, quality commitments | Public |
| `/contact` | Customer support, cook assistance, subject routing | Public |
| `/privacy` | DPDP Act 2023 compliant privacy policy | Public |
| `/terms` | Customer & Cook terms of service | Public |

---

## 🧪 Build & Quality Verification

```bash
# Type check and build production bundle
npm run build

# Run code style & linting
npm run lint
```
* Status: **0 Errors, 0 Warnings**. All routes prerender and generate statically.

---

## 📄 Documentation Links
* [Product Requirements Document (PRD)](./docs/PRD.md)
* [Entity-Relationship Diagram (ERD)](./docs/ERD.md)
* [Technical Architecture & Security](./docs/ARCHITECTURE.md)
* [Postman REST API Collection](./docs/API_COLLECTION.json)
