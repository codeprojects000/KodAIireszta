# Przywrócona strona i opcjonalny podgląd efektów

Przywrócona została wersja sprzed trzech ostatnich aktualizacji: mobilna strona z PWA, przed „Światem projektów”, animowaną sceną i poprawką logo. Znowu domyślnie widać oryginalny nagłówek oraz wcześniejszy układ filmów i aplikacji.

Wodotryski są dostępne wyłącznie przez Ustawienia strony → Podgląd wodotrysków → Zobacz wodotryski. Otwierają się w osobnym oknie wewnątrz strony. Można przełączyć Widok telefonu. Zamknięcie okna usuwa podgląd i zatrzymuje jego działanie. Ustawienia podglądu są zapisane oddzielnie od ustawień strony głównej. Na stronie głównej WebGL nie jest uruchamiany.

## Wgranie

Rozpakuj ZIP. Wgraj jego zawartość do głównego katalogu KodAIireszta, nadpisując stare pliki i zachowując foldery assets, scripts oraz .github. Nie przesyłaj archiwum ZIP jako pliku strony. Hosting pozostaje GitHub Pages z Source: GitHub Actions. Nie zmieniaj domeny, DNS ani HTTPS.

Po zielonym wyniku automatu odśwież stronę. W zainstalowanej PWA wybierz Nowa wersja — odśwież w ustawieniach, jeśli ten przycisk się pojawi. Stare pliki animowanej wersji mogą pozostać w historii repozytorium — nie są ładowane przez główną stronę ani kopiowane osobno do publikowanego dist.

## Sprawdzenie

Sprawdź oryginalne logo, filmy, aplikacje, ulubione i ustawienia. Włącz podgląd efektów, przełącz Widok telefonu, zamknij go. Główna strona ma nadal wyglądać jak przed podglądem.

Przeszły testy PL/EN, wcześniejszych funkcji mobilnych, osobnego otwierania i zamykania ramki, oddzielenia ustawień, budowania i PWA. Podgląd nie rejestruje własnego service workera. Wygląd i efekty GPU nie zostały ponownie zweryfikowane w przeglądarce; narzędzie kontroli przeglądarki było niedostępne. Nie opublikowano zmian na Twoim koncie — paczka wymaga wgrania.
