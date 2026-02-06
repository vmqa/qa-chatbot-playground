"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { articles } from "@/data/articles";

const ITEMS_PER_PAGE_OPTIONS = [10, 20];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  // Get all unique tags - limit to most popular ones
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    // Sort by frequency and take top 8 tags
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, []);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((article) =>
        selectedTags.some((tag) => article.tags.includes(tag))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });

    return filtered;
  }, [searchQuery, selectedTags, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);
  const paginatedArticles = filteredAndSortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    handleFilterChange();
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header currentPage="blog" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              QA Automation Blog
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Articles about test automation, Playwright, API testing, and AI-assisted testing
            </p>
          </div>
          <Link
            href="/"
            data-testid="blog-back-to-chat"
            className="hidden md:inline-flex items-center px-4 py-2 text-[var(--primary)] border border-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </Link>
        </div>

        {/* Mobile Back to Chat Button */}
        <div className="mb-4 md:hidden">
          <Link
            href="/"
            data-testid="blog-back-to-chat-mobile"
            className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </Link>
        </div>

        {/* Main Content: Articles on Left, Filters on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Articles Column (Left - 8 columns) */}
          <div className="lg:col-span-8">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-[var(--text-secondary)]" data-testid="blog-results-count">
                Showing {paginatedArticles.length} of {filteredAndSortedArticles.length} articles
              </p>
            </div>

            {/* Articles Grid */}
            {paginatedArticles.length === 0 ? (
              <div className="text-center py-12" data-testid="blog-no-results">
                <p className="text-lg text-[var(--text-secondary)]">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mb-8" data-testid="blog-articles-grid">
                {paginatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    data-testid={`blog-article-${article.slug}`}
                    className="block bg-[var(--surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-[var(--border)] flex-shrink-0">
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-testid={`blog-article-thumbnail-${article.slug}`}
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors" data-testid={`blog-article-title-${article.slug}`}>
                          {article.title}
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-3" data-testid={`blog-article-description-${article.slug}`}>
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3" data-testid={`blog-article-tags-${article.slug}`}>
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-[var(--border)] text-[var(--text-secondary)] text-xs rounded-full"
                              data-testid={`blog-article-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                          <span data-testid={`blog-article-date-${article.slug}`}>
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span data-testid={`blog-article-readtime-${article.slug}`}>
                            {article.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2" data-testid="blog-pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  data-testid="blog-pagination-prev"
                  className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--border)] transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      data-testid={`blog-pagination-page-${page}`}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "border-[var(--border)] hover:bg-[var(--border)]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="blog-pagination-next"
                  className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--border)] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Filters Column (Right - 4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="bg-[var(--surface)] rounded-lg shadow-sm p-4">
                <label htmlFor="search" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleFilterChange();
                  }}
                  placeholder="Search articles..."
                  data-testid="blog-search"
                  className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Sort Controls */}
              <div className="bg-[var(--surface)] rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Sort</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="sortBy" className="block text-xs text-[var(--text-secondary)] mb-1">
                      Sort By
                    </label>
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                      data-testid="blog-sort-by"
                      className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="date">Date</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sortOrder" className="block text-xs text-[var(--text-secondary)] mb-1">
                      Order
                    </label>
                    <select
                      id="sortOrder"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                      data-testid="blog-sort-order"
                      className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="itemsPerPage" className="block text-xs text-[var(--text-secondary)] mb-1">
                      Per Page
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      data-testid="blog-items-per-page"
                      className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tag Filters */}
              <div className="bg-[var(--surface)] rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2" data-testid="blog-tag-filters">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      data-testid={`blog-tag-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedTags([]);
                      handleFilterChange();
                    }}
                    data-testid="blog-clear-filters"
                    className="mt-3 text-xs text-[var(--primary)] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
