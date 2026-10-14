/**
 * HomeFeast Playwright End-to-End (E2E) Test Suite
 * Covers the primary user journey:
 * 1. Visit homepage
 * 2. Search for cooks by city and meal type
 * 3. Inspect Cook profile and weekly menu
 * 4. Select subscription plan (1-Day Trial / Weekly / Monthly)
 * 5. Complete Checkout flow with coupon discount
 * 6. Verify confirmation
 */

import { test, expect } from "@playwright/test";

test.describe("HomeFeast Core User Journey Flow", () => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  test("1. Homepage renders hero, search bar, and featured cooks", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/HomeFeast/);

    // Hero headline
    const heading = page.locator("h1");
    await expect(heading).toContainText("Maa Ke Haath Ka Khana");

    // City and meal search bar
    const searchForm = page.locator("#hero-search-form");
    await expect(searchForm).toBeVisible();

    // Featured cooks
    const cookCards = page.locator(".cook-card");
    const count = await cookCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("2. Browse / Search cooks with filters", async ({ page }) => {
    await page.goto(`${BASE_URL}/search?city=Rajkot`);

    // Verify search page header
    const searchHeader = page.locator("h1");
    await expect(searchHeader).toContainText("Tiffin Providers");

    // Filter controls: Veg Only toggle
    const vegFilter = page.locator("button:has-text('Veg Only')");
    await expect(vegFilter).toBeVisible();
    await vegFilter.click();

    // List view should show filtered results
    const results = page.locator(".cook-card");
    await expect(results.first()).toBeVisible();
  });

  test("3. View Cook Profile and Weekly Menu", async ({ page }) => {
    await page.goto(`${BASE_URL}/cooks/c1`);

    // Cook kitchen name
    const cookName = page.locator("h1");
    await expect(cookName).toContainText("Meera");

    // FSSAI Badge
    const fssaiBadge = page.locator("text=FSSAI Verified");
    await expect(fssaiBadge).toBeVisible();

    // 7-day weekly menu tabs
    const menuSection = page.locator("text=7-Day Rotating Menu");
    await expect(menuSection).toBeVisible();

    // Select Weekly or Trial plan button
    const subscribeBtn = page.locator("a:has-text('Select Plan')").first();
    await expect(subscribeBtn).toBeVisible();
  });

  test("4. Complete Checkout Flow with Coupon Code", async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout?cookId=c1&planId=p2&planName=Weekly+Plan&price=749`);

    // Verify checkout details
    await expect(page.locator("h1")).toContainText("Subscribe to Meera's Kitchen");

    // Fill delivery form
    await page.fill("input[name='fullName']", "Rohan Mehta");
    await page.fill("input[name='phone']", "9876543210");
    await page.fill("textarea[name='address']", "Flat 402, Royal Residency, Kalavad Road, Rajkot");

    // Apply Coupon Code
    await page.fill("input[placeholder='Enter FIRSTFEAST']", "FIRSTFEAST");
    await page.click("button:has-text('Apply')");

    // Submit Order
    const placeOrderBtn = page.locator("#place-order-btn");
    await placeOrderBtn.click();

    // Expect Confirmation
    const confirmationModal = page.locator("text=Subscription Request Sent!");
    await expect(confirmationModal).toBeVisible({ timeout: 5000 });
  });
});
