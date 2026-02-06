"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Header from "@/components/Header";
import { articles, Article, ArticleContent } from "@/data/articles";

interface CollapsibleSectionProps {
  title: string;
  items: string[];
  testId: string;
}

function CollapsibleSection({ title, items, testId }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden my-4" data-testid={testId}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`${testId}-toggle`}
        className="w-full flex items-center justify-between p-4 bg-[var(--surface)] hover:bg-[var(--border)] transition-colors"
      >
        <span className="font-semibold text-[var(--text-primary)]">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-[var(--background)]" data-testid={`${testId}-content`}>
          <ul className="list-disc list-inside space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-[var(--text-primary)]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ content, language }: { content: string; language?: string }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden" data-testid="article-code-block">
      <SyntaxHighlighter
        language={language || "typescript"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header currentPage="blog" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Article Not Found</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors"
          >
            Back to Blog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header currentPage="blog" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          data-testid="article-back-link"
          className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-hover)] mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4" data-testid="article-title">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
              <span data-testid="article-author">By {article.author}</span>
              <span>•</span>
              <span data-testid="article-date">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span data-testid="article-readtime">{article.readTime} min read</span>
            </div>
            <p className="text-lg text-[var(--text-secondary)] mb-4" data-testid="article-description">
              {article.description}
            </p>
            <div className="flex flex-wrap gap-2" data-testid="article-tags">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  data-testid={`article-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none" data-testid="article-content">
            {article.content.map((block, index) => {
              switch (block.type) {
                case "heading":
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4"
                      data-testid={`article-heading-${index}`}
                    >
                      {block.content}
                    </h2>
                  );

                case "paragraph":
                  return (
                    <p
                      key={index}
                      className="text-[var(--text-primary)] mb-4 leading-relaxed"
                      data-testid={`article-paragraph-${index}`}
                    >
                      {block.content}
                    </p>
                  );

                case "code":
                  return <CodeBlock key={index} content={block.content || ""} language={block.language} />;

                case "image":
                  return (
                    <div key={index} className="my-6" data-testid={`article-image-${index}`}>
                      <img
                        src={block.content || ""}
                        alt={block.title || "Article image"}
                        className="w-full rounded-lg"
                      />
                      {block.title && (
                        <p className="text-sm text-[var(--text-secondary)] mt-2 text-center">{block.title}</p>
                      )}
                    </div>
                  );

                case "collapsible":
                  return (
                    <CollapsibleSection
                      key={index}
                      title={block.title || ""}
                      items={block.items || []}
                      testId={`article-collapsible-${index}`}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                data-testid="article-footer-back-link"
                className="inline-flex items-center px-4 py-2 text-[var(--primary)] border border-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Articles
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
