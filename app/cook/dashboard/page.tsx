"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, UtensilsCrossed, Calendar, DollarSign, Clock,
  Bell, Settings, LogOut, Plus, Edit2, Trash2, CheckCircle,
  XCircle, TrendingUp, Package, Users, ShieldCheck, ArrowRight,
  Check, Phone, MessageSquare, MapPin, Store, AlertCircle,
  RefreshCw, ChefHat, Search, ExternalLink, Pause, Play, Sparkles,
  Camera, Upload, Image as ImageIcon
} from "lucide-react";
import EarningsChart from "@/components/EarningsChart";

// Navigation sidebar items
const COOK_SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Shop & Kitchen Profile", icon: Store },
  { key: "menu", label: "Menu Manager", icon: UtensilsCrossed },
  { key: "weekly", label: "Week-Wise Meal Plan", icon: Calendar },
  { key: "plans", label: "Plans & Pricing", icon: DollarSign },
  { key: "subscribers", label: "Subscribers", icon: Users },
  { key: "orders", label: "Today's Dispatch", icon: Package },
  { key: "earnings", label: "Earnings & Payouts", icon: TrendingUp },
];

interface CookProfile {
  shopName: string;
  headCook: string;
  phone: string;
  email: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  fssaiNumber: string;
  fssaiVerified: boolean;
  city: string;
  address: string;
  serviceAreas: string[];
  deliveryRadiusKm: number;
  isOpen: boolean;
  lunchSlot: string;
  dinnerSlot: string;
  pureVeg: boolean;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  bankHolder: string;
  status?: string;
}

// Clean structure for newly registered home kitchens
const EMPTY_PROFILE: CookProfile = {
  shopName: "",
  headCook: "",
  phone: "",
  email: "",
  bio: "",
  avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  fssaiNumber: "",
  fssaiVerified: false,
  city: "Rajkot",
  address: "",
  serviceAreas: ["Race Course", "Kalavad Road", "Mavdi", "150ft Ring Road", "University Road"],
  deliveryRadiusKm: 5,
  isOpen: true,
  lunchSlot: "12:00 PM – 01:30 PM",
  dinnerSlot: "07:30 PM – 09:00 PM",
  pureVeg: true,
  bankName: "",
  bankAccount: "",
  bankIfsc: "",
  bankHolder: "",
  status: "approved",
};

// Default initial data structures for demo purposes
const DEFAULT_PROFILE: CookProfile = {
  shopName: "Meenaben's Kitchen",
  headCook: "Meenaben Patel",
  phone: "+91 98250 12345",
  email: "demo@cook.com",
  bio: "Authentic Gujarati & Kathiyawadi homemade meals made with fresh ingredients, pure spices, and traditional recipes delivered daily.",
  avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  fssaiNumber: "10020042003854",
  fssaiVerified: true,
  city: "Rajkot",
  address: "Race Course Road, Rajkot",
  serviceAreas: ["Race Course", "Kalavad Road", "Mavdi", "150ft Ring Road", "University Road"],
  deliveryRadiusKm: 5,
  isOpen: true,
  lunchSlot: "12:00 PM – 01:30 PM",
  dinnerSlot: "07:30 PM – 09:00 PM",
  pureVeg: true,
  bankName: "State Bank of India",
  bankAccount: "•••• •••• 4892",
  bankIfsc: "SBIN0001234",
  bankHolder: "Meenaben Patel",
  status: "approved",
};

const DEFAULT_MENU = [
  { id: "m1", name: "Ringan No Olo (Kathiyawadi)", category: "Main Sabzi", type: "veg", price: 55, available: true, mealTime: "Dinner", desc: "Smoked roasted eggplant mashed with spring garlic, green chilies, and cold-pressed oil" },
  { id: "m2", name: "Sev Tameta Nu Shaak", category: "Main Sabzi", type: "veg", price: 45, available: true, mealTime: "Both", desc: "Traditional sweet-tangy tomato gravy topped with crisp Ratlami sev" },
  { id: "m3", name: "Gujarati Sweet-Sour Kadhi", category: "Dal & Kadhi", type: "veg", price: 35, available: true, mealTime: "Both", desc: "Spiced buttermilk tempered with curry leaves, mustard seeds, and jaggery" },
  { id: "m4", name: "Dal Fry (Tadka)", category: "Dal & Kadhi", type: "veg", price: 40, available: true, mealTime: "Lunch", desc: "Slow-cooked toor dal tempered with desi cow ghee, cumin, and whole red chilies" },
  { id: "m5", name: "Phulka Roti with Ghee (4 Pcs)", category: "Roti & Breads", type: "veg", price: 25, available: true, mealTime: "Both", desc: "Puffed whole wheat phulkas brushed with pure A2 Desi cow ghee" },
  { id: "m6", name: "Bajra No Rotlo with Butter", category: "Roti & Breads", type: "veg", price: 30, available: true, mealTime: "Dinner", desc: "Clay tawa roasted pearl millet flatbread served with fresh white homemade makhan" },
  { id: "m7", name: "Vaghareli Khichdi", category: "Rice & Khichdi", type: "veg", price: 50, available: true, mealTime: "Dinner", desc: "Nutritious rice and yellow moong dal tempered with garlic, peanuts, and dry spices" },
  { id: "m8", name: "Steamed Basmati Rice", category: "Rice & Khichdi", type: "veg", price: 30, available: true, mealTime: "Lunch", desc: "Fluffy aged basmati rice cooked to perfection" },
  { id: "m9", name: "Moong Dal Halwa", category: "Dessert / Sweet", type: "veg", price: 60, available: true, mealTime: "Lunch", desc: "Rich golden roasted yellow lentils cooked in ghee, cardamom, and almond slivers" },
];

const DEFAULT_WEEKLY_PLAN = [
  {
    day: "Monday",
    lunch: { sabzi1: "Sev Tameta Nu Shaak", sabzi2: "Bhindi Masala", dalKadhi: "Gujarati Kadhi", bread: "4x Phulka Rotis", rice: "Jeera Rice", sweetOrSide: "Roasted Papad & Kachumber" },
    dinner: { mainDish: "Kathiyawadi Ringan No Olo", bread: "2x Bajra No Rotlo with Makhan", dalKadhi: "Desi Kadhi", rice: "Vaghareli Khichdi", side: "Gud & Fresh Garlic Chutney" }
  },
  {
    day: "Tuesday",
    lunch: { sabzi1: "Paneer Butter Masala", sabzi2: "Aloo Palak", dalKadhi: "Dal Fry Tadka", bread: "4x Phulka Rotis", rice: "Steamed Rice", sweetOrSide: "Moong Dal Halwa" },
    dinner: { mainDish: "Mix Kathol (Sprouted Beans)", bread: "4x Gujarati Bhakri", dalKadhi: "Kadhi", rice: "Plain Khichdi", side: "Onion Salad & Green Chutney" }
  },
  {
    day: "Wednesday",
    lunch: { sabzi1: "Surti Undhiyu", sabzi2: "Dudhi Chana Dal", dalKadhi: "Gujarati Sweet Kadhi", bread: "4x Methi Puri / Phulkas", rice: "Vegetable Pulao", sweetOrSide: "Jalebi (2 pcs)" },
    dinner: { mainDish: "Lasaniya Batata (Garlic Potatoes)", bread: "2x Rotlo with White Butter", dalKadhi: "Chhach (Buttermilk)", rice: "Vaghareli Khichdi", side: "Karela Nu Sambharo" }
  },
  {
    day: "Thursday",
    lunch: { sabzi1: "Gatta Nu Shaak (Besan Dumplings)", sabzi2: "Aloo Gobi Matar", dalKadhi: "Toor Dal Fry", bread: "4x Phulka Rotis", rice: "Steamed Rice", sweetOrSide: "Buttermilk & Papad" },
    dinner: { mainDish: "Methi Thepla (4 pcs)", bread: "Batata Nu Shaak (Sukhi Bhaji)", dalKadhi: "Sweet-Sour Kadhi", rice: "Jeera Rice", side: "Gor-Keri Achar" }
  },
  {
    day: "Friday",
    lunch: { sabzi1: "Rajma Masala", sabzi2: "Cabbage Sambharo", dalKadhi: "Kadhi", bread: "4x Phulka Rotis", rice: "Jeera Rice", sweetOrSide: "Gulab Jamun (1 pc)" },
    dinner: { mainDish: "Dal Dhokli Kathiyawadi Style", bread: "Ghee Phulkas", dalKadhi: "Steamed Rice", rice: "Masala Khichdi", side: "Raw Mango Chutney" }
  },
  {
    day: "Saturday",
    lunch: { sabzi1: "Chole Masala", sabzi2: "Mix Veg Handvo Slice", dalKadhi: "Dal Fry", bread: "4x Bhature / Phulkas", rice: "Peas Pulao", sweetOrSide: "Sweet Lassi / Shrikhand" },
    dinner: { mainDish: "Sev Usal / Ragda", bread: "Pav / Rotis", dalKadhi: "Kadhi", rice: "Vaghareli Khichdi", side: "Fried Green Chilies" }
  },
  {
    day: "Sunday",
    lunch: { sabzi1: "Royal Gujarati Thali (Kaju Karela + Paneer)", sabzi2: "Sukha Aloo", dalKadhi: "Special Dal", bread: "Puri & Phulkas", rice: "Kaju Pulao", sweetOrSide: "Basundi with Dry Fruits" },
    dinner: { mainDish: "Light Evening Khichdi Kadhi Special", bread: "Phulkas", dalKadhi: "Tempered Kadhi", rice: "Khichdi", side: "Papad, Chutney & Buttermilk" }
  }
];

const DEFAULT_PLANS = [
  {
    id: "p1",
    name: "Daily Homestyle Plan",
    type: "daily",
    badge: "Flexible Daily",
    price: 120,
    billingCycle: "per meal",
    mealsIncluded: 1,
    description: "Fresh homemade tiffin every day with Sabzi, Dal, Roti & Rice.",
    includes: ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"],
    specialItem: "Sev Tameta Nu Shaak",
    pauseAllowedDays: 0,
    deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
    popular: false,
    active: true,
  },
  {
    id: "p2",
    name: "Weekly Saver Plan",
    type: "weekly",
    badge: "Most Popular Choice",
    price: 749,
    billingCycle: "7 days",
    mealsIncluded: 7,
    description: "7-day rotating wholesome plan with Sunday dessert special.",
    includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
    specialItem: "Ringan No Olo with Bajra Rotlo",
    pauseAllowedDays: 1,
    deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
    popular: true,
    active: true,
  },
  {
    id: "p3",
    name: "Monthly Royal Plan",
    type: "monthly",
    badge: "Best Value",
    price: 2799,
    billingCycle: "30 days",
    mealsIncluded: 30,
    description: "30-day complete meal plan with 5 flexible pause days.",
    includes: ["Full Royal Thali", "5 Flexible Pause Days", "Sunday Desserts"],
    specialItem: "Royal Undhiyu & Shrikhand",
    pauseAllowedDays: 5,
    deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)", "Both Lunch & Dinner"],
    popular: false,
    active: true,
  },
];

// Helper to deduplicate orders by ID or customer+slot+plan
function deduplicateOrders(items: any[]) {
  const seenIds = new Set<string>();
  const seenCustomerSlots = new Set<string>();
  const uniqueOrders: any[] = [];
  for (const o of items) {
    if (!o) continue;
    const idKey = String(o.id || "");
    const custKey = `${(o.customer || o.customerName || "").toLowerCase().trim()}_${(o.slot || "").toLowerCase().trim()}_${(o.plan || o.planName || "").toLowerCase().trim()}`;
    if ((idKey && seenIds.has(idKey)) || (custKey && seenCustomerSlots.has(custKey))) {
      continue;
    }
    if (idKey) seenIds.add(idKey);
    if (custKey) seenCustomerSlots.add(custKey);
    uniqueOrders.push(o);
  }
  return uniqueOrders;
}

export default function CookDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // State initialized with empty arrays / empty profile so new accounts never show fake data
  const [profile, setProfile] = useState<CookProfile>(EMPTY_PROFILE);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>(DEFAULT_WEEKLY_PLAN);
  const [plans, setPlans] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UI state
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [menuFilterCategory, setMenuFilterCategory] = useState("All");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<any | null>(null);
  const [newDish, setNewDish] = useState({
    name: "", category: "Main Sabzi", type: "veg", price: 50, mealTime: "Both", desc: ""
  });

  // Edit Day Plan Modal
  const [showEditDayModal, setShowEditDayModal] = useState(false);
  const [dayToEdit, setDayToEdit] = useState<any | null>(null);

  // Edit Plan Modal
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  // Add Plan Modal
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    type: "weekly",
    badge: "Most Popular Choice",
    price: 749,
    billingCycle: "7 days",
    mealsIncluded: 7,
    description: "7-day wholesome rotating meal plan with Sunday special.",
    includesText: "Daily variety thali, Dal/Kadhi, Fresh Rotis, Rice, Sunday Dessert",
    includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
    specialItem: "Sev Tameta Nu Shaak",
    popular: false,
    pauseAllowedDays: 1,
    deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
    active: true,
  });

  // Add Subscriber Modal
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    name: "", phone: "", plan: "Weekly Saver Plan (7 Days)", slot: "Lunch (12–1:30 PM)", address: "", dietPreference: "Pure Veg, less spicy"
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const userScopedKey = (currentUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");

  // Load state from localStorage on client mount
  useEffect(() => {
    setMounted(true);

    // Read ?tab= from URL query if present
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && COOK_SIDEBAR.some(s => s.key === tabParam)) {
        setActiveTab(tabParam);
      }

      // Check current user from login
      let activeUser: any = null;
      try {
        const storedUser = localStorage.getItem("hf_user");
        if (storedUser) {
          activeUser = JSON.parse(storedUser);
          setCurrentUser(activeUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }

      const isDemoAccount = activeUser?.email === "demo@cook.com";
      const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");
      
      // Clean and resolve chef and kitchen names dynamically
      let cookChefName = (activeUser?.name || "Home Cook").trim();
      cookChefName = cookChefName.replace(/['’]s['’]s/gi, "'s").replace(/['’]s$/i, "");
      if (isDemoAccount && (!cookChefName || cookChefName === "Home Cook" || cookChefName.toLowerCase().includes("jeet"))) {
        cookChefName = "Meenaben Patel";
      }

      let cookKitchenName = activeUser?.kitchenName ? activeUser.kitchenName.replace(/['’]s['’]s/gi, "'s") : `${cookChefName}'s Kitchen`;
      if (isDemoAccount) {
        cookKitchenName = "Meenaben's Kitchen";
        cookChefName = "Meenaben Patel";
      }

      // Load Profile strictly scoped to the authenticated cook
      try {
        const scopedProfile = userCleanKey ? localStorage.getItem(`hf_cook_profile_${userCleanKey}`) : null;
        let profileObj: any = null;
        if (scopedProfile) {
          profileObj = JSON.parse(scopedProfile);
        } else if (isDemoAccount) {
          const globalProfile = localStorage.getItem("hf_cook_profile");
          if (globalProfile) profileObj = JSON.parse(globalProfile);
        }

        if (!profileObj) {
          if (isDemoAccount) {
            profileObj = { ...DEFAULT_PROFILE };
          } else {
            const cleanPhone = (activeUser?.phone || "").replace(/\D/g, "").slice(0, 10);
            profileObj = {
              ...EMPTY_PROFILE,
              headCook: cookChefName,
              shopName: cookKitchenName,
              phone: cleanPhone,
              email: activeUser?.email || "",
              bio: `Fresh homemade meals cooked with passion and hygiene by Chef ${cookChefName}. Serving daily tiffins across ${activeUser?.city || "Rajkot"}.`,
              city: activeUser?.city || "Rajkot",
              address: activeUser?.address || "",
              fssaiNumber: activeUser?.fssaiNo || "",
              fssaiVerified: false,
              bankHolder: cookChefName,
              bankName: "",
              bankAccount: "",
              bankIfsc: "",
              status: "approved",
            };
          }
        }

        // Clean out any stale fake bank info or rakesh junjunwala mentions for non-demo users
        if (!isDemoAccount) {
          if (profileObj.bankAccount?.includes("4892") || profileObj.bankAccount?.includes("7899") || profileObj.bankIfsc === "SBIN0001234") {
            profileObj.bankName = "";
            profileObj.bankAccount = "";
            profileObj.bankIfsc = "";
          }
          if (profileObj.bio?.toLowerCase().includes("junjunwala") || profileObj.bio?.toLowerCase().includes("rakesh")) {
            profileObj.bio = `Fresh homemade meals cooked with passion and hygiene by Chef ${cookChefName}. Serving daily tiffins across ${activeUser?.city || "Rajkot"}.`;
          }
          if (profileObj.headCook?.toLowerCase().includes("meenaben") || profileObj.shopName?.toLowerCase().includes("meenaben")) {
            profileObj.headCook = cookChefName;
            profileObj.shopName = cookKitchenName;
          }
        }

        setProfile(profileObj);
        if (userCleanKey) {
          localStorage.setItem(`hf_cook_profile_${userCleanKey}`, JSON.stringify(profileObj));
        }
        if (isDemoAccount) {
          localStorage.setItem("hf_cook_profile", JSON.stringify(profileObj));
        }
      } catch {}

      // Sync verified profile and approval status from live PostgreSQL backend
      fetch("/api/v1/cooks?status=all")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const matched = data.data.find(
              (c: any) =>
                (activeUser?.email && (c.email === activeUser.email || c.userId === activeUser.id)) ||
                (activeUser?.name && (c.name?.toLowerCase() === activeUser.name.toLowerCase() || c.kitchenName?.toLowerCase() === cookKitchenName.toLowerCase())) ||
                (isDemoAccount && c.kitchenName?.toLowerCase().includes("meenaben")) ||
                (activeUser?.email === "jeet@homefeast.in" && c.kitchenName?.toLowerCase().includes("jeet"))
            );
            if (matched) {
              const matchedStatus = (matched.status || "pending").toLowerCase();
              setProfile((prev) => {
                const synced = {
                  ...prev,
                  shopName: matched.kitchenName || prev.shopName,
                  headCook: matched.name || prev.headCook,
                  fssaiNumber: matched.fssaiNo || prev.fssaiNumber,
                  city: matched.city || prev.city,
                  serviceAreas: matched.serviceAreas || prev.serviceAreas,
                  status: matchedStatus,
                  fssaiVerified: matchedStatus === "approved",
                  isOpen: matchedStatus === "approved" ? (prev.isOpen ?? true) : false,
                };
                if (userCleanKey) localStorage.setItem(`hf_cook_profile_${userCleanKey}`, JSON.stringify(synced));
                if (isDemoAccount) localStorage.setItem("hf_cook_profile", JSON.stringify(synced));
                return synced;
              });
            }
          }
        })
        .catch(() => {});

      // Load Menu scoped strictly to this authenticated cook
      try {
        const scopedMenu = userCleanKey ? localStorage.getItem(`hf_cook_menu_${userCleanKey}`) : null;
        if (scopedMenu) {
          setMenuItems(JSON.parse(scopedMenu));
        } else if (isDemoAccount) {
          const globalMenu = localStorage.getItem("hf_cook_menu");
          setMenuItems(globalMenu ? JSON.parse(globalMenu) : DEFAULT_MENU);
        } else {
          setMenuItems([]);
        }
      } catch {
        setMenuItems([]);
      }

      // Load Weekly Plan scoped strictly to this authenticated cook
      try {
        const scopedWeekly = userCleanKey ? localStorage.getItem(`hf_cook_weekly_menu_${userCleanKey}`) : null;
        if (scopedWeekly) {
          setWeeklyPlan(JSON.parse(scopedWeekly));
        } else if (isDemoAccount) {
          const globalWeekly = localStorage.getItem("hf_cook_weekly_menu");
          if (globalWeekly) setWeeklyPlan(JSON.parse(globalWeekly));
        } else {
          setWeeklyPlan(DEFAULT_WEEKLY_PLAN);
        }
      } catch {}

      // Load Plans scoped strictly to this authenticated cook
      try {
        const scopedPlans = userCleanKey ? localStorage.getItem(`hf_cook_plans_${userCleanKey}`) : null;
        if (scopedPlans) {
          setPlans(JSON.parse(scopedPlans));
        } else if (isDemoAccount) {
          const globalPlans = localStorage.getItem("hf_cook_plans");
          setPlans(globalPlans ? JSON.parse(globalPlans) : DEFAULT_PLANS);
        } else {
          setPlans([]);
        }
      } catch {
        setPlans([]);
      }

      // Load Subscribers scoped strictly to this authenticated cook
      try {
        const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");
        const scopedSubsData = userCleanKey ? localStorage.getItem(`hf_cook_subscribers_${userCleanKey}`) : null;
        const storedSubscribers = scopedSubsData || (isDemoAccount ? localStorage.getItem("hf_cook_subscribers") : null);

        if (storedSubscribers) {
          const parsedSubs = JSON.parse(storedSubscribers);
          const seenSubKeys = new Set<string>();
          const dedupedSubs = parsedSubs.filter((s: any) => {
            const key = `${s.name}_${s.phone}_${s.plan}`.toLowerCase();
            if (seenSubKeys.has(key)) return false;
            seenSubKeys.add(key);
            return true;
          });
          setSubscribers(dedupedSubs);
        } else {
          setSubscribers([]);
        }
      } catch {
        setSubscribers([]);
      }

      // Load Orders scoped strictly to this authenticated cook
      try {
        const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");
        const scopedOrdersData = userCleanKey ? localStorage.getItem(`hf_cook_orders_${userCleanKey}`) : null;
        const storedOrders = scopedOrdersData || (isDemoAccount ? localStorage.getItem("hf_cook_orders") : null);

        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          const dedupedOrders = deduplicateOrders(parsedOrders);
          setOrders(dedupedOrders);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }

      // Live Backend API Query: Connect orders strictly for this specific cook
      const queryParams = new URLSearchParams();
      if (activeUser?.id) queryParams.set("cookId", activeUser.id);
      if (activeUser?.email) queryParams.set("email", activeUser.email);
      queryParams.set("kitchen", cookKitchenName);

      fetch(`/api/v1/orders?${queryParams.toString()}`)
        .then((res) => res.json())
        .then((orderData) => {
          if (orderData.success && Array.isArray(orderData.data)) {
            const formatted = orderData.data.map((o: any) => ({
              id: o.id,
              customer: o.customer || o.customerName || "Customer",
              phone: o.phone || "+91 98251 00000",
              plan: o.plan || o.planName || "Weekly Saver Plan",
              slot: o.slot || o.mealSlot || "Lunch (12:00 PM – 01:30 PM)",
              address: o.address || o.deliveryAddress || "Home delivery",
              status: o.status || "CONFIRMED",
              packedItems: o.packedItems || { sabzi: false, rotis: false, dal: false, rice: false },
              items: o.items && o.items.length > 0 ? o.items : ["Daily Gujarati Thali", "Phulka Roti", "Dal/Kadhi", "Sabzi", "Rice"],
            }));
            const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");
            if (isDemoAccount) {
              setOrders((prev) => {
                const merged = deduplicateOrders([...formatted, ...prev]);
                if (typeof window !== "undefined") localStorage.setItem("hf_cook_orders", JSON.stringify(merged));
                return merged;
              });
            } else {
              setOrders(formatted);
              if (typeof window !== "undefined" && userCleanKey) {
                localStorage.setItem(`hf_cook_orders_${userCleanKey}`, JSON.stringify(formatted));
              }
            }
          }
        })
        .catch(() => {});

      const subParams = new URLSearchParams();
      if (activeUser?.id) subParams.set("cookId", activeUser.id);
      if (activeUser?.email) subParams.set("email", activeUser.email);
      subParams.set("kitchen", cookKitchenName);

      fetch(`/api/v1/subscriptions?${subParams.toString()}`)
        .then((res) => res.json())
        .then((subJson) => {
          if (subJson.success && Array.isArray(subJson.data) && subJson.data.length > 0) {
            const formattedSubs = subJson.data.map((s: any) => ({
              id: s.id,
              name: s.name || s.customerName || "Customer",
              phone: s.phone || "",
              plan: s.plan || s.planName || "Weekly Saver Plan (7 Days)",
              slot: s.slot || "Lunch (12:00 PM – 01:30 PM)",
              address: s.address || s.deliveryAddress || "Home delivery",
              startDate: s.startDate || "2026-10-14",
              remainingMeals: s.remainingMeals ?? s.totalMeals ?? 7,
              totalMeals: s.totalMeals ?? 7,
              dietPreference: s.dietPreference || "Standard pure veg",
              status: s.status || "ACTIVE",
            }));
            const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");
            if (isDemoAccount) {
              setSubscribers((prev) => {
                const prevIds = new Set(prev.map((p) => p.id));
                const merged = [...prev, ...formattedSubs.filter((f: any) => !prevIds.has(f.id))];
                if (typeof window !== "undefined") localStorage.setItem("hf_cook_subscribers", JSON.stringify(merged));
                return merged;
              });
            } else {
              setSubscribers(formattedSubs);
              if (typeof window !== "undefined" && userCleanKey) {
                localStorage.setItem(`hf_cook_subscribers_${userCleanKey}`, JSON.stringify(formattedSubs));
              }
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Photo Presets for quick selection
  const PRESET_AVATARS = [
    { label: "👩‍🍳 Gujarati Rasoi", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80" },
    { label: "🍲 Maa Ki Rasoi", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
    { label: "👨‍🍳 Master Chef", url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80" },
    { label: "🥘 Kathiyawadi Special", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&q=80" },
  ];

  const PRESET_COVERS = [
    { label: "🍛 Royal Gujarati Thali", url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80" },
    { label: "🏡 Warm Desi Kitchen", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80" },
    { label: "🫓 Fresh Tawa Rotis", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=80" },
    { label: "🍱 Fresh Tiffin Spread", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80" },
  ];

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Please choose an image under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        showToast("Kitchen avatar photo updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast("Please choose a cover banner image under 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile(prev => ({ ...prev, coverImage: reader.result as string }));
        showToast("Kitchen cover banner updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const syncPlansToBackend = (updatedPlans: any[]) => {
    if (typeof window === "undefined") return;
    try {
      const cookId = `c_${(profile.headCook || "cook").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const existingRegistered = JSON.parse(localStorage.getItem("hf_registered_cooks") || "[]");
      const matchedIdx = existingRegistered.findIndex((c: any) => c.id === cookId || c.kitchenName?.toLowerCase() === profile.shopName?.toLowerCase());

      const formattedPlans = updatedPlans.map((p, idx) => {
        const typeLower = (p.type || (p.billingCycle?.toLowerCase().includes("month") ? "monthly" : p.billingCycle?.toLowerCase().includes("week") ? "weekly" : "daily")).toLowerCase();
        const cleanIncludes = Array.isArray(p.includes) && p.includes.length > 0
          ? p.includes
          : typeof p.includesText === "string" && p.includesText.trim()
          ? p.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
          : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"];

        return {
          id: p.id || `p_${cookId}_${typeLower}_${idx}`,
          type: typeLower,
          label: p.name || p.label || `${typeLower.toUpperCase()} Plan`,
          name: p.name || p.label || `${typeLower.toUpperCase()} Plan`,
          price: Number(p.price) || 120,
          perMeal: Math.round((Number(p.price) || 120) / Math.max(1, Number(p.mealsIncluded) || (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1))),
          description: p.description || `${p.name} homestyle meal plan`,
          includes: cleanIncludes,
          popular: Boolean(p.popular || (p.badge && p.badge.toLowerCase().includes("popular"))),
          badge: p.badge || (p.popular ? "Most Popular Choice" : ""),
          mealsIncluded: Number(p.mealsIncluded) || (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1),
          billingCycle: p.billingCycle || (typeLower === "monthly" ? "30 days" : typeLower === "weekly" ? "7 days" : "per meal"),
          pauseAllowedDays: Number(p.pauseAllowedDays) || (typeLower === "monthly" ? 5 : typeLower === "weekly" ? 1 : 0),
          specialItem: p.specialItem || "Sev Tameta Nu Shaak",
        };
      });

      if (matchedIdx >= 0) {
        existingRegistered[matchedIdx].plans = formattedPlans;
        localStorage.setItem("hf_registered_cooks", JSON.stringify(existingRegistered));
      }

      // Sync to live PostgreSQL API
      fetch("/api/v1/cooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          name: profile.headCook,
          kitchenName: profile.shopName,
          phone: profile.phone,
          city: profile.city,
          area: profile.address || profile.city,
          avatar: profile.avatar,
          coverImage: profile.coverImage,
          bio: profile.bio,
          fssaiNo: profile.fssaiNumber,
          isVeg: profile.pureVeg,
          status: profile.status || "approved",
          plans: formattedPlans,
        }),
      }).catch(() => {});
    } catch {}
  };

  // Save Handlers to persist state
  const saveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_profile_${userScopedKey}`, JSON.stringify(profile));
      localStorage.setItem("hf_cook_profile", JSON.stringify(profile));
      // Also update hf_user kitchen name if appropriate
      try {
        const u = localStorage.getItem("hf_user");
        if (u) {
          const userObj = JSON.parse(u);
          userObj.kitchenName = profile.shopName;
          userObj.name = profile.headCook;
          if (profile.avatar) userObj.avatar = profile.avatar;
          localStorage.setItem("hf_user", JSON.stringify(userObj));
        }
      } catch {}

      // Sync into public registered cooks registry and server API
      try {
        const existingRegistered = JSON.parse(localStorage.getItem("hf_registered_cooks") || "[]");
        const cookId = `c_${profile.headCook.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        const updatedPlans = plans.map((p, idx) => {
          const typeLower = (p.type || (p.billingCycle?.toLowerCase().includes("month") ? "monthly" : p.billingCycle?.toLowerCase().includes("week") ? "weekly" : "daily")).toLowerCase();
          const cleanIncludes = Array.isArray(p.includes) && p.includes.length > 0
            ? p.includes
            : typeof p.includesText === "string" && p.includesText.trim()
            ? p.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
            : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"];

          return {
            id: p.id || `p_${cookId}_${typeLower}_${idx}`,
            type: typeLower,
            label: p.name,
            name: p.name,
            price: Number(p.price) || 120,
            perMeal: Math.round(Number(p.price) / Math.max(1, Number(p.mealsIncluded) || (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1))),
            description: p.description || `${p.name} homestyle meal plan`,
            includes: cleanIncludes,
            popular: Boolean(p.popular || (p.badge && p.badge.toLowerCase().includes("popular"))),
            badge: p.badge || (p.popular ? "Most Popular Choice" : ""),
            specialItem: p.specialItem || "Chef Special",
          };
        });

        const updatedRecord = {
          id: cookId,
          kitchenName: profile.shopName,
          name: profile.headCook,
          bio: profile.bio,
          avatar: profile.avatar || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
          coverImage: profile.coverImage || "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
          city: profile.city || "Rajkot",
          area: profile.address || `${profile.city || "Rajkot"}`,
          pincode: "360005",
          rating: 4.9,
          totalReviews: 24,
          totalOrders: 180,
          cuisines: profile.pureVeg ? ["gujarati", "kathiyawadi", "jain"] : ["gujarati", "punjabi"],
          deliverySlots: [profile.lunchSlot || "Lunch (12–1:30 PM)", profile.dinnerSlot || "Dinner (7:30–9 PM)"],
          serviceAreas: profile.serviceAreas || ["Kalavad Road", "University Road"],
          status: "approved",
          isVeg: profile.pureVeg !== undefined ? profile.pureVeg : true,
          plans: updatedPlans,
        };
        const filteredList = existingRegistered.filter((c: any) => c.kitchenName !== profile.shopName && c.id !== cookId);
        localStorage.setItem("hf_registered_cooks", JSON.stringify([updatedRecord, ...filteredList]));

        fetch("/api/v1/cooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?.id,
            email: currentUser?.email || profile.email,
            phone: profile.phone,
            name: profile.headCook,
            kitchenName: profile.shopName,
            bio: profile.bio,
            avatar: profile.avatar,
            coverImage: profile.coverImage,
            fssaiNo: profile.fssaiNumber,
            city: profile.city,
            area: profile.address,
            isVeg: profile.pureVeg,
            status: profile.status || "approved",
            plans: updatedPlans,
          }),
        }).catch(() => {});
      } catch {}
    }
    showToast("Shop profile, kitchen photos & settings saved successfully!");
  };

  const toggleKitchenStatus = () => {
    if (profile.status === "pending") {
      showToast("⏳ Your kitchen is pending Admin Approval. It will automatically go LIVE once verified by Admin.");
      return;
    }
    const updated = { ...profile, isOpen: !profile.isOpen };
    setProfile(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_profile_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_profile", JSON.stringify(updated));
    }
    showToast(updated.isOpen ? "Kitchen is now LIVE & accepting orders!" : "Kitchen paused. Not taking new orders.");
  };


  // Menu Handlers
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newDish.name.trim();
    if (cleanName.length < 2) {
      showToast("Dish name must be at least 2 characters long.");
      return;
    }
    const safePrice = Math.max(1, Math.min(1000, Number(newDish.price) || 40));
    const dish = {
      id: `dish_${Date.now()}`,
      name: cleanName,
      category: newDish.category,
      type: newDish.type,
      price: safePrice,
      available: true,
      mealTime: newDish.mealTime,
      desc: newDish.desc.trim() || `${cleanName} made fresh daily.`,
    };
    const updated = [dish, ...menuItems];
    setMenuItems(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_menu_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_menu", JSON.stringify(updated));
    }
    setNewDish({ name: "", category: "Main Sabzi", type: "veg", price: 50, mealTime: "Both", desc: "" });
    setShowAddDishModal(false);
    showToast(`Added "${dish.name}" to menu catalog!`);
  };

  const handleUpdateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    const updated = menuItems.map(d => d.id === editingDish.id ? editingDish : d);
    setMenuItems(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_menu_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_menu", JSON.stringify(updated));
    }
    setEditingDish(null);
    showToast(`Updated "${editingDish.name}" successfully!`);
  };

  const toggleDishStock = (id: string) => {
    const updated = menuItems.map(d => d.id === id ? { ...d, available: !d.available } : d);
    setMenuItems(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_menu_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_menu", JSON.stringify(updated));
    }
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your menu?`)) return;
    const updated = menuItems.filter(d => d.id !== id);
    setMenuItems(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_menu_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_menu", JSON.stringify(updated));
    }
    showToast(`Removed "${name}" from menu.`);
  };

  // Weekly Plan Handlers
  const handleSaveDayPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayToEdit) return;
    const updated = weeklyPlan.map((d, idx) => idx === selectedDayIndex ? dayToEdit : d);
    setWeeklyPlan(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_weekly_menu_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_weekly_menu", JSON.stringify(updated));
    }
    setShowEditDayModal(false);
    showToast(`Updated menu for ${dayToEdit.day}!`);
  };

  const handlePublishWeeklyPlan = () => {
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_weekly_menu_${userScopedKey}`, JSON.stringify(weeklyPlan));
      localStorage.setItem("hf_cook_weekly_menu", JSON.stringify(weeklyPlan));
    }
    showToast("7-Day Rotating Weekly Menu published to all subscribers!");
  };

  // Plans Handlers
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const cleanIncludes = Array.isArray(editingPlan.includes) && editingPlan.includes.length > 0
      ? editingPlan.includes
      : typeof editingPlan.includesText === "string" && editingPlan.includesText.trim()
      ? editingPlan.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
      : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice"];

    const typeLower = (editingPlan.type || (editingPlan.billingCycle?.toLowerCase().includes("month") ? "monthly" : editingPlan.billingCycle?.toLowerCase().includes("week") ? "weekly" : "daily")).toLowerCase();
    const planToSave = {
      ...editingPlan,
      name: editingPlan.name.trim(),
      type: typeLower,
      price: Number(editingPlan.price) || 120,
      mealsIncluded: Number(editingPlan.mealsIncluded) || (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1),
      pauseAllowedDays: Number(editingPlan.pauseAllowedDays) || 0,
      includes: cleanIncludes,
      popular: Boolean(editingPlan.popular),
      badge: editingPlan.badge || (editingPlan.popular ? "Most Popular Choice" : ""),
      specialItem: editingPlan.specialItem || "Sev Tameta Nu Shaak",
    };

    const updated = plans.map(p => p.id === editingPlan.id ? planToSave : p);
    setPlans(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_plans_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_plans", JSON.stringify(updated));
    }
    syncPlansToBackend(updated);
    setShowEditPlanModal(false);
    showToast(`Saved settings for ${editingPlan.name}!`);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name.trim()) return;
    const cleanIncludes = Array.isArray(newPlan.includes) && newPlan.includes.length > 0
      ? newPlan.includes
      : typeof newPlan.includesText === "string" && newPlan.includesText.trim()
      ? newPlan.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
      : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice"];

    const typeLower = (newPlan.type || "weekly").toLowerCase();
    const plan = {
      ...newPlan,
      id: `p_${Date.now()}`,
      name: newPlan.name.trim(),
      type: typeLower,
      price: Number(newPlan.price) || 120,
      mealsIncluded: Number(newPlan.mealsIncluded) || (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1),
      pauseAllowedDays: Number(newPlan.pauseAllowedDays) || 0,
      description: newPlan.description.trim() || `${newPlan.name.trim()} homemade tiffin plan.`,
      includes: cleanIncludes,
      popular: Boolean(newPlan.popular),
      badge: newPlan.badge || (newPlan.popular ? "Most Popular Choice" : ""),
      specialItem: newPlan.specialItem || "Chef Special",
      deliverySlots: newPlan.deliverySlots.length > 0 ? newPlan.deliverySlots : ["Lunch (12–1:30 PM)"],
      active: true,
    };
    const updated = [...plans, plan];
    setPlans(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_plans_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_plans", JSON.stringify(updated));
    }
    syncPlansToBackend(updated);
    setShowAddPlanModal(false);
    setNewPlan({
      name: "",
      type: "weekly",
      badge: "Most Popular Choice",
      price: 749,
      billingCycle: "7 days",
      mealsIncluded: 7,
      description: "7-day wholesome rotating meal plan with Sunday special.",
      includesText: "Daily variety thali, Dal/Kadhi, Fresh Rotis, Rice, Sunday Dessert",
      includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
      specialItem: "Sev Tameta Nu Shaak",
      popular: false,
      pauseAllowedDays: 1,
      deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
      active: true,
    });
    showToast(`Added plan "${plan.name}"!`);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove plan "${name}"?`)) return;
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_plans_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_plans", JSON.stringify(updated));
    }
    syncPlansToBackend(updated);
    showToast(`Removed plan "${name}".`);
  };

  // Subscriber Handlers
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriber.name || !newSubscriber.phone) return;
    const cleanPhone = newSubscriber.phone.replace(/\D/g, "").slice(0, 10);
    const totalDays = newSubscriber.plan.includes("30") ? 30 : newSubscriber.plan.includes("7") ? 7 : 1;
    const sub = {
      id: `sub_${Date.now()}`,
      name: newSubscriber.name,
      phone: cleanPhone,
      plan: newSubscriber.plan,
      slot: newSubscriber.slot,
      address: newSubscriber.address || "Rajkot City",
      startDate: new Date().toISOString().split("T")[0],
      remainingMeals: totalDays,
      totalMeals: totalDays,
      dietPreference: newSubscriber.dietPreference,
      status: "ACTIVE",
    };
    const updated = [sub, ...subscribers];
    setSubscribers(updated);

    // Also generate a dispatch order for today
    const orderTicket = {
      id: `ord_${Date.now()}`,
      customer: sub.name,
      phone: sub.phone,
      plan: sub.plan,
      slot: sub.slot,
      address: sub.address,
      items: ["Daily Gujarati Thali", "Phulka Roti", "Dal/Kadhi", "Sabzi", "Rice"],
      status: "CONFIRMED",
      packedItems: { sabzi: false, rotis: false, dal: false, rice: false },
    };
    const updatedOrders = deduplicateOrders([orderTicket, ...orders]);
    setOrders(updatedOrders);

    if (typeof window !== "undefined") {
      if (userScopedKey) {
        localStorage.setItem(`hf_cook_subscribers_${userScopedKey}`, JSON.stringify(updated));
        localStorage.setItem(`hf_cook_orders_${userScopedKey}`, JSON.stringify(updatedOrders));
      }
      localStorage.setItem("hf_cook_subscribers", JSON.stringify(updated));
      localStorage.setItem("hf_cook_orders", JSON.stringify(updatedOrders));
    }

    setShowAddSubscriberModal(false);
    setNewSubscriber({ name: "", phone: "", plan: "Weekly Saver Plan (7 Days)", slot: "Lunch (12–1:30 PM)", address: "", dietPreference: "Pure Veg, less spicy" });
    showToast(`Added subscriber ${sub.name} & created today's tiffin packing ticket!`);
  };

  const handleTogglePauseSubscriber = (id: string) => {
    const updated = subscribers.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setSubscribers(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_subscribers_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_subscribers", JSON.stringify(updated));
    }
    showToast("Subscriber status updated.");
  };

  const handleDeleteSubscriber = (id: string, name: string) => {
    if (!confirm(`Cancel subscription for ${name}?`)) return;
    const updated = subscribers.filter(s => s.id !== id);
    setSubscribers(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_subscribers_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_subscribers", JSON.stringify(updated));
    }
    showToast(`Removed subscription for ${name}.`);
  };

  const handleSimulateTestSubscriber = () => {
    const demoSub = {
      id: `sub_${Date.now()}`,
      name: "Bhavin Patel",
      phone: "9825123456",
      plan: "Weekly Saver Plan (7 Days)",
      slot: "Lunch (12:00 PM – 01:30 PM)",
      address: "Flat 402, Shivalik Heights, Kalavad Road, Rajkot",
      startDate: new Date().toISOString().split("T")[0],
      remainingMeals: 6,
      totalMeals: 7,
      dietPreference: "Kathiyawadi style, extra garlic chutney, less chili",
      status: "ACTIVE",
    };
    const updatedSubs = [demoSub, ...subscribers];
    setSubscribers(updatedSubs);

    const testOrder = {
      id: `ord_${Date.now()}`,
      customer: demoSub.name,
      phone: demoSub.phone,
      plan: demoSub.plan,
      slot: demoSub.slot,
      address: demoSub.address,
      items: ["Ringan No Olo", "Bajra No Rotlo (2 pcs)", "Gujarati Kadhi", "Vaghareli Khichdi", "Garlic Chutney"],
      status: "CONFIRMED",
      packedItems: { sabzi: true, rotis: false, dal: false, rice: false },
    };
    const updatedOrders = deduplicateOrders([testOrder, ...orders]);
    setOrders(updatedOrders);

    if (typeof window !== "undefined") {
      if (userScopedKey) {
        localStorage.setItem(`hf_cook_subscribers_${userScopedKey}`, JSON.stringify(updatedSubs));
        localStorage.setItem(`hf_cook_orders_${userScopedKey}`, JSON.stringify(updatedOrders));
      }
      localStorage.setItem("hf_cook_subscribers", JSON.stringify(updatedSubs));
      localStorage.setItem("hf_cook_orders", JSON.stringify(updatedOrders));
    }

    showToast("Simulated test subscriber & generated today's live packing ticket!");
  };

  // Orders Dispatch State Machine
  const updateOrderStatus = (id: string, newStatus: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_orders_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_orders", JSON.stringify(updated));
    }
    showToast(`Order status updated to: ${newStatus.replace(/_/g, " ")}`);

    fetch("/api/v1/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    }).catch(() => {});
  };

  const togglePackItem = (orderId: string, itemKey: string) => {
    let targetPacked: any = {};
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const currentPacked = o.packedItems || {};
        targetPacked = { ...currentPacked, [itemKey]: !currentPacked[itemKey] };
        return {
          ...o,
          packedItems: targetPacked,
        };
      }
      return o;
    });
    setOrders(updated);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_orders_${userScopedKey}`, JSON.stringify(updated));
      localStorage.setItem("hf_cook_orders", JSON.stringify(updated));
    }

    fetch("/api/v1/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, packedItems: targetPacked }),
    }).catch(() => {});
  };

  const clearDeliveredOrders = () => {
    const remaining = orders.filter(o => o.status !== "DELIVERED");
    setOrders(remaining);
    if (typeof window !== "undefined") {
      if (userScopedKey) localStorage.setItem(`hf_cook_orders_${userScopedKey}`, JSON.stringify(remaining));
      localStorage.setItem("hf_cook_orders", JSON.stringify(remaining));
    }
    showToast("Delivered orders cleared from dispatch queue.");
  };

  // Earnings calculations
  const activeSubscribersList = subscribers.filter((s) => s.status === "ACTIVE");
  const totalSubscribersCount = activeSubscribersList.length;

  const subsRevenue = activeSubscribersList.reduce((sum, s) => {
    const price = Number(s.planPrice) || (s.plan?.toLowerCase().includes("month") ? 2799 : s.plan?.toLowerCase().includes("week") ? 749 : 120);
    return sum + price;
  }, 0);

  const ordersRevenue = orders
    .filter((o) => o.status === "DELIVERED" || o.status === "CONFIRMED")
    .reduce((sum, o) => sum + (Number(o.amount) || Number(o.totalAmount) || 120), 0);

  const calculatedGrossRevenue = subsRevenue + ordersRevenue;
  const commission = Math.round(calculatedGrossRevenue * 0.10);
  const netEarnings = calculatedGrossRevenue - commission;

  if (mounted && authChecked && !isAuthenticated) {
    return (
      <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "var(--bg)" }}>
        <div className="card" style={{ maxWidth: 520, width: "100%", padding: "2.5rem", textAlign: "center", border: "1.5px solid var(--border)" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(232, 85, 7, 0.12)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <ChefHat size={36} />
          </div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.6rem", color: "var(--text)", marginBottom: "0.5rem" }}>
            Cook Portal Sign In Required
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            You are currently visiting as a guest. Please sign in to your verified Home Cook account to access your kitchen profile, menu catalog, week-wise rotating meal schedule, and live dispatch orders.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.875rem" }}>
              Sign In to Cook Account
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 10000,
            background: "var(--surface)",
            color: "var(--text)",
            border: "1.5px solid var(--primary)",
            padding: "0.875rem 1.25rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.9375rem",
            fontWeight: 600,
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <Sparkles size={18} style={{ color: "var(--primary)" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cook Sidebar */}
      <aside className="sidebar" aria-label="Cook navigation" style={{ width: "270px", flexShrink: 0 }}>
        {/* Kitchen Header in Sidebar */}
        <div style={{ marginBottom: "1.5rem", padding: "0.5rem 0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.25rem",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {profile.shopName.charAt(0) || profile.headCook.charAt(0) || "K"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", margin: 0, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile.shopName}
              </p>
              <span className={`badge ${profile.status === "pending" ? "badge-pending" : "badge-active"}`} style={{ fontSize: "0.68rem", marginTop: "0.25rem" }}>
                {profile.status === "pending" ? "⏳ Verification Pending" : "✓ FSSAI Verified"} ({profile.city})
              </span>
            </div>
          </div>

          {/* Quick Kitchen Open/Closed Toggle */}
          <button
            onClick={toggleKitchenStatus}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              border: profile.status === "pending"
                ? "1px solid var(--accent)"
                : profile.isOpen
                ? "1px solid var(--secondary)"
                : "1px solid var(--danger)",
              background: profile.status === "pending"
                ? "rgba(232, 101, 10, 0.1)"
                : profile.isOpen
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              color: profile.status === "pending"
                ? "var(--accent)"
                : profile.isOpen
                ? "var(--secondary)"
                : "var(--danger)",
              fontSize: "0.78rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: profile.status === "pending"
                  ? "var(--accent)"
                  : profile.isOpen
                  ? "var(--secondary)"
                  : "var(--danger)",
              }}
            />
            {profile.status === "pending"
              ? "🔒 Awaiting Admin Approval"
              : profile.isOpen
              ? "Kitchen OPEN (Accepting)"
              : "Kitchen CLOSED (Paused)"}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {COOK_SIDEBAR.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`sidebar-link${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              style={{
                width: "100%",
                textAlign: "left",
                background: activeTab === key ? "var(--surface-alt)" : "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontWeight: activeTab === key ? 700 : 500,
                color: activeTab === key ? "var(--primary)" : "var(--text)",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={18} style={{ color: activeTab === key ? "var(--primary)" : "var(--text-muted)" }} />
              <span style={{ flex: 1, fontSize: "0.875rem" }}>{label}</span>
              {key === "orders" && orders.filter(o => o.status !== "DELIVERED").length > 0 && (
                <span
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {orders.filter(o => o.status !== "DELIVERED").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("hf_token");
                localStorage.removeItem("hf_user");
                window.location.href = "/";
              }
            }}
            className="sidebar-link"
            style={{
              width: "100%",
              textDecoration: "none",
              color: "var(--danger)",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", minWidth: 0 }}>

        {/* Top Operational Banner */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            paddingBottom: "1.25rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", margin: 0 }}>
                {profile.shopName}
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "20px",
                  background: profile.status === "pending"
                    ? "rgba(232, 101, 10, 0.15)"
                    : profile.isOpen
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: profile.status === "pending"
                    ? "var(--accent)"
                    : profile.isOpen
                    ? "var(--secondary)"
                    : "var(--danger)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: profile.status === "pending"
                      ? "var(--accent)"
                      : profile.isOpen
                      ? "var(--secondary)"
                      : "var(--danger)",
                  }}
                />
                {profile.status === "pending"
                  ? "Pending Admin Approval"
                  : profile.isOpen
                  ? "Accepting Orders"
                  : "Closed / Off Duty"}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.35rem 0 0" }}>
              Head Chef: <strong>{profile.headCook}</strong> • FSSAI: {profile.fssaiNumber} • {profile.city} ({profile.serviceAreas.length} Service Hubs)
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={() => setActiveTab("profile")}
              className="btn btn-outline"
              style={{ fontSize: "0.8125rem", padding: "0.5rem 0.875rem" }}
            >
              <Settings size={15} /> Edit Shop Settings
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className="btn btn-primary"
              style={{ fontSize: "0.8125rem", padding: "0.5rem 1rem" }}
            >
              <Package size={15} /> Today&apos;s Dispatch Station
            </button>
          </div>
        </header>

        {/* Pending Admin Review Warning Banner */}
        {profile.status === "pending" && (
          <div
            style={{
              background: "rgba(232, 101, 10, 0.08)",
              border: "1.5px solid var(--primary)",
              borderRadius: "var(--radius)",
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Clock size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", margin: 0 }}>
                  Kitchen Registration Under Review (Pending Admin Approval)
                </h3>
                <span className="badge badge-pending" style={{ fontSize: "0.7rem" }}>
                  Not Live Yet
                </span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Your kitchen is currently under verification by the HomeFeast Administrator team. Customers cannot see your profile on search or place orders until approval is granted in the Admin Console. Once approved, your kitchen will automatically become <strong>LIVE & Active</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { label: "Today's Tiffins to Dispatch", value: orders.filter(o => o.status !== "DELIVERED").length.toString(), sub: `${orders.filter(o => o.status === "DELIVERED").length} completed`, icon: Package, color: "var(--primary)" },
                { label: "Active Subscribers", value: totalSubscribersCount.toString(), sub: `${subscribers.length} total registered`, icon: Users, color: "var(--secondary)" },
                { label: "Est. Month Payout", value: `₹${netEarnings.toLocaleString("en-IN")}`, sub: "Weekly bank settlement", icon: TrendingUp, color: "var(--info)" },
                { label: "Active Menu Dishes", value: menuItems.filter(m => m.available).length.toString(), sub: `${menuItems.length} catalog items`, icon: UtensilsCrossed, color: "var(--accent)" },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} className="kpi-card" style={{ padding: "1.25rem", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{label}</p>
                      <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", margin: 0 }}>{value}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem", margin: 0 }}>{sub}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Live Operations Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Dispatch Queue Widget */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                      Today&apos;s Live Packing Station
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                      {orders.filter(o => o.status !== "DELIVERED").length} tiffins needing packing and handover
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("orders")} className="btn btn-ghost" style={{ fontSize: "0.8125rem", color: "var(--primary)" }}>
                    Full Dispatch View →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2.5rem 1rem", border: "1.5px dashed var(--border)", borderRadius: "10px" }}>
                    <Package size={36} style={{ color: "var(--text-muted)", margin: "0 auto 0.75rem" }} />
                    <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>No orders in queue for right now</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: 380, margin: "0 auto 1rem" }}>
                      When subscribers renew or new customers subscribe to your shop, their meal tickets appear here automatically.
                    </p>
                    <button onClick={handleSimulateTestSubscriber} className="btn btn-outline" style={{ fontSize: "0.8125rem" }}>
                      <Sparkles size={14} /> Simulate a Customer Order
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        style={{
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "var(--surface-alt)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--text)", fontSize: "0.9375rem" }}>{o.customer}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>• {o.slot}</span>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>{o.items.slice(0, 3).join(" • ")}</p>
                        </div>
                        <span
                          className={`badge ${
                            o.status === "DELIVERED"
                              ? "badge-success"
                              : o.status === "OUT_FOR_DELIVERY"
                              ? "badge-warning"
                              : "badge-active"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Today's Scheduled Rotating Meal */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Today&apos;s Rotating Menu
                  </h3>
                  <button onClick={() => setActiveTab("weekly")} className="btn btn-ghost" style={{ fontSize: "0.8125rem", color: "var(--primary)" }}>
                    7-Day Calendar →
                  </button>
                </div>

                <div style={{ padding: "1rem", borderRadius: "10px", background: "var(--surface-alt)", marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", margin: 0 }}>
                    🍱 Lunch Menu ({weeklyPlan[0]?.day})
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: "0.5rem 0 0.25rem" }}>
                    {weeklyPlan[0]?.lunch.sabzi1} & {weeklyPlan[0]?.lunch.sabzi2}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {weeklyPlan[0]?.lunch.dalKadhi} • {weeklyPlan[0]?.lunch.bread} • {weeklyPlan[0]?.lunch.rice}
                  </p>
                </div>

                <div style={{ padding: "1rem", borderRadius: "10px", background: "var(--surface-alt)" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--secondary)", margin: 0 }}>
                    🌙 Dinner Menu ({weeklyPlan[0]?.day})
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: "0.5rem 0 0.25rem" }}>
                    {weeklyPlan[0]?.dinner.mainDish}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {weeklyPlan[0]?.dinner.bread} • {weeklyPlan[0]?.dinner.dalKadhi} • {weeklyPlan[0]?.dinner.rice}
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Velocity Chart */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Weekly Revenue & Delivery Velocity
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                    Daily fulfilled meal subscriptions (Last 7 Days)
                  </p>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>+18% Growth</span>
              </div>
              <EarningsChart orders={orders} isDemo={currentUser?.email === "demo@cook.com"} />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SHOP & KITCHEN PROFILE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "profile" && (
          <div>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                Shop Name & Kitchen Settings 🏪
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                Manage your store identity, operating hours, delivery radius, and verified credentials.
              </p>
            </div>

            <form onSubmit={saveProfile}>
              {/* Visual Branding Card: Avatar Logo & Kitchen Cover Banner */}
              <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Camera size={20} style={{ color: "var(--primary)" }} />
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Kitchen Visuals & Storefront Branding (Logo & Cover Banner)
                  </h3>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
                  Upload or select your Kitchen Logo Avatar and Hero Cover Banner. These photos are displayed on your public kitchen profile, menu page, and meal plan cards.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.75rem" }}>
                  {/* Kitchen Avatar / Logo */}
                  <div style={{ background: "var(--surface-alt)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <label className="label" style={{ fontWeight: 700, marginBottom: "0.75rem", display: "block" }}>
                      Kitchen Logo / Chef Avatar
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{ position: "relative", width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--primary)", flexShrink: 0, background: "var(--surface)" }}>
                        <img
                          src={profile.avatar || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80"}
                          alt={profile.shopName || "Kitchen Avatar"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem", cursor: "pointer", display: "inline-flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.4rem" }}>
                          <Upload size={13} /> Upload Avatar
                          <input type="file" accept="image/*" onChange={handleAvatarFileUpload} style={{ display: "none" }} />
                        </label>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>PNG, JPG or WebP up to 2MB</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Or Paste Image URL</label>
                      <input
                        type="url"
                        className="input"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
                        placeholder="https://..."
                        value={profile.avatar || ""}
                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>Quick Preset Avatars:</span>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {PRESET_AVATARS.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setProfile(prev => ({ ...prev, avatar: p.url }));
                              showToast(`Selected ${p.label}!`);
                            }}
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "14px",
                              border: profile.avatar === p.url ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                              background: profile.avatar === p.url ? "rgba(235, 94, 40, 0.12)" : "var(--surface)",
                              color: profile.avatar === p.url ? "var(--primary)" : "var(--text)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kitchen Cover / Banner */}
                  <div style={{ background: "var(--surface-alt)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <label className="label" style={{ fontWeight: 700, marginBottom: "0.75rem", display: "block" }}>
                      Kitchen Banner / Cover Photo
                    </label>
                    <div style={{ position: "relative", width: "100%", height: 85, borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "0.75rem" }}>
                      <img
                        src={profile.coverImage || "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80"}
                        alt="Cover Banner"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", display: "flex", alignItems: "flex-end", padding: "0.5rem 0.75rem" }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                          {profile.shopName || "Kitchen Storefront"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
                      <label className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem", cursor: "pointer", display: "inline-flex", gap: "0.4rem", alignItems: "center", whiteSpace: "nowrap" }}>
                        <Upload size={13} /> Upload Banner
                        <input type="file" accept="image/*" onChange={handleCoverFileUpload} style={{ display: "none" }} />
                      </label>
                      <input
                        type="url"
                        className="input"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem", flex: 1 }}
                        placeholder="Cover image URL (https://...)"
                        value={profile.coverImage || ""}
                        onChange={(e) => setProfile({ ...profile, coverImage: e.target.value })}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>Quick Preset Banners:</span>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {PRESET_COVERS.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setProfile(prev => ({ ...prev, coverImage: c.url }));
                              showToast(`Selected ${c.label}!`);
                            }}
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "14px",
                              border: profile.coverImage === c.url ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                              background: profile.coverImage === c.url ? "rgba(235, 94, 40, 0.12)" : "var(--surface)",
                              color: profile.coverImage === c.url ? "var(--primary)" : "var(--text)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                            }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }}>
                {/* Left Card: Core Store Info */}
                <div className="card" style={{ padding: "1.75rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Shop Identity & Chef Details
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label className="label">Shop / Kitchen Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={profile.shopName}
                        onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                        placeholder="e.g. Maa Ki Rasoi or Royal Kitchen"
                      />
                    </div>
                    <div>
                      <label className="label">Head Cook / Owner Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={profile.headCook}
                        onChange={(e) => setProfile({ ...profile, headCook: e.target.value })}
                        placeholder="e.g. Your Full Name / Head Chef"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label className="label">Phone / WhatsApp Number (10 digits) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        placeholder="10-digit mobile number"
                        className="input"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      />
                    </div>
                    <div>
                      <label className="label">Business Email</label>
                      <input
                        type="email"
                        className="input"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label className="label">Kitchen Bio / Specialty</label>
                    <textarea
                      rows={3}
                      className="input"
                      style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "inherit" }}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Describe your authentic food style, hygiene standards, and ingredients..."
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label className="label">Full Physical Kitchen Address *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="label">City</label>
                      <select
                        className="input"
                        style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)" }}
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      >
                        <option value="Rajkot">Rajkot</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Delivery Radius (km)</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        className="input"
                        value={profile.deliveryRadiusKm}
                        onChange={(e) => setProfile({ ...profile, deliveryRadiusKm: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: FSSAI, Operating Hours & Payouts */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "1rem" }}>
                      Operational Hours & Dispatch Slots
                    </h3>

                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Lunch Dispatch Window</label>
                      <input
                        type="text"
                        className="input"
                        value={profile.lunchSlot}
                        onChange={(e) => setProfile({ ...profile, lunchSlot: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Dinner Dispatch Window</label>
                      <input
                        type="text"
                        className="input"
                        value={profile.dinnerSlot}
                        onChange={(e) => setProfile({ ...profile, dinnerSlot: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="label">FSSAI License Registration</label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          className="input"
                          value={profile.fssaiNumber}
                          onChange={(e) => setProfile({ ...profile, fssaiNumber: e.target.value })}
                        />
                        <span className="badge badge-success" style={{ alignSelf: "center", whiteSpace: "nowrap" }}>
                          ✓ Certified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "1rem" }}>
                      Settlement Bank Account
                    </h3>

                    <div style={{ marginBottom: "0.75rem" }}>
                      <label className="label">Bank Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. State Bank of India, HDFC Bank"
                        value={profile.bankName}
                        onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label className="label">Account Number</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. 123456789012"
                          value={profile.bankAccount}
                          onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">IFSC Code</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. SBIN0001234"
                          value={profile.bankIfsc}
                          onChange={(e) => setProfile({ ...profile, bankIfsc: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
                  Save Shop & Kitchen Settings
                </button>
                <button
                  type="button"
                  onClick={toggleKitchenStatus}
                  className="btn btn-outline"
                  style={{ color: profile.isOpen ? "var(--danger)" : "var(--secondary)" }}
                >
                  {profile.isOpen ? "Pause Kitchen (Take Offline)" : "Turn Kitchen Live (Accept Orders)"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: MENU MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "menu" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                  Menu Catalog & Recipes 🍽️
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                  Add dishes, configure pricing, and toggle in-stock availability for today&apos;s tiffins.
                </p>
              </div>
              <button
                onClick={() => setShowAddDishModal(true)}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1.25rem" }}
              >
                <Plus size={16} /> Add New Dish
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              {/* Category Pills */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["All", "Main Sabzi", "Dal & Kadhi", "Roti & Breads", "Rice & Khichdi", "Dessert / Sweet"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuFilterCategory(cat)}
                    style={{
                      padding: "0.4rem 0.875rem",
                      borderRadius: "20px",
                      border: menuFilterCategory === cat ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: menuFilterCategory === cat ? "rgba(235, 94, 40, 0.12)" : "var(--surface)",
                      color: menuFilterCategory === cat ? "var(--primary)" : "var(--text)",
                      fontSize: "0.8125rem",
                      fontWeight: menuFilterCategory === cat ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative", minWidth: 240 }}>
                <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="input"
                  style={{ paddingLeft: "2.25rem", height: 38, fontSize: "0.85rem" }}
                />
              </div>
            </div>

            {/* Dishes Table */}
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                    {["Dish Name", "Category", "Meal Slot", "Dietary", "Price", "Availability", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.875rem 1.25rem",
                          textAlign: "left",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          fontFamily: "Poppins",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                        <div style={{ maxWidth: 440, margin: "0 auto" }}>
                          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(235, 94, 40, 0.12)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                            <ChefHat size={32} />
                          </div>
                          <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)", margin: "0 0 0.5rem" }}>
                            No dishes added yet
                          </h3>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
                            Start building your tiffin menu by adding your signature gravies, sabzis, rotis, dals, and regional specialties.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowAddDishModal(true)}
                            className="btn btn-primary"
                            style={{ padding: "0.5rem 1.25rem", margin: "0 auto" }}
                          >
                            <Plus size={16} /> Add Your First Dish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    menuItems
                      .filter(d => menuFilterCategory === "All" || d.category === menuFilterCategory)
                      .filter(d => !menuSearchQuery || d.name.toLowerCase().includes(menuSearchQuery.toLowerCase()))
                      .map((dish) => (
                        <tr key={dish.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <p style={{ fontWeight: 700, color: "var(--text)", margin: 0, fontSize: "0.9375rem" }}>{dish.name}</p>
                            {dish.desc && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>{dish.desc}</p>}
                          </td>
                          <td style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                            <span style={{ padding: "0.25rem 0.5rem", borderRadius: "6px", background: "var(--surface-alt)", border: "1px solid var(--border)" }}>
                              {dish.category}
                            </span>
                          </td>
                          <td style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                            {dish.mealTime}
                          </td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span className={`badge ${dish.type === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                              <span className={dish.type === "veg" ? "veg-dot" : "nonveg-dot"} />
                              {dish.type.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>
                            ₹{dish.price}
                          </td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <button
                              type="button"
                              onClick={() => toggleDishStock(dish.id)}
                              style={{
                                padding: "0.3rem 0.75rem",
                                borderRadius: "20px",
                                border: "none",
                                background: dish.available ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: dish.available ? "var(--secondary)" : "var(--danger)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {dish.available ? "✓ In Stock" : "✗ Sold Out"}
                            </button>
                          </td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                type="button"
                                onClick={() => setEditingDish(dish)}
                                className="btn btn-ghost"
                                style={{ padding: "0.3rem 0.5rem" }}
                                aria-label="Edit dish"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDish(dish.id, dish.name)}
                                className="btn btn-ghost"
                                style={{ color: "var(--danger)", padding: "0.3rem 0.5rem" }}
                                aria-label="Delete dish"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Dish Modal */}
            {showAddDishModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 520, padding: "2rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Add New Recipe to Catalog
                  </h3>
                  <form onSubmit={handleAddDish}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Dish Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="e.g. Gujarati Undhiyu"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Category</label>
                        <select
                          className="input"
                          value={newDish.category}
                          onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        >
                          <option value="Main Sabzi">Main Sabzi</option>
                          <option value="Dal & Kadhi">Dal & Kadhi</option>
                          <option value="Roti & Breads">Roti & Breads</option>
                          <option value="Rice & Khichdi">Rice & Khichdi</option>
                          <option value="Dessert / Sweet">Dessert / Sweet</option>
                          <option value="Farsan / Snacks">Farsan / Snacks</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Price per Portion (₹)</label>
                        <input
                          type="number"
                          required
                          min="10"
                          className="input"
                          value={newDish.price}
                          onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Meal Slot</label>
                        <select
                          className="input"
                          value={newDish.mealTime}
                          onChange={(e) => setNewDish({ ...newDish, mealTime: e.target.value })}
                        >
                          <option value="Both">Both Lunch & Dinner</option>
                          <option value="Lunch">Lunch Only</option>
                          <option value="Dinner">Dinner Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Dietary Classification</label>
                        <select
                          className="input"
                          value={newDish.type}
                          onChange={(e) => setNewDish({ ...newDish, type: e.target.value })}
                        >
                          <option value="veg">Pure Vegetarian</option>
                          <option value="jain">Jain (No Onion/Garlic)</option>
                          <option value="nonveg">Non-Veg</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="label">Short Description / Key Ingredients</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Cooked with pure groundnut oil and fresh vegetables"
                        value={newDish.desc}
                        onChange={(e) => setNewDish({ ...newDish, desc: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowAddDishModal(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save to Menu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Dish Modal */}
            {editingDish && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 520, padding: "2rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Edit Recipe: {editingDish.name}
                  </h3>
                  <form onSubmit={handleUpdateDish}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Dish Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={editingDish.name}
                        onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Category</label>
                        <select
                          className="input"
                          value={editingDish.category}
                          onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                        >
                          <option value="Main Sabzi">Main Sabzi</option>
                          <option value="Dal & Kadhi">Dal & Kadhi</option>
                          <option value="Roti & Breads">Roti & Breads</option>
                          <option value="Rice & Khichdi">Rice & Khichdi</option>
                          <option value="Dessert / Sweet">Dessert / Sweet</option>
                          <option value="Farsan / Snacks">Farsan / Snacks</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Price per Portion (₹)</label>
                        <input
                          type="number"
                          required
                          min="10"
                          className="input"
                          value={editingDish.price}
                          onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="label">Description</label>
                      <input
                        type="text"
                        className="input"
                        value={editingDish.desc}
                        onChange={(e) => setEditingDish({ ...editingDish, desc: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setEditingDish(null)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Recipe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: WEEK-WISE MEAL PLAN ("week ways paln") */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "weekly" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                  7-Day Rotating Weekly Meal Plan 📅
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                  Customers view this schedule before subscribing. Customize your Monday to Sunday lunch and dinner dishes.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => {
                    setDayToEdit({ ...weeklyPlan[selectedDayIndex] });
                    setShowEditDayModal(true);
                  }}
                  className="btn btn-outline"
                >
                  <Edit2 size={15} /> Edit {weeklyPlan[selectedDayIndex]?.day}
                </button>
                <button
                  onClick={handlePublishWeeklyPlan}
                  className="btn btn-primary"
                >
                  <CheckCircle size={15} /> Publish Weekly Plan
                </button>
              </div>
            </div>

            {/* Day Switcher Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
              {weeklyPlan.map((d, idx) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "10px",
                    border: selectedDayIndex === idx ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: selectedDayIndex === idx ? "rgba(235, 94, 40, 0.12)" : "var(--surface)",
                    color: selectedDayIndex === idx ? "var(--primary)" : "var(--text)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  {d.day}
                </button>
              ))}
            </div>

            {/* Selected Day View */}
            {weeklyPlan[selectedDayIndex] && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Lunch Box Schedule */}
                <div className="card" style={{ padding: "1.75rem", borderLeft: "4px solid var(--primary)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div>
                      <span className="badge badge-primary">LUNCH SERVICE</span>
                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", margin: "0.5rem 0 0" }}>
                        {weeklyPlan[selectedDayIndex].day} Afternoon Tiffin
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                        Dispatch Slot: {profile.lunchSlot}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Sabzi 1 (Special)</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].lunch.sabzi1}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Sabzi 2 (Dry / Kathol)</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].lunch.sabzi2}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Dal / Kadhi</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].lunch.dalKadhi}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Roti & Rice</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].lunch.bread} + {weeklyPlan[selectedDayIndex].lunch.rice}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Side / Dessert</p>
                      <p style={{ fontWeight: 700, color: "var(--primary)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].lunch.sweetOrSide}</p>
                    </div>
                  </div>
                </div>

                {/* Dinner Box Schedule */}
                <div className="card" style={{ padding: "1.75rem", borderLeft: "4px solid var(--secondary)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div>
                      <span className="badge badge-success">DINNER SERVICE</span>
                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", margin: "0.5rem 0 0" }}>
                        {weeklyPlan[selectedDayIndex].day} Evening Meal
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                        Dispatch Slot: {profile.dinnerSlot}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Main Kathiyawadi / Desi Dish</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].dinner.mainDish}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Rotlo / Bhakri / Roti</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].dinner.bread}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Kadhi / Dal</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].dinner.dalKadhi}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Khichdi / Rice</p>
                      <p style={{ fontWeight: 700, color: "var(--text)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].dinner.rice}</p>
                    </div>
                    <div style={{ padding: "0.875rem", background: "var(--surface-alt)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Kathiyawadi Chutney & Salad</p>
                      <p style={{ fontWeight: 700, color: "var(--secondary)", margin: "0.25rem 0 0" }}>{weeklyPlan[selectedDayIndex].dinner.side}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Day Modal */}
            {showEditDayModal && dayToEdit && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 640, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Edit {dayToEdit.day}&apos;s Meal Schedule
                  </h3>

                  <form onSubmit={handleSaveDayPlan}>
                    <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Lunch Dishes</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Sabzi 1</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.lunch.sabzi1}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, lunch: { ...dayToEdit.lunch, sabzi1: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Sabzi 2</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.lunch.sabzi2}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, lunch: { ...dayToEdit.lunch, sabzi2: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Dal / Kadhi</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.lunch.dalKadhi}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, lunch: { ...dayToEdit.lunch, dalKadhi: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Bread & Rice</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.lunch.bread}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, lunch: { ...dayToEdit.lunch, bread: e.target.value } })}
                        />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <label className="label">Side / Sweet</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.lunch.sweetOrSide}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, lunch: { ...dayToEdit.lunch, sweetOrSide: e.target.value } })}
                        />
                      </div>
                    </div>

                    <p style={{ fontWeight: 700, color: "var(--secondary)", fontSize: "0.9rem", marginBottom: "0.5rem", marginTop: "1rem" }}>Dinner Dishes</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      <div>
                        <label className="label">Main Dish</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.dinner.mainDish}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, dinner: { ...dayToEdit.dinner, mainDish: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Rotlo / Bread</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.dinner.bread}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, dinner: { ...dayToEdit.dinner, bread: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Kadhi</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.dinner.dalKadhi}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, dinner: { ...dayToEdit.dinner, dalKadhi: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="label">Khichdi / Rice</label>
                        <input
                          type="text"
                          className="input"
                          value={dayToEdit.dinner.rice}
                          onChange={(e) => setDayToEdit({ ...dayToEdit, dinner: { ...dayToEdit.dinner, rice: e.target.value } })}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowEditDayModal(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Day Schedule
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: PLANS & PRICING ("add plns") */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "plans" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                  Plans & Subscription Pricing 💰
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                  Configure your daily trial, weekly saver, and monthly royal subscription packages offered to neighborhood customers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewPlan({
                    name: "",
                    type: "weekly",
                    badge: "Most Popular Choice",
                    price: 749,
                    billingCycle: "7 days",
                    mealsIncluded: 7,
                    description: "7-day wholesome rotating meal plan with Sunday special.",
                    includesText: "Daily variety thali, Dal/Kadhi, Fresh Rotis, Rice, Sunday Dessert",
                    includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
                    specialItem: "Sev Tameta Nu Shaak",
                    popular: false,
                    pauseAllowedDays: 1,
                    deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
                    active: true,
                  });
                  setShowAddPlanModal(true);
                }}
                className="btn btn-primary"
                style={{ fontSize: "0.875rem" }}
              >
                <Plus size={16} /> Add New Plan
              </button>
            </div>

            {/* Quick helper tip */}
            <div style={{ background: "rgba(235, 94, 40, 0.08)", border: "1px dashed rgba(235, 94, 40, 0.3)", borderRadius: "10px", padding: "0.875rem 1.25rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Sparkles size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <p style={{ fontSize: "0.85rem", color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                <strong>Live Sync:</strong> Any subscription plans you add or edit here automatically show up on your public Kitchen Profile (<strong>/cooks/[id]</strong>) and in the Homepage meal plan carousel (<strong>/#plans</strong>).
              </p>
            </div>

            {/* Plans Grid */}
            <div style={{ display: "grid", gridTemplateColumns: plans.length === 0 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              {plans.length === 0 ? (
                <div className="card" style={{ padding: "3.5rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(232, 101, 10, 0.12)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <Calendar size={32} />
                  </div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)", margin: "0 0 0.5rem" }}>
                    No subscription plans configured yet
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: 440, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                    Create daily trial, weekly saver, or monthly meal subscription packages so neighborhood customers can subscribe to your tiffins.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddPlanModal(true)}
                    className="btn btn-primary"
                    style={{ padding: "0.5rem 1.25rem", margin: "0 auto" }}
                  >
                    <Plus size={16} /> Add First Plan
                  </button>
                </div>
              ) : (
                plans.map((p) => {
                  const perMeal = Math.round(p.price / Math.max(1, p.mealsIncluded || 1));
                  const cookTakeHome = Math.round(p.price * 0.90);
                  const isPopularChoice = p.popular || (p.badge && p.badge.toLowerCase().includes("popular"));
                  const includesList = Array.isArray(p.includes) && p.includes.length > 0
                    ? p.includes
                    : typeof p.includesText === "string" && p.includesText.trim()
                    ? p.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
                    : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"];

                  return (
                    <div
                      key={p.id}
                      className="card"
                      style={{
                        padding: "1.75rem",
                        border: isPopularChoice ? "2px solid var(--primary)" : "1px solid var(--border)",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        boxShadow: isPopularChoice ? "0 8px 24px rgba(235, 94, 40, 0.15)" : undefined,
                      }}
                    >
                      {isPopularChoice && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-12px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--primary)",
                            color: "#fff",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            padding: "2px 12px",
                            borderRadius: "12px",
                            textTransform: "uppercase",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          }}
                        >
                          ★ {p.badge || "Most Popular Choice"}
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: isPopularChoice ? "0.5rem" : 0, marginBottom: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0.2rem 0.55rem",
                            borderRadius: "6px",
                            background: p.type === "monthly" ? "rgba(139, 92, 246, 0.15)" : p.type === "weekly" ? "rgba(235, 94, 40, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            color: p.type === "monthly" ? "#a78bfa" : p.type === "weekly" ? "var(--primary)" : "#60a5fa",
                          }}
                        >
                          {(p.type || "weekly").toUpperCase()} PLAN
                        </span>
                        {p.badge && !isPopularChoice && (
                          <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", margin: "0 0 0.5rem" }}>
                        {p.name}
                      </h3>

                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--primary)" }}>
                          ₹{p.price}
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          / {p.billingCycle || (p.type === "monthly" ? "30 days" : p.type === "weekly" ? "7 days" : "day")}
                        </span>
                        <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 700, background: "rgba(34, 197, 94, 0.1)", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                          ₹{perMeal}/meal
                        </span>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 1rem" }}>
                        {p.description}
                      </p>

                      {/* What's Included Preview Checklist */}
                      <div style={{ background: "var(--surface-alt)", padding: "0.875rem", borderRadius: "10px", marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                          What&apos;s Included:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          {includesList.map((inc: string, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "var(--text)" }}>
                              <CheckCircle size={13} style={{ color: "#22c55e", flexShrink: 0 }} fill="#22c55e" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {p.specialItem && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--primary)", background: "rgba(235, 94, 40, 0.08)", padding: "0.4rem 0.65rem", borderRadius: "6px", marginBottom: "1rem", border: "1px dashed rgba(235, 94, 40, 0.25)" }}>
                          <ChefHat size={14} style={{ flexShrink: 0 }} />
                          <span>Chef Signature: <strong>{p.specialItem}</strong></span>
                        </div>
                      )}

                      <div style={{ background: "var(--surface-alt)", padding: "0.65rem 0.85rem", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.78rem" }}>
                        <p style={{ margin: "0 0 0.2rem", color: "var(--text-muted)" }}>
                          Your Take-Home (90%): <strong style={{ color: "var(--secondary)" }}>₹{cookTakeHome}</strong>
                        </p>
                        <p style={{ margin: 0, color: "var(--text-muted)" }}>
                          Max Pause Days: <strong>{p.pauseAllowedDays || 0} days</strong>
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                        <button
                          type="button"
                          onClick={() => {
                            const incArr = Array.isArray(p.includes) && p.includes.length > 0
                              ? p.includes
                              : (p.includesText ? p.includesText.split(",").map((s: string) => s.trim()) : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice"]);
                            setEditingPlan({
                              ...p,
                              type: p.type || "weekly",
                              includes: incArr,
                              includesText: incArr.join(", "),
                              specialItem: p.specialItem || "Sev Tameta Nu Shaak",
                              popular: Boolean(p.popular || (p.badge && p.badge.toLowerCase().includes("popular"))),
                            });
                            setShowEditPlanModal(true);
                          }}
                          className="btn btn-outline"
                          style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem" }}
                        >
                          <Edit2 size={14} /> Edit Plan
                        </button>
                        {plans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeletePlan(p.id, p.name)}
                            className="btn btn-ghost"
                            style={{ color: "var(--danger)", padding: "0.5rem" }}
                            title="Delete Plan"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Plan Modal */}
            {showAddPlanModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: "2rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Create New Subscription Plan
                  </h3>

                  <form onSubmit={handleAddPlan}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Plan Name *</label>
                        <input
                          type="text"
                          required
                          className="input"
                          placeholder="e.g. Weekly Kathiyawadi Saver"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Plan Type *</label>
                        <select
                          className="input"
                          style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)" }}
                          value={newPlan.type}
                          onChange={(e) => {
                            const val = e.target.value;
                            const meals = val === "monthly" ? 30 : val === "weekly" ? 7 : 1;
                            const cycle = val === "monthly" ? "30 days" : val === "weekly" ? "7 days" : "per meal";
                            const pauses = val === "monthly" ? 5 : val === "weekly" ? 1 : 0;
                            setNewPlan({
                              ...newPlan,
                              type: val,
                              mealsIncluded: meals,
                              billingCycle: cycle,
                              pauseAllowedDays: pauses,
                            });
                          }}
                        >
                          <option value="daily">Daily Plan</option>
                          <option value="weekly">Weekly Plan (7 Days)</option>
                          <option value="monthly">Monthly Plan (30 Days)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Total Price (₹) *</label>
                        <input
                          type="number"
                          required
                          min="50"
                          className="input"
                          value={newPlan.price}
                          onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="label">Meals Included *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="input"
                          value={newPlan.mealsIncluded}
                          onChange={(e) => setNewPlan({ ...newPlan, mealsIncluded: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Calculated Per-Meal Preview */}
                    <div style={{ background: "var(--surface-alt)", padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>Calculated Rate: <strong>₹{Math.round(newPlan.price / Math.max(1, newPlan.mealsIncluded))}/meal</strong></span>
                      <span>Take-Home (90%): <strong style={{ color: "var(--secondary)" }}>₹{Math.round(newPlan.price * 0.90)}</strong></span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Billing Cycle (e.g. 7 days, /month)</label>
                        <input
                          type="text"
                          required
                          className="input"
                          value={newPlan.billingCycle}
                          onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Max Pause Days Allowed</label>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          className="input"
                          value={newPlan.pauseAllowedDays}
                          onChange={(e) => setNewPlan({ ...newPlan, pauseAllowedDays: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* What's Included Input */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">What&apos;s Included (Comma-separated items) *</label>
                      <textarea
                        rows={2}
                        required
                        className="input"
                        style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "inherit" }}
                        placeholder="e.g. 1 Fresh Sabzi, Dal/Kadhi, 4 Phulkas, Rice/Khichdi, Sunday Dessert"
                        value={newPlan.includesText}
                        onChange={(e) => setNewPlan({ ...newPlan, includesText: e.target.value })}
                      />
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Presets:</span>
                        {[
                          { label: "Homestyle Thali", text: "1 Fresh Sabzi, Dal/Kadhi, 4 Phulkas, Steamed Rice" },
                          { label: "Kathiyawadi Thali", text: "Ringan No Olo, 2x Bajra Rotlo, Desi Kadhi, Khichdi, Garlic Chutney" },
                          { label: "Royal Feast", text: "2 Special Sabzis, Dal Fry, 4 Ghee Phulkas, Jeera Rice, Sweet & Papad" }
                        ].map((pr, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setNewPlan({ ...newPlan, includesText: pr.text })}
                            style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-alt)", color: "var(--text)", cursor: "pointer" }}
                          >
                            + {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Chef Signature Dish (Optional)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Sev Tameta Nu Shaak"
                          value={newPlan.specialItem || ""}
                          onChange={(e) => setNewPlan({ ...newPlan, specialItem: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Plan Badge Text (Optional)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Recommended, Best Value"
                          value={newPlan.badge}
                          onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Popular choice checkbox */}
                    <div style={{ marginBottom: "1rem", background: "var(--surface-alt)", padding: "0.75rem", borderRadius: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
                        <input
                          type="checkbox"
                          checked={newPlan.popular}
                          onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked, badge: e.target.checked ? "Most Popular Choice" : newPlan.badge })}
                          style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                        />
                        Highlight as Most Popular Choice (Adds orange border & highlight banner on store)
                      </label>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="label">Customer Description</label>
                      <textarea
                        rows={2}
                        className="input"
                        style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "inherit" }}
                        placeholder="Brief summary for subscribers (e.g. 7-day rotating wholesome plan with Sunday dessert special)."
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowAddPlanModal(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Add Plan to Kitchen
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Plan Modal */}
            {showEditPlanModal && editingPlan && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: "2rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Configure Plan: {editingPlan.name}
                  </h3>

                  <form onSubmit={handleSavePlan}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Plan Name *</label>
                        <input
                          type="text"
                          required
                          className="input"
                          value={editingPlan.name}
                          onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Plan Type *</label>
                        <select
                          className="input"
                          style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)" }}
                          value={editingPlan.type || "weekly"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingPlan({
                              ...editingPlan,
                              type: val,
                            });
                          }}
                        >
                          <option value="daily">Daily Plan</option>
                          <option value="weekly">Weekly Plan (7 Days)</option>
                          <option value="monthly">Monthly Plan (30 Days)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Total Price (₹) *</label>
                        <input
                          type="number"
                          required
                          min="50"
                          className="input"
                          value={editingPlan.price}
                          onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="label">Meals Included *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="input"
                          value={editingPlan.mealsIncluded}
                          onChange={(e) => setEditingPlan({ ...editingPlan, mealsIncluded: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Calculated Per-Meal Preview */}
                    <div style={{ background: "var(--surface-alt)", padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>Calculated Rate: <strong>₹{Math.round(editingPlan.price / Math.max(1, editingPlan.mealsIncluded))}/meal</strong></span>
                      <span>Take-Home (90%): <strong style={{ color: "var(--secondary)" }}>₹{Math.round(editingPlan.price * 0.90)}</strong></span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Billing Cycle (e.g. 7 days, /month)</label>
                        <input
                          type="text"
                          required
                          className="input"
                          value={editingPlan.billingCycle}
                          onChange={(e) => setEditingPlan({ ...editingPlan, billingCycle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Max Pause Allowance (Days)</label>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          className="input"
                          value={editingPlan.pauseAllowedDays}
                          onChange={(e) => setEditingPlan({ ...editingPlan, pauseAllowedDays: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* What's Included Input */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">What&apos;s Included (Comma-separated items) *</label>
                      <textarea
                        rows={2}
                        required
                        className="input"
                        style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "inherit" }}
                        placeholder="e.g. 1 Fresh Sabzi, Dal/Kadhi, 4 Phulkas, Rice/Khichdi, Sunday Dessert"
                        value={editingPlan.includesText ?? (Array.isArray(editingPlan.includes) ? editingPlan.includes.join(", ") : "")}
                        onChange={(e) => setEditingPlan({ ...editingPlan, includesText: e.target.value })}
                      />
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Presets:</span>
                        {[
                          { label: "Homestyle Thali", text: "1 Fresh Sabzi, Dal/Kadhi, 4 Phulkas, Steamed Rice" },
                          { label: "Kathiyawadi Thali", text: "Ringan No Olo, 2x Bajra Rotlo, Desi Kadhi, Khichdi, Garlic Chutney" },
                          { label: "Royal Feast", text: "2 Special Sabzis, Dal Fry, 4 Ghee Phulkas, Jeera Rice, Sweet & Papad" }
                        ].map((pr, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setEditingPlan({ ...editingPlan, includesText: pr.text })}
                            style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-alt)", color: "var(--text)", cursor: "pointer" }}
                          >
                            + {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Chef Signature Dish</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Sev Tameta Nu Shaak"
                          value={editingPlan.specialItem || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, specialItem: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Badge Text</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Most Popular Choice"
                          value={editingPlan.badge || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Popular choice checkbox */}
                    <div style={{ marginBottom: "1rem", background: "var(--surface-alt)", padding: "0.75rem", borderRadius: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(editingPlan.popular)}
                          onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked, badge: e.target.checked ? "Most Popular Choice" : editingPlan.badge })}
                          style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                        />
                        Highlight as Most Popular Choice (Adds orange border & highlight banner on store)
                      </label>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="label">Customer Description / Perks</label>
                      <textarea
                        rows={2}
                        className="input"
                        style={{ background: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border)", fontFamily: "inherit" }}
                        value={editingPlan.description}
                        onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowEditPlanModal(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Plan Rates & Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: SUBSCRIBERS ("and his subscription") */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "subscribers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                  Active Subscribers & Customers 👥
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                  Manage ongoing subscriptions, meal progress, dietary notes, and direct WhatsApp contact.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleSimulateTestSubscriber}
                  className="btn btn-outline"
                >
                  <Sparkles size={15} /> Simulate Test Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(true)}
                  className="btn btn-primary"
                >
                  <Plus size={15} /> Add Subscriber Manually
                </button>
              </div>
            </div>

            {subscribers.length === 0 ? (
              <div className="card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                <Users size={48} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  No Active Subscribers Yet
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", maxWidth: 460, margin: "0 auto 1.5rem" }}>
                  Your kitchen is verified and listed on HomeFeast. As residents in {profile.city} choose your meal plans, they will appear here with automated daily dispatch tickets.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={handleSimulateTestSubscriber} className="btn btn-primary">
                    <Sparkles size={15} /> Add Sample Subscriber to Preview
                  </button>
                  <button onClick={() => setShowAddSubscriberModal(true)} className="btn btn-outline">
                    <Plus size={15} /> Register Offline Customer
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {subscribers.map((sub) => {
                  const whatsappUrl = `https://wa.me/${sub.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${sub.name}, this is ${profile.shopName} regarding your tiffin subscription. Please let us know if you need any adjustments to today's meal!`
                  )}`;
                  return (
                    <div key={sub.id} className="card" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                              {sub.name}
                            </h3>
                            <span
                              className={`badge ${
                                sub.status === "ACTIVE" ? "badge-success" : "badge-warning"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.35rem 0" }}>
                            Plan: <strong>{sub.plan}</strong> • Slot: <strong>{sub.slot}</strong> • Started: {sub.startDate}
                          </p>
                          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>
                            📍 Delivery Address: {sub.address}
                          </p>
                          {sub.dietPreference && (
                            <p style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, margin: "0.35rem 0 0" }}>
                              Note: &ldquo;{sub.dietPreference}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Progress and Remaining Meals */}
                        <div style={{ textAlign: "right", minWidth: 160 }}>
                          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>
                            Meals Remaining
                          </p>
                          <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)", margin: "0.15rem 0" }}>
                            {sub.remainingMeals} / {sub.totalMeals}
                          </p>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem", color: "var(--secondary)" }}
                        >
                          <MessageSquare size={14} /> WhatsApp Customer
                        </a>
                        <button
                          type="button"
                          onClick={() => handleTogglePauseSubscriber(sub.id)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                        >
                          {sub.status === "ACTIVE" ? <Pause size={14} /> : <Play size={14} />}
                          {sub.status === "ACTIVE" ? "Pause Meal Dispatch" : "Resume Meal Dispatch"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.id, sub.name)}
                          className="btn btn-ghost"
                          style={{ color: "var(--danger)", fontSize: "0.8125rem", padding: "0.4rem 0.875rem", marginLeft: "auto" }}
                        >
                          <Trash2 size={14} /> Remove Subscriber
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Subscriber Modal */}
            {showAddSubscriberModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "1rem",
                }}
              >
                <div className="card" style={{ width: "100%", maxWidth: 500, padding: "2rem" }}>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Register Subscriber
                  </h3>

                  <form onSubmit={handleAddSubscriber}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="e.g. Rahul Mehta"
                        value={newSubscriber.name}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Mobile Number (10 digits) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        className="input"
                        placeholder="10-digit mobile number"
                        value={newSubscriber.phone}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="label">Subscription Plan</label>
                        <select
                          className="input"
                          value={newSubscriber.plan}
                          onChange={(e) => setNewSubscriber({ ...newSubscriber, plan: e.target.value })}
                        >
                          <option value="Daily Trial Plan">Daily Trial Plan</option>
                          <option value="Weekly Saver Plan (7 Days)">Weekly Saver Plan (7 Days)</option>
                          <option value="Monthly Home Plan (30 Days)">Monthly Home Plan (30 Days)</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Delivery Slot</label>
                        <select
                          className="input"
                          value={newSubscriber.slot}
                          onChange={(e) => setNewSubscriber({ ...newSubscriber, slot: e.target.value })}
                        >
                          <option value="Lunch (12–1:30 PM)">Lunch (12–1:30 PM)</option>
                          <option value="Dinner (7:30–9 PM)">Dinner (7:30–9 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label className="label">Delivery Address</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="e.g. Flat 301, Pushpak Apts, Kalavad Rd"
                        value={newSubscriber.address}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, address: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="label">Dietary Instructions</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Jain (No garlic), less oil, extra roti"
                        value={newSubscriber.dietPreference}
                        onChange={(e) => setNewSubscriber({ ...newSubscriber, dietPreference: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => setShowAddSubscriberModal(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Add Subscriber & Start Tiffin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: TODAY'S PACKING & DISPATCH */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                  Today&apos;s Tiffin Packing & Dispatch Station 🍱
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                  Check off packed meal components and transition orders from cooking to out-for-delivery.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {orders.some(o => o.status === "DELIVERED") && (
                  <button
                    type="button"
                    onClick={clearDeliveredOrders}
                    className="btn btn-ghost"
                    style={{ fontSize: "0.8125rem" }}
                  >
                    Clear Delivered Tiffins
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSimulateTestSubscriber}
                  className="btn btn-outline"
                >
                  <Plus size={15} /> Add Instant Order
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                <CheckCircle size={48} style={{ color: "var(--secondary)", margin: "0 auto 1rem" }} />
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  All Tiffins Packed & Delivered!
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", maxWidth: 420, margin: "0 auto 1.5rem" }}>
                  There are no pending tiffin deliveries in your queue for right now. Next dispatch cycle will open for tomorrow&apos;s lunch slot.
                </p>
                <button onClick={handleSimulateTestSubscriber} className="btn btn-primary">
                  <Sparkles size={15} /> Generate Test Tiffin Order
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {orders.map((o) => {
                  const packed = o.packedItems || {};
                  return (
                    <div key={o.id} className="card" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                              {o.customer}
                            </h3>
                            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                              ({o.plan})
                            </span>
                          </div>
                          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                            Slot: <strong>{o.slot}</strong> • 📍 {o.address}
                          </p>
                        </div>

                        <span
                          className={`badge ${
                            o.status === "DELIVERED"
                              ? "badge-success"
                              : o.status === "OUT_FOR_DELIVERY"
                              ? "badge-warning"
                              : o.status === "IN_PREPARATION"
                              ? "badge-active"
                              : "badge-primary"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Items and Packing Checklist */}
                      <div style={{ background: "var(--surface-alt)", borderRadius: "10px", padding: "1rem", marginBottom: "1.25rem" }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 0.5rem" }}>
                          Packing Checklist (Tick before handing over):
                        </p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          {[
                            { key: "sabzi", label: "Sabzi Containers Packed" },
                            { key: "rotis", label: "Fresh Phulkas / Rotlo (Ghee)" },
                            { key: "dal", label: "Dal / Kadhi Container" },
                            { key: "rice", label: "Rice / Khichdi & Salad" },
                          ].map((chk) => (
                            <label
                              key={chk.key}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: packed[chk.key] ? "var(--secondary)" : "var(--text)",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!packed[chk.key]}
                                onChange={() => togglePackItem(o.id, chk.key)}
                                style={{ accentColor: "var(--secondary)", width: 16, height: 16 }}
                              />
                              {chk.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* State Machine Transition Actions */}
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", marginRight: "0.5rem" }}>
                          Dispatch Stage:
                        </span>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, "IN_PREPARATION")}
                          className={`btn ${o.status === "IN_PREPARATION" ? "btn-primary" : "btn-outline"}`}
                          style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                        >
                          🔥 1. Cooking in Kitchen
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, "OUT_FOR_DELIVERY")}
                          className={`btn ${o.status === "OUT_FOR_DELIVERY" ? "btn-primary" : "btn-outline"}`}
                          style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                        >
                          🛵 2. Out for Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(o.id, "DELIVERED")}
                          className={`btn ${o.status === "DELIVERED" ? "btn-secondary" : "btn-outline"}`}
                          style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                        >
                          ✓ 3. Delivered to Customer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: EARNINGS & PAYOUTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "earnings" && (
          <div>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>
                Cook Earnings & Direct Payouts 📈
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                Weekly direct bank settlement every Monday morning via IMPS/NEFT.
              </p>
            </div>

            {/* Payout Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>Gross Revenue</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--primary)", margin: "0.35rem 0 0" }}>
                  ₹{calculatedGrossRevenue.toLocaleString("en-IN")}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>Based on active subscriptions</p>
              </div>

              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>Platform Commission (10%)</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--danger)", margin: "0.35rem 0 0" }}>
                  -₹{commission.toLocaleString("en-IN")}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>Logistics & customer care fee</p>
              </div>

              <div className="card" style={{ padding: "1.5rem", border: "1.5px solid var(--secondary)" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--secondary)", fontWeight: 700, margin: 0 }}>Net Bank Deposit</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--secondary)", margin: "0.35rem 0 0" }}>
                  ₹{netEarnings.toLocaleString("en-IN")}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>Settles every Monday 09:00 AM</p>
              </div>
            </div>

            {/* Weekly Trend Chart */}
            <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Settlement & Revenue Velocity
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                    Daily subscription delivery credits
                  </p>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>✓ 100% on-time settlement</span>
              </div>
              <EarningsChart orders={orders} isDemo={currentUser?.email === "demo@cook.com"} />
            </div>

            {/* Bank Card */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: "0 0 0.5rem" }}>
                    Registered Bank Account for Payouts
                  </h3>
                  {profile.bankAccount ? (
                    <>
                      <p style={{ fontSize: "0.95rem", color: "var(--text)", margin: 0 }}>
                        {profile.bankName} • Account: <strong>{profile.bankAccount}</strong>
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                        IFSC: {profile.bankIfsc} • Holder: {profile.bankHolder || profile.headCook}
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
                      ⚠️ No payout bank account linked yet. Please add your settlement bank details to receive weekly direct deposits.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={profile.bankAccount ? "btn btn-outline" : "btn btn-primary"}
                  style={{ fontSize: "0.8125rem" }}
                >
                  {profile.bankAccount ? "Update Bank Details" : "+ Link Bank Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
