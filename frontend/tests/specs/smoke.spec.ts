import { test, expect } from "@playwright/test";

test.describe("Smoke test", () => {
  test("Homepage displays static heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Hi! I'm Marco" }),
    ).toBeVisible();
  });
});
