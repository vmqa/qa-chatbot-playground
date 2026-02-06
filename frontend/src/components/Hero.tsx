interface HeroProps {
  onStartChat: () => void;
}

export default function Hero({ onStartChat }: HeroProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Hi, I&apos;m{" "}
          <span className="text-[var(--primary)]">Marco</span>
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-4">
          QA Engineer
        </p>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          He is my AI assistant
          that can answer your questions about my
          experience or skills.
        </p>
        <button
          type="button"
          onClick={onStartChat}
          data-testid="start-chat-button"
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Ask Marco
        </button>
      </div>
    </section>
  );
}
