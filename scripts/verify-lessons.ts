import path from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database, type QueryExecResult } from "sql.js";
import { lessons } from "../src/data/lessons";
import type { QueryResult } from "../src/db/database";
import { schemaSql } from "../src/db/schema";
import { seedSql } from "../src/db/seed";
import { compareQueryResults, normalizeTextAnswer } from "../src/lib/normalizeResults";
import { shouldRequireOrderedResult } from "../src/lib/validator";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");
const SQL = await initSqlJs({
  locateFile: (file) => path.join(root, "node_modules", "sql.js", "dist", file),
});

function createDb(): Database {
  const db = new SQL.Database();
  db.exec(schemaSql);
  db.exec(seedSql);
  return db;
}

function toQueryResult(result?: QueryExecResult): QueryResult {
  if (!result) {
    return { columns: [], values: [] };
  }

  return {
    columns: result.columns,
    values: result.values as QueryResult["values"],
  };
}

function run(sql: string): QueryResult {
  const db = createDb();

  try {
    return toQueryResult(db.exec(sql).at(-1));
  } finally {
    db.close();
  }
}

const failures: string[] = [];

for (const lesson of lessons) {
  if (lesson.type === "sql") {
    if (!lesson.expectedSql) {
      failures.push(`Lekcja ${lesson.id}: brak expectedSql.`);
      continue;
    }

    try {
      const expected = run(lesson.expectedSql);
      const expectedAgain = run(lesson.expectedSql);
      const accepted = compareQueryResults(expectedAgain, expected, {
        orderMatters: shouldRequireOrderedResult(lesson),
      });

      if (!accepted.correct) {
        failures.push(`Lekcja ${lesson.id}: rozwiązanie wzorcowe nie przechodzi walidacji.`);
      }

      const wrong = compareQueryResults(run("SELECT 1 AS wrong_marker;"), expected, {
        orderMatters: shouldRequireOrderedResult(lesson),
      });

      if (wrong.correct) {
        failures.push(`Lekcja ${lesson.id}: oczywiście błędne zapytanie zostało uznane za poprawne.`);
      }
    } catch (error) {
      failures.push(`Lekcja ${lesson.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    if (!lesson.expectedTextAnswer) {
      failures.push(`Lekcja ${lesson.id}: brak expectedTextAnswer.`);
      continue;
    }

    const expected = normalizeTextAnswer(lesson.expectedTextAnswer);

    if (normalizeTextAnswer(lesson.solution) !== expected) {
      failures.push(`Lekcja ${lesson.id}: solution różni się od expectedTextAnswer.`);
    }

    if (normalizeTextAnswer("SELECT") === expected) {
      failures.push(`Lekcja ${lesson.id}: testowa zła odpowiedź pasuje do wzorca.`);
    }
  }
}

const aliasExpected = run(`
  SELECT Kraje.nazwa_kraju, Kraje.stolica
  FROM Kraje
  WHERE Kraje.kod IS NOT NULL
  ORDER BY Kraje.nazwa_kraju DESC;
`);
const aliasVariant = run(`
  SELECT Kraje.nazwa_kraju AS kraj, Kraje.stolica AS miasto_glowne
  FROM Kraje
  WHERE Kraje.kod IS NOT NULL
  ORDER BY Kraje.nazwa_kraju DESC;
`);
const aliasComparison = compareQueryResults(aliasVariant, aliasExpected, { orderMatters: true });

if (!aliasComparison.correct) {
  failures.push("Walidacja błędnie odrzuca poprawny wynik z innymi aliasami kolumn.");
}

const unorderedExpected = run(`
  SELECT Klienci.Nazwa, Zamowienia.IDzamowienia
  FROM Klienci
  LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta;
`);
const unorderedVariant = run(`
  SELECT Klienci.Nazwa, Zamowienia.IDzamowienia
  FROM Klienci
  LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
  ORDER BY Klienci.Nazwa DESC;
`);
const unorderedComparison = compareQueryResults(unorderedVariant, unorderedExpected, {
  orderMatters: shouldRequireOrderedResult({ taskText: "Wyświetl wszystkich klientów oraz numery zamówień, które mogą posiadać." }),
});

if (!unorderedComparison.correct) {
  failures.push("Walidacja błędnie wymaga kolejności dla zadania bez jasnego sortowania.");
}

const orderedExpected = run(`
  SELECT Kraje.nazwa_kraju, Kraje.stolica
  FROM Kraje
  WHERE Kraje.kod IS NOT NULL
  ORDER BY Kraje.nazwa_kraju DESC;
`);
const orderedWrongOrder = run(`
  SELECT Kraje.nazwa_kraju, Kraje.stolica
  FROM Kraje
  WHERE Kraje.kod IS NOT NULL
  ORDER BY Kraje.nazwa_kraju ASC;
`);
const orderedComparison = compareQueryResults(orderedWrongOrder, orderedExpected, {
  orderMatters: shouldRequireOrderedResult({
    taskText:
      "Wyświetl nazwy krajów i stolice dla krajów posiadających kod państwa. Posortuj odwrotnie alfabetycznie po nazwie kraju.",
  }),
});

if (orderedComparison.correct) {
  failures.push("Walidacja nie wymaga kolejności dla zadania z jasnym poleceniem sortowania.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Zweryfikowano ${lessons.length} zadań: wzorce przechodzą, błędne odpowiedzi odpadają.`);
