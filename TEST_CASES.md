# HomeFeast Quality Assurance — Detailed Test Cases Register
**Specification Reference:** PRD v1.0 & Audit Protocol  
**Coverage:** Functional, Edge Cases, Boundary Values, Negative Testing & Security  

---

## 1. Authentication & Role-Based Access Control (RBAC)

### TC-AUTH-001: Customer Login with Valid Credentials
* **Preconditions:** Registered user in database with role `CUSTOMER`.
* **Test Steps:**
  1. Navigate to `/auth/login`.
  2. Select role tab: "Customer".
  3. Enter valid email and password.
  4. Click "Sign In".
* **Expected Result:**
  * Receives HTTP 200 with JWT token containing `role: "CUSTOMER"`.
  * Redirects to `/customer/dashboard`.
  * Navbar displays customer name, avatar, and customer-specific dropdown menu.

### TC-AUTH-002: Customer Login with Invalid Password (Negative Test)
* **Preconditions:** Valid user exists.
* **Test Steps:**
  1. Navigate to `/auth/login`.
  2. Enter valid email and incorrect password.
  3. Click "Sign In".
* **Expected Result:**
  * HTTP 401 Unauthorized.
  * Inline error message displayed: "Invalid email or password."
  * Form preserves the email field; password field cleared.
  * No session token or `localStorage` item stored.

### TC-AUTH-003: Cook Sign In & Dashboard Access
* **Preconditions:** Approved cook account exists.
* **Test Steps:**
  1. Navigate to `/auth/login`.
  2. Select role tab: "Home Cook".
  3. Enter cook credentials and click "Sign In".
* **Expected Result:**
  * Redirects to `/cook/dashboard`.
  * Renders live packing station, menu manager, 7-day meal plan, and earnings.

### TC-AUTH-004: Direct Unauthenticated Access to Admin Dashboard (Security Test)
* **Preconditions:** User is anonymous (unauthenticated).
* **Test Steps:**
  1. Open private browsing window.
  2. Type URL directly: `http://localhost:3000/admin/dashboard`.
* **Expected Result:**
  * Access denied. Redirected to `/auth/login?redirect=/admin/dashboard&error=unauthorized`.
  * Zero administrative data or KPIs rendered in DOM.

---

## 2. Cook Discovery & Search Filtering

### TC-SEARCH-001: Search Cooks by City (Exact & Mixed Case)
* **Preconditions:** Cooks exist in Rajkot (`c1`, `c2`) and Ahmedabad (`c3`, `c4`).
* **Test Steps:**
  1. Test `/search?city=rajkot`
  2. Test `/search?city=Rajkot`
  3. Test `/search?city=RAJKOT`
* **Expected Result:**
  * All 3 variations display exactly the 2 cooks located in Rajkot.
  * Results count header reads: "2 Home Cooks Found in Rajkot".

### TC-SEARCH-002: Pure Veg Only Filter Toggle
* **Preconditions:** Both Veg (`c1`, `c3`) and Non-Veg (`c2`, `c4`) cooks exist.
* **Test Steps:**
  1. Navigate to `/search`.
  2. Click "Pure Veg Only" filter button.
* **Expected Result:**
  * Cook cards with `isVeg === false` are filtered out.
  * Every remaining cook card displays the green "Pure Veg" badge.

### TC-SEARCH-003: Cuisine Multi-Filter
* **Test Steps:**
  1. On `/search`, open "Filters" drawer.
  2. Click "Kathiyawadi" / "Gujarati" chip.
* **Expected Result:**
  * Only cooks with `"gujarati"` in their `cuisines` array are displayed.

### TC-SEARCH-004: Plan Duration Filtering (Daily / Weekly / Monthly)
* **Test Steps:**
  1. On `/search`, click "Filters" drawer.
  2. Select "Daily".
* **Expected Result:**
  * Only cooks offering daily trial plans are displayed.
  * Cooks offering only monthly subscriptions are filtered out.

### TC-SEARCH-005: Empty Search Results Handling
* **Test Steps:**
  1. Enter search query: `"XYZNonExistentKitchen999"`.
* **Expected Result:**
  * Renders friendly empty state illustration with message: "No cooks found. Try different filters or a different city."
  * "Clear Filters" button is visible and clicking it resets the search.

---

## 3. Subscription & Checkout Flow

### TC-CHK-001: Complete Weekly Subscription Checkout with Promo Code
* **Preconditions:** Cook `c1` with Weekly Plan (₹749).
* **Test Steps:**
  1. Navigate to `/checkout?cook=c1&plan=p2`.
  2. Verify Subtotal displays ₹749.
  3. Enter coupon code: `FIRSTFEAST` and click "Apply".
  4. Verify Discount displays ₹75 (10% rounded) and Total Amount is ₹674.
  5. Select Payment Method: Cash on Delivery (COD).
  6. Check "18+ Age & Terms Confirmation" checkbox.
  7. Click "Confirm Subscription".
* **Expected Result:**
  * Shows "Subscription Confirmed!" screen with unique Order ID (e.g. `HF-481920`).
  * Order is saved in database and immediately visible in `/cook/dashboard` under "Today's Live Packing Station".
  * Customer receives confirmation details.

### TC-CHK-002: Checkout Terms Validation (Boundary / Negative Test)
* **Test Steps:**
  1. On `/checkout`, fill in all address and phone fields.
  2. Leave the "Terms & Age Confirmation" checkbox unchecked.
  3. Click "Confirm Subscription".
* **Expected Result:**
  * Form does not submit.
  * Inline validation alert appears: "Please confirm that you are 18+ years old and accept our Terms, Privacy, and Refund policies."

### TC-CHK-003: Phone Number Format Validation
* **Test Steps:**
  1. On `/checkout`, enter phone number: `"98765"` (5 digits).
  2. Click "Confirm Subscription".
* **Expected Result:**
  * Validation error: "Phone number must be at least 10 digits."

### TC-CHK-004: Coupon Discount Boundary (Zero Floor Protection)
* **Test Steps:**
  1. Test plan priced at ₹80 with coupon discount of ₹100.
* **Expected Result:**
  * Total amount is clamped at `₹0`, never negative.

---

## 4. Cook Management & Dashboard Operations

### TC-COOK-001: Daily Packing Station Order Status Progression
* **Test Steps:**
  1. Cook opens `/cook/dashboard`.
  2. Locates an order in "Today's Live Packing Station".
  3. Clicks "Mark Prepared" -> Status updates to "PREPARED".
  4. Clicks "Handover to Delivery" -> Status updates to "OUT_FOR_DELIVERY".
  5. Clicks "Mark Delivered" -> Status updates to "DELIVERED".
* **Expected Result:**
  * Status updates sequentially with timestamp.
  * Order moves to completed dispatch archive.

### TC-COOK-002: Cook Earnings & Direct Payouts Calculation
* **Preconditions:** Cook has 3 subscribers paying ₹1,000 each (Gross: ₹3,000).
* **Expected Formula:**
  * Gross Revenue = ₹3,000
  * Platform Commission (10%) = ₹300
  * Net Bank Deposit = ₹2,700
* **Edge Case Test:** Cook has 0 subscribers and 0 orders.
  * Expected Gross Revenue = **₹0** (NOT ₹23,800).
  * Net Bank Deposit = **₹0**.

### TC-COOK-003: 7-Day Rotating Menu Updates
* **Test Steps:**
  1. Cook navigates to "Week-Wise Meal Plan" tab.
  2. Selects "Wednesday Lunch".
  3. Edits Sabzi 1 to "Paneer Tikka Masala".
  4. Clicks "Save Week Plan".
  5. Refreshes the page.
* **Expected Result:**
  * Updated dish name persists after reload.
  * Customer viewing `/cooks/[id]` sees the updated Wednesday menu.

---

## 5. Customer Subscription Management & Support

### TC-CUST-001: Pause Subscription Before 8:00 PM Cutoff
* **Preconditions:** Active subscription exists; current time is 4:00 PM.
* **Test Steps:**
  1. Customer visits `/customer/dashboard` -> "Subscriptions".
  2. Clicks "Pause Tomorrow's Delivery".
* **Expected Result:**
  * Tomorrow's date added to `pausedDates`.
  * Subscription status updates to "PAUSED" for tomorrow.
  * Morning cron excludes this subscriber from tomorrow's dispatch.

### TC-CUST-002: Pause Subscription After 8:00 PM Cutoff (Negative Test)
* **Preconditions:** Current time is 9:30 PM.
* **Test Steps:**
  1. Customer clicks "Pause Tomorrow's Delivery".
* **Expected Result:**
  * Blocked with message: "Cutoff time passed (8:00 PM). Tomorrow's meal is already in prep. You may pause from day after tomorrow."

### TC-CUST-003: Permanent Account Erasure (DPDP Act 2023)
* **Test Steps:**
  1. On `/customer/dashboard`, open "Profile & Privacy" tab.
  2. Click "Request Permanent Account Deletion".
  3. Confirm the browser dialog.
* **Expected Result:**
  * Calls `DELETE /api/v1/auth/delete-account`.
  * Receives confirmation reference (e.g. `DEL-2026-XYZ`) with 30-day purge notice.
