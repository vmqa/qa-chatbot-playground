import { expect, Locator, Page } from "@playwright/test";
import { step } from "~support/decorators";
import { BasePage } from "~support/BasePage.pom";

export class HeaderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators

  private locateMobileMenuButton(): Locator {
    return this.page.getByTestId("mobile-menu-button");
  }

  private locateMobileMenu(): Locator {
    return this.page.getByTestId("mobile-menu");
  }

  private locateMobileMenuLink(name: string): Locator {
    return this.locateMobileMenu().getByRole("link", { name });
  }

  // Actions

  @step()
  async clickMobileMenuButton(): Promise<void> {
    await this.locateMobileMenuButton().click();
  }

  @step()
  async clickMobileMenuLink(name: string): Promise<void> {
    await this.locateMobileMenuLink(name).click();
  }

  // Assertions

  @step()
  async toHaveMobileMenuButtonVisible(): Promise<void> {
    await expect(
      this.locateMobileMenuButton(),
      "Mobile menu button should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveMobileMenuOpen(): Promise<void> {
    await expect(
      this.locateMobileMenu(),
      "Mobile menu should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveMobileMenuClosed(): Promise<void> {
    await expect(
      this.locateMobileMenu(),
      "Mobile menu should not be visible",
    ).toBeHidden();
  }

  @step()
  async toHaveMobileMenuLink(name: string): Promise<void> {
    await expect(
      this.locateMobileMenuLink(name),
      `Mobile menu should have "${name}" link`,
    ).toBeVisible();
  }
}
