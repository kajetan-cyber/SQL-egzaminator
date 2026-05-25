import type { Lesson } from "../data/lessons";
import type { LessonStatus } from "../App";

interface LessonListProps {
  lessons: Lesson[];
  activeLessonId: number;
  statuses: Record<number, LessonStatus>;
  onSelectLesson: (lessonId: number) => void;
}

function getStatusLabel(status: LessonStatus): string {
  if (status === "correct") {
    return "OK";
  }

  if (status === "incorrect") {
    return "Błąd";
  }

  return "Nowe";
}

export default function LessonList({ lessons, activeLessonId, statuses, onSelectLesson }: LessonListProps) {
  const solvedCount = lessons.filter((lesson) => statuses[lesson.id] && statuses[lesson.id] !== "unanswered").length;
  const correctCount = lessons.filter((lesson) => statuses[lesson.id] === "correct").length;
  const incorrectCount = lessons.filter((lesson) => statuses[lesson.id] === "incorrect").length;

  return (
    <aside className="lesson-sidebar">
      <div className="brand">
        <span className="brand-mark">SQL</span>
        <div>
          <h1>Egzaminator</h1>
          <p>Nauka z zadań PDF</p>
        </div>
      </div>

      <div className="progress-grid" aria-label="Postęp">
        <div>
          <strong>{solvedCount}</strong>
          <span>rozwiązane</span>
        </div>
        <div>
          <strong>{correctCount}</strong>
          <span>poprawne</span>
        </div>
        <div>
          <strong>{incorrectCount}</strong>
          <span>błędne</span>
        </div>
      </div>

      <nav className="lesson-nav" aria-label="Lista zadań">
        {lessons.map((lesson) => {
          const status = statuses[lesson.id] ?? "unanswered";
          const isActive = lesson.id === activeLessonId;

          return (
            <button
              className={`lesson-list-item ${isActive ? "active" : ""} ${status}`}
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              type="button"
            >
              <span className="lesson-number">{lesson.id}</span>
              <span className="lesson-list-title">{lesson.title}</span>
              <span className="lesson-status">{getStatusLabel(status)}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
