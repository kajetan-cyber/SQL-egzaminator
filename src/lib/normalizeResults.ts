import type { QueryResult } from "../db/database";

export type ComparableCell = string | number | null;

export interface CompareOptions {
  orderMatters: boolean;
}

export interface ComparisonResult {
  correct: boolean;
  message: string;
}

export function normalizeColumnName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl");
}

export function normalizeTextAnswer(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl");
}

function normalizeCell(value: unknown): ComparableCell {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Uint8Array) {
    return Array.from(value).join(",");
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? value : Number(value.toFixed(8));
  }

  return String(value);
}

function normalizeRows(result: QueryResult): ComparableCell[][] {
  return result.values.map((row) => row.map(normalizeCell));
}

function rowKey(row: ComparableCell[]): string {
  return JSON.stringify(row);
}

function rowsEqual(left: ComparableCell[][], right: ComparableCell[][]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((row, rowIndex) => {
    const otherRow = right[rowIndex];
    return row.length === otherRow.length && row.every((cell, cellIndex) => cell === otherRow[cellIndex]);
  });
}

export function compareQueryResults(
  userResult: QueryResult,
  expectedResult: QueryResult,
  options: CompareOptions,
): ComparisonResult {
  if (userResult.columns.length !== expectedResult.columns.length) {
    return {
      correct: false,
      message: `Liczba kolumn jest inna. Oczekiwano ${expectedResult.columns.length}, otrzymano ${userResult.columns.length}.`,
    };
  }

  const userRows = normalizeRows(userResult);
  const expectedRows = normalizeRows(expectedResult);

  if (userRows.length !== expectedRows.length) {
    return {
      correct: false,
      message: `Liczba wierszy jest inna. Oczekiwano ${expectedRows.length}, otrzymano ${userRows.length}.`,
    };
  }

  const leftRows = options.orderMatters ? userRows : [...userRows].sort((a, b) => rowKey(a).localeCompare(rowKey(b), "pl"));
  const rightRows = options.orderMatters
    ? expectedRows
    : [...expectedRows].sort((a, b) => rowKey(a).localeCompare(rowKey(b), "pl"));

  if (!rowsEqual(leftRows, rightRows)) {
    return {
      correct: false,
      message: options.orderMatters
        ? "Wiersze albo ich kolejność różnią się od wzorca."
        : "Zestaw wierszy różni się od wzorca.",
    };
  }

  return {
    correct: true,
    message: "Wynik zapytania jest zgodny z rozwiązaniem wzorcowym.",
  };
}
