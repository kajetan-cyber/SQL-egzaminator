import type { TableName } from "../db/schema";

export type LessonType = "sql" | "text";
export type LessonCategory = "pdf" | "extra";

export const lessonCategoryLabels: Record<LessonCategory, string> = {
  pdf: "Zadania z PDF",
  extra: "Więcej zadań",
};

export interface Lesson {
  id: number;
  title: string;
  taskText: string;
  type: LessonType;
  category?: LessonCategory;
  visibleTables: TableName[];
  expectedSql?: string;
  expectedTextAnswer?: string;
  hints: string[];
  solution: string;
  compareOrder?: boolean;
}

export function getLessonCategory(lesson: Lesson): LessonCategory {
  return lesson.category ?? "pdf";
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
  {
    id: 14,
    title: "Kraje bez kodu",
    taskText: "Wyświetl nazwy krajów i stolice dla krajów, które nie mają wpisanego kodu państwa. Posortuj wynik alfabetycznie po nazwie kraju.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.stolica
      FROM Kraje
      WHERE Kraje.kod IS NULL
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.stolica
FROM Kraje
WHERE Kraje.kod IS NULL
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 15,
    title: "Filmy dramatyczne i wytwórnie",
    taskText: "Wyświetl tytuły filmów dramatycznych oraz nazwy ich wytwórni. Posortuj wynik po tytule filmu.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie"],
    expectedSql: `
      SELECT Filmy.tytul, Wytwornie.nazwa AS wytwornia
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      WHERE Filmy.gatunek = 'dramat'
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Wytwornie.nazwa AS wytwornia
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
WHERE Filmy.gatunek = 'dramat'
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 16,
    title: "Wytwórnie sprzed 1960 roku",
    taskText: "Wyświetl nazwy i lata założenia wytwórni założonych przed 1960 rokiem. Posortuj rosnąco po roku założenia.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
      FROM Wytwornie
      WHERE Wytwornie.rok_zalozenia < 1960
      ORDER BY Wytwornie.rok_zalozenia;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
FROM Wytwornie
WHERE Wytwornie.rok_zalozenia < 1960
ORDER BY Wytwornie.rok_zalozenia;`,
    compareOrder: true,
  },
  {
    id: 17,
    title: "Filmy i kraje produkcji",
    taskText: "Wyświetl tytuły filmów oraz nazwy krajów, z których pochodzą ich wytwórnie. Posortuj wynik po tytule filmu.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Filmy.tytul, Kraje.nazwa_kraju AS kraj
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź alias kolumny", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Kraje.nazwa_kraju AS kraj
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 18,
    title: "Liczba filmów każdej wytwórni",
    taskText: "Wyświetl nazwy wszystkich wytwórni oraz liczbę filmów przypisanych do każdej z nich. Uwzględnij także wytwórnie bez filmów.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Wytwornie.nazwa, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Wytwornie
      LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
      GROUP BY Wytwornie.wytwornia_id, Wytwornie.nazwa
      ORDER BY liczba_filmow DESC, Wytwornie.nazwa;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź GROUP BY", "Sprawdź alias kolumny"],
    solution: `SELECT Wytwornie.nazwa, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Wytwornie
LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
GROUP BY Wytwornie.wytwornia_id, Wytwornie.nazwa
ORDER BY liczba_filmow DESC, Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 19,
    title: "Liczba wytwórni w krajach",
    taskText: "Wyświetl nazwy krajów oraz liczbę wytwórni pochodzących z każdego kraju. Uwzględnij kraje bez wytwórni.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju AS kraj, COUNT(Wytwornie.wytwornia_id) AS liczba_wytworni
      FROM Kraje
      LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY liczba_wytworni DESC, kraj;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju AS kraj, COUNT(Wytwornie.wytwornia_id) AS liczba_wytworni
FROM Kraje
LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY liczba_wytworni DESC, kraj;`,
    compareOrder: true,
  },
  {
    id: 20,
    title: "Klienci bez zamówień",
    taskText: "Wyświetl nazwy klientów, którzy nie mają żadnego zamówienia. Posortuj wynik po nazwie klienta.",
    type: "sql",
    category: "extra",
    visibleTables: ["Klienci", "Zamowienia"],
    expectedSql: `
      SELECT Klienci.Nazwa
      FROM Klienci
      LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
      WHERE Zamowienia.IDzamowienia IS NULL
      ORDER BY Klienci.Nazwa;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Klienci.Nazwa
FROM Klienci
LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
WHERE Zamowienia.IDzamowienia IS NULL
ORDER BY Klienci.Nazwa;`,
    compareOrder: true,
  },
  {
    id: 21,
    title: "Zamówienia z nazwą klienta",
    taskText: "Wyświetl numery zamówień, nazwy klientów i daty zamówień. Posortuj wynik rosnąco po numerze zamówienia.",
    type: "sql",
    category: "extra",
    visibleTables: ["Zamowienia", "Klienci"],
    expectedSql: `
      SELECT Zamowienia.IDzamowienia, Klienci.Nazwa, Zamowienia.DataZamowienia
      FROM Zamowienia
      INNER JOIN Klienci ON Zamowienia.IdKlienta = Klienci.IdKlienta
      ORDER BY Zamowienia.IDzamowienia;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź warunek połączenia", "Sprawdź ORDER BY"],
    solution: `SELECT Zamowienia.IDzamowienia, Klienci.Nazwa, Zamowienia.DataZamowienia
FROM Zamowienia
INNER JOIN Klienci ON Zamowienia.IdKlienta = Klienci.IdKlienta
ORDER BY Zamowienia.IDzamowienia;`,
    compareOrder: true,
  },
  {
    id: 22,
    title: "Osoby z Polski lub Francji",
    taskText: "Wyświetl imiona, nazwiska i nazwy krajów osób pochodzących z Polski lub Francji. Posortuj wynik po nazwisku.",
    type: "sql",
    category: "extra",
    visibleTables: ["Osoby", "Kraje"],
    expectedSql: `
      SELECT Osoby.imie, Osoby.nazwisko, Kraje.nazwa_kraju
      FROM Osoby
      INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju = 'Polska' OR Kraje.nazwa_kraju = 'Francja'
      ORDER BY Osoby.nazwisko;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Osoby.imie, Osoby.nazwisko, Kraje.nazwa_kraju
FROM Osoby
INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju = 'Polska' OR Kraje.nazwa_kraju = 'Francja'
ORDER BY Osoby.nazwisko;`,
    compareOrder: true,
  },
  {
    id: 23,
    title: "Najmłodsza wytwórnia",
    taskText: "Wyświetl nazwę wytwórni, nazwę kraju i rok założenia najpóźniej założonej wytwórni.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Kraje.nazwa_kraju, Wytwornie.rok_zalozenia
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      ORDER BY Wytwornie.rok_zalozenia DESC
      LIMIT 1;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź ORDER BY", "Sprawdź LIMIT"],
    solution: `SELECT Wytwornie.nazwa, Kraje.nazwa_kraju, Wytwornie.rok_zalozenia
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
ORDER BY Wytwornie.rok_zalozenia DESC
LIMIT 1;`,
    compareOrder: true,
  },
  {
    id: 24,
    title: "Wytwórnie posiadające filmy",
    taskText: "Wyświetl nazwy wytwórni oraz liczbę filmów, ale tylko dla wytwórni, które mają co najmniej jeden film.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Wytwornie.nazwa, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Wytwornie
      INNER JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
      GROUP BY Wytwornie.wytwornia_id, Wytwornie.nazwa
      HAVING COUNT(Filmy.id_filmu) > 0
      ORDER BY liczba_filmow DESC, Wytwornie.nazwa;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź GROUP BY", "Sprawdź HAVING"],
    solution: `SELECT Wytwornie.nazwa, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Wytwornie
INNER JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
GROUP BY Wytwornie.wytwornia_id, Wytwornie.nazwa
HAVING COUNT(Filmy.id_filmu) > 0
ORDER BY liczba_filmow DESC, Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 25,
    title: "Kraje osób o nazwisku na P",
    taskText: "Wyświetl różne nazwy krajów i ich stolice dla osób, których nazwisko zaczyna się na literę P. Posortuj wynik po nazwie kraju.",
    type: "sql",
    category: "extra",
    visibleTables: ["Osoby", "Kraje"],
    expectedSql: `
      SELECT DISTINCT Kraje.nazwa_kraju, Kraje.stolica
      FROM Osoby
      INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
      WHERE Osoby.nazwisko LIKE 'P%'
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź DISTINCT"],
    solution: `SELECT DISTINCT Kraje.nazwa_kraju, Kraje.stolica
FROM Osoby
INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
WHERE Osoby.nazwisko LIKE 'P%'
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 26,
    title: "Kraje z kodem zawierającym E",
    taskText: "Wyświetl nazwy krajów i ich kody dla krajów, których kod zawiera literę E. Posortuj wynik po kodzie.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.kod
      FROM Kraje
      WHERE Kraje.kod LIKE '%E%'
      ORDER BY Kraje.kod;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź LIKE", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.kod
FROM Kraje
WHERE Kraje.kod LIKE '%E%'
ORDER BY Kraje.kod;`,
    compareOrder: true,
  },
  {
    id: 27,
    title: "Filmy ze starszych wytwórni",
    taskText: "Wyświetl tytuły filmów, nazwy wytwórni i lata założenia dla filmów wyprodukowanych przez wytwórnie założone przed 1970 rokiem.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie"],
    expectedSql: `
      SELECT Filmy.tytul, Wytwornie.nazwa, Wytwornie.rok_zalozenia
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      WHERE Wytwornie.rok_zalozenia < 1970
      ORDER BY Wytwornie.rok_zalozenia, Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Wytwornie.nazwa, Wytwornie.rok_zalozenia
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
WHERE Wytwornie.rok_zalozenia < 1970
ORDER BY Wytwornie.rok_zalozenia, Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 28,
    title: "Klienci z Warszawy lub Krakowa",
    taskText: "Wyświetl nazwy i miasta klientów z Warszawy lub Krakowa. Posortuj wynik po nazwie klienta.",
    type: "sql",
    category: "extra",
    visibleTables: ["Klienci"],
    expectedSql: `
      SELECT Klienci.Nazwa, Klienci.Miasto
      FROM Klienci
      WHERE Klienci.Miasto = 'Warszawa' OR Klienci.Miasto = 'Kraków'
      ORDER BY Klienci.Nazwa;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź OR", "Sprawdź ORDER BY"],
    solution: `SELECT Klienci.Nazwa, Klienci.Miasto
FROM Klienci
WHERE Klienci.Miasto = 'Warszawa' OR Klienci.Miasto = 'Kraków'
ORDER BY Klienci.Nazwa;`,
    compareOrder: true,
  },
  {
    id: 29,
    title: "Zamówienia wybranych kurierów",
    taskText: "Wyświetl numery zamówień, daty i kody kurierów dla zamówień obsługiwanych przez kuriera 1 lub 3. Posortuj po numerze zamówienia.",
    type: "sql",
    category: "extra",
    visibleTables: ["Zamowienia"],
    expectedSql: `
      SELECT Zamowienia.IDzamowienia, Zamowienia.DataZamowienia, Zamowienia.KodKuriera
      FROM Zamowienia
      WHERE Zamowienia.KodKuriera IN (1, 3)
      ORDER BY Zamowienia.IDzamowienia;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź IN", "Sprawdź ORDER BY"],
    solution: `SELECT Zamowienia.IDzamowienia, Zamowienia.DataZamowienia, Zamowienia.KodKuriera
FROM Zamowienia
WHERE Zamowienia.KodKuriera IN (1, 3)
ORDER BY Zamowienia.IDzamowienia;`,
    compareOrder: true,
  },
  {
    id: 30,
    title: "Kraje z co najmniej pięcioma osobami",
    taskText: "Wyświetl nazwy krajów i liczbę osób tylko dla krajów, z których pochodzi co najmniej 5 osób.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
      FROM Kraje
      INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      HAVING COUNT(Osoby.id_osoby) >= 5
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź GROUP BY", "Sprawdź HAVING", "Sprawdź alias kolumny"],
    solution: `SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
FROM Kraje
INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
HAVING COUNT(Osoby.id_osoby) >= 5
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 31,
    title: "Wszystkie kraje i liczba osób",
    taskText: "Wyświetl wszystkie kraje oraz liczbę osób pochodzących z każdego kraju. Uwzględnij kraje bez osób.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
      FROM Kraje
      LEFT JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
FROM Kraje
LEFT JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 32,
    title: "Najstarsze lata wytwórni w krajach",
    taskText: "Wyświetl nazwy krajów oraz najwcześniejszy rok założenia wytwórni w każdym kraju, który ma wytwórnię.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, MIN(Wytwornie.rok_zalozenia) AS najstarszy_rok
      FROM Kraje
      INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź MIN", "Sprawdź GROUP BY"],
    solution: `SELECT Kraje.nazwa_kraju, MIN(Wytwornie.rok_zalozenia) AS najstarszy_rok
FROM Kraje
INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 33,
    title: "Filmy z literą a w tytule",
    taskText: "Wyświetl tytuły i gatunki filmów, których tytuł zawiera literę a. Posortuj wynik po tytule.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy"],
    expectedSql: `
      SELECT Filmy.tytul, Filmy.gatunek
      FROM Filmy
      WHERE Filmy.tytul LIKE '%a%'
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź LIKE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Filmy.gatunek
FROM Filmy
WHERE Filmy.tytul LIKE '%a%'
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 34,
    title: "Wytwórnie i kody krajów",
    taskText: "Wyświetl nazwy wytwórni oraz kody krajów, z których pochodzą. Uwzględnij tylko kraje z kodem.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Kraje.kod
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.kod IS NOT NULL
      ORDER BY Wytwornie.nazwa;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Wytwornie.nazwa, Kraje.kod
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.kod IS NOT NULL
ORDER BY Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 35,
    title: "Filmy z Belgii i Hiszpanii z gatunkiem",
    taskText: "Wyświetl nazwy krajów, tytuły filmów i gatunki dla filmów z belgijskich oraz hiszpańskich wytwórni.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Filmy.tytul, Filmy.gatunek
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju IN ('Belgia', 'Hiszpania')
      ORDER BY Kraje.nazwa_kraju, Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Filmy.tytul, Filmy.gatunek
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju IN ('Belgia', 'Hiszpania')
ORDER BY Kraje.nazwa_kraju, Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 36,
    title: "Średni rok założenia wytwórni",
    taskText: "Wyświetl nazwy krajów i średni rok założenia wytwórni w tych krajach. Zaokrąglij średnią funkcją ROUND i użyj aliasu sredni_rok.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, ROUND(AVG(Wytwornie.rok_zalozenia), 0) AS sredni_rok
      FROM Kraje
      INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź AVG", "Sprawdź ROUND", "Sprawdź GROUP BY"],
    solution: `SELECT Kraje.nazwa_kraju, ROUND(AVG(Wytwornie.rok_zalozenia), 0) AS sredni_rok
FROM Kraje
INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 37,
    title: "Liczba zamówień klientów",
    taskText: "Wyświetl nazwy wszystkich klientów oraz liczbę ich zamówień. Posortuj malejąco po liczbie zamówień, a potem po nazwie.",
    type: "sql",
    category: "extra",
    visibleTables: ["Klienci", "Zamowienia"],
    expectedSql: `
      SELECT Klienci.Nazwa, COUNT(Zamowienia.IDzamowienia) AS liczba_zamowien
      FROM Klienci
      LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
      GROUP BY Klienci.IdKlienta, Klienci.Nazwa
      ORDER BY liczba_zamowien DESC, Klienci.Nazwa;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Klienci.Nazwa, COUNT(Zamowienia.IDzamowienia) AS liczba_zamowien
FROM Klienci
LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
GROUP BY Klienci.IdKlienta, Klienci.Nazwa
ORDER BY liczba_zamowien DESC, Klienci.Nazwa;`,
    compareOrder: true,
  },
  {
    id: 38,
    title: "Klienci z zamówieniami",
    taskText: "Wyświetl nazwy klientów oraz liczbę zamówień tylko dla klientów, którzy mają co najmniej jedno zamówienie.",
    type: "sql",
    category: "extra",
    visibleTables: ["Klienci", "Zamowienia"],
    expectedSql: `
      SELECT Klienci.Nazwa, COUNT(Zamowienia.IDzamowienia) AS liczba_zamowien
      FROM Klienci
      INNER JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
      GROUP BY Klienci.IdKlienta, Klienci.Nazwa
      HAVING COUNT(Zamowienia.IDzamowienia) >= 1
      ORDER BY Klienci.Nazwa;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź GROUP BY", "Sprawdź HAVING"],
    solution: `SELECT Klienci.Nazwa, COUNT(Zamowienia.IDzamowienia) AS liczba_zamowien
FROM Klienci
INNER JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
GROUP BY Klienci.IdKlienta, Klienci.Nazwa
HAVING COUNT(Zamowienia.IDzamowienia) >= 1
ORDER BY Klienci.Nazwa;`,
    compareOrder: true,
  },
  {
    id: 39,
    title: "Filmy z krajów z literą a",
    taskText: "Wyświetl tytuły filmów i nazwy krajów dla filmów, których wytwórnia pochodzi z kraju mającego literę a w nazwie.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Filmy.tytul, Kraje.nazwa_kraju
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.nazwa_kraju LIKE '%a%'
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź LIKE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Kraje.nazwa_kraju
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.nazwa_kraju LIKE '%a%'
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 40,
    title: "Wytwórnie z Belgii lub Szwecji po kodzie",
    taskText: "Wyświetl nazwy i lata założenia wytwórni pochodzących z krajów o kodach BE lub SE.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.kod = 'BE' OR Kraje.kod = 'SE'
      ORDER BY Wytwornie.nazwa;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.kod = 'BE' OR Kraje.kod = 'SE'
ORDER BY Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 41,
    title: "Nazwiska osób i kody krajów",
    taskText: "Wyświetl nazwiska osób oraz kody krajów, z których pochodzą. Posortuj wynik po nazwisku.",
    type: "sql",
    category: "extra",
    visibleTables: ["Osoby", "Kraje"],
    expectedSql: `
      SELECT Osoby.nazwisko, Kraje.kod
      FROM Osoby
      INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
      WHERE Kraje.kod IS NOT NULL
      ORDER BY Osoby.nazwisko;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Osoby.nazwisko, Kraje.kod
FROM Osoby
INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
WHERE Kraje.kod IS NOT NULL
ORDER BY Osoby.nazwisko;`,
    compareOrder: true,
  },
  {
    id: 42,
    title: "Kraje bez osób",
    taskText: "Wyświetl nazwy krajów, z których nie pochodzi żadna osoba w tabeli Osoby.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju
      FROM Kraje
      LEFT JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      WHERE Osoby.id_osoby IS NULL
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź WHERE", "Sprawdź NULL"],
    solution: `SELECT Kraje.nazwa_kraju
FROM Kraje
LEFT JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
WHERE Osoby.id_osoby IS NULL
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 43,
    title: "Kraje bez wytwórni",
    taskText: "Wyświetl nazwy krajów, z których nie pochodzi żadna wytwórnia.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju
      FROM Kraje
      LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      WHERE Wytwornie.wytwornia_id IS NULL
      ORDER BY Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź WHERE", "Sprawdź NULL"],
    solution: `SELECT Kraje.nazwa_kraju
FROM Kraje
LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
WHERE Wytwornie.wytwornia_id IS NULL
ORDER BY Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 44,
    title: "Filmy wytwórni sprzed 1950",
    taskText: "Wyświetl tytuły filmów i nazwy wytwórni dla filmów wyprodukowanych przez wytwórnie założone przed 1950 rokiem.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie"],
    expectedSql: `
      SELECT Filmy.tytul, Wytwornie.nazwa
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      WHERE Wytwornie.rok_zalozenia < 1950
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Wytwornie.nazwa
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
WHERE Wytwornie.rok_zalozenia < 1950
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 45,
    title: "Najnowsze zamówienie",
    taskText: "Wyświetl numer i datę najnowszego zamówienia.",
    type: "sql",
    category: "extra",
    visibleTables: ["Zamowienia"],
    expectedSql: `
      SELECT Zamowienia.IDzamowienia, Zamowienia.DataZamowienia
      FROM Zamowienia
      ORDER BY Zamowienia.DataZamowienia DESC
      LIMIT 1;
    `,
    hints: ["Sprawdź ORDER BY", "Sprawdź DESC", "Sprawdź LIMIT"],
    solution: `SELECT Zamowienia.IDzamowienia, Zamowienia.DataZamowienia
FROM Zamowienia
ORDER BY Zamowienia.DataZamowienia DESC
LIMIT 1;`,
    compareOrder: true,
  },
  {
    id: 46,
    title: "Dwa pierwsze kraje alfabetycznie",
    taskText: "Wyświetl dwa pierwsze alfabetycznie kraje posiadające kod państwa oraz ich kody.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.kod
      FROM Kraje
      WHERE Kraje.kod IS NOT NULL
      ORDER BY Kraje.nazwa_kraju
      LIMIT 2;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź ORDER BY", "Sprawdź LIMIT"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.kod
FROM Kraje
WHERE Kraje.kod IS NOT NULL
ORDER BY Kraje.nazwa_kraju
LIMIT 2;`,
    compareOrder: true,
  },
  {
    id: 47,
    title: "Status kodu kraju",
    taskText: "Policz kraje z kodem i bez kodu. Wynik pokaż w kolumnach status_kodu i liczba_krajow.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT CASE WHEN Kraje.kod IS NULL THEN 'Brak kodu' ELSE 'Ma kod' END AS status_kodu,
             COUNT(Kraje.id_kraju) AS liczba_krajow
      FROM Kraje
      GROUP BY status_kodu
      ORDER BY status_kodu;
    `,
    hints: ["Sprawdź CASE", "Sprawdź GROUP BY", "Sprawdź alias kolumny"],
    solution: `SELECT CASE WHEN Kraje.kod IS NULL THEN 'Brak kodu' ELSE 'Ma kod' END AS status_kodu,
       COUNT(Kraje.id_kraju) AS liczba_krajow
FROM Kraje
GROUP BY status_kodu
ORDER BY status_kodu;`,
    compareOrder: true,
  },
  {
    id: 48,
    title: "Wytwórnie starsze od najstarszej szwedzkiej",
    taskText: "Wyświetl nazwy i lata założenia wytwórni starszych niż najstarsza wytwórnia ze Szwecji.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
      FROM Wytwornie
      WHERE Wytwornie.rok_zalozenia < (
        SELECT MIN(w.rok_zalozenia)
        FROM Wytwornie AS w
        INNER JOIN Kraje AS k ON w.kraj = k.id_kraju
        WHERE k.nazwa_kraju = 'Szwecja'
      )
      ORDER BY Wytwornie.rok_zalozenia;
    `,
    hints: ["Sprawdź podzapytanie", "Sprawdź MIN", "Sprawdź WHERE"],
    solution: `SELECT Wytwornie.nazwa, Wytwornie.rok_zalozenia
FROM Wytwornie
WHERE Wytwornie.rok_zalozenia < (
  SELECT MIN(w.rok_zalozenia)
  FROM Wytwornie AS w
  INNER JOIN Kraje AS k ON w.kraj = k.id_kraju
  WHERE k.nazwa_kraju = 'Szwecja'
)
ORDER BY Wytwornie.rok_zalozenia;`,
    compareOrder: true,
  },
  {
    id: 49,
    title: "Filmy z wytwórni 1-3",
    taskText: "Wyświetl tytuły filmów i identyfikatory wytwórni dla filmów przypisanych do wytwórni o identyfikatorach od 1 do 3.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy"],
    expectedSql: `
      SELECT Filmy.tytul, Filmy.wytwornia
      FROM Filmy
      WHERE Filmy.wytwornia BETWEEN 1 AND 3
      ORDER BY Filmy.wytwornia, Filmy.tytul;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź BETWEEN", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Filmy.wytwornia
FROM Filmy
WHERE Filmy.wytwornia BETWEEN 1 AND 3
ORDER BY Filmy.wytwornia, Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 50,
    title: "Klienci i daty zamówień",
    taskText: "Wyświetl nazwy wszystkich klientów oraz daty ich zamówień, jeśli takie zamówienia istnieją.",
    type: "sql",
    category: "extra",
    visibleTables: ["Klienci", "Zamowienia"],
    expectedSql: `
      SELECT Klienci.Nazwa, Zamowienia.DataZamowienia
      FROM Klienci
      LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
      ORDER BY Klienci.Nazwa;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź warunek połączenia", "Sprawdź ORDER BY"],
    solution: `SELECT Klienci.Nazwa, Zamowienia.DataZamowienia
FROM Klienci
LEFT JOIN Zamowienia ON Klienci.IdKlienta = Zamowienia.IdKlienta
ORDER BY Klienci.Nazwa;`,
    compareOrder: true,
  },
  {
    id: 51,
    title: "Osoby według kraju i nazwiska",
    taskText: "Wyświetl nazwy krajów, imiona i nazwiska osób. Posortuj odwrotnie alfabetycznie po kraju, a następnie po nazwisku.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Osoby.imie, Osoby.nazwisko
      FROM Osoby
      INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
      ORDER BY Kraje.nazwa_kraju DESC, Osoby.nazwisko;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź ORDER BY", "Sprawdź DESC"],
    solution: `SELECT Kraje.nazwa_kraju, Osoby.imie, Osoby.nazwisko
FROM Osoby
INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
ORDER BY Kraje.nazwa_kraju DESC, Osoby.nazwisko;`,
    compareOrder: true,
  },
  {
    id: 52,
    title: "Wytwórnie bez filmów",
    taskText: "Wyświetl nazwy wytwórni, które nie mają przypisanego żadnego filmu.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Wytwornie.nazwa
      FROM Wytwornie
      LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
      WHERE Filmy.id_filmu IS NULL
      ORDER BY Wytwornie.nazwa;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź WHERE", "Sprawdź NULL"],
    solution: `SELECT Wytwornie.nazwa
FROM Wytwornie
LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
WHERE Filmy.id_filmu IS NULL
ORDER BY Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 53,
    title: "Liczba filmów według gatunku",
    taskText: "Wyświetl gatunki filmów oraz liczbę filmów w każdym gatunku. Posortuj malejąco po liczbie filmów.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy"],
    expectedSql: `
      SELECT Filmy.gatunek, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Filmy
      GROUP BY Filmy.gatunek
      ORDER BY liczba_filmow DESC, Filmy.gatunek;
    `,
    hints: ["Sprawdź GROUP BY", "Sprawdź COUNT", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.gatunek, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Filmy
GROUP BY Filmy.gatunek
ORDER BY liczba_filmow DESC, Filmy.gatunek;`,
    compareOrder: true,
  },
  {
    id: 54,
    title: "Gatunki z wieloma filmami",
    taskText: "Wyświetl gatunki, dla których istnieją co najmniej 2 filmy, oraz liczbę tych filmów.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy"],
    expectedSql: `
      SELECT Filmy.gatunek, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Filmy
      GROUP BY Filmy.gatunek
      HAVING COUNT(Filmy.id_filmu) >= 2
      ORDER BY Filmy.gatunek;
    `,
    hints: ["Sprawdź GROUP BY", "Sprawdź HAVING", "Sprawdź COUNT"],
    solution: `SELECT Filmy.gatunek, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Filmy
GROUP BY Filmy.gatunek
HAVING COUNT(Filmy.id_filmu) >= 2
ORDER BY Filmy.gatunek;`,
    compareOrder: true,
  },
  {
    id: 55,
    title: "Kraje z długą nazwą stolicy",
    taskText: "Wyświetl nazwy krajów i stolice dla krajów, których stolica ma więcej niż 6 znaków.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, Kraje.stolica
      FROM Kraje
      WHERE LENGTH(Kraje.stolica) > 6
      ORDER BY Kraje.stolica;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź LENGTH", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, Kraje.stolica
FROM Kraje
WHERE LENGTH(Kraje.stolica) > 6
ORDER BY Kraje.stolica;`,
    compareOrder: true,
  },
  {
    id: 56,
    title: "Filmy wytwórni z lat 1950-1980",
    taskText: "Wyświetl tytuły filmów i lata założenia ich wytwórni dla wytwórni założonych w latach 1950-1980.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie"],
    expectedSql: `
      SELECT Filmy.tytul, Wytwornie.rok_zalozenia
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      WHERE Wytwornie.rok_zalozenia BETWEEN 1950 AND 1980
      ORDER BY Wytwornie.rok_zalozenia, Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź BETWEEN", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Wytwornie.rok_zalozenia
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
WHERE Wytwornie.rok_zalozenia BETWEEN 1950 AND 1980
ORDER BY Wytwornie.rok_zalozenia, Filmy.tytul;`,
    compareOrder: true,
  },
  {
    id: 57,
    title: "Osoby z krajów o kodzie kończącym się na L",
    taskText: "Wyświetl imiona, nazwiska i kody krajów osób pochodzących z krajów, których kod kończy się literą L.",
    type: "sql",
    category: "extra",
    visibleTables: ["Osoby", "Kraje"],
    expectedSql: `
      SELECT Osoby.imie, Osoby.nazwisko, Kraje.kod
      FROM Osoby
      INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
      WHERE Kraje.kod LIKE '%L'
      ORDER BY Osoby.nazwisko;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź LIKE", "Sprawdź ORDER BY"],
    solution: `SELECT Osoby.imie, Osoby.nazwisko, Kraje.kod
FROM Osoby
INNER JOIN Kraje ON Osoby.kraj = Kraje.id_kraju
WHERE Kraje.kod LIKE '%L'
ORDER BY Osoby.nazwisko;`,
    compareOrder: true,
  },
  {
    id: 58,
    title: "Wytwórnie z krajów z wieloma osobami",
    taskText: "Wyświetl nazwy wytwórni pochodzących z krajów, z których pochodzi więcej niż 4 osoby.",
    type: "sql",
    category: "extra",
    visibleTables: ["Wytwornie", "Kraje", "Osoby"],
    expectedSql: `
      SELECT Wytwornie.nazwa
      FROM Wytwornie
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Kraje.id_kraju IN (
        SELECT Osoby.kraj
        FROM Osoby
        GROUP BY Osoby.kraj
        HAVING COUNT(Osoby.id_osoby) > 4
      )
      ORDER BY Wytwornie.nazwa;
    `,
    hints: ["Sprawdź podzapytanie", "Sprawdź GROUP BY", "Sprawdź HAVING"],
    solution: `SELECT Wytwornie.nazwa
FROM Wytwornie
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Kraje.id_kraju IN (
  SELECT Osoby.kraj
  FROM Osoby
  GROUP BY Osoby.kraj
  HAVING COUNT(Osoby.id_osoby) > 4
)
ORDER BY Wytwornie.nazwa;`,
    compareOrder: true,
  },
  {
    id: 59,
    title: "Kraj z największą liczbą osób",
    taskText: "Wyświetl nazwę kraju i liczbę osób dla kraju, z którego pochodzi najwięcej osób.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Osoby"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
      FROM Kraje
      INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY liczba_osob DESC, Kraje.nazwa_kraju
      LIMIT 1;
    `,
    hints: ["Sprawdź GROUP BY", "Sprawdź ORDER BY", "Sprawdź LIMIT"],
    solution: `SELECT Kraje.nazwa_kraju, COUNT(Osoby.id_osoby) AS liczba_osob
FROM Kraje
INNER JOIN Osoby ON Kraje.id_kraju = Osoby.kraj
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY liczba_osob DESC, Kraje.nazwa_kraju
LIMIT 1;`,
    compareOrder: true,
  },
  {
    id: 60,
    title: "Kraj z największą liczbą filmów",
    taskText: "Wyświetl nazwę kraju i liczbę filmów dla kraju, którego wytwórnie mają najwięcej filmów.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Kraje
      INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      INNER JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY liczba_filmow DESC, Kraje.nazwa_kraju
      LIMIT 1;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź GROUP BY", "Sprawdź LIMIT"],
    solution: `SELECT Kraje.nazwa_kraju, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Kraje
INNER JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
INNER JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY liczba_filmow DESC, Kraje.nazwa_kraju
LIMIT 1;`,
    compareOrder: true,
  },
  {
    id: 61,
    title: "Zamówienia pracowników 3 i 4",
    taskText: "Wyświetl numery zamówień, identyfikatory pracowników i daty dla zamówień obsługiwanych przez pracownika 3 lub 4.",
    type: "sql",
    category: "extra",
    visibleTables: ["Zamowienia"],
    expectedSql: `
      SELECT Zamowienia.IDzamowienia, Zamowienia.IdPracownika, Zamowienia.DataZamowienia
      FROM Zamowienia
      WHERE Zamowienia.IdPracownika = 3 OR Zamowienia.IdPracownika = 4
      ORDER BY Zamowienia.IDzamowienia;
    `,
    hints: ["Sprawdź WHERE", "Sprawdź OR", "Sprawdź ORDER BY"],
    solution: `SELECT Zamowienia.IDzamowienia, Zamowienia.IdPracownika, Zamowienia.DataZamowienia
FROM Zamowienia
WHERE Zamowienia.IdPracownika = 3 OR Zamowienia.IdPracownika = 4
ORDER BY Zamowienia.IDzamowienia;`,
    compareOrder: true,
  },
  {
    id: 62,
    title: "Wszystkie kraje i liczba filmów",
    taskText: "Wyświetl wszystkie kraje oraz liczbę filmów wyprodukowanych przez ich wytwórnie. Uwzględnij kraje bez filmów.",
    type: "sql",
    category: "extra",
    visibleTables: ["Kraje", "Wytwornie", "Filmy"],
    expectedSql: `
      SELECT Kraje.nazwa_kraju, COUNT(Filmy.id_filmu) AS liczba_filmow
      FROM Kraje
      LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
      LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
      GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
      ORDER BY liczba_filmow DESC, Kraje.nazwa_kraju;
    `,
    hints: ["Sprawdź LEFT JOIN", "Sprawdź GROUP BY", "Sprawdź ORDER BY"],
    solution: `SELECT Kraje.nazwa_kraju, COUNT(Filmy.id_filmu) AS liczba_filmow
FROM Kraje
LEFT JOIN Wytwornie ON Kraje.id_kraju = Wytwornie.kraj
LEFT JOIN Filmy ON Wytwornie.wytwornia_id = Filmy.wytwornia
GROUP BY Kraje.id_kraju, Kraje.nazwa_kraju
ORDER BY liczba_filmow DESC, Kraje.nazwa_kraju;`,
    compareOrder: true,
  },
  {
    id: 63,
    title: "Filmy z nowszych wytwórni i kodem kraju",
    taskText: "Wyświetl tytuły filmów, nazwy wytwórni i kody krajów dla wytwórni założonych po 1960 roku.",
    type: "sql",
    category: "extra",
    visibleTables: ["Filmy", "Wytwornie", "Kraje"],
    expectedSql: `
      SELECT Filmy.tytul, Wytwornie.nazwa, Kraje.kod
      FROM Filmy
      INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
      INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
      WHERE Wytwornie.rok_zalozenia > 1960
      ORDER BY Filmy.tytul;
    `,
    hints: ["Sprawdź JOIN", "Sprawdź WHERE", "Sprawdź ORDER BY"],
    solution: `SELECT Filmy.tytul, Wytwornie.nazwa, Kraje.kod
FROM Filmy
INNER JOIN Wytwornie ON Filmy.wytwornia = Wytwornie.wytwornia_id
INNER JOIN Kraje ON Wytwornie.kraj = Kraje.id_kraju
WHERE Wytwornie.rok_zalozenia > 1960
ORDER BY Filmy.tytul;`,
    compareOrder: true,
  },
];
