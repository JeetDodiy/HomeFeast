import { z } from "zod";

// User Registration & Auth
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CUSTOMER", "COOK", "ADMIN"]).default("CUSTOMER"),
  cityId: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["CUSTOMER", "COOK", "ADMIN"]).default("CUSTOMER"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Cook Onboarding
export const CookOnboardingSchema = z.object({
  kitchenName: z.string().min(3, "Kitchen name must be at least 3 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  fssaiNo: z.string().regex(/^[0-9]{14}$/, "FSSAI must be a valid 14-digit registration number"),
  cityId: z.string().min(1, "City is required"),
  serviceAreas: z.array(z.string()).min(1, "Select at least one service area"),
  deliverySlots: z.array(z.string()).min(1, "Select at least one delivery slot"),
  cuisines: z.array(z.string()).min(1, "Select at least one cuisine"),
});

// Menu Item
export const MenuItemSchema = z.object({
  dishName: z.string().min(2, "Dish name must be at least 2 characters"),
  mealType: z.enum(["VEG", "NON_VEG"]),
  cuisineId: z.string().min(1, "Cuisine is required"),
  price: z.number().positive("Price must be positive"),
  availability: z.boolean().default(true),
  deliveryTime: z.string().default("Lunch & Dinner"),
  image: z.string().url("Invalid image URL").optional(),
});

// Subscription Plan
export const PlanSchema = z.object({
  name: z.string().min(2, "Plan name is required"),
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY", "TRIAL"]),
  price: z.number().positive("Price must be positive"),
  mealsPerDay: z.number().int().min(1).max(3).default(1),
  description: z.string().optional(),
});

// Subscription Creation
export const CreateSubscriptionSchema = z.object({
  cookId: z.string().min(1, "Cook is required"),
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
  slot: z.enum(["LUNCH", "DINNER", "BOTH"]),
  address: z.string().min(5, "Delivery address is required"),
  notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  paymentMethod: z.enum(["COD", "UPI_ON_DELIVERY"]).default("COD"),
});

// Pause / Skip Subscription (Cutoff check: before 8 PM previous day)
export const PauseSubscriptionSchema = z.object({
  dateToPause: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  reason: z.string().max(200).optional(),
});

// Review
export const CreateReviewSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  cookId: z.string().min(1, "Cook ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

// Complaint / Dispute
export const CreateComplaintSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  details: z.string().min(10, "Details must be at least 10 characters"),
});

// Admin Review Cook
export const AdminCookReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().optional(),
});
