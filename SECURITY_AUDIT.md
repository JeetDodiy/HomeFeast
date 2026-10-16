# HomeFeast Cybersecurity & Threat Modeling Audit Report
**Scope:** Authentication, Authorization, Session Management, Cryptography, Data Exposure & OWASP Top 10  
**Testing Methodology:** Non-destructive whitebox inspection & evidence-based endpoint penetration testing  
**Audit Standard:** OWASP Top 10 (2021), DPDP Act 2023, ISO 27001 Data Confidentiality  

---

## 1. Executive Security Assessment

| Vulnerability Category | Severity | Status | OWASP Mapping |
|---|---|---|---|
| **Broken Access Control on Admin Endpoints** | **P0 (Critical)** | Confirmed | A01:2021 – Broken Access Control |
| **Authentication Bypass (Mock Password Verification)** | **P0 (Critical)** | Confirmed | A07:2021 – Identification & Auth Failures |
| **Hardcoded Cryptographic Salt Fallback** | **P1 (High)** | Confirmed | A02:2021 – Cryptographic Failures |
| **Insecure Direct Object Reference (IDOR) on User Orders** | **P1 (High)** | Confirmed | A01:2021 – Broken Access Control |
| **Wildcard CORS in Auxiliary Service** | **P2 (Medium)** | Confirmed | A05:2021 – Security Misconfiguration |
| **Missing Rate Limiting on Authentication Endpoints** | **P2 (Medium)** | Confirmed | A04:2021 – Insecure Design |
| **DPDP Act Account Erasure Worker Absence** | **P2 (Medium)** | Confirmed | Regulatory Compliance Gap |

---

## 2. In-Depth Vulnerability Analysis & Reproductions

### SEC-001: Unprotected Admin KPI Endpoint & Dashboard (P0 — Critical)
* **Description:** Both the REST API route `/api/v1/admin/kpis` and the frontend page `/admin/dashboard` lack authentication checks. Any unauthenticated caller can query business revenue and user analytics, or access the admin UI to approve/reject cooks.
* **Evidence:**
  ```bash
  # Execute against live server:
  curl -s http://localhost:3000/api/v1/admin/kpis
  ```
  **Response Payload Received Without Token:**
  ```json
  {
    "success": true,
    "data": {
      "registeredUsers": { "total": 1248, "customers": 1180, "cooks": 64, "admins": 4 },
      "totalRevenue": 284500,
      "cityBreakdown": [{ "city": "Rajkot", "activeSubscribers": 198 }]
    }
  }
  ```
* **Remediation:**
  1. Add Next.js Route Middleware (`middleware.ts`) to intercept `/admin/*` and `/api/v1/admin/*`.
  2. Verify incoming JWT signature against `JWT_SECRET`.
  3. Ensure decoded payload possesses `role === "ADMIN"`. Return `401 Unauthorized` if invalid.

---

### SEC-002: Authentication Bypass via Mock Route Handler (P0 — Critical)
* **Description:** [app/api/v1/auth/route.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/api/v1/auth/route.ts) grants a valid session for any email/password pair without querying the database or verifying password hashes.
* **Evidence:**
  ```bash
  curl -s -X POST http://localhost:3000/api/v1/auth \
    -H "Content-Type: application/json" \
    -d '{"action":"login","email":"attacker@unknown.com","password":"invalidpassword","role":"ADMIN"}'
  ```
  **Response Received:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "hf_jwt_1792065135154_8m2o2j",
    "user": { "role": "ADMIN", "name": "System Administrator" }
  }
  ```
* **Remediation:**
  1. Query `User` record from PostgreSQL via Prisma.
  2. Compare password using `bcrypt.compare(body.password, user.passwordHash)`.
  3. Issue cryptographically signed JWT using `jsonwebtoken` library.

---

### SEC-003: Public Salt Fallback in Encryption Utility (P1 — High)
* **Description:** [lib/crypto.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/lib/crypto.ts#L6) contains:
  ```typescript
  crypto.scryptSync(process.env.APP_SECRET || "homefeast-default-secret-salt-2026", "homefeast-salt", 32);
  ```
* **Impact:** When deployed without `.env` configured, customer phone numbers and home addresses are encrypted using this publicly visible string. Anyone with repository access can decrypt all sensitive user records.
* **Remediation:** Enforce fatal startup failure if `process.env.ENCRYPTION_KEY` is undefined in production.

---

### SEC-004: Insecure Direct Object Reference (IDOR) on Orders (P1 — High)
* **Description:** `/api/v1/orders` accepts `userId` parameter from query string without verifying whether the requesting user owns that ID.
* **Evidence:** An authenticated customer `u2` can supply `?userId=u1` and read order history belonging to customer `u1`.
* **Remediation:** Extract `userId` strictly from the verified JWT payload rather than client-controlled query parameters.

---

### SEC-005: Wildcard CORS on Auxiliary Service (P2 — Medium)
* **Description:** [server/src/server.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/server/src/server.ts#L9) configures `cors({ origin: "*" })`.
* **Impact:** Allows any third-party domain to make credentialed requests to the Express backend.
* **Remediation:** Restrict allowed origins to `https://homefeast.in` and `http://localhost:3000`.

---

## 3. DPDP Act 2023 Regulatory Compliance Review

* **Statutory Obligation:** Right to Erasure (Digital Personal Data Protection Act 2023, India).
* **Current Status:**
  * Endpoint `DELETE /api/v1/auth/delete-account` logs deletion intent and returns a 30-day notice. **(Compliant API surface)**
  * Gap: No scheduled cron job exists to execute the permanent purge query (`prisma.user.delete(...)`) once 30 days elapse.
* **Recommendation:** Create a daily scheduled background task in `lib/jobs/dataRetention.ts` to purge accounts marked for deletion older than 30 days.
