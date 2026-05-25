import { useEffect, useState } from "react";
import { getLessonCategory, lessonCategoryLabels, type Lesson } from "../data/lessons";
import type { TableSnapshot } from "../db/database";
import { getTableSnapshot } from "../db/database";
import { validateSqlLesson, validateTextLesson, type ValidationResult } from "../lib/validator";
import InteractiveTable from "./InteractiveTable";
import QueryResult from "./QueryResult";
import SchemaViewer from "./SchemaViewer";
import SqlEditor from "./SqlEditor";
import LiveQueryPreview from "./LiveQueryPreview";
import TextAnswerInput from "./TextAnswerInput";

interface LessonViewProps {
  lesson: Lesson;
  onValidation: (lessonId: number, correct: boolean) => void;
}

function defaultSqlValue(lesson: Lesson): string {
  if (lesson.type !== "sql") {
    return "";
  }

  return "";
}

export default function LessonView({ lesson, onValidation }: LessonViewProps) {
  const [sql, setSql] = useState(defaultSqlValue(lesson));
  const [textAnswer, setTextAnswer] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>();
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [tableSnapshots, setTableSnapshots] = useState<TableSnapshot[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [loadError, setLoadError] = useState<string | undefined>();

  useEffect(() => {
    setSql(defaultSqlValue(lesson));
    setTextAnswer("");
    setValidationResult(undefined);
    setShowSolution(false);
  }, [lesson]);

  useEffect(() => {
    let cancelled = false;

    async function loadTables() {
      if (lesson.visibleTables.length === 0) {
        setTableSnapshots([]);
        return;
      }

      setIsLoadingTables(true);
      setLoadError(undefined);

      try {
        const snapshots = await Promise.all(lesson.visibleTables.map((tableName) => getTableSnapshot(tableName)));

        if (!cancelled) {
          setTableSnapshots(snapshots);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTables(false);
        }
      }
    }

    loadTables();

    return () => {
      cancelled = true;
    };
  }, [lesson]);

  async function handleRunSql() {
    setIsRunning(true);

    try {
      const result = await validateSqlLesson(lesson, sql);
      setValidationResult(result);
      onValidation(lesson.id, result.correct);
    } finally {
      setIsRunning(false);
    }
  }

  function handleRunText() {
    setIsRunning(true);
    const result = validateTextLesson(lesson, textAnswer);
    setValidationResult(result);
    onValidation(lesson.id, result.correct);
    setIsRunning(false);
  }

  return (
    <main className="lesson-view">
      <section className="lesson-hero">
        <div className="hero-tags">
          <span className="task-number">Zadanie {lesson.id}</span>
          <span className="category-label">{lessonCategoryLabels[getLessonCategory(lesson)]}</span>
        </div>
        <h2>{lesson.title}</h2>
        <p>{lesson.taskText}</p>
      </section>

      {lesson.type === "sql" && (
        <>
          <SchemaViewer tables={lesson.visibleTables} />
          {loadError ? (
            <section className="panel">
              <div className="sqlite-error">
                <strong>Nie udało się załadować tabel</strong>
                <pre>{loadError}</pre>
              </div>
            </section>
          ) : (
            <InteractiveTable isLoading={isLoadingTables} tables={tableSnapshots} />
          )}
          <SqlEditor isRunning={isRunning} onChange={setSql} onRun={handleRunSql} value={sql} />
          <LiveQueryPreview sql={sql} />
        </>
      )}

      {lesson.type === "text" && (
        <TextAnswerInput isRunning={isRunning} onChange={setTextAnswer} onRun={handleRunText} value={textAnswer} />
      )}

      <QueryResult validationResult={validationResult} />

      <section className="solution-bar">
        <button className="secondary-button" onClick={() => setShowSolution((value) => !value)} type="button">
          {showSolution ? "Ukryj rozwiązanie" : "Pokaż rozwiązanie"}
        </button>
        {showSolution && (
          <pre className="solution-code">
            <code>{lesson.solution}</code>
          </pre>
        )}
      </section>
    </main>
  );
}
