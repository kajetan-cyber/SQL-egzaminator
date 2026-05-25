import type { QueryResult as QueryResultData, SqlValue } from "../db/database";
import type { ValidationResult } from "../lib/validator";

interface QueryResultProps {
  validationResult?: ValidationResult;
}

function formatValue(value: SqlValue): string {
  if (value === null) {
    return "NULL";
  }

  if (value instanceof Uint8Array) {
    return Array.from(value).join(", ");
  }

  return String(value);
}

function ResultTable({ result }: { result: QueryResultData }) {
  if (result.columns.length === 0) {
    return <div className="empty-state">Zapytanie nie zwróciło tabeli wynikowej.</div>;
  }

  return (
    <div className="table-scroll result-scroll">
      <table>
        <thead>
          <tr>
            {result.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, rowIndex) => (
            <tr key={`result-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td className={cell === null ? "null-cell" : ""} key={`result-${rowIndex}-${cellIndex}`}>
                  {formatValue(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QueryResult({ validationResult }: QueryResultProps) {
  if (!validationResult) {
    return (
      <section className="panel result-panel" aria-live="polite">
        <div className="empty-state">Wynik zapytania pojawi się tutaj po uruchomieniu odpowiedzi.</div>
      </section>
    );
  }

  const statusClass = validationResult.correct ? "correct" : "incorrect";

  return (
    <section className={`panel result-panel ${statusClass}`} aria-live="polite">
      <div className="result-banner">
        <strong>{validationResult.correct ? "Poprawnie" : "Niepoprawnie"}</strong>
        <span>{validationResult.message}</span>
      </div>

      {!validationResult.correct && validationResult.hint && <p className="hint">Podpowiedź: {validationResult.hint}</p>}

      {validationResult.type === "sql" && (
        <>
          {validationResult.error && (
            <div className="sqlite-error">
              <strong>Błąd SQLite</strong>
              <pre>{validationResult.error}</pre>
            </div>
          )}

          {!validationResult.correct && validationResult.expectedColumns.length > 0 && (
            <div className="expected-columns">
              <span>Oczekiwane kolumny:</span>
              {validationResult.expectedColumns.map((column) => (
                <code key={column}>{column}</code>
              ))}
            </div>
          )}

          <div className="section-heading compact-heading">
            <h2>Wynik użytkownika</h2>
          </div>
          <ResultTable result={validationResult.userResult} />
        </>
      )}
    </section>
  );
}
