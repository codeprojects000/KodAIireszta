# Automat projektów — instalacja jednorazowa

Ta paczka aktualizuje wyłącznie automat. Nie zmienia wyglądu strony, logo, galerii użytkownika ani ustawień zaawansowanych. Nie trzeba ponownie wgrywać całego portalu.

## Co robi automat

- Odczytuje publiczne repozytoria konta codeprojects000; pomija sam portal, wykluczone repozytoria, forki i archiwa.
- Dla nowych projektów przygotowuje nazwę i krótki opis z About, README i dostępnych treści aplikacji. To wybór i skrócenie prawdziwych informacji, a nie model AI. Nie wymaga płatnego klucza.
- Gdy aplikacja ma działający adres GitHub Pages, wykonuje zdjęcie komputerowe 1440×900 i telefoniczne 390×844 oraz miniaturę 640 px. Dwa podglądy pokazują różne rozmiary ekranu; nie udają dwóch wewnętrznych ekranów aplikacji.
- Opcjonalnie można wskazać różne publiczne adresy demonstracyjne dla obu zdjęć.
- Aktualizuje galerię i content.json/content.js, zapisuje zmiany oraz publikuje stronę w tym samym przebiegu.
- Nie nadpisuje istniejących opracowanych opisów. W automatycznie zarządzanych opisach wykrywa ręczne zmiany i blokuje ich nadpisywanie.
- Obsługuje maksymalnie sześć projektów na przebieg; pozostałe przechodzą do następnego. Zwykle odświeża obraz po zmianie repozytorium lub po 30 dniach.
- Po błędzie pozostawia poprzednią galerię. Dla nowego projektu bez wcześniejszych zdjęć pozostaje okładka zastępcza. Błąd jest widoczny w podsumowaniu Actions.
- Nieudany automatyczny podgląd ma dobę przerwy przed ponowieniem, chyba że zmienił się projekt/konfiguracja lub wymusisz odświeżenie.
- Istniejąca automatyzacja YouTube nadal działa.

## Wgraj te pliki raz

1. Rozpakuj KodAIireszta-automat-projektow.zip.
2. Otwórz repozytorium KodAIireszta na GitHubie → Add file → Upload files.
3. Przeciągnij całą ZAWARTOŚĆ rozpakowanej paczki, z folderami scripts, automation, examples i .github, oraz dwoma plikami JSON. Zachowaj strukturę i nadpisz wskazane istniejące pliki.
4. Commit changes na main.
5. Sprawdź Code → .github → workflows → sync-youtube.yml. Musi zawierać kroki Plan project screenshots i Install Chromium.
6. Jeśli folder .github nie został przesłany: otwórz istniejący plik automatu na GitHubie, kliknij ołówek i zastąp całość zawartością osobnego pliku workflow-automat-projektow.txt otrzymanego z tą paczką.
7. Nie zmieniaj domeny, DNS, HTTPS ani Source w Pages. Publikacja nadal odbywa się przez GitHub Actions.

Nie dodawaj żadnego własnego klucza ani hasła. Import używa tymczasowego GITHUB_TOKEN zapewnianego przez GitHub Actions. Nie zapisuje go w plikach strony i nie przekazuje do przeglądarki robiącej zdjęcia. Automatyzacja zużywa zasoby GitHub Actions, ale nie wywołuje płatnego modelu językowego.

## Pierwsze uruchomienie

Actions → Sync portal content → Run workflow.

Obecne, wcześniej przygotowane galerie są domyślnie zachowywane. Aby od razu sprawdzić automat na starych projektach, zaznacz:

„Odśwież także istniejące galerie (zachowaj ręczne opisy)”.

Uruchom to po zakończeniu publikacji samych aplikacji. Zaznaczenie pozwala zastąpić ich stare galerie automatyczną parą komputer/telefon. Nadal respektowane są jawne blokady i własne obrazy ustawione w konfiguracji.

Po zakończeniu otwórz Summary przebiegu. Sekcje Plan podglądów i Automatyczne podglądy projektów pokażą liczbę zdjęć i błędy. Zielony wynik całego workflow nie oznacza, że każda aplikacja dała się sfotografować — problemy pojedynczych aplikacji nie blokują publikacji pozostałej strony.

## Potem wszystko dzieje się automatycznie

Dodajesz publiczne repozytorium na codeprojects000 i publikujesz aplikację → przy następnym przebiegu portal ją wykrywa, przygotowuje kartę i podglądy. Harmonogram próbuje co sześć godzin; GitHub może go opóźnić. Run workflow pozwala sprawdzić wcześniej. Nie trzeba wgrywać nowych obrazów do portalu ani ponownie przesyłać plików strony.

Jeśli repozytorium nie jest jeszcze opublikowane, przycisk prowadzi do kodu. Automat sprawdzi dostępność ponownie przy kolejnym przebiegu.

## Poprawki w jednym pliku

projects.overrides.json jest centralnym miejscem korekt. Kluczem jest nazwa repozytorium, np. finanse-. Możesz poprawić title, description, details oraz descriptionEn/detailsEn. Te pola mają pierwszeństwo przed automatem.

Nie kopiuj przykładu bez dostosowania. Plik examples/project-automation.example.json pokazuje format i jest tylko wzorem.

Najprostsza korekta:

{
  "version": 1,
  "projects": {
    "nazwa-repozytorium": {
      "title": "Moja nazwa",
      "description": "Mój opis."
    }
  }
}

Zapis tego jednego pliku na GitHubie uruchamia aktualizację i publikację. Nie wymaga całej paczki strony.

Aby zachować galerię bez zmian, ustaw screenshots.locked na true. Aby nie importować projektu, ustaw hidden na true. Pole manual: true zachowuje ręczne zarządzanie wpisem i pomija zdjęcia. Automatyczne opisy EN pozostają neutralne, chyba że podasz własną wersję descriptionEn; nie obiecujemy tłumaczenia bez modelu.

## Ekran powitalny, profil, logowanie

Automat uruchamia świeżą, odizolowaną przeglądarkę bez kont, cookies, prywatnych danych i kluczy. Nie loguje się i nie wpisuje haseł. Widoczny ekran z hasłem wstrzymuje zdjęcia, zachowując starą galerię.

Jeśli aplikacja ma tryb demonstracyjny, wpisz w jej konfiguracji screenshots.desktopPath i screenshots.mobilePath, np. "demo.html" albo "?demo=1". Adres musi naprawdę istnieć w tej aplikacji. Nie zaczynaj od "/demo.html", jeśli prowadziłoby to poza katalog projektu.

Opcjonalne screenshots.waitFor wskazuje selektor gotowego ekranu; screenshots.clicks to lista do pięciu selektorów przycisków potrzebnych np. do wybrania istniejącej demonstracji. Nie ma wykonywania dowolnego kodu, wpisywania haseł ani wysyłania formularzy do serwera.

Jeżeli świadomie chcesz fotografować ekran powitalny z polem hasła, możesz ustawić screenshots.allowWelcome na true. Nie uruchamia to logowania.

## Co jest chronione

- Tylko publiczne aplikacje na codeprojects000.github.io w katalogu odpowiedniego projektu.
- Nawigacja nie przechodzi na inne domeny; pobieranie zasobów sprawdza adresy i odrzuca lokalne/prywatne sieci.
- Brak klucza administratora w publicznym JavaScript.
- Ręczne opisy i blokady mają pierwszeństwo.
- Zdjęcia są podmieniane dopiero po poprawnym przygotowaniu obu widoków i miniatury.
- Poprzednie pliki wygenerowane przez ten automat są usuwane z bieżącego zestawu dopiero, gdy nie są już używane. Ręczne obrazy pozostają.

## Weryfikacja

Przeszły testy logiki importu README, korekt centralnych, dwóch rozmiarów przeglądarki, mapowania galerii i miniatury, zachowania opisów, braku zmian przy ponownym przebiegu, błędu drugiego zdjęcia, blokady logowania, ponawiania, ograniczeń adresów i sprzątania własnych nieużywanych plików.

Testy przeglądarkowego procesu korzystały z atrapy Playwright. Nie wykonano rzeczywistych zdjęć w lokalnym środowisku: pobranie narzędzi i połączenie sieciowe nie były dostępne. Pierwsze faktyczne uruchomienie Chromium oraz instalację zależności trzeba zweryfikować w Twoim GitHub Actions. Narzędzia są przypięte do wersji Playwright 1.65.1 i sharp 0.35.5, sprawdzonych w oficjalnych wydaniach. Zależności pobiera GitHub wyłącznie, kiedy są zdjęcia do wykonania.

Paczka nie została automatycznie zapisana na Twoim koncie. Jest przygotowana do jednorazowego wgrania.
