export const EXAMPLE_QUESTIONS = [
  {
    label: "Playwright",
    question: "What are the best practices for using Playwright in test automation?",
  },
  {
    label: "AI Testing",
    question: "How to approach AI testing today?",
  },
  {
    label: "CI/CD Pipelines",
    question: "Should I learn plumbing intead of coding these days?",
  },
  {
    label: "Selenium",
    question: "Is Selenium still alive now?",
  },
  {
    label: "Test Automation",
    question: "How to start in test automation?",
  },
] as const;

export type ExampleQuestion = typeof EXAMPLE_QUESTIONS[number];
export type ExampleQuestionLabel = typeof EXAMPLE_QUESTIONS[number]['label'];
