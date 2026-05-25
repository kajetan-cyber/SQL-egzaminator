import { tableSchemas, type TableName } from "../db/schema";

interface SchemaViewerProps {
  tables: TableName[];
}

export default function SchemaViewer({ tables }: SchemaViewerProps) {
  if (tables.length === 0) {
    return null;
  }

  return (
    <section className="panel schema-viewer" aria-labelledby="schema-heading">
      <div className="section-heading">
        <h2 id="schema-heading">Schemat tabel</h2>
      </div>
      <div className="schema-grid">
        {tables.map((tableName) => (
          <article className="schema-table" key={tableName}>
            <h3>{tableName}</h3>
            <ul>
              {tableSchemas[tableName].map((column) => (
                <li key={column.name}>
                  <span>{column.name}</span>
                  <code>
                    {column.type}
                    {column.required && !column.type.includes("PRIMARY KEY") ? " NOT NULL" : ""}
                  </code>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
