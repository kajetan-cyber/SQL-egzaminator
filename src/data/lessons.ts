import type { TableName } from "../db/schema";

export type LessonType = "sql" | "text";

export interface Lesson {
  id: number;
  title: string;
  taskText: string;
  type: LessonType;
  visibleTables: TableName[];
  expectedSql?: string;
  expectedTextAnswer?: string;
  hints: string[];
  solution: string;
  compareOrder?: boolean;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Filmy z Belgii lub Hiszpanii",
    taskText: "Wyświetl tytuły filmów wyprodukowanych przez belgijskie lub hiszpańskie wytwórnie. Posortuj wynik alfabetycznie po tytule.",
    type: "sql",
    visibleTables: ["Filmy", "Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Filmy.tytul
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju = 'Belgia' OR Kraje.nazwa_kraju = 'Hiszpania'
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju = 'Belgia' OR Kraje.nazwa_kraju = 'Hiszpania'
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 2,
    title: "Kraje z kodem: nazwa malejąco",
    taskText: "Wyświetl nazwy krajów i stolice dla krajów posiadających kod państwa. Posortuj odwrotnie alfabetycznie po nazwie kraju.",
    type: "sql",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.stolica
      FROM Kraje
      WHERE Kraje.kod IS NOT NULL
      ORDER BY Kraje.nazwa_kraju DESC;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.stolica
FROM Kraje
WHERE Kraje.kod IS NOT NULL
ORDER BY Kraje.nazwa_kraju DESC;`,
    compareOrder: true,
  },
  {
    id: 3,
    title: "Kraje z kodem: kod malejąco",
    taskText: "Wyświetl nazwy krajów i stolice dla krajów posiadających kod państwa. Posortuj malejąco po kodzie kraju.",
    type: "sql",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.stolica
      FROM Kraje
      WHERE Kraje.kod IS NOT NULL
      ORDER BY Kraje.kod DESC;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.stolica
FROM Kraje
WHERE Kraje.kod IS NOT NULL
ORDER BY Kraje.kod DESC;`,
    compareOrder: true,
  },
  {
    id: 4,
    title: "Wytwórnie z krajów wskazanych osób",
    taskText: "Wyświetl nazwy wytwórni pochodzących z krajów osób o nazwiskach Gauss, Dawkins, Pasteur i Ulam. Posortuj wynik po nazwie wytwórni.",
    type: "sql",
    visibleTables: ["Wytwornie", "Kraje", "Osoby"],
    expectedSql: `
      SELECT Wytwornie.nazwa AS 'Nazwa wytwórni'
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      WHERE Osoby.nazwisko = 'Gauss'
        OR Osoby.nazwisko = 'Dawkins'
        OR Osoby.nazwisko = 'Pasteur'
        OR Osoby.nazwisko = 'Ulam'
      ORDER BY Wytwornie.nazwa;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź alias kolumny"],
    solution: `SELECT Wytwornie.nazwa AS 'Nazwa wytwórni'
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
WHERE Osoby.nazwisko = 'Gauss'
  OR Osoby.nazwisko = 'Dawkins'
  OR Osoby.nazwisko = 'Pasteur'
  OR Osoby.nazwisko = 'Ulam'
ORDER BY Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 5,
    title: "Najstarsza szwedzka wytwórnia",
    taskText: "Wyświetl nazwę i rok założenia najwcześniej powstałej szwedzkiej wytwórni.",
    type: "sql",
    visibleTables: ["Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju = 'Szwecja'
      ORDER BY Wytwornie.rok_zalozenia
      LIMIT 1;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju = 'Szwecja'
ORDER BY Wytwornie.rok_zalozenia
LIMIT 1;`,
    compareOrder: true,
  },
  {
    id: 6,
    title: "Klienci i możliwe zamówienia",
    taskText: "Wyświetl wszystkich klientów oraz numery zamówień, które mogą posiadać.",
    type: "sql",
    visibleTables: ["Klienci", "Zamowienia"],
    expectedSql: `
      SELECT Klienci.Nazwa, Zamowienia.IDzamowienia
      FROM Klienci
      LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź warunek połączenia"],
    solution: `SELECT Klienci.Nazwa, Zamowienia.IDzamowienia
FROM Klienci
LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta;`,
    compareOrder: false,
  },
  {
    id: 7,
    title: "Liczba osób według krajów",
    taskText: "Wyświetl nazwy krajów i liczbę osób pochodzących z nich. Posortuj rosnąco po liczbie osób.",
    type: "sql",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju AS 'Nazwa kraju', COUNT(Osoby.id_osoby) AS 'Liczba osób'
      FROM Kraje
      INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      GROUP BY Kraje.nazwa_kraju
      ORDER BY COUNT(Osoby.id_osoby);
    `,
    hints: ["Sprawdź JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju AS 'Nazwa kraju', COUNT(Osoby.id_osoby) AS 'Liczba osób'
FROM Kraje
INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
GROUP BY Kraje.nazwa_kraju
ORDER BY COUNT(Osoby.id_osoby);`,
    compareOrder: true,
  },
  {
    id: 8,
    title: "Liczba osób: kraje Z-A",
    taskText: "Wyświetl nazwy krajów i liczbę osób pochodzących z nich. Posortuj odwrotnie alfabetycznie po nazwie kraju.",
    type: "sql",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju AS 'Nazwa kraju', COUNT(Osoby.id_osoby) AS 'Liczba osób'
      FROM Kraje
      INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      GROUP BY Kraje.nazwa_kraju
      ORDER BY Kraje.nazwa_kraju DESC;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju AS 'Nazwa kraju', COUNT(Osoby.id_osoby) AS 'Liczba osób'
FROM Kraje
INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
GROUP BY Kraje.nazwa_kraju
ORDER BY Kraje.nazwa_kraju DESC;`,
    compareOrder: true,
  },
  {
    id: 9,
    title: "Filmy z Belgii",
    taskText: "Wyświetl tytuły filmów wyprodukowanych przez belgijskie wytwórnie. Posortuj wynik po tytule filmu.",
    type: "sql",
    visibleTables: ["Filmy", "Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Filmy.tytul
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju = 'Belgia'
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju = 'Belgia'
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 10,
    title: "Instrukcja uprawnień",
    taskText: "Jaka instrukcja SQL pozwala zarządzać uprawnieniami?",
    type: "text",
    visibleTables: [],
    expectedTextAnswer: "GRANT",
    hints: ["To polecenie nadaje uprawnienia użytkownikom lub rolom."],
    solution: "GRANT",
  },
  {
    id: 11,
    title: "Wycofanie transakcji",
    taskText: "Jaka instrukcja SQL służy do wycofywania zmian w transakcji?",
    type: "text",
    visibleTables: [],
    expectedTextAnswer: "ROLLBACK",
    hints: ["To polecenie cofa zmiany wykonane w bieżącej transakcji."],
    solution: "ROLLBACK",
  },
  {
    id: 12,
    title: "Aktualizacja rekordów",
    taskText: "Jaka instrukcja SQL służy do aktualizacji rekordów w bazie?",
    type: "text",
    visibleTables: [],
    expectedTextAnswer: "UPDATE",
    hints: ["To polecenie zmienia istniejące rekordy."],
    solution: "UPDATE",
  },
  {
    id: 13,
    title: "Zmiana struktury tabeli",
    taskText: "Jaka instrukcja SQL służy do zmiany struktury tabeli?",
    type: "text",
    visibleTables: [],
    expectedTextAnswer: "ALTER TABLE",
    hints: ["To polecenie modyfikuje schemat istniejącej tabeli."],
    solution: "ALTER TABLE",
  },
];
