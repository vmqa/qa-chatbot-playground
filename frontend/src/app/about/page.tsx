import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | AI QA Playground — Free Test Automation Practice Project",
  description:
    "AI QA Playground is a free, open source test automation practice project built around a real AI chatbot. Practice Playwright, Pytest, and AI testing.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header currentPage="about" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">

        {/* Hero */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            About AI QA Playground
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            AI QA Playground is a free, open source test automation practice project built around
            a real AI chatbot application.
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mt-4">
            Unlike todo lists and login forms, this project gives you something worth testing —
            streaming responses, rate limiting, input validation, error handling, and a real
            OpenAI-powered backend. It&apos;s designed to help QA engineers build a test automation
            portfolio with realistic, production-style scenarios.
          </p>
        </section>

        {/* For QA Engineers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            For QA Engineers
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Practice test automation and AI testing against a real system — not a simplified demo.
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "UI automation with Playwright",
              "API testing with Pytest",
              "Handling async and streaming behavior",
              "AI testing scenarios: response validation, prompt boundary testing, rate limit handling",
              "Running tests in CI/CD with GitHub Actions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[var(--text-secondary)]">
                <span className="text-[var(--primary)] mt-1">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Run it locally with your own OpenAI key — full control, no restrictions, no cost.
            A solid addition to any test automation portfolio.
          </p>
        </section>

        {/* Building AI-Powered Applications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Building AI-Powered Applications
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            This project is also a working example of building an AI-powered application
            end-to-end — from requirements and architecture to deployment.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Everything was built with Claude Code: backend API, frontend UI, test suite, CI/CD
            pipelines, and deployment config. It demonstrates how QA engineers and developers
            can use AI agents to ship and test full-stack products faster.
          </p>
        </section>

        {/* Creator */}
        <section className="border-t border-[var(--border)] pt-10">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            About the Creator
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
            Idea by <span className="font-semibold text-[var(--text-primary)]">Vadym Marochok</span> — QA Engineer
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
            Feel free to connect on{" "}
            <a
              href="https://linkedin.com/in/vadym-m/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline"
            >
              LinkedIn
            </a>
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-4 italic">
            Implemented with Claude Code
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
