# Automatyczne treści: YouTube + GitHub

## Co jest przygotowane

Jeden workflow „Sync portal content” co sześć godzin sprawdza kanał YouTube i wszystkie publiczne repozytoria profilu codeprojects000. Nie wymaga klucza YouTube API ani płatnego modelu AI. Harmonogram i skrypty są w tej paczce; nie są jeszcze włączone na koncie GitHub.

## Nowy film

Dodajesz film na kanał → przy kolejnym udanym przebiegu pojawia się tytuł, data, miniatura i przycisk YouTube. Nowy film dostaje krótki opis z pierwszego akapitu opisu filmu na Twoim kanale. Jeżeli brak opisu, używany jest neutralny tekst. Nowy wpis EN dostaje neutralne angielskie wprowadzenie. Redakcyjne opisy i istniejące tłumaczenia są zachowywane. Nowe tytuły nie są automatycznie tłumaczone przez model językowy.

## Nowy projekt

Tworzysz publiczne repozytorium w codeprojects000 → automat pobiera nazwę i opis z pola About/Description w GitHubie i tworzy prostą okładkę z nazwą. Gdy opis jest pusty, używa neutralnego zdania zamiast wymyślać funkcje. Wersja EN ma neutralne wprowadzenie, dopóki nie dostanie angielskiego opisu.
Jeżeli GitHub Pages działa pod codeprojects000.github.io, przycisk otwiera aplikację. Wcześniej prowadzi do kodu. Automat sprawdza publikację przy kolejnych przebiegach i podmienia adres, gdy strona działa. Dotychczasowe ręcznie opracowane opisy i galerie pozostają zachowane.
Domyślnie pomijane są forki, archiwa i repozytorium samego portalu podczas działania workflow; dodatkowe wyjątki są w github.config.json. Stare konto nie jest odczytywane.
Automat nie włącza GitHub Pages w innych repozytoriach i nie zmienia ich ustawień. Zmiany plików aplikacji są publikowane zgodnie z konfiguracją GitHub Pages danego projektu — to oddzielna rzecz od synchronizacji katalogu na portalu.

## Własny opis i obrazek bez poprawiania portalu

Opcjonalnie umieść portal.json w głównym katalogu nowego projektu. Przykład jest w examples/portal.json. Pola description i descriptionEn trafiają do karty, details i detailsEn do szczegółów. Obrazek wskazany przez image musi być plikiem PNG/JPEG/WebP w tym samym publicznym repozytorium, maksymalnie 3 MB. Jest kopiowany lokalnie do portalu. hidden: true wyłącza projekt z katalogu. Nie umieszczaj danych prywatnych ani sekretów w tym pliku.
Nie trzeba dodawać portal.json, żeby projekt pojawił się na stronie. To opcjonalny sposób dopracowania opisów i podglądu. Bez niego nowy projekt ma automatyczną okładkę, a nie zrzut aplikacji.

## Uruchomienie po publikacji repozytorium portalu

1. Wgraj całą zawartość paczki, także katalog .github, do głównego katalogu repozytorium portalu.
2. Otwórz Actions → Sync portal content → Run workflow. Pozwól workflow zapisywać zmiany, jeśli ustawienia repozytorium to ograniczają. Reguły ochrony gałęzi mogą wymagać osobnej konfiguracji.
3. Podłącz to repozytorium i gałąź do hostingu portalu, np. planowanego Cloudflare Pages. Udany zapis danych musi jeszcze zostać opublikowany przez hosting.
4. Harmonogram: 00:17, 06:17, 12:17, 18:17 UTC. GitHub może opóźniać uruchomienia i wyłączać harmonogram nieaktywnych repozytoriów publicznych po 60 dniach.

Skrypty ręczne: node scripts/sync-youtube.cjs oraz node scripts/sync-github.cjs (Node.js 24). Bez zmian = bez nowego commita. Błąd pobierania zatrzymuje workflow; nie publikuje częściowej listy projektów.
Push wykonany przez GITHUB_TOKEN nie uruchamia automatycznie kolejnego workflow GitHub Actions. Przy GitHub Pages dla samego portalu trzeba połączyć synchronizację z wdrożeniem Pages; samo wgranie tego harmonogramu tego nie zapewnia.

## Źródła

- [GitHub — publiczne repozytoria użytkownika](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
- [GitHub Pages — publikacja zmian](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub — harmonogram](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [YouTube — kanały Atom](https://developers.google.com/youtube/data/guides/push_notifications)
