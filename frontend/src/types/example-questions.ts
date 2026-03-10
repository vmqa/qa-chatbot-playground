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
    label: "AI Agentic development",
    question: "How do you set up testing process in agentic AI development pipeline?",
  },
] as const;

export type ExampleQuestion = typeof EXAMPLE_QUESTIONS[number];
export type ExampleQuestionLabel = typeof EXAMPLE_QUESTIONS[number]['label'];
