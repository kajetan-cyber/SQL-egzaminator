import { useMemo, useState } from "react";
import type { SqlValue, TableSnapshot } from "../db/database";

interface InteractiveTableProps {
  tables: TableSnapshot[];
  isLoading: boolean;
}

type SortDirection = "asc" | "desc";
type SortState = Record<string, { column: string | null; direction: SortDirection }>;

function formatValue(value: SqlValue): string {
  if (value === null) {
    return "NULL";
  }

  if (value instanceof Uint8Array) {
    return Array.from(value).join(", ");
  }

  return String(value);
}

function compareValues(left: SqlValue, right: SqlValue): number {
  if (left === null && right === null) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return formatValue(left).localeCompare(formatValue(right), "pl", { numeric: true });
}

export default function InteractiveTable({ tables, isLoading }: InteractiveTableProps) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState<SortState>({});
  const normalizedFilter = useMemo(() => filter.trim().toLocaleLowerCase("pl"), [filter]);

  function getRows(table: TableSnapshot) {
    const filteredRows = normalizedFilter
      ? table.values.filter((row) =>
          row.some((cell) => formatValue(cell).toLocaleLowerCase("pl").includes(normalizedFilter)),
        )
      : table.values;

    const tableSortState = sortState[table.name];

    if (!tableSortState?.column) {
      return filteredRows;
    }

    const columnIndex = table.columns.indexOf(tableSortState.column);

    if (columnIndex === -1) {
      return filteredRows;
    }

    return [...filteredRows].sort((left, right) => {
      const comparison = compareValues(left[columnIndex], right[columnIndex]);
      return tableSortState.direction === "asc" ? comparison : -comparison;
    });
  }

  function handleSort(tableName: string, column: string) {
    setSortState((currentState) => {
      const currentTableState = currentState[tableName];
      const direction = currentTableState?.column === column && currentTableState.direction === "asc" ? "desc" : "asc";

      return {
        ...currentState,
        [tableName]: { column, direction },
      };
    });
  }

  if (isLoading) {
    return (
      <section className="panel">
        <div className="empty-state">Ładowanie danych tabel...</div>
      </section>
    );
  }

  if (tables.length === 0) {
    return null;
  }

  return (
    <section className="panel interactive-table" aria-labelledby="data-heading">
      <div className="section-heading table-heading">
        <div>
          <h2 id="data-heading">Podgląd danych</h2>
          <p>Wszystkie tabele potrzebne w tym zadaniu są widoczne jednocześnie.</p>
        </div>
        <label className="table-filter">
          <span>Filtr</span>
          <input
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Szukaj we wszystkich tabelach"
            type="search"
            value={filter}
          />
        </label>
      </div>

      <div className="all-tables-grid">
        {tables.map((table) => {
          const rows = getRows(table);
          const tableSortState = sortState[table.name];

          return (
            <article className="data-table-card" key={table.name}>
              <div className="data-table-title">
                <h3>{table.name}</h3>
                <span>
                  {rows.length} / {table.values.length} wierszy
                </span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {table.columns.map((column) => (
                        <th key={column}>
                          <button onClick={() => handleSort(table.name, column)} type="button">
                            <span>{column}</span>
                            <span aria-hidden="true">
                              {tableSortState?.column === column
                                ? tableSortState.direction === "asc"
                                  ? "↑"
                                  : "↓"
                                : "↕"}
                            </span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td className="empty-table-row" colSpan={table.columns.length}>
                          Brak wierszy pasujących do filtra.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, rowIndex) => (
                        <tr key={`${table.name}-${rowIndex}`}>
                          {row.map((cell, cellIndex) => (
                            <td className={cell === null ? "null-cell" : ""} key={`${table.name}-${rowIndex}-${cellIndex}`}>
                              {formatValue(cell)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
