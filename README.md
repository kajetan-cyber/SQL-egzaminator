# SQL Egzaminator

Aplikacja webowa do nauki SQL oparta na zadaniach i przykładowych rozwiązaniach z pliku `bazy_danych-1.docx.pdf`.
Wzorcem funkcjonalnym były interaktywne tabele z SQLBolt, ale zadania, dane i schematy są własne dla tego projektu.

## Instalacja

```bash
npm install
```

## Uruchomienie

```bash
npm run dev
```

Po starcie Vite otwórz adres pokazany w terminalu, zwykle `http://127.0.0.1:5173/`.

## Dodawanie nowego zadania

1. Dodaj wpis w `src/data/lessons.ts`.
2. Ustaw `type` na `"sql"` albo `"text"`.
3. Dla zadania SQL podaj `visibleTables`, `expectedSql`, `hints` i `solution`.
4. Dla pytania tekstowego podaj `expectedTextAnswer`, `hints` i `solution`.
5. Jeżeli potrzebne są nowe dane testowe, dopisz je w `src/db/seed.ts`.
6. Jeżeli potrzebna jest nowa tabela, dopisz schemat w `src/db/schema.ts`.

Przykładowa struktura lekcji:

```ts
{
  id: 14,
  title: "Nowe zadanie",
  taskText: "Treść polecenia",
  type: "sql",
  visibleTables: ["Kraje"],
  expectedSql: "SELECT nazwa_kraju FROM Kraje;",
  hints: ["Sprawdź SELECT"],
  solution: "SELECT nazwa_kraju FROM Kraje;",
}
```

## Walidacja odpowiedzi

Aplikacja nie porównuje treści SQL znak po znaku.

1. Uruchamia zapytanie użytkownika na testowej bazie SQLite w przeglądarce.
2. Uruchamia wzorcowe zapytanie z `src/data/lessons.ts` na takiej samej świeżej bazie.
3. Porównuje nazwy kolumn bez rozróżniania wielkości liter.
4. Porównuje wartości wierszy.
5. Dla zadań z sortowaniem sprawdza kolejność wyników.
6. Dla zadań tekstowych porównuje odpowiedzi bez rozróżniania wielkości liter i nadmiarowych spacji.

Jeżeli SQL zawiera błąd składni lub błąd wykonania, aplikacja pokazuje komunikat SQLite i nie przerywa pracy.

## Sprawdzenie wzorców

Opcjonalny skrypt logiczny sprawdza, czy wszystkie rozwiązania wzorcowe przechodzą walidację, a prosta błędna odpowiedź jest odrzucana:

```bash
npm run verify:lessons
```

## Publikacja na GitHubie

1. Utwórz nowe repozytorium na GitHubie, np. `sql-egzaminator`.
2. W katalogu projektu uruchom:

```bash
git init
git add .
git commit -m "Initial SQL learning app"
git branch -M main
git remote add origin https://github.com/TWOJ_LOGIN/sql-egzaminator.git
git push -u origin main
```

3. Na GitHubie wejdź w `Settings` -> `Pages`.
4. W polu `Source` wybierz `GitHub Actions`.
5. Po chwili workflow `Deploy to GitHub Pages` zbuduje aplikację.
6. Link będzie miał format:

```text
https://TWOJ_LOGIN.github.io/sql-egzaminator/
```

Jeżeli komenda `git` nie działa na komputerze, zainstaluj Git for Windows albo użyj GitHub Desktop i dodaj ten folder jako lokalne repozytorium.
