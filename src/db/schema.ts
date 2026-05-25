export const tableSchemas = {
  Kraje: [
    { name: "id_kraju", type: "INTEGER PRIMARY KEY", required: true },
    { name: "nazwa_kraju", type: "TEXT", required: true },
    { name: "stolica", type: "TEXT", required: false },
    { name: "kod", type: "TEXT", required: false },
  ],
  Filmy: [
    { name: "id_filmu", type: "INTEGER PRIMARY KEY", required: true },
    { name: "tytul", type: "TEXT", required: true },
    { name: "gatunek", type: "TEXT", required: true },
    { name: "wytwornia", type: "INTEGER", required: true },
  ],
  Wytwornie: [
    { name: "wytwornia_id", type: "INTEGER PRIMARY KEY", required: true },
    { name: "nazwa", type: "TEXT", required: true },
    { name: "kraj", type: "INTEGER", required: true },
    { name: "rok_zalozenia", type: "INTEGER", required: true },
  ],
  Osoby: [
    { name: "id_osoby", type: "INTEGER PRIMARY KEY", required: true },
    { name: "imie", type: "TEXT", required: true },
    { name: "nazwisko", type: "TEXT", required: true },
    { name: "kraj", type: "INTEGER", required: true },
  ],
  Klienci: [
    { name: "IdKlienta", type: "INTEGER PRIMARY KEY", required: true },
    { name: "Nazwa", type: "TEXT", required: false },
    { name: "Adres", type: "TEXT", required: false },
    { name: "Miasto", type: "TEXT", required: false },
    { name: "Kod", type: "TEXT", required: false },
    { name: "Kraj", type: "TEXT", required: false },
  ],
  Zamowienia: [
    { name: "IDzamowienia", type: "INTEGER PRIMARY KEY", required: true },
    { name: "IdKlienta", type: "INTEGER", required: false },
    { name: "IdPracownika", type: "INTEGER", required: false },
    { name: "DataZamowienia", type: "TEXT", required: false },
    { name: "KodKuriera", type: "INTEGER", required: false },
  ],
} as const;

export type TableName = keyof typeof tableSchemas;

export const schemaSql = `
CREATE TABLE Kraje (
  id_kraju INTEGER PRIMARY KEY,
  nazwa_kraju TEXT NOT NULL,
  stolica TEXT,
  kod TEXT
);

CREATE TABLE Filmy (
  id_filmu INTEGER PRIMARY KEY,
  tytul TEXT NOT NULL,
  gatunek TEXT NOT NULL,
  wytwornia INTEGER NOT NULL,
  FOREIGN KEY (wytwornia) REFERENCES Wytwornie(wytwornia_id)
);

CREATE TABLE Wytwornie (
  wytwornia_id INTEGER PRIMARY KEY,
  nazwa TEXT NOT NULL,
  kraj INTEGER NOT NULL,
  rok_zalozenia INTEGER NOT NULL,
  FOREIGN KEY (kraj) REFERENCES Kraje(id_kraju)
);

CREATE TABLE Osoby (
  id_osoby INTEGER PRIMARY KEY,
  imie TEXT NOT NULL,
  nazwisko TEXT NOT NULL,
  kraj INTEGER NOT NULL,
  FOREIGN KEY (kraj) REFERENCES Kraje(id_kraju)
);

CREATE TABLE Klienci (
  IdKlienta INTEGER PRIMARY KEY,
  Nazwa TEXT,
  Adres TEXT,
  Miasto TEXT,
  Kod TEXT,
  Kraj TEXT
);

CREATE TABLE Zamowienia (
  IDzamowienia INTEGER PRIMARY KEY,
  IdKlienta INTEGER,
  IdPracownika INTEGER,
  DataZamowienia TEXT,
  KodKuriera INTEGER,
  FOREIGN KEY (IdKlienta) REFERENCES Klienci(IdKlienta)
);
`;
