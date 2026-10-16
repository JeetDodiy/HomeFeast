# HomeFeast Field-by-Field Validation Audit Report
**Scope:** All User-Facing Forms, Backend API Request Handlers & Database Constraints  
**Audit Standard:** Strict Data Integrity, Type Safety, Boundary Conditions & Injection Protection  

---

## 1. Customer & Cook Registration Form (`/auth/register`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend API Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `name` | string | Yes | Min 2, max 100 chars, letters & spaces | HTML input `required` | In `lib/validators.ts`: `min(2)`. API route does not execute validator. | **High:** Connect `RegisterSchema.safeParse` in `app/api/v1/auth/route.ts`. |
| `email` | string | Yes | Valid RFC 5322 email format | HTML5 `type="email"` | In `lib/validators.ts`: `email()`. Direct POST bypasses check. | **Medium:** Add lowercase trimming & uniqueness check. |
| `phone` | string | Yes | 10-digit Indian mobile format (`^[6-9]\d{9}$`) | HTML5 `type="tel"` | In `lib/validators.ts`: `min(10)`. No regex for Indian mobile format. | **High:** Update validator to `regex(/^[6-9]\d{9}$/)`. |
| `password` | string | Yes | Min 8 chars, 1 uppercase, 1 digit, 1 symbol | Visual strength meter; matches confirm password | `min(8)` in Zod; no complexity rules enforced on backend. | **Medium:** Enforce minimum complexity on server before hashing. |
| `ageConsent` | boolean | Yes | Must be checked (`true`) | JavaScript `if (!ageConsent) alert(...)` | Not checked on backend. | **Medium:** Reject registration payload if `ageConsent !== true`. |
| `role` | enum | Yes | `"CUSTOMER"` \| `"COOK"` | Toggle button | Accepts any string in payload. | **High:** Enforce enum validation; reject `"ADMIN"` self-registration. |

---

## 2. Subscription Checkout Form (`/checkout`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `fullName` | string | Yes | Min 2 characters, no special symbols | Prefilled from state; input field | Missing backend validation | **Medium:** Add sanitization to prevent stored XSS. |
| `phone` | string | Yes | Exactly 10 digits (`^[6-9]\d{9}$`) | Input field; accepts any characters | Missing backend validation | **High:** Add input mask `[6-9][0-9]{9}` and backend regex check. |
| `email` | string | Yes | Valid email address | HTML input field | Missing backend validation | **Low:** Validate email format before dispatching confirmation. |
| `address` | string | Yes | Min 10, max 250 characters | Textarea; min 5 chars in Zod | Missing backend validation | **Medium:** Enforce minimum 10 chars to ensure deliverable address. |
| `pincode` | string | Yes | Exactly 6 numeric digits (`^\d{6}$`) | Text input; accepts any string | Missing backend validation | **High:** Add `pattern="[0-9]{6}"` and verify against active city pincodes. |
| `mealSlot` | enum | Yes | `"LUNCH"` \| `"DINNER"` \| `"BOTH"` | Radio selector | Missing backend validation | **Medium:** Enforce enum values in order generation. |
| `termsAgreed`| boolean | Yes | Must be `true` | Checked via React state | Missing backend validation | **Medium:** Enforce legal contract acceptance flag in database order record. |

---

## 3. Cook Onboarding Form (`/cook/register`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `kitchenName` | string | Yes | Min 3, max 80 characters | HTML input | In `validators.ts`: `min(3)`. Not enforced in API handler. | **Medium:** Enforce uniqueness per city to avoid brand collision. |
| `fssaiNo` | string | Yes | Exactly 14 numeric digits (`^\d{14}$`) | Text input; no pattern | In `validators.ts`: `regex(/^[0-9]{14}$/)`. Direct POST accepts any string. | **High:** Enforce 14-digit FSSAI regex on both frontend and backend. |
| `city` | string | Yes | Must match active hub (Rajkot / Ahmedabad) | Select dropdown | Missing backend validation | **Medium:** Validate `cityId` against `City` database table. |
| `cuisines` | array | Yes | Array of cuisine IDs, min length 1 | Checkbox chips; min 1 check | In `validators.ts`: `min(1)`. API does not validate. | **Low:** Enforce array type and foreign keys in database. |
| `capacity` | string | Yes | Number of meals/day (min 5, max 500) | Dropdown selector | Stored as arbitrary text | **Low:** Standardize as integer `maxDailyCapacity`. |

---

## 4. Cook Menu Item Creation Form (`/cook/dashboard`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `dishName` | string | Yes | Min 2, max 100 characters | HTML input | Stored in `localStorage` | **Low:** Sanitize input against script tags. |
| `price` | number | Yes | Positive integer (> 0, <= 1000) | `type="number"`, `min="1"` | Stored in `localStorage` | **Medium:** Validate price > 0 on server to prevent free dish exploits. |
| `category` | enum | Yes | Sabzi, Dal, Roti, Rice, Sweet | Select dropdown | Stored in `localStorage` | **Low:** Enforce valid category taxonomy. |
| `mealTime` | enum | Yes | Lunch, Dinner, Both | Select dropdown | Stored in `localStorage` | **Low:** None. |

---

## 5. Review & Rating Submission (`/api/v1/reviews`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `rating` | integer | Yes | Integer between 1 and 5 | Star selector (1–5) | In `validators.ts`: `int().min(1).max(5)`. Route accepts any number. | **High:** Enforce integer 1–5 on `/api/v1/reviews` POST. |
| `comment` | string | Yes | Min 5, max 500 characters | Textarea | In `validators.ts`: `min(5)`. Route accepts empty comments. | **Medium:** Block empty or whitespace-only reviews. |
| `cookId` | string | Yes | Must reference valid existing Cook | Passed from state | No foreign key validation | **High:** Check cook existence in database before creating review. |

---

## 6. Support Ticket & Contact Inquiry (`/contact` & `/api/v1/contact`)

| Field Name | Type | Required | Expected Rules | Frontend Implementation | Backend Implementation | Discrepancies & Recommendations |
|---|---|---|---|---|---|---|
| `name` | string | Yes | Min 2 characters | `required` attribute | Validates non-empty | **Low:** Good. |
| `email` | string | Yes | Valid email address | `required type="email"` | Validates non-empty | **Medium:** Add RFC 5322 regex validation in route handler. |
| `subject` | string | No | Optional string | Input field | Defaults to "General Inquiry" | **Low:** Good. |
| `message` | string | Yes | Min 10, max 2000 characters | `required` textarea | Validates non-empty | **Medium:** Enforce minimum 10 characters to prevent spam tickets. |
