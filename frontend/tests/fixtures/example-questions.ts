import { EXAMPLE_QUESTIONS } from '@/types/example-questions';
import type { ExampleQuestionLabel } from '@/types/example-questions';

export { EXAMPLE_QUESTIONS };
export type { ExampleQuestionLabel };

export type ExampleQuestionText = typeof EXAMPLE_QUESTIONS[number]['question'];

export const getQuestionByLabel = (label: ExampleQuestionLabel): string => {
  const question = EXAMPLE_QUESTIONS.find(q => q.label === label);
  if (!question) {
    throw new Error(`Example question with label "${label}" not found`);
  }
  return question.question;
};
