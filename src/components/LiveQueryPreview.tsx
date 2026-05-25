import { useEffect, useState } from "react";
import type { QueryResult, SqlValue } from "../db/database";
import { executeSqlOnFreshDatabase } from "../db/database";

interface LiveQueryPreviewProps {
  sql: string;
}

interface LivePreviewState {
  result: QueryResult;
  error?: string;
  isLoading: boolean;
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

function LiveResultTable({ result }: { result: QueryResult }) {
  if (result.columns.length === 0) {
    return <div className="empty-state">Zapytanie nie zwróciło tabeli wynikowej.</div>;
  }

  return (
    <div className="table-scroll live-result-scroll">
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
            <tr key={`live-result-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td className={cell === null ? "null-cell" : ""} key={`live-result-${rowIndex}-${cellIndex}`}>
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

export default function LiveQueryPreview({ sql }: LiveQueryPreviewProps) {
  const [state, setState] = useState<LivePreviewState>({
    result: { columns: [], values: [] },
    isLoading: false,
  });

  useEffect(() => {
    const trimmedSql = sql.trim();

    if (!trimmedSql) {
      setState({
        result: { columns: [], values: [] },
        isLoading: false,
      });
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: undefined,
      }));

      const execution = await executeSqlOnFreshDatabase(trimmedSql);

      if (!cancelled) {
        setState({
          result: execution.result,
          error: execution.error,
          isLoading: false,
        });
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [sql]);

  const hasSql = sql.trim().length > 0;

  return (
    <section className="panel live-preview" aria-live="polite" aria-labelledby="live-preview-heading">
      <div className="section-heading">
        <div>
          <h2 id="live-preview-heading">Mój wynik na żywo</h2>
          <p>Tabela aktualizuje się automatycznie podczas pisania w edytorze SQL.</p>
        </div>
        {state.isLoading && <span className="live-preview-status">Aktualizuję...</span>}
      </div>

      {!hasSql && <div className="empty-state">Wpisz zapytanie SQL, a tutaj pojawi się aktualny wynik.</div>}

      {hasSql && state.error && (
        <div className="sqlite-error live-error">
          <strong>Błąd SQLite</strong>
          <pre>{state.error}</pre>
        </div>
      )}

      {hasSql && !state.error && <LiveResultTable result={state.result} />}
    </section>
  );
}
