import { test } from "@playwright/test";
import { MainChatPage } from "~pom/MainChatPage.pom";
import { HeaderPage } from "~pom/HeaderPage.pom";
import { BlogPage } from "~pom/BlogPage.pom";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.resolve(__dirname, "../../reports/screenshots");

test.describe("Mobile burger menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  let mainChatPage: MainChatPage;
  let headerPage: HeaderPage;

  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    mainChatPage = new MainChatPage(page);
    headerPage = new HeaderPage(page);
    await mainChatPage.goto();
  });

  test("Open burger menu and navigate to Blog", async ({ page }, testInfo) => {
    const blogPage = new BlogPage(page);

    await test.step("Verify burger menu button is visible on mobile", async () => {
      await headerPage.toHaveMobileMenuButtonVisible();
      await headerPage.toHaveMobileMenuClosed();
      const screenshot = await page.screenshot();
      await testInfo.attach("01-burger-menu-initial", { body: screenshot, contentType: "image/png" });
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "01-burger-menu-initial.png"), screenshot);
    });

    await test.step("Open burger menu", async () => {
      await headerPage.clickMobileMenuButton();
      await headerPage.toHaveMobileMenuOpen();
      await headerPage.toHaveMobileMenuLink("Chat");
      await headerPage.toHaveMobileMenuLink("Blog");
      const screenshot = await page.screenshot();
      await testInfo.attach("02-burger-menu-open", { body: screenshot, contentType: "image/png" });
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "02-burger-menu-open.png"), screenshot);
    });

    await test.step("Navigate to Blog via mobile menu", async () => {
      await headerPage.clickMobileMenuLink("Blog");
      await blogPage.toBeOnBlogPage();
      const screenshot = await page.screenshot();
      await testInfo.attach("03-blog-page-after-navigation", { body: screenshot, contentType: "image/png" });
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "03-blog-page-after-navigation.png"), screenshot);
    });
  });
});
