import { EXAMPLE_QUESTIONS } from "@/types/example-questions";

interface ExampleQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export default function ExampleQuestions({
  onQuestionClick,
}: ExampleQuestionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {EXAMPLE_QUESTIONS.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onQuestionClick(item.question)}
          data-testid="example-question"
          className={`px-4 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--chat-header-bg)] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 cursor-pointer ${
            index >= 3 ? "hidden sm:inline-flex" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
