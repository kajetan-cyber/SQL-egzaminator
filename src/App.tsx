import { useEffect, useMemo, useState } from "react";
import LessonList from "./components/LessonList";
import LessonView from "./components/LessonView";
import { lessons } from "./data/lessons";

export type LessonStatus = "unanswered" | "correct" | "incorrect";

const progressStorageKey = "sql-egzaminator-progress";

function loadProgress(): Record<number, LessonStatus> {
  try {
    const value = window.localStorage.getItem(progressStorageKey);
    return value ? (JSON.parse(value) as Record<number, LessonStatus>) : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [statuses, setStatuses] = useState<Record<number, LessonStatus>>(loadProgress);

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0],
    [activeLessonId],
  );

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(statuses));
  }, [statuses]);

  function handleValidation(lessonId: number, correct: boolean) {
    setStatuses((currentStatuses) => ({
      ...currentStatuses,
      [lessonId]: correct ? "correct" : "incorrect",
    }));
  }

  return (
    <div className="app-shell">
      <LessonList
        activeLessonId={activeLesson.id}
        lessons={lessons}
        onSelectLesson={setActiveLessonId}
        statuses={statuses}
      />
      <LessonView key={activeLesson.id} lesson={activeLesson} onValidation={handleValidation} />
    </div>
  );
}
