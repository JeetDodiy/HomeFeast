# HomeFeast Prioritized Remediation & Release Fix Plan
**Execution Strategy:** Smallest Safe Diffs, Test-Driven Verification & Zero Functionality Regression  

---

## Phase 1: Immediate Critical Fixes (Sprint 1 — 24 Hours)

### 1.1 Secure Administrative Portal & KPI Endpoint (P0)
* **Target Files:** `middleware.ts`, [app/api/v1/admin/kpis/route.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/api/v1/admin/kpis/route.ts), [app/admin/dashboard/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/admin/dashboard/page.tsx)
* **Changes Required:**
  1. Create `middleware.ts` to inspect requests matching `/admin/:path*` and `/api/v1/admin/:path*`.
  2. Verify JWT token from `Authorization` header or `hf_token` cookie.
  3. Deny access (401 / redirect to `/auth/login`) if user is unauthenticated or `role !== "ADMIN"`.
* **Verification Test:** `curl -i http://localhost:3000/api/v1/admin/kpis` must return HTTP 401.

### 1.2 Fix Cook Revenue Falsy Calculation (P1)
* **Target File:** [app/cook/dashboard/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/cook/dashboard/page.tsx#L491-L493)
* **Changes Required:**
  * Replace `(totalSubscribersCount * 2200) + (orders.length * 120) || 23800` with actual summation of subscriber plan prices and completed order values.
  * Ensure 0 revenue renders as ₹0.
* **Verification Test:** Verify a new cook with 0 subscribers displays ₹0 Gross Revenue and ₹0 Net Deposit.

### 1.3 Fix City Search Case-Sensitivity Bug (P1)
* **Target File:** [app/search/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/search/page.tsx#L56)
* **Changes Required:**
  * Normalize `selectedCity` and `city.id`/`city.name` to lowercase before comparison.
* **Verification Test:** `http://localhost:3000/search?city=Rajkot` displays 2 cooks instead of 0.

### 1.4 Fix Broken 404 Navbar Profile Link (P2)
* **Target File:** [components/Navbar.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/components/Navbar.tsx#L351) & [components/Navbar.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/components/Navbar.tsx#L459)
* **Changes Required:**
  * Update `href="/customer/profile"` to `href="/customer/dashboard?tab=profile"`.
* **Verification Test:** Clicking "My Profile & Addresses" in the top navbar opens the customer profile tab with HTTP 200.

---

## Phase 2: Core Data Persistence & Authentication (Sprint 2 — 3 to 5 Days)

### 2.1 Connect Prisma Client & PostgreSQL
* **Target Files:** `lib/prisma.ts`, `app/api/v1/orders/route.ts`, `app/api/v1/subscriptions/route.ts`, `app/api/v1/cooks/route.ts`
* **Changes Required:**
  1. Export singleton `PrismaClient` in `lib/prisma.ts`.
  2. Implement real database queries in API routes (`prisma.order.create`, `prisma.subscription.findMany`, etc.).
  3. Update `app/checkout/page.tsx` to `POST /api/v1/orders` on submit.
* **Verification Test:** Order placed by customer in browser A appears immediately in cook dashboard in browser B.

### 2.2 Real Password Hashing & JWT Authentication
* **Target Files:** [app/api/v1/auth/route.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/api/v1/auth/route.ts), [app/auth/register/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/auth/register/page.tsx)
* **Changes Required:**
  1. Integrate `bcryptjs` to hash passwords upon registration (`bcrypt.hash(password, 12)`).
  2. Query user by email and verify password on login (`bcrypt.compare(password, user.passwordHash)`).
  3. Sign valid JWTs with 15-minute expiration and role payload using `jsonwebtoken`.
* **Verification Test:** Invalid passwords fail with HTTP 401; valid passwords receive signed tokens.

---

## Phase 3: Workflow & UX Refinement (Sprint 3 — 2 Days)

### 3.1 Activate Plan Type & Max Price Search Filters
* **Target File:** [app/search/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/search/page.tsx)
* **Changes Required:**
  * Include `planType` and `maxPrice` criteria in `COOKS.filter(...)`.
* **Verification Test:** Selecting "Daily" displays only daily trial plan providers.

### 3.2 Wire Dead Buttons on Cook Profile
* **Target File:** [app/cooks/[id]/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/cooks/%5Bid%5D/page.tsx)
* **Changes Required:**
  * Add `onClick` to "Contact Cook" (opens WhatsApp / dialer).
  * Add `onClick` to "Save Cook" (persists to favorites).
  * Add `onClick` to "Share" (`navigator.share`).
* **Verification Test:** Clicking all 3 buttons performs the expected user action.

### 3.3 Enforce 8:00 PM Cutoff on Subscription Pauses
* **Target File:** [app/customer/dashboard/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/customer/dashboard/page.tsx)
* **Changes Required:**
  * Add cutoff logic blocking pauses after 8:00 PM for next-day meals.

---

## Phase 4: Regression & Release Verification

1. Run unit test suite: `npm test` -> 100% pass.
2. Update and run E2E suite: `npx playwright test` -> verify complete checkout flow.
3. Validate complete production build: `npm run build` -> 0 TypeScript / Turbopack errors.
4. Conduct manual cross-browser testing on Chrome, Safari, and mobile viewport.
