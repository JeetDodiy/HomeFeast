# HomeFeast Algorithm, Calculation & Business Logic Audit Report
**Scope:** Pricing Formulas, Discounts, Cron Jobs, Rating Aggregations, Payout Calculations & Cutoff Rules  
**Standard:** Mathematical Correctness, Floating-Point Precision, Edge-Case Resilience & Idempotency  

---

## 1. Cook Gross Revenue & Direct Payout Algorithm

### 1.1 Implementation Analysis
* **Location:** [app/cook/dashboard/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/cook/dashboard/page.tsx#L491-L493)
* **Code in Codebase:**
  ```typescript
  const calculatedGrossRevenue = (totalSubscribersCount * 2200) + (orders.length * 120) || 23800;
  const commission = Math.round(calculatedGrossRevenue * 0.10);
  const netEarnings = calculatedGrossRevenue - commission;
  ```

### 1.2 Identified Flaws & Boundary Failures
1. **Falsy Fallback Bug:**
   * When `totalSubscribersCount === 0` and `orders.length === 0`:
     $$\text{Gross} = (0 \times 2200) + (0 \times 120) = 0$$
   * In JavaScript, `0` is falsy. Therefore:
     $$0 \parallel 23800 \implies 23800$$
   * **Result:** A brand new cook with 0 subscribers is displayed **₹23,800** in gross revenue and **₹21,420** in net bank deposit!
2. **Arbitrary Pricing Assumptions:**
   * Uses flat ₹2,200 multiplier per subscriber regardless of whether the user purchased:
     * Daily Plan: ₹120
     * Weekly Saver Plan: ₹749
     * Monthly Home Plan: ₹2,799
   * Uses flat ₹120 multiplier per order regardless of actual order item total.

### 1.3 Corrected Mathematical Formula
$$\text{Gross Revenue} = \sum_{s \in \text{ActiveSubs}} \text{planPrice}(s) + \sum_{o \in \text{CompletedOrders}} \text{orderTotal}(o)$$
$$\text{Commission} = \text{round}(\text{Gross Revenue} \times 0.10)$$
$$\text{Net Earnings} = \text{Gross Revenue} - \text{Commission}$$

**TypeScript Drop-in Fix:**
```typescript
const calculatedGrossRevenue = subscribers.reduce((sum, s) => sum + (Number(s.planPrice) || 0), 0) +
                              orders.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
const commission = Math.round(calculatedGrossRevenue * 0.10);
const netEarnings = calculatedGrossRevenue - commission;
```

---

## 2. Promotional Coupon & Discount Engine

### 2.1 Implementation Analysis
* **Location:** [app/checkout/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/checkout/page.tsx#L63-L89)
* **Rules Evaluated:**
  * `WELCOME50`: Flat ₹50 off.
  * `FIRSTFEAST`: 10% off (`Math.round(plan.price * 0.1)`).
  * `HOMELOVE`: Flat ₹100 off.
* **Total Calculation:**
  $$\text{Total} = \max(0, \text{Subtotal} - \text{Discount} + \text{PlatformFee})$$

### 2.2 Boundary & Precision Test Results
* **Case 1: Standard Plan (₹749 with `FIRSTFEAST`):**
  * Discount = `Math.round(749 * 0.1)` = `75`.
  * Total = `749 - 75 = 674`. **(Pass)**
* **Case 2: Flat Coupon Exceeding Price (₹80 Plan with `HOMELOVE` ₹100):**
  * Total = `Math.max(0, 80 - 100) = 0`. **(Pass - No negative charge)**
* **Case 3: Floating-Point Rounding:**
  * Uses `Math.round()`, avoiding IEEE 754 precision artifacts like `0.1 + 0.2 = 0.30000000000000004`. **(Pass)**

### 2.3 Identified Gap
* **Coupon Reuse Vulnerability:** There is no persistence tracking whether a customer has already used `FIRSTFEAST` or `WELCOME50`. A user can apply `FIRSTFEAST` on every checkout indefinitely.

---

## 3. Daily Order Dispatch Generation Cron Job

### 3.1 Implementation Analysis
* **Location:** [lib/jobs/dailyOrders.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/lib/jobs/dailyOrders.ts#L15-L44)
* **Automated Unit Test:** [tests/api.test.ts](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/tests/api.test.ts#L6-L48)

### 3.2 Logic Trace & Verification
```typescript
const activeToday = subscriptions.filter((sub) => {
  if (sub.status !== "ACTIVE") return false;
  if (sub.pausedDates?.includes(today)) return false;
  return true;
});
```
* **Test Verification:**
  * Active non-paused subscription (`sub-1`): **Order Generated**
  * Paused status subscription (`sub-2`): **Skipped**
  * Active subscription with today in `pausedDates` (`sub-3`): **Skipped**
* **Result:** **100% Algorithm Verification Pass** (`npm test` passed in 0.5s).

---

## 4. Subscription Pause & Cutoff Timing Rule

### 4.1 Specification vs Reality
* **PRD Requirement:** Customers can pause upcoming meals if requested **before 8:00 PM of the previous day**. Requests after 8:00 PM are rejected to prevent ingredient and preparation waste.
* **Codebase Implementation:** [app/customer/dashboard/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/customer/dashboard/page.tsx#L96-L110)
  ```typescript
  const toggleSubscriptionStatus = (id: string) => {
    // Toggles state immediately without inspecting time or date
  };
  ```
* **Audit Finding:** **Algorithm Missing**. The UI toggles pause immediately at any time of day.
* **Proposed Implementation:**
  ```typescript
  const now = new Date();
  const currentHour = now.getHours();
  if (isTargetDateTomorrow && currentHour >= 20) {
    throw new Error("Cutoff time passed (8:00 PM). Preparation for tomorrow has begun. You can pause starting from the following day.");
  }
  ```

---

## 5. Cook Search Matching & Normalization Algorithm

### 5.1 Case-Sensitivity Defect
* **Location:** [app/search/page.tsx](file:///home/jeet-dodiya/Desktop/un-project/pro%202/homefeast/app/search/page.tsx#L56)
* **Failure Mechanism:**
  ```typescript
  CITIES.find((x) => x.id === selectedCity)?.name.toLowerCase()
  ```
  When URL is `?city=Rajkot`, `x.id` is `"rajkot"`. Strict equality `x.id === "Rajkot"` evaluates to `false` for every city in the array.
* **Correction:**
  ```typescript
  const cityMatch = CITIES.find((x) => x.id.toLowerCase() === selectedCity.toLowerCase() || x.name.toLowerCase() === selectedCity.toLowerCase());
  ```

---

## 6. Review & Rating Aggregation Algorithm

### 6.1 Audit Finding
* **PRD Requirement:** Cook profile rating dynamically reflects verified customer ratings:
  $$\text{Rating} = \frac{\sum_{i=1}^N \text{rating}_i}{N}$$
* **Codebase Implementation:** The endpoint `/api/v1/reviews` accepts reviews, but never recalculates or updates `rating` or `totalReviews` on the cook record. Cook rating remains hardcoded at 4.8.
* **Required Fix:** On `POST /api/v1/reviews`, recalculate the cook's aggregate rating and update the database row.
