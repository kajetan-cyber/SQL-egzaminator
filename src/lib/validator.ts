import type { Lesson } from "../data/lessons";
import type { QueryResult } from "../db/database";
import { executeSqlOnFreshDatabase } from "../db/database";
import { compareQueryResults, normalizeTextAnswer } from "./normalizeResults";

export interface SqlValidationResult {
  type: "sql";
  correct: boolean;
  message: string;
  hint?: string;
  error?: string;
  userResult: QueryResult;
  expectedResult: QueryResult;
  expectedColumns: string[];
}

export interface TextValidationResult {
  type: "text";
  correct: boolean;
  message: string;
  hint?: string;
  expectedAnswer: string;
}

export type ValidationResult = SqlValidationResult | TextValidationResult;

export async function validateSqlLesson(lesson: Lesson, sql: string): Promise<SqlValidationResult> {
  if (!lesson.expectedSql) {
    throw new Error("Lekcja SQL nie ma zdefiniowanego rozwiązania wzorcowego.");
  }

  const expectedExecution = await executeSqlOnFreshDatabase(lesson.expectedSql);

  if (expectedExecution.error) {
    throw new Error(`Błąd w rozwiązaniu wzorcowym: ${expectedExecution.error}`);
  }

  const userExecution = await executeSqlOnFreshDatabase(sql);

  if (userExecution.error) {
    return {
      type: "sql",
      correct: false,
      message: "SQLite zwrócił błąd podczas wykonywania zapytania.",
      hint: lesson.hints[0],
      error: userExecution.error,
      userResult: userExecution.result,
      expectedResult: expectedExecution.result,
      expectedColumns: expectedExecution.result.columns,
    };
  }

  const comparison = compareQueryResults(userExecution.result, expectedExecution.result, {
    orderMatters: lesson.compareOrder ?? true,
  });

  return {
    type: "sql",
    correct: comparison.correct,
    message: comparison.message,
    hint: comparison.correct ? undefined : lesson.hints[0],
    userResult: userExecution.result,
    expectedResult: expectedExecution.result,
    expectedColumns: expectedExecution.result.columns,
  };
}

export function validateTextLesson(lesson: Lesson, value: string): TextValidationResult {
  if (!lesson.expectedTextAnswer) {
    throw new Error("Lekcja tekstowa nie ma zdefiniowanej odpowiedzi wzorcowej.");
  }

  const correct = normalizeTextAnswer(value) === normalizeTextAnswer(lesson.expectedTextAnswer);

  return {
    type: "text",
    correct,
    message: correct ? "Odpowiedź tekstowa jest poprawna." : "Odpowiedź różni się od wzorca.",
    hint: correct ? undefined : lesson.hints[0],
    expectedAnswer: lesson.expectedTextAnswer,
  };
}
