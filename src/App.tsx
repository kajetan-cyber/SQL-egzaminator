import { useEffect, useMemo, useState } from "react";
import LessonList from "./components/LessonList";
import LessonView from "./components/LessonView";
import { getLessonCategory, lessons, type LessonCategory } from "./data/lessons";

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
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory>("pdf");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [statuses, setStatuses] = useState<Record<number, LessonStatus>>(loadProgress);

  const visibleLessons = useMemo(
    () => lessons.filter((lesson) => getLessonCategory(lesson) === selectedCategory),
    [selectedCategory],
  );

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

  function handleSelectCategory(category: LessonCategory) {
    const categoryLessons = lessons.filter((lesson) => getLessonCategory(lesson) === category);

    setSelectedCategory(category);

    if (categoryLessons.length > 0) {
      setActiveLessonId(categoryLessons[0].id);
    }
  }

  function handleSelectLesson(lessonId: number) {
    const selectedLesson = lessons.find((lesson) => lesson.id === lessonId);

    if (selectedLesson) {
      setSelectedCategory(getLessonCategory(selectedLesson));
    }

    setActiveLessonId(lessonId);
  }

  function handleNextLesson() {
    const candidates = visibleLessons.filter((lesson) => lesson.id !== activeLessonId);
    const pool = candidates.length > 0 ? candidates : visibleLessons;
    const randomLesson = pool[Math.floor(Math.random() * pool.length)];

    if (randomLesson) {
      setActiveLessonId(randomLesson.id);
    }
  }

  return (
    <div className="app-shell">
      <LessonList
        activeLessonId={activeLesson.id}
        lessons={lessons}
        onNextLesson={handleNextLesson}
        onSelectCategory={handleSelectCategory}
        onSelectLesson={handleSelectLesson}
        selectedCategory={selectedCategory}
        statuses={statuses}
        visibleLessons={visibleLessons}
      />
      <LessonView key={activeLesson.id} lesson={activeLesson} onValidation={handleValidation} />
    </div>
  );
}
