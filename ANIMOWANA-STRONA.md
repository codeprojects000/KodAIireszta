# Kod, AI i reszta — animowana strona

Ta wersja zastępuje „Świat projektów”. Nie ma sekcji Wejdź głębiej, scen z aplikacjami, prezentacji 30/90 sekund, kulis ani pustych ekranów przed/po. Widowiskiem jest sam interfejs.

## Oprawa

- Płynne, proceduralne tło WebGL: fale, metaliczne refleksy, szklane światło i cyfrowa siatka.
- Przestrzenny znak </> modelowany i oświetlany w shaderze. Podczas przewijania przemieszcza się ku znakowi nagłówka.
- Dwusekundowe wejście: przestrzenny znak, przelot i fala odsłaniająca stronę. Raz na sesję, bez fikcyjnych procentów. Pomiń jest dostępne od początku.
- Trzy oprawy: Płynny metal, Szkło, Cyfrowa materia. Przełącza je przycisk przy nagłówku. Wybór zapisuje się na urządzeniu.
- Świetlna nić prowadząca przez stronę, falowanie granic sekcji, bezwładność tła, rozświetlenie przy wyborze sekcji i szczelina przejścia.
- Reakcja na położenie palca/wskaźnika: światło, deformacja tła, fala, świetlna smuga i cząsteczki.
- Węzeł świetlnych punktów powstający podczas przewijania. Poszczególne materiały zmieniają formę na splot, spiralę lub falę. Liczba punktów i rozdzielczość są mniejsze na telefonie.
- Magnetyczne przyciski dla myszy, miękkie kształty kontrolek, szkło i odbicia kart, głębia paneli oraz zmiany typografii.
- Generatywna kompozycja: Stwórz własny kadr → Nowa kompozycja → Zapisz PNG. Grafika powstaje lokalnie. Nie jest to generowanie przez model AI.
- Istniejące przejście PL/EN rozbudowane o rozproszenie i ponowne złożenie tekstu.
- Finał przy stopce: cząsteczki zbierają się wokół znaku kodu.

To jedna oprawa o wspólnych parametrach ruchu, światła i materiału. Nie każda metafora oznacza osobną sekwencję. Filmy, aplikacje, miniatury, galerie, ulubione, udostępnianie, ustawienia oraz PWA pozostają dostępne. Układ desktopowy nadal pokazuje katalog w dwóch kolumnach; na telefonie są zakładki i dolne menu.

## Aktualizacja GitHuba

1. Rozpakuj KodAIireszta-animowana-strona.zip.
2. W repozytorium KodAIireszta wybierz Add file → Upload files.
3. Przeciągnij zawartość rozpakowanego folderu, razem z assets, scripts i .github. Nadpisz istniejące pliki. Nie przesyłaj ZIP-a jako pojedynczego pliku.
4. Commit changes. Poczekaj na zielony Sync portal content.
5. Settings → Pages → Source pozostaje GitHub Actions. Dotychczasowy automat buduje dist, zawierający wyłącznie aktualną wersję. Nie zmieniaj DNS, domeny ani HTTPS.
6. Otwórz stronę i odśwież. W zainstalowanej PWA sprawdź Ustawienia → Nowa wersja — odśwież, jeśli jest dostępne. W razie starej zapisanej oprawy można zamknąć wszystkie okna aplikacji i otworzyć ją ponownie.

Stare źródła showcase.js/showcase.css/presentation.js mogą pozostać w historii repozytorium; nie są już wczytywane ani publikowane z dist. Nie trzeba usuwać ich ręcznie, jeśli publikujesz przez dostarczony workflow.

## Pierwsze sprawdzenie

- Otwórz główną stronę, obejrzyj 2-sekundowe wejście i sprawdź Pomiń. Ponowne odświeżenie tej samej sesji nie powinno wymuszać animacji.
- Przełącz trzy rzeczywistości przy nagłówku; przewiń do kart i stopki.
- Dotknij pustego tła; na komputerze poruszaj myszą przy przyciskach.
- Sprawdź obie zakładki, zapisanie ulubionego, galerię i szczegóły.
- Stwórz i pobierz własny kadr PNG.
- Sprawdź PL/EN i ustawienia. Pełne efekty są domyślne dla nowej wizyty. Starsze zapisane preferencje nie są kasowane; Przywróć domyślne włączy pełny zestaw. Systemowe ograniczenie ruchu zawsze ma pierwszeństwo.

## Weryfikacja i ograniczenia

Przeszły testy działania DOM w PL/EN, zachowania katalogu, kart, zakładek, galerii, ulubionych i paneli, zmiany oprawy i zapisu ustawień, pomijania wejścia, wyłączenia ruchu, zgodności plików oraz PWA. Sprawdzono również interfejs renderera, skończone wartości parametrów i sprzątanie zasobów przy użyciu atrap WebGL. To nie jest test renderowania na prawdziwym GPU.

Próba testu wizualnego w Edge została zatrzymana przez narzędzie kontroli komputera, które nie mogło wiarygodnie ustalić adresu karty. Nie obchodzono tego zabezpieczenia. Dlatego wygląd i kompilację shaderów na konkretnym urządzeniu trzeba potwierdzić po otwarciu strony. W razie braku WebGL lub błędu kompilacji strona przechodzi na tło CSS i przestrzenny znak CSS; treść i nawigacja nadal działają. Nie potwierdzono płynności na fizycznym telefonie.

Wersja nie została automatycznie opublikowana na Twoim koncie — to gotowa paczka do wgrania.
