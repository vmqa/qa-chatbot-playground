import { expect, Locator, Page } from "@playwright/test";
import { step } from "~support/decorators";
import { BasePage } from "~support/BasePage.pom";

export class BlogPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators

  private locatePageTitle(): Locator {
    return this.page.getByRole("heading", { name: "QA Automation Blog" });
  }

  private locateBackToChatButton(): Locator {
    return this.page.getByTestId("blog-back-to-chat");
  }

  private locateSearchInput(): Locator {
    return this.page.getByTestId("blog-search");
  }

  private locateSortBySelect(): Locator {
    return this.page.getByTestId("blog-sort-by");
  }

  private locateSortOrderSelect(): Locator {
    return this.page.getByTestId("blog-sort-order");
  }

  private locateItemsPerPageSelect(): Locator {
    return this.page.getByTestId("blog-items-per-page");
  }

  private locateResultsCount(): Locator {
    return this.page.getByTestId("blog-results-count");
  }

  private locateArticlesGrid(): Locator {
    return this.page.getByTestId("blog-articles-grid");
  }

  private locateArticle(slug: string): Locator {
    return this.page.getByTestId(`blog-article-${slug}`);
  }

  private locateNoResults(): Locator {
    return this.page.getByTestId("blog-no-results");
  }

  private locateTagFilter(tag: string): Locator {
    return this.page.getByTestId(`blog-tag-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`);
  }

  private locateClearFiltersButton(): Locator {
    return this.page.getByTestId("blog-clear-filters");
  }

  private locatePaginationPrev(): Locator {
    return this.page.getByTestId("blog-pagination-prev");
  }

  private locatePaginationNext(): Locator {
    return this.page.getByTestId("blog-pagination-next");
  }

  private locatePaginationPage(page: number): Locator {
    return this.page.getByTestId(`blog-pagination-page-${page}`);
  }

  // Actions

  @step()
  async goto() {
    await this.navigate("/blog");
    await this.waitForPageReady();
    await this.toHavePageTitle();
  }

  @step()
  async searchArticles(query: string) {
    await this.locateSearchInput().fill(query);
  }

  @step()
  async clearSearch() {
    await this.locateSearchInput().clear();
  }

  @step()
  async selectSortBy(sortBy: "date" | "name") {
    await this.locateSortBySelect().selectOption(sortBy);
  }

  @step()
  async selectSortOrder(order: "asc" | "desc") {
    await this.locateSortOrderSelect().selectOption(order);
  }

  @step()
  async selectItemsPerPage(items: number) {
    await this.locateItemsPerPageSelect().selectOption(items.toString());
  }

  @step()
  async clickTagFilter(tag: string) {
    await this.locateTagFilter(tag).click();
  }

  @step()
  async clearFilters() {
    await this.locateClearFiltersButton().click();
  }

  @step()
  async clickArticle(slug: string) {
    await this.locateArticle(slug).click();
  }

  @step()
  async clickBackToChat() {
    await this.locateBackToChatButton().click();
  }

  @step()
  async clickPaginationNext() {
    await this.locatePaginationNext().click();
  }

  @step()
  async clickPaginationPrev() {
    await this.locatePaginationPrev().click();
  }

  @step()
  async clickPaginationPage(page: number) {
    await this.locatePaginationPage(page).click();
  }

  // Assertions

  @step()
  async toHavePageTitle() {
    const pageTitle = this.locatePageTitle();
    await expect(
      pageTitle,
      "Blog page title should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveBackToChatButton() {
    await expect(
      this.locateBackToChatButton(),
      "Back to Chat button should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveSearchInput() {
    await expect(
      this.locateSearchInput(),
      "Search input should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveArticlesGrid() {
    await expect(
      this.locateArticlesGrid(),
      "Articles grid should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveArticle(slug: string) {
    await expect(
      this.locateArticle(slug),
      `Article "${slug}" should be visible`,
    ).toBeVisible();
  }

  @step()
  async notToHaveArticle(slug: string) {
    await expect(
      this.locateArticle(slug),
      `Article "${slug}" should not be visible`,
    ).toBeHidden();
  }

  @step()
  async toHaveNoResults() {
    await expect(
      this.locateNoResults(),
      "No results message should be visible",
    ).toBeVisible();
  }

  @step()
  async toHaveResultsCount(expectedCount: string) {
    await expect(
      this.locateResultsCount(),
      `Results count should contain "${expectedCount}"`,
    ).toContainText(expectedCount);
  }

  @step()
  async toHaveTagFilterActive(tag: string) {
    const tagFilter = this.locateTagFilter(tag);
    await expect(
      tagFilter,
      `Tag filter "${tag}" should have active styling`,
    ).toHaveClass(/bg-\[var\(--primary\)\]/);
  }

  @step()
  async toHavePaginationPage(page: number) {
    await expect(
      this.locatePaginationPage(page),
      `Pagination page ${page} should be visible`,
    ).toBeVisible();
  }

  @step()
  async toHavePaginationPageActive(page: number) {
    const paginationPage = this.locatePaginationPage(page);
    await expect(
      paginationPage,
      `Pagination page ${page} should be active`,
    ).toHaveClass(/bg-\[var\(--primary\)\]/);
  }

  @step()
  async toHavePaginationNextDisabled() {
    await expect(
      this.locatePaginationNext(),
      "Pagination Next button should be disabled",
    ).toBeDisabled();
  }

  @step()
  async toHavePaginationPrevDisabled() {
    await expect(
      this.locatePaginationPrev(),
      "Pagination Prev button should be disabled",
    ).toBeDisabled();
  }

  @step()
  async toBeOnBlogPage() {
    await this.toHavePageTitle();
    await this.toHaveSearchInput();
  }
}
