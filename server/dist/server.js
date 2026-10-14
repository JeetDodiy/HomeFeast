"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "HomeFeast REST API", timestamp: new Date().toISOString() });
});
// In-Memory Database for seed and live operations
const CITIES = [
    { id: "rajkot", name: "Rajkot", state: "Gujarat", isActive: true },
    { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", isActive: true },
];
const CUISINES = [
    { id: "cui_1", name: "Gujarati", description: "Authentic Kathiyawadi & Gujarati thali" },
    { id: "cui_2", name: "Punjabi", description: "Rich gravies, paneer, and tandoori phulkas" },
    { id: "cui_3", name: "South Indian", description: "Crisp dosas, idli, sambar, and uttapam" },
    { id: "cui_4", name: "Rajasthani", description: "Dal Baati Churma, Gatte ki Sabzi" },
    { id: "cui_5", name: "Diet / Healthy", description: "Keto, high-protein, low-oil, diabetic-friendly" },
];
const COOKS = [
    {
        id: "c1",
        name: "Meera Patel",
        kitchenName: "Meera's Kitchen",
        city: "Rajkot",
        cityId: "rajkot",
        area: "Race Course",
        isVeg: true,
        rating: 4.8,
        totalReviews: 142,
        startingPrice: 120,
        fssaiNo: "10020042003854",
        status: "APPROVED",
        serviceAreas: ["Race Course", "Kalavad Road", "Yagnik Road", "University Road"],
        deliverySlots: ["Lunch (12–1 PM)", "Dinner (7–8 PM)"],
        isHolidayMode: false,
    },
    {
        id: "c2",
        name: "Priya Shah",
        kitchenName: "Priya's Home Kitchen",
        city: "Rajkot",
        cityId: "rajkot",
        area: "Kalavad Road",
        isVeg: false,
        rating: 4.6,
        totalReviews: 89,
        startingPrice: 130,
        fssaiNo: "10020042003855",
        status: "APPROVED",
        serviceAreas: ["Kalavad Road", "150 Feet Ring Road", "Nana Mava"],
        deliverySlots: ["Lunch (12:30–1:30 PM)", "Dinner (7:30–8:30 PM)"],
        isHolidayMode: false,
    },
    {
        id: "c3",
        name: "Aarti Dave",
        kitchenName: "Aarti's Kathiyawadi Rasoi",
        city: "Rajkot",
        cityId: "rajkot",
        area: "University Road",
        isVeg: true,
        rating: 4.9,
        totalReviews: 210,
        startingPrice: 110,
        fssaiNo: "10020042003856",
        status: "APPROVED",
        serviceAreas: ["University Road", "Indira Circle", "Pushkar Dham"],
        deliverySlots: ["Lunch (11:30 AM–12:30 PM)", "Dinner (7–8 PM)"],
        isHolidayMode: false,
    },
];
const ORDERS = [
    {
        id: "HF-ORD-8821",
        userId: "usr_1",
        cookId: "c1",
        cookName: "Meera's Kitchen",
        planName: "Weekly Plan – Gujarati Thali",
        status: "CONFIRMED",
        deliveryDate: "2024-10-14",
        slot: "Lunch (12–1 PM)",
        totalAmount: 749,
        address: "Flat 402, Royal Residency, Kalavad Road, Rajkot",
        createdAt: "2024-10-14T08:30:00Z",
    },
];
const SUBSCRIPTIONS = [
    {
        id: "sub-1",
        userId: "usr_1",
        cookId: "c1",
        cookName: "Meera's Kitchen",
        planName: "Weekly Plan",
        slot: "Lunch (12–1 PM)",
        status: "ACTIVE",
        startDate: "2024-10-14",
        endDate: "2024-10-21",
        price: 749,
        pausedDates: [],
    },
];
const COMPLAINTS = [
    {
        id: "comp-1",
        orderId: "HF-ORD-8821",
        userId: "usr_1",
        subject: "Delivery Delay",
        details: "Tiffin arrived 40 minutes late.",
        status: "IN_REVIEW",
        createdAt: "2024-10-14",
        adminNote: "Delivery partner contacted.",
    },
];
/* ==========================================================================
   1. AUTHENTICATION ENDPOINTS (/api/v1/auth)
   ========================================================================== */
app.post("/api/v1/auth/register", (req, res) => {
    const { name, email, password, role } = req.body;
    res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
        data: { id: `usr_${Date.now()}`, name, email, role: role || "CUSTOMER", isVerified: false },
    });
});
app.post("/api/v1/auth/login", (req, res) => {
    const { email, role } = req.body;
    res.json({
        success: true,
        message: "Login successful",
        token: `jwt_token_${Date.now()}`,
        user: { id: "usr_1", email, name: "Priya Sharma", role: role || "CUSTOMER" },
    });
});
app.post("/api/v1/auth/forgot-password", (_req, res) => {
    res.json({ success: true, message: "Password reset instructions sent to your email." });
});
app.post("/api/v1/auth/refresh", (_req, res) => {
    res.json({ success: true, token: `refreshed_jwt_${Date.now()}` });
});
app.post("/api/v1/auth/logout", (_req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
});
/* ==========================================================================
   2. PUBLIC COOKS ENDPOINTS (/api/v1/cooks)
   ========================================================================== */
app.get("/api/v1/cooks", (req, res) => {
    const { city, mealType, minPrice, maxPrice, sort } = req.query;
    let results = [...COOKS];
    if (city) {
        results = results.filter((c) => c.city.toLowerCase() === city.toLowerCase());
    }
    if (mealType === "veg") {
        results = results.filter((c) => c.isVeg);
    }
    else if (mealType === "non-veg") {
        results = results.filter((c) => !c.isVeg);
    }
    if (minPrice) {
        results = results.filter((c) => c.startingPrice >= Number(minPrice));
    }
    if (maxPrice) {
        results = results.filter((c) => c.startingPrice <= Number(maxPrice));
    }
    if (sort === "rating") {
        results.sort((a, b) => b.rating - a.rating);
    }
    else if (sort === "price-low") {
        results.sort((a, b) => a.startingPrice - b.startingPrice);
    }
    res.json({ success: true, count: results.length, data: results });
});
app.get("/api/v1/cooks/:id", (req, res) => {
    const cook = COOKS.find((c) => c.id === req.params.id) || COOKS[0];
    res.json({ success: true, data: cook });
});
app.get("/api/v1/cooks/:id/menu", (req, res) => {
    const sampleMenu = [
        { day: "Monday", lunch: "Sev Tameta, Phulka Roti, Dal Fry, Jeera Rice, Chhas", dinner: "Bhindi Masala, Rotli, Kadhi, Khichdi" },
        { day: "Tuesday", lunch: "Ringna no Olo, Bajra no Rotlo, Dal, Rice, Gur", dinner: "Paneer Bhurji, Paratha, Dal Tadka, Rice" },
        { day: "Wednesday", lunch: "Mix Veg Handvo, Green Chutney, Kadhi, Khichdi", dinner: "Aloo Gobi, Roti, Dal Fry, Steamed Rice" },
        { day: "Thursday", lunch: "Undhiyu, Puri, Shrikhand, Dal, Rice", dinner: "Dudhi Chana Dal, Rotli, Khichdi, Kadhi" },
        { day: "Friday", lunch: "Gujarati Dal, Bhaat, Bataka nu Shaak, Rotli, Salad", dinner: "Chole Masala, Bhature, Pulao, Raita" },
        { day: "Saturday", lunch: "Kathiyawadi Thali with 2 Shaak, Rotla, Garlic Chutney", dinner: "Kaju Curry, Butter Naan, Veg Biryani" },
        { day: "Sunday", lunch: "Special Dal Baati Churma with Ghee & Chhas", dinner: "Light Moong Khichdi with Kadhi & Papad" },
    ];
    res.json({ success: true, cookId: req.params.id, data: sampleMenu });
});
app.get("/api/v1/cooks/:id/reviews", (req, res) => {
    const reviews = [
        { id: "rev-1", author: "Rohan M.", rating: 5, date: "2024-10-12", comment: "Authentic ghar ka swad! Fresh phulkas every time." },
        { id: "rev-2", author: "Pooja V.", rating: 5, date: "2024-10-10", comment: "Very hygienic packaging and prompt delivery." },
    ];
    res.json({ success: true, cookId: req.params.id, data: reviews });
});
/* ==========================================================================
   3. COOK DASHBOARD ENDPOINTS (/api/v1/cook)
   ========================================================================== */
app.get("/api/v1/cook/profile", (_req, res) => {
    res.json({ success: true, data: COOKS[0] });
});
app.put("/api/v1/cook/profile", (req, res) => {
    res.json({ success: true, message: "Profile updated successfully", data: req.body });
});
app.get("/api/v1/cook/requests", (_req, res) => {
    res.json({
        success: true,
        data: [
            { id: "req-1", customerName: "Rahul Sharma", plan: "Monthly Plan", slot: "Lunch", startDate: "2024-10-15", address: "Race Course, Rajkot" },
        ],
    });
});
app.patch("/api/v1/cook/requests/:id", (req, res) => {
    const { status, reason } = req.body;
    res.json({ success: true, message: `Request ${status}`, id: req.params.id, reason });
});
app.get("/api/v1/cook/orders", (_req, res) => {
    res.json({ success: true, data: ORDERS });
});
app.get("/api/v1/cook/earnings", (_req, res) => {
    res.json({
        success: true,
        data: {
            todayEarnings: 2150,
            monthlyEarnings: 48900,
            activeSubscribers: 28,
            completedOrdersCount: 420,
        },
    });
});
/* ==========================================================================
   4. SUBSCRIPTIONS & ORDERS ENDPOINTS
   ========================================================================== */
app.get("/api/v1/subscriptions/me", (_req, res) => {
    res.json({ success: true, data: SUBSCRIPTIONS });
});
app.post("/api/v1/subscriptions", (req, res) => {
    const newSub = {
        id: `sub-${Date.now()}`,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        ...req.body,
    };
    SUBSCRIPTIONS.push(newSub);
    res.status(201).json({ success: true, message: "Subscription requested", data: newSub });
});
app.patch("/api/v1/subscriptions/:id", (req, res) => {
    const { action, date } = req.body;
    // Cutoff rule check: if skipping/pausing, must be before 8 PM previous day
    res.json({
        success: true,
        message: `Subscription ${action} successfully. Cutoff verified.`,
        id: req.params.id,
        date,
    });
});
app.get("/api/v1/orders/me", (_req, res) => {
    res.json({ success: true, data: ORDERS });
});
app.post("/api/v1/orders", (req, res) => {
    const newOrder = {
        id: `HF-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "PLACED",
        createdAt: new Date().toISOString(),
        ...req.body,
    };
    ORDERS.push(newOrder);
    res.status(201).json({ success: true, message: "Order placed successfully", data: newOrder });
});
app.patch("/api/v1/orders/:id/status", (req, res) => {
    const { status } = req.body;
    res.json({ success: true, message: `Order status updated to ${status}`, orderId: req.params.id });
});
/* ==========================================================================
   5. CITIES, CUISINES, COMPLAINTS, NOTIFICATIONS
   ========================================================================== */
app.get("/api/v1/cities", (_req, res) => {
    res.json({ success: true, count: CITIES.length, data: CITIES });
});
app.post("/api/v1/admin/cities", (req, res) => {
    const newCity = { id: req.body.name.toLowerCase().replace(/\s+/g, "-"), ...req.body, isActive: true };
    CITIES.push(newCity);
    res.status(201).json({ success: true, message: "City onboarded successfully", data: newCity });
});
app.get("/api/v1/admin/cuisines", (_req, res) => {
    res.json({ success: true, count: CUISINES.length, data: CUISINES });
});
app.post("/api/v1/admin/cuisines", (req, res) => {
    const newCuisine = { id: `cui_${Date.now()}`, ...req.body };
    CUISINES.push(newCuisine);
    res.status(201).json({ success: true, message: "Cuisine added", data: newCuisine });
});
app.get("/api/v1/complaints/me", (_req, res) => {
    res.json({ success: true, data: COMPLAINTS });
});
app.post("/api/v1/complaints", (req, res) => {
    const newComp = { id: `comp-${Date.now()}`, status: "OPEN", createdAt: new Date().toISOString(), ...req.body };
    COMPLAINTS.push(newComp);
    res.status(201).json({ success: true, message: "Complaint submitted", data: newComp });
});
app.get("/api/v1/notifications", (_req, res) => {
    res.json({
        success: true,
        data: [
            { id: "n1", type: "ORDER_CONFIRMED", message: "Your lunch tiffin order with Meera's Kitchen is confirmed.", isRead: false },
            { id: "n2", type: "DAILY_REMINDER", message: "Reminder: Pause or skip tomorrow's lunch before 8:00 PM today.", isRead: true },
        ],
    });
});
/* ==========================================================================
   6. ADMIN MANAGEMENT & KPIS (/api/v1/admin)
   ========================================================================== */
app.get("/api/v1/admin/users", (_req, res) => {
    res.json({
        success: true,
        data: [
            { id: "usr_1", name: "Priya Sharma", email: "priya@example.com", role: "CUSTOMER", isBlocked: false, city: "Rajkot" },
            { id: "usr_2", name: "Meera Patel", email: "meera@example.com", role: "COOK", isBlocked: false, city: "Rajkot" },
            { id: "usr_3", name: "Admin Officer", email: "admin@homefeast.in", role: "ADMIN", isBlocked: false, city: "Ahmedabad" },
        ],
    });
});
app.patch("/api/v1/admin/users/:id/block", (req, res) => {
    const { isBlocked } = req.body;
    res.json({ success: true, message: `User status changed to ${isBlocked ? "BLOCKED" : "ACTIVE"}` });
});
app.get("/api/v1/admin/cooks/pending", (_req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: "c_pending_1",
                name: "Geeta Ben",
                kitchenName: "Geeta's Satvik Rasoi",
                city: "Rajkot",
                fssaiNo: "10020042003899",
                status: "PENDING",
                submittedAt: "2024-10-14",
            },
        ],
    });
});
app.patch("/api/v1/admin/cooks/:id/approve", (req, res) => {
    const { status, reason } = req.body;
    res.json({ success: true, message: `Cook registration ${status}`, id: req.params.id, reason });
});
app.get("/api/v1/admin/kpis", (_req, res) => {
    res.json({
        success: true,
        data: {
            registeredUsers: 1248,
            monthlyActiveUsers: 842,
            activeSubscriptions: 342,
            orderConversionRate: 18.4,
            cookOnboardingRate: 78.5,
            customerRetentionRate: 86.2,
            totalRevenue: 284500,
        },
    });
});
app.listen(PORT, () => {
    console.log(`🚀 HomeFeast Express Backend REST API running on http://localhost:${PORT}`);
});
exports.default = app;
