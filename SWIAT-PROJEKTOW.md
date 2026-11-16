# Kod, AI i reszta — Świat projektów

## Aktualizacja

To pełna paczka strony: dotychczasowe funkcje mobilne i PWA oraz nowa prezentacja AI. Rozpakuj ZIP i wgraj jego zawartość do głównego katalogu repozytorium KodAIireszta, nadpisując istniejące pliki. Zachowaj foldery assets, scripts, examples i .github. Nie wgrywaj ZIP-a jako pojedynczego pliku strony. Nie zmieniaj domeny, DNS ani ustawień HTTPS.

Dotychczasowy workflow Sync portal content ma nadal budować `node scripts/build-site.cjs` i publikować `dist` przez GitHub Pages. Folder dist nie jest w paczce i nie trzeba go przesyłać. Jeśli masz już zainstalowaną PWA, sprawdź w jej ustawieniach przycisk „Nowa wersja — odśwież”.

## Gdzie są nowe funkcje

- Pod nagłówkiem: przestrzenny rdzeń AI i przycisk „Wejdź przez monitor”. Na komputerze można też dotknąć samego ekranu monitora na grafice.
- Wejście: krótki tunel znaków z przyciskiem Pomiń.
- Świat aplikacji: przestrzenne obiekty z rzeczywistymi zrzutami, własnymi symbolami i kolorami. Wybranie obiektu zmienia światło, podgląd oraz wyróżnienie jego karty na stronie.
- Mapa: połączenia prowadzące do tych samych projektów.
- Sieć neuronowa: Wyślij impuls uruchamia wizualizację połączeń. To efekt edukacyjny, nie działający model AI.
- Pokaz projektu: nowy przycisk przy każdej aplikacji. Dostępne są Pokaz, Wideo, Od pomysłu, Kulisy, Przed/po.
- Pokaz: prawdziwe zrzuty, podpisy, wybór 30 lub 90 sekund, odtwarzanie, pauza i przechodzenie do kolejnej sceny. Pokaz zdjęć nie udaje nagrania działania aplikacji.
- Tryb wystawowy: w świecie aplikacji. Przechodzi między projektami w pętli. Dotknięcie prezentacji zatrzymuje pokaz; można go wznowić przyciskiem Odtwórz. Zmiana karty przeglądarki pauzuje pokaz.
- Rekonstrukcja: cząsteczki i ponowne złożenie widoku po zakończeniu pokazu lub wyjściu z wystawy.
- Ukryta niespodzianka: pięć szybkich dotknięć logo w górnym menu otwiera ukrytą sieć.
- Efekt głębi: rdzeń przesuwa się subtelnie względem tekstu podczas przewijania. Ruch respektuje ustawienia i ograniczenia systemowe.

## Materiały, których nie otrzymałem

Nie ma jeszcze nagrań aplikacji, napisów do nagrań, prawdziwych par obrazów przed/po ani osobistych relacji z procesu tworzenia. Ich obsługa jest zbudowana, ale widoki uczciwie pokazują brak materiału. Nie dopisałem fikcyjnych trudności, dat i wniosków. Bieżące opisy oraz dostępne zrzuty są używane jako podstawa pokazu.

Aby dodać materiały:

1. Utwórz folder assets/demos i umieść tam nagrania MP4/WebM, napisy WebVTT oraz obrazy PNG/JPEG/WebP. Większe nagrania mogą wymagać osobnego hostingu i dostosowania konfiguracji; nie wgrywaj ich bez sprawdzenia limitów repozytorium.
2. Edytuj showcase-content.js. Przykład jest w examples/showcase-content.example.js — wpisuj tylko istniejące pliki i prawdziwe informacje.
3. Klucze obecnych projektów: finanse, muzyczne-klocki, angielski, skoczek, krok-kcal, github-73797374656d6f735f776562.
4. Pole video wskazuje nagranie, captions napisy, before/after prawdziwą parę do porównania, goal/challenge/lesson opis autora, timeline etapy historii. Opcjonalny obiekt en zawiera wersję angielską. Bez niego używany jest wpis podstawowy.
5. Wgraj zmiany na GitHub. Automat budowania kopiuje assets/demos i odświeża wersję PWA.

## Sprawdzenie po wgraniu

Otwórz stronę po HTTPS na telefonie i komputerze. Sprawdź Wejdź przez monitor → Pomiń → wybór aplikacji → Odkryj projekt. Przejdź przez Mapę i Sieć. W Pokazie przetestuj 30/90 sekund i pauzę. Sprawdź też wyłączone efekty w ustawieniach. Wszystkie dotychczasowe filmy, aplikacje, ulubione i ustawienia pozostają dostępne.

Testy działania PL/EN i budowania przeszły. Zweryfikowano również odtwarzacz z przykładową konfiguracją materiałów, ścieżkę napisów, suwak porównania i zapasową kopię PWA offline. Konfiguracja testowa nie trafia do strony. Nie potwierdzono wizualnie efektów na fizycznym telefonie; lokalny podgląd przeglądarkowy był niedostępny. To pełna paczka do wgrania, nie informacja o publikacji na żywej domenie.
