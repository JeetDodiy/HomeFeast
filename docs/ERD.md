# HomeFeast — Entity Relationship Diagram (ERD) & Data Model

## 1. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    CITY ||--o{ USER : "resides in"
    CITY ||--o{ COOK : "operates in"
    USER ||--o| COOK : "manages"
    USER ||--o{ SUBSCRIPTION : "subscribes"
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ COMPLAINT : "files"
    USER ||--o{ NOTIFICATION : "receives"

    COOK ||--o{ MENU_ITEM : "cooks"
    COOK ||--o{ PLAN : "offers"
    COOK ||--o{ COOK_CUISINE : "specializes in"
    CUISINE ||--o{ COOK_CUISINE : "categorizes"
    COOK ||--o{ SUBSCRIPTION : "fulfills"
    COOK ||--o{ ORDER : "dispatches"
    COOK ||--o{ REVIEW : "evaluated by"

    PLAN ||--o{ SUBSCRIPTION : "defines"
    SUBSCRIPTION ||--o{ ORDER : "generates daily"
    ORDER ||--o| REVIEW : "rated on"
    ORDER ||--o{ COMPLAINT : "escalated as"

    USER {
        string id PK
        string name
        string email UK
        string phone UK
        string passwordHash
        enum role "CUSTOMER | COOK | ADMIN"
        string cityId FK
        string address
        boolean isVerified
        boolean isBlocked
    }

    CITY {
        string id PK
        string name UK
        string state
        boolean isActive
    }

    COOK {
        string id PK
        string userId FK,UK
        string kitchenName
        string bio
        string fssaiNo
        string cityId FK
        string area
        boolean isVeg
        enum status "PENDING | APPROVED | REJECTED"
        float ratingAvg
        int totalReviews
    }

    PLAN {
        string id PK
        string cookId FK
        string name
        enum type "DAILY | WEEKLY | MONTHLY"
        float price
        float perMeal
        string description
    }

    SUBSCRIPTION {
        string id PK
        string userId FK
        string cookId FK
        string planId FK
        date startDate
        date endDate
        enum status "PENDING | ACCEPTED | ACTIVE | PAUSED | CANCELLED"
        string deliverySlot
        string deliveryAddress
    }

    ORDER {
        string id PK
        string userId FK
        string cookId FK
        string subscriptionId FK
        float totalAmount
        enum paymentMethod "COD | UPI | CARD"
        date deliveryDate
        string slot
        enum status "PLACED | CONFIRMED | IN_PREPARATION | OUT_FOR_DELIVERY | DELIVERED"
    }

    REVIEW {
        string id PK
        string orderId FK,UK
        string userId FK
        string cookId FK
        int rating
        string comment
    }

    COMPLAINT {
        string id PK
        string orderId FK
        string userId FK
        string subject
        string details
        enum status "OPEN | IN_REVIEW | RESOLVED"
        string adminNote
    }
```

---

## 2. Relational Integrity & Key Indexes

To ensure lightning-fast multi-city queries and maintain sub-3-second page loads as user volume expands:

1. **`cooks (cityId, status)`**:
   - Compounded index used by `/search` and listing pages to retrieve only approved cooks within the selected city.
2. **`subscriptions (userId, status)`**:
   - Used by the Customer Dashboard to load current meal plans in < 5ms.
3. **`orders (cookId, deliveryDate)`**:
   - Used by the Cook Dashboard for today's kitchen packing and dispatch checklists.
4. **`notifications (userId, isRead)`**:
   - Used for the unread alert badge in navigation bars.
