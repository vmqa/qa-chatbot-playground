import { test } from "@playwright/test";
import { MainChatPage } from "~pom/MainChatPage.pom";

test.describe("AI Agentic development chip", () => {
  let mainChatPage: MainChatPage;

  test.beforeEach(async ({ page }) => {
    mainChatPage = new MainChatPage(page);
    await mainChatPage.goto();
  });

  test("Chip shows 'AI Agentic development' label", async ({ page }) => {
    await test.step("Verify chip is visible with correct label", async () => {
      await page
        .getByTestId("example-question")
        .filter({ hasText: "AI Agentic development" })
        .waitFor({ state: "visible" });
    });
  });

  test("Clicking chip fills input with correct question", async () => {
    await test.step("Click 'AI Agentic development' chip", async () => {
      await mainChatPage.toHaveSubmitButtonBeDisabled();
      await mainChatPage.clickExampleQuestion("AI Agentic development");
    });

    await test.step("Verify input value matches expected question", async () => {
      await mainChatPage.toHaveExampleChatInput(
        "How do you set up testing process in agentic AI development pipeline?",
      );
      await mainChatPage.toHaveSubmitButtonBeEnabled();
    });
  });

  test("'Test Automation' chip no longer exists", async ({ page }) => {
    await test.step("Verify 'Test Automation' chip is not present", async () => {
      const testAutomationChip = page
        .getByTestId("example-question")
        .filter({ hasText: "Test Automation" });
      await testAutomationChip.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
      const count = await testAutomationChip.count();
      if (count > 0) {
        throw new Error("'Test Automation' chip should not exist on the page");
      }
    });
  });
});
