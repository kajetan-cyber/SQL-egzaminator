export const seedSql = `
INSERT INTO Kraje (id_kraju, nazwa_kraju, stolica, kod) VALUES
  (1, 'Belgia', 'Bruksela', 'BE'),
  (2, 'Hiszpania', 'Madryt', 'ES'),
  (3, 'Szwecja', 'Sztokholm', 'SE'),
  (4, 'Polska', 'Warszawa', 'PL'),
  (5, 'Francja', 'Paryz', 'FR'),
  (6, 'Niemcy', 'Berlin', 'DE'),
  (7, 'Wielka Brytania', 'Londyn', 'GB'),
  (8, 'Czechy', 'Praga', NULL);

INSERT INTO Wytwornie (wytwornia_id, nazwa, kraj, rok_zalozenia) VALUES
  (1, 'Belga Films', 1, 1937),
  (2, 'Brussels Pictures', 1, 1988),
  (3, 'Hispania Films', 2, 1956),
  (4, 'Iberia Studios', 2, 1971),
  (5, 'Svensk Filmindustri', 3, 1919),
  (6, 'Nordisk Film Sverige', 3, 1984),
  (7, 'Kadr', 4, 1955),
  (8, 'Gaumont', 5, 1895),
  (9, 'Bavaria Film', 6, 1919),
  (10, 'BBC Films', 7, 1990);

INSERT INTO Filmy (id_filmu, tytul, gatunek, wytwornia) VALUES
  (1, 'Brukselska noc', 'dramat', 1),
  (2, 'Diamenty Antwerpii', 'kryminal', 2),
  (3, 'Madrycki poranek', 'obyczajowy', 3),
  (4, 'Barcelona bez konca', 'komedia', 4),
  (5, 'Sztokholmska zima', 'dramat', 5),
  (6, 'Warszawski most', 'dokument', 7),
  (7, 'Paryski list', 'dramat', 8),
  (8, 'Monachijskie lato', 'familijny', 9);

INSERT INTO Osoby (id_osoby, imie, nazwisko, kraj) VALUES
  (1, 'Carl Friedrich', 'Gauss', 6),
  (2, 'Richard', 'Dawkins', 7),
  (3, 'Ada', 'Lovelace', 7),
  (4, 'Louis', 'Pasteur', 5),
  (5, 'Rene', 'Descartes', 5),
  (6, 'Blaise', 'Pascal', 5),
  (7, 'Stanislaw', 'Ulam', 4),
  (8, 'Maria', 'Sklodowska-Curie', 4),
  (9, 'Mikolaj', 'Kopernik', 4),
  (10, 'Olga', 'Tokarczuk', 4),
  (11, 'Astrid', 'Lindgren', 3),
  (12, 'Greta', 'Garbo', 3),
  (13, 'Alfred', 'Nobel', 3),
  (14, 'Ingmar', 'Bergman', 3),
  (15, 'Selma', 'Lagerlof', 3),
  (16, 'Rene', 'Magritte', 1),
  (17, 'Georges', 'Simenon', 1),
  (18, 'Audrey', 'Hepburn', 1),
  (19, 'Jacques', 'Brel', 1),
  (20, 'Adolphe', 'Sax', 1),
  (21, 'Peter Paul', 'Rubens', 1),
  (22, 'Pablo', 'Picasso', 2),
  (23, 'Salvador', 'Dali', 2),
  (24, 'Miguel', 'Cervantes', 2),
  (25, 'Federico', 'Lorca', 2),
  (26, 'Montserrat', 'Caballe', 2),
  (27, 'Santiago', 'Ramon y Cajal', 2),
  (28, 'Antoni', 'Gaudi', 2);

INSERT INTO Klienci (IdKlienta, Nazwa, Adres, Miasto, Kod, Kraj) VALUES
  (1, 'Jan Niezbędny', 'ul. Długa 1', 'Warszawa', '00-001', 'Polska'),
  (2, 'Wacław DiPone', 'ul. Szewska 8', 'Kraków', '30-002', 'Polska'),
  (3, 'Robert Won', 'ul. Portowa 4', 'Gdańsk', '80-001', 'Polska'),
  (4, 'Anna Bez Zamówień', 'ul. Cicha 12', 'Poznań', '60-101', 'Polska');

INSERT INTO Zamowienia (IDzamowienia, IdKlienta, IdPracownika, DataZamowienia, KodKuriera) VALUES
  (10308, 1, 7, '2024-09-18', 2),
  (10309, 2, 3, '2024-09-19', 1),
  (10310, 3, 4, '2024-09-20', 3);
`;
