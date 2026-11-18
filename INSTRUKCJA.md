# Osobna sekcja YouTube Shorts

Paczka zmienia pięć plików. Nie zawiera content.json ani content.js, więc nie zastępuje aktualnych filmów, projektów ani opisów na GitHubie.

## Wgranie aktualizacji

1. Rozpakuj KodAIireszta-YouTube-Shorts.zip.
2. W repozytorium KodAIireszta otwórz Code → Add file → Upload files.
3. Wgraj cztery pliki do głównego katalogu: index.html, en.html, app.js i style.css. Zatwierdź przez Commit changes.
4. Wejdź do katalogu scripts i wgraj tam plik sync-youtube.cjs z katalogu scripts w paczce. Zastąp poprzedni plik i zatwierdź zmianę. Nie umieszczaj go w głównym katalogu.
5. Otwórz Actions → Sync portal content → Run workflow → Run workflow. Opcja odświeżania screenów projektów nie jest potrzebna do shortów.
6. Poczekaj na zakończenie publikacji. Na stronie użyj Ctrl + F5; w zainstalowanej aplikacji możesz użyć przycisku „Nowa wersja — odśwież” w ustawieniach.

## Co się zmienia

- Pod filmami i projektami, przed „O mnie”, pojawia się sekcja YouTube Shorts na całą szerokość.
- Małe pionowe miniatury, krótki tytuł i bezpośredni link do danego shorta. Na telefonie kafelki przewija się w poziomie.
- Zapis do ulubionych i udostępnianie działają również przy shortach.
- Nowy automat zapisuje oznaczenie isShort na podstawie linku publikacji w oficjalnym feedzie YouTube. Zwykłe filmy i shorty mają osobne miejsca na stronie; nie są dublowane.
- Wersje PL i EN, ustawienia kolorów, ograniczenie ruchu i przełącznik „Pokazuj filmy” obejmują nową sekcję.
- Nie potrzeba klucza API ani dodatkowej usługi. Częstotliwość synchronizacji pozostaje taka jak w obecnym workflow.

## Starsze shorty

Feed YouTube udostępnia ograniczoną listę najnowszych publikacji. Pierwsza synchronizacja rozpozna format wpisów, które są w tym feedzie; nie pobiera całej historii kanału. Zachowuje starsze wpisy i własne opisy.

Jeśli archiwalny short nadal jest w filmach, można jednorazowo dopisać jego 11-znakowy identyfikator do tablicy shortVideoIds w youtube.config.json. Przykład pola (zastąp identyfikator prawdziwym):

```json
"shortVideoIds": ["AbCdEf123_-"]
```

Analogiczne pole regularVideoIds wymusza zwykły film i ma pierwszeństwo. Po zmianie uruchom Run workflow. Nie klasyfikujemy po samym tytule ani długości filmu.

## Weryfikacja tej paczki

Przeszły testy rozpoznawania linków Shorts i zwykłych filmów, zachowania własnych opisów, migracji PL/EN, braku duplikatów, oddzielnego renderowania sekcji, pustej sekcji i synchronizacji obu plików treści. Budowanie strony również zakończyło się poprawnie.

Podgląd w przeglądarce nie był dostępny: przeglądarka nie mogła połączyć się z lokalnym serwerem. Aktualizacji nie opublikowano na Twoim GitHubie.
