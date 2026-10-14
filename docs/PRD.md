# HomeFeast — Product Requirements Document (PRD)

## 1. Executive Summary
**HomeFeast** is a modern, responsive web application connecting customers (students, working professionals, elderly people) with verified local home cooks and tiffin providers. The platform delivers fresh, hygienic, home-style meals through flexible daily, weekly, and monthly subscription plans.

---

## 2. Problem Statement
People living away from home struggle to access healthy, affordable food on a sustained basis:
* **High Restaurant Costs:** Delivery fees, restaurant markups, and taxes make daily dining unsustainable.
* **Repetitive & Unhealthy Options:** Restaurant food is often high in oil, sodium, and preservatives.
* **Lack of Long-Term Subscriptions:** Existing food delivery apps prioritize on-demand single meals rather than predictable daily tiffin services.
* **Manual Coordination Chaos:** Existing tiffin services rely on phone calls, WhatsApp messages, paper diaries, and cash handoffs.

---

## 3. Product Vision & Goals
* **Digitize Tiffin Subscriptions:** Provide automated meal scheduling, pausing, cancellation, and daily dispatch tracking.
* **Empower Home Kitchens:** Enable micro-entrepreneurs and homemakers to monetize culinary talent with zero marketing friction.
* **Promote Cleanliness & Safety:** Enforce mandatory FSSAI registration checks and hygiene audits.
* **Scale Multi-City:** Built with city-scoped data models to support rapid geographic expansion without code changes.

---

## 4. User Personas

| Persona | Demographics | Key Pain Points | HomeFeast Value Proposition |
| :--- | :--- | :--- | :--- |
| **Arjun (The Professional)** | 26, Software Engineer, lives in rented flat | Long working hours, tired of heavy restaurant food | Affordable weekly Gujarati thali subscription delivered right to his desk |
| **Kavya (The Student)** | 20, College student in hostel | Tight monthly allowance, misses mom's cooking | Daily budget-friendly plans (under ₹100/meal) with pause days during exams |
| **Mahesh Bhai (The Senior)** | 67, Retired, living alone | Cooking difficulty, requires mild/diet food | Reliable daily pure veg tiffin prepared with low oil and salt |
| **Meera Patel (The Home Cook)**| 44, Homemaker & skilled cook | Wants extra income, struggles with marketing & tracking orders | Guaranteed subscription revenue, automated order dispatch, weekly payouts |

---

## 5. Functional Requirements by Role

### 5.1 Customer (User)
1. **Discovery & Search:**
   - Multi-city search (Rajkot, Ahmedabad, Surat, etc.).
   - Filters: Veg / Non-Veg / Jain, Cuisines, Price range, Subscription duration (Daily, Weekly, Monthly).
   - Sorting: By rating, price, and distance.
2. **Cook Profiles:**
   - Kitchen photos, bio, certified FSSAI license badge.
   - Weekly menu preview with daily rotis/sabzi/dal schedule.
   - Verified customer ratings and reviews.
3. **Checkout & Ordering:**
   - Choose meal slot (Lunch, Dinner, Both), delivery days, and start date.
   - Promo coupon discounts (`FIRSTFEAST`, `WELCOME50`).
   - Payment modes: Pay on Delivery (Cash/UPI QR), Instant UPI, Card/NetBanking.
4. **Customer Dashboard:**
   - Real-time subscription tracker and remaining meal countdown.
   - One-click Pause (up to 5 days/month) and Resume actions.
   - Full order history and support ticket desk.

### 5.2 Home Cook / Provider
1. **Kitchen Management:**
   - Edit kitchen bio, operating area, delivery slots, and holiday mode.
2. **Menu & Pricing:**
   - Add/edit/delete dishes with real-time availability toggles (*In Stock* vs. *Sold Out*).
   - Define daily, weekly, and monthly pricing tiers.
3. **Order & Subscription Inbox:**
   - Accept or decline subscription requests with custom notes.
   - Live dispatch status updater (*Cooking* ➔ *Out for Delivery* ➔ *Delivered*).
4. **Earnings Tracker:**
   - Weekly gross revenue, platform fee deductions (10%), and net bank payouts.

### 5.3 Administrator
1. **Cook Verification & Approval:**
   - Audit submitted kitchen applications, inspect FSSAI credentials, and approve listings.
2. **Platform Governance:**
   - Search, manage, or block problematic accounts.
   - Resolve customer-cook complaints within 24-hour SLA.
3. **Analytics & KPIs:**
   - Monitor city penetration, active subscriber retention, and average order value.

---

## 6. Key Performance Indicators (KPIs) & Calculation Formulas

| KPI | Formula / Source | Target | Where Displayed |
| :--- | :--- | :--- | :--- |
| **Registered Users** | Count of users grouped by role (Customer, Cook, Admin) | > 5,000 | Admin Dashboard |
| **Monthly Active Users (MAU)** | Users with a login or active order within the last 30 days | > 3,000 | Admin Dashboard |
| **Active Subscriptions** | Total count of subscriptions with status `ACTIVE` | > 1,500 | Admin & Cook Dashboards |
| **Order Conversion Rate** | $\frac{\text{Total Orders}}{\text{Cook Profile Views}} \times 100$ | > 15% | Admin Analytics |
| **Cook Onboarding Rate** | $\frac{\text{Approved Cooks}}{\text{Cook Sign-Ups}} \times 100$ | > 75% | Admin Approvals |
| **Customer Retention Rate** | $\frac{\text{Customers Renewing in Month 2}}{\text{Customers in Month 1}} \times 100$ | > 70% | Admin Dashboard |

---

## 7. Errata & Clarifications from Original Project Brief

1. **Entity Deduplication:** In the original brief, "Orders" was listed twice under Core Entities. HomeFeast resolves this by properly separating **Orders** (daily meal dispatches) from **Subscriptions** (multi-day recurring contracts).
2. **Text Typo Correction:** The string `"hygienichomemade"` in the original brief was corrected to `"hygienic homemade"` throughout all specifications and user interfaces.
3. **Cutoff Policy:** Pausing, skipping, or cancelling meals is subject to an automated cutoff rule (must be submitted before 8:00 PM on the previous calendar day) to protect cook ingredient purchasing and preparation schedules.
4. **Phase 1 Payment Scope:** Cash on Delivery (COD) and UPI on Delivery are active for Phase 1. Database schema and architecture are decoupled to allow seamless integration of Razorpay/Stripe and digital wallets in Phase 2.

