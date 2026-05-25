import initSqlJs, { type Database, type QueryExecResult, type SqlJsStatic } from "sql.js";
import { schemaSql, tableSchemas, type TableName } from "./schema";
import { seedSql } from "./seed";

export type SqlValue = string | number | Uint8Array | null;

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
}

export interface QueryExecution {
  result: QueryResult;
  error?: string;
}

export interface TableSnapshot extends QueryResult {
  name: TableName;
}

let sqlModulePromise: Promise<SqlJsStatic> | null = null;

function getSqlWasmUrl(): string {
  const baseUri =
    typeof globalThis === "object" && "document" in globalThis
      ? (globalThis as unknown as { document: { baseURI: string } }).document.baseURI
      : "/";

  return new URL("sql-wasm.wasm", baseUri).toString();
}

function getSqlModule(): Promise<SqlJsStatic> {
  if (!sqlModulePromise) {
    sqlModulePromise = initSqlJs({
      locateFile: getSqlWasmUrl,
    });
  }

  return sqlModulePromise;
}

function toQueryResult(result?: QueryExecResult): QueryResult {
  if (!result) {
    return { columns: [], values: [] };
  }

  return {
    columns: result.columns,
    values: result.values as SqlValue[][],
  };
}

async function createSeededDatabase(): Promise<Database> {
  const SQL = await getSqlModule();
  const db = new SQL.Database();
  db.exec(schemaSql);
  db.exec(seedSql);
  return db;
}

export async function executeSqlOnFreshDatabase(sql: string): Promise<QueryExecution> {
  let db: Database | null = null;

  try {
    db = await createSeededDatabase();
    const results = db.exec(sql);
    return { result: toQueryResult(results.at(-1)) };
  } catch (error) {
    return {
      result: { columns: [], values: [] },
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    db?.close();
  }
}

export async function getTableSnapshot(tableName: TableName): Promise<TableSnapshot> {
  if (!(tableName in tableSchemas)) {
    throw new Error(`Nieznana tabela: ${tableName}`);
  }

  const execution = await executeSqlOnFreshDatabase(`SELECT * FROM "${tableName}"`);

  if (execution.error) {
    throw new Error(execution.error);
  }

  return {
    name: tableName,
    columns: execution.result.columns,
    values: execution.result.values,
  };
}
