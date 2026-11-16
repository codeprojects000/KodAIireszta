# Wersja mobilna — wybrany zestaw

## Co zostało dodane

1. Pełne efekty i duże podglądy jako ustawienia domyślne dla nowej wizyty; wcześniejsze świadomie zapisane preferencje pozostają zachowane.
2. Instalacja PWA: manifest, ikony, tryb osobnego okna i kolor ekranu startowego. Ostateczny wygląd uruchamiania zależy od telefonu i przeglądarki.
3. Dolna nawigacja na telefonie.
4. Płynny wskaźnik wybranej pozycji menu.
5. Zakładki Filmy / Projekty obsługiwane przyciskiem lub poziomym gestem, z miękkim zatrzymaniem.
6. Systemowe udostępnianie; tam, gdzie jest niedostępne — kopiowanie linku.
7. Szczegóły aplikacji jako panel od dołu; gest zamknięcia wykonywany na uchwycie, aby nie przeszkadzał w przewijaniu tekstu.
8. Ulubione przechowywane lokalnie i animacja zapisu; bez konta i synchronizacji między telefonami.
9. Paleta kolorów z natychmiastowym, płynnym podglądem.
10. Sprężyste przyciski.
11. Galeria zrzutów na każdej karcie projektu; gest lub strzałki.
12. Powrót na górę z pierścieniem pokazującym postęp przewinięcia.
13. Zmiana motywu przez rozchodzący się krąg w przeglądarkach obsługujących View Transitions; w pozostałych płynna zmiana barw.
14. Rozwijane opisy filmów na telefonie.
15. Wybór ekranu startowego: filmy, projekty, ulubione.
16. Szkielety kart podczas wczytywania treści.
17. Osobny tryb prezentacji aplikacji: galeria, warstwy, odkrywanie przewijaniem i uruchamianie.
18. Animowane ikony dolnej nawigacji.
19. Zmniejszanie nagłówka podczas przewijania.
20. Przejście zdjęcia, tytułu i przycisku pomiędzy kartą a szczegółami, również przy powrocie.
21. Rozsuwanie ekranu na warstwy w prezentacji. To świadomy efekt wizualny wykonany z trzech fragmentów prawdziwego zrzutu, a nie odtworzony kod wewnętrzny aplikacji.
22. Historia projektu sterowana przewijaniem rzeczywistych ekranów.
23. Świetlny portal pojawiający się przy dotknięciu Uruchom; nie opóźnia otwierania aplikacji.
24. Płynne przejścia kolorów paneli, przycisków, poświat i konstelacji.
25. Konstelacja reagująca na położenie palca/wskaźnika w nagłówku.
26. Znak marki składany z cząsteczek — raz na sesję.
27. Osobna przestrzenna karuzela projektów oraz fala świetlna przy zmianie zakładki.

## Wgranie

Rozpakuj KodAIireszta-mobile-PWA.zip. Przeciągnij zawartość folderu do głównego katalogu repozytorium KodAIireszta, nadpisując stare pliki. Zachowaj strukturę folderów assets. Nie przesyłaj ZIP-a jako pojedynczego pliku strony. Nie zmieniaj domeny ani DNS.

Settings → Pages → Source pozostaje GitHub Actions. Dotychczasowy workflow Sync portal content publikuje całość z katalogu dist po zbudowaniu. Folderu dist nie trzeba wgrywać.

## Sprawdzenie na telefonie po publikacji

- Otwórz stronę po HTTPS. Instalacja PWA i część możliwości udostępniania wymagają bezpiecznego połączenia.
- Ustawienia → Zainstaluj aplikację. Na iPhonie użyj Safari → Udostępnij → Do ekranu początkowego; przycisk pokazuje też instrukcję. Na Androidzie instalacja zależy od obsługi przeglądarki i jej kryteriów.
- Przesuń Filmy/Projekty po treści poza przyciskami; galerii używaj gestem na obrazku.
- Zapisz materiał i otwórz Ulubione. Ustawienia i ulubione są osobne dla każdej przeglądarki; usunięcie danych strony je kasuje.
- W projekcie wybierz Szczegóły albo Prezentacja. W Warstwach przesuń suwak; w Odkrywaj przewijaj ekran.
- Jeżeli zmienisz ekran startowy, będzie używany przy kolejnym wejściu na telefonie.
- W Ustawieniach przywrócenie domyślnych włącza pełne efekty i duże podglądy. Systemowe ograniczenie ruchu ma pierwszeństwo.
- Nowy kod PWA pobiera dane najpierw z sieci. Dla kolejnych wersji w ustawieniach może pojawić się Nowa wersja — odśwież; nie odświeża sam w trakcie korzystania.

## Weryfikacja

Sprawdzono działanie DOM dla obu języków, zapis i usuwanie ulubionych, zakładki, panele, prezentację, paletę, ustawienia ruchu, pliki oraz ikony PWA, pobieranie aktualnej treści i zapasową kopię offline. Nie przeprowadzono wizualnego testu na fizycznym telefonie: lokalny podgląd przeglądarkowy nie uzyskał połączenia. Nie można lokalnie potwierdzić systemowego okna udostępniania ani instalacji na Twoim telefonie.
