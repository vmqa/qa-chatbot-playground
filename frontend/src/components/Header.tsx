"use client";

import { useState } from "react";
import Image from "next/image";

interface HeaderProps {
  currentPage?: "home" | "blog";
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with avatar */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="cursor-pointer"
              aria-label="Home"
            >
              <Image
                src="/avatar.png"
                alt="Ask Marco"
                width={95}
                height={95}
                className="rounded-full object-cover hover:ring-2 hover:ring-[var(--primary)] transition-all"
              />
            </a>
            <a href="/" className="text-xl font-bold text-[var(--primary)]">
              Ask Marco
            </a>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className={`transition-colors cursor-pointer ${
                currentPage === "home"
                  ? "text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
            >
              Chat
            </a>
            <span className="text-[var(--border)]">|</span>
            <a
              href="/blog"
              className={`transition-colors cursor-pointer ${
                currentPage === "blog"
                  ? "text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
            >
              Blog
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--border)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <a
              href="/"
              className={`block py-2 cursor-pointer ${
                currentPage === "home"
                  ? "text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </a>
            <a
              href="/blog"
              className={`block py-2 cursor-pointer ${
                currentPage === "blog"
                  ? "text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
