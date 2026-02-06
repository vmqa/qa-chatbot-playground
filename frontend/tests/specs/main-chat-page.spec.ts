import { test } from "@playwright/test";
import { MainChatPage } from "~pom/MainChatPage.pom";
import { BlogPage } from "~pom/BlogPage.pom";
import { GREETING_MARKERS, TEST_AUTOMATION_MARKERS } from "~fixtures/test-data";

test.describe("Main Chat Page", () => {
  let mainChatPage: MainChatPage;

  test.beforeEach(async ({ page }) => {
    mainChatPage = new MainChatPage(page);
    await mainChatPage.goto();
  });

  test("Chatbot responds to greeting", async () => {
    await test.step("Input chat message", async () => {
      await mainChatPage.toBeOnChatPage();
      await mainChatPage.toHaveInputFocusInsideChat();
      await mainChatPage.toHaveSubmitButtonBeDisabled();
      await mainChatPage.fillChatInput("Hello");
      await mainChatPage.clickSubmit();
      await mainChatPage.toHaveUserMessage("Hello");
    });

    await test.step("Verify assistant response", async () => {
      await mainChatPage.toHaveAssistantMessageContaining(GREETING_MARKERS);
      await mainChatPage.toHaveInputFocusInsideChat();
      await mainChatPage.toHaveSubmitButtonBeDisabled();
    });
  });

  test("Example questions", async () => {
    await test.step("Select example questions", async () => {
      await mainChatPage.toBeOnChatPage();
      await mainChatPage.toHaveSubmitButtonBeDisabled();
      await mainChatPage.toHavePlaceholderText(
        "Ask me about Quality Assurance...",
      );
      await mainChatPage.clickExampleQuestion("AI Testing");
      await mainChatPage.toHaveExampleChatInput(
        "How to approach AI testing today?",
      );
      await mainChatPage.toHaveSubmitButtonBeEnabled();
      await mainChatPage.clickExampleQuestion("Test Automation");
      await mainChatPage.toHaveExampleChatInput(
        "How to start in test automation?",
      );
    });

    await test.step("Verify assistant response", async () => {
      await mainChatPage.submitWithEnter();
      await mainChatPage.toHaveUserMessage("How to start in test automation?");
      await mainChatPage.toHaveAssistantMessageContaining(TEST_AUTOMATION_MARKERS);
    });
  });

  test("Navigation", async ({ page }) => {
    const blogPage = new BlogPage(page);

    await test.step("Click Blog page link", async () => {
      await mainChatPage.clickBlogLink();
      await blogPage.toBeOnBlogPage();
      await blogPage.toHaveArticlesGrid();
    });

    await test.step("Click back to Chat button", async () => {
      await blogPage.clickBackToChat();
      await mainChatPage.toBeOnChatPage();
    });
  });
});
