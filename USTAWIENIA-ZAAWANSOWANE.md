# Ustawienia zaawansowane — 30 opcji

Otwórz Ustawienia strony → Ustawienia zaawansowane. Są cztery zakładki, wyszukiwarka, reset każdej grupy, Porównaj, Anuluj i Zastosuj. Domyślne ustawienia zachowują wygląd poprzedniej wersji. Zmiany dotyczą danego urządzenia i przeglądarki.

## Wygląd

1. Własny kolor akcentu, z osobnym przełącznikiem używania koloru.
2. Osobne kolory filmów, projektów i ulubionych.
3. Tło: obecne, jednolity kolor, gradient z kątem, faktura lub własny obraz. PNG/JPEG/WebP do 6 MB jest lokalnie zmniejszany przed zapisaniem; wynik ma limit rozmiaru. Obraz nie jest wysyłany na serwer.
4. Krycie paneli.
5. Siła rozmycia szkła.
6. Zaokrąglenie narożników.
7. Obramowanie: minimalistyczne, świetlne, podwójne, techniczne.
8. Krój, rozmiar, odstępy liter i wysokość wiersza.

## Układ

9. Kolejność grup Katalog / O mnie oraz kolejność Filmów / Projektów w katalogu. Przeciąganie lub przyciski strzałek. Zachowano architekturę dwóch kolumn i zakładek mobilnych; O mnie nie jest wkładane pomiędzy dwa panele tego samego katalogu.
10. Maksymalna szerokość strony.
11. Proporcje kolumn na komputerze; telefon zachowuje zakładki.
12. Projektant kart: obraz po lewej, nad tekstem lub po prawej, opis krótki/pełny/same tytuły i metadane. Telefon dopasowuje układ do jednej kolumny.
13. Widoczność i kolejność dolnego menu. Minimum dwie pozycje, ustawienia zawsze dostępne. Zmienia się również logiczna kolejność elementów.
14. Obsługa prawą lub lewą ręką: położenie wybranych kontrolek i zamknięcia.
15. Własny zestaw do pięciu skrótów w przycisku ⋯. Przycisk pojawia się po zmianie domyślnego zestawu.
16. Szczegóły projektu: dostosowane do urządzenia, panel od dołu, okno centralne, pełny ekran.

## Animacje

17. Prędkość animacji interfejsu. Nie zmienia prędkości filmu ani czasu działania gestów; istniejący sześci sekundowy znak nagłówka zachowuje własną oś czasu.
18. Osobne przełączniki animowanego tła, cząsteczek, poświat, reakcji przycisków i przejść.
19. Intensywność ozdobnego ruchu i poświat. Nie deformuje przejść wymagających dokładnego dopasowania zdjęcia do galerii.
20. Reakcja na dotyk: fala, ślad, impuls, brak.
21. Dodatkowe wejście: brak, logo lub światło, czas 0,8–3 s i częstotliwość. Przycisk Odtwórz wejście służy do próby. Zawsze można pominąć.
22. Przewijanie: zwykłe, delikatna głębia, eksperymentalne tło WebGL. To dekoracyjna grafika, bez modelu AI i płatnego API. Silnik jest pobierany na żądanie; pierwsze uruchomienie wymaga dostępności pliku z sieci. Brak WebGL uruchamia prostsze tło zastępcze.
23. Podgląd na żywo: opcjonalnie tymczasowo stosuje szkic do strony. Osobne okno pokazuje wygląd bez zapisu. Zamknięcie ustawień odrzuca niezapisane zmiany.
24. Automatyczna jakość: dostosowuje rozdzielczość eksperymentalnego tła do płynności. Tekst pozostaje ostry.

Systemowe ograniczenie ruchu i podstawowy tryb skupienia mają pierwszeństwo. Ustawienia nie wymuszają animacji wbrew tym preferencjom.

## Profile i dane

25. Do 12 własnych profili: zapis szkicu, wczytanie do podglądu, usuwanie. Profil może zawierać również podstawowe preferencje wyglądu.
26. Harmonogram: ręcznie, według systemu albo godzin rozpoczęcia dnia i nocy. Oddzielne motywy dzienne i nocne.
27. Eksport i import JSON z walidacją, również z własnym tłem. Import trafia do szkicu i wymaga Zastosuj. Nie jest to eksport ulubionych.
28. Historia do 12 zapisów. Przywrócenie trafia do podglądu; Zastosuj zatwierdza cofnięcie.
29. Pomiar zapisanych danych, czyszczenie pobranych obrazów offline bez usuwania skryptów i cudzych pamięci, osobne usuwanie ulubionych oraz reset zaawansowanych do szkicu. Własne tła i profile są zachowywane przy czyszczeniu obrazów offline.
30. Porównanie obecnie / po zmianach: osobne ramki z oddzielnym zapisem preferencji. Można oglądać widok telefonu lub skalowany widok komputera. Zamknięcie niszczy ramki. Podgląd nie rejestruje własnej PWA.

## Jak używać

- Zmień opcje i wybierz Porównaj lub Podgląd. Zastosuj zapisuje. Anuluj albo zamknięcie odrzuca szkic.
- Zapis profilu jest osobną, świadomą czynnością — nie musi stosować go do strony.
- Aby wrócić do obecnego wyglądu, zresetuj grupy i zastosuj. Podstawowe ustawienia mają własny reset.
- Dane są lokalne. Tryb prywatny, blokada zapisu lub zapełniona pamięć mogą uniemożliwić utrwalenie zmian; panel pokazuje wtedy komunikat. Eksport pozwala zachować konfigurację w pliku.

## Aktualizacja

Rozpakuj ZIP. Wgraj zawartość do głównego katalogu KodAIireszta, nadpisując poprzednie pliki i zachowując foldery. Nie wgrywaj ZIP-a jako pliku strony. Poczekaj na zielony Sync portal content. Source w GitHub Pages pozostaje GitHub Actions. Nie zmieniaj domeny, DNS ani HTTPS.

Po publikacji odśwież stronę. W zainstalowanej PWA sprawdź Nowa wersja — odśwież w ustawieniach. Istniejące proste ustawienia i podgląd wodotrysków pozostają.

## Sprawdzenie

Przeszły testy działania PL/EN: wszystkie 30 grup, szkic i zastosowanie, anulowanie podglądu, profile, model importu/eksportu, wyszukiwanie, walidacja, menu i układ, harmonogram, wejście z pomijaniem, zapis obrazu, brak miejsca na zapis i odseparowane porównanie. Osobny test sprawdził czyszczenie tylko obrazów we własnej pamięci PWA. Przeszły budowanie, kontrola plików i testy automatu treści.

Nie wykonano wizualnego testu panelu w przeglądarce ani testu GPU/instalacji na fizycznym telefonie: narzędzie kontroli przeglądarki było niedostępne. Zmiany nie zostały opublikowane automatycznie — to paczka do wgrania. Po publikacji sprawdź responsywność panelu i podglądów na swoich urządzeniach.
