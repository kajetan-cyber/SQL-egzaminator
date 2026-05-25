import { getLessonCategory, lessonCategoryLabels, type Lesson, type LessonCategory } from "../data/lessons";
import type { LessonStatus } from "../App";

interface LessonListProps {
  lessons: Lesson[];
  visibleLessons: Lesson[];
  activeLessonId: number;
  selectedCategory: LessonCategory;
  statuses: Record<number, LessonStatus>;
  onSelectCategory: (category: LessonCategory) => void;
  onSelectLesson: (lessonId: number) => void;
  onNextLesson: () => void;
}

const lessonCategories: LessonCategory[] = ["pdf", "extra"];

function getStatusLabel(status: LessonStatus): string {
  if (status === "correct") {
    return "OK";
  }

  if (status === "incorrect") {
    return "Błąd";
  }

  return "Nowe";
}

export default function LessonList({
  lessons,
  visibleLessons,
  activeLessonId,
  selectedCategory,
  statuses,
  onSelectCategory,
  onSelectLesson,
  onNextLesson,
}: LessonListProps) {
  const solvedCount = visibleLessons.filter((lesson) => statuses[lesson.id] && statuses[lesson.id] !== "unanswered").length;
  const correctCount = visibleLessons.filter((lesson) => statuses[lesson.id] === "correct").length;
  const incorrectCount = visibleLessons.filter((lesson) => statuses[lesson.id] === "incorrect").length;

  return (
    <aside className="lesson-sidebar">
      <div className="brand">
        <span className="brand-mark">SQL</span>
        <div>
          <h1>Egzaminator</h1>
          <p>Wybierz zestaw i losuj zadania</p>
        </div>
      </div>

      <div className="category-tabs" aria-label="Zakładki zadań" role="tablist">
        {lessonCategories.map((category) => {
          const categoryLessons = lessons.filter((lesson) => getLessonCategory(lesson) === category);

          return (
            <button
              aria-selected={selectedCategory === category}
              className={selectedCategory === category ? "active" : ""}
              key={category}
              onClick={() => onSelectCategory(category)}
              role="tab"
              type="button"
            >
              <span>{lessonCategoryLabels[category]}</span>
              <strong>{categoryLessons.length}</strong>
            </button>
          );
        })}
      </div>

      <button className="next-lesson-button" onClick={onNextLesson} type="button">
        Następne zadanie
      </button>

      <div className="progress-grid" aria-label="Postęp w wybranej zakładce">
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

      <nav className="lesson-nav" aria-label={`Lista zadań: ${lessonCategoryLabels[selectedCategory]}`}>
        {visibleLessons.map((lesson) => {
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
