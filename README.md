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
3. Ustaw `category` na `"extra"`, jeżeli zadanie ma trafić do zakładki `Więcej zadań`. Brak kategorii oznacza `Zadania z PDF`.
4. Dla zadania SQL podaj `visibleTables`, `expectedSql`, `hints` i `solution`.
5. Dla pytania tekstowego podaj `expectedTextAnswer`, `hints` i `solution`.
6. Jeżeli potrzebne są nowe dane testowe, dopisz je w `src/db/seed.ts`.
7. Jeżeli potrzebna jest nowa tabela, dopisz schemat w `src/db/schema.ts`.

Przykładowa struktura lekcji:

```ts
{
  id: 14,
  title: "Nowe zadanie",
  taskText: "Treść polecenia",
  type: "sql",
  category: "extra",
  visibleTables: ["Kraje"],
  expectedSql: "SELECT nazwa_kraju FROM Kraje;",
  hints: ["Sprawdź SELECT"],
  solution: "SELECT nazwa_kraju FROM Kraje;",
}
```

## Kategorie i losowanie

Aplikacja ma dwie zakładki z zadaniami:

- `Zadania z PDF` - oryginalne zadania wyciągnięte z pliku `bazy_danych-1.docx.pdf`.
- `Więcej zadań` - dodatkowe zadania SQL na podobnym poziomie trudności, oparte na tych samych tabelach.

Przycisk `Następne zadanie` losuje kolejne zadanie tylko z aktualnie wybranej zakładki.

## Walidacja odpowiedzi

Aplikacja nie porównuje treści SQL znak po znaku.

1. Uruchamia zapytanie użytkownika na testowej bazie SQLite w przeglądarce.
2. Uruchamia wzorcowe zapytanie z `src/data/lessons.ts` na takiej samej świeżej bazie.
3. Sprawdza liczbę kolumn, ale nie wymaga identycznych aliasów ani nazw kolumn.
4. Porównuje wartości wierszy, więc inne poprawne zapytanie jest akceptowane, jeśli daje ten sam wynik.
5. Kolejność wyników sprawdza tylko wtedy, gdy polecenie jasno wymaga sortowania i wskazuje sposób sortowania.
6. Dla zadań tekstowych porównuje odpowiedzi bez rozróżniania wielkości liter i nadmiarowych spacji.

Jeżeli SQL zawiera błąd składni lub błąd wykonania, aplikacja pokazuje komunikat SQLite i nie przerywa pracy.

## Sprawdzenie wzorców

Opcjonalny skrypt logiczny sprawdza, czy wszystkie rozwiązania wzorcowe przechodzą walidację, a prosta błędna odpowiedź jest odrzucana:

```bash
npm run verify:lessons
```



Jeżeli komenda `git` nie działa na komputerze, zainstaluj Git for Windows albo użyj GitHub Desktop i dodaj ten folder jako lokalne repozytorium.
