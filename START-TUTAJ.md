# Publikacja Kod, AI i reszta

Przygotowane dla repozytorium `codeprojects000/KodAIireszta` i adresu `https://www.kodaiireszta.pl/`.
GitHub przechowuje kod i uruchamia automat treści. Cloudflare Pages publikuje stronę. OVH pozostaje sprzedawcą domeny.
Nic nie zostało jeszcze opublikowane ani zmienione na Twoich kontach.

## 1. Wgraj pliki na GitHub

1. Rozpakuj ZIP na komputerze. Otwórz folder, w którym bezpośrednio widać `index.html`, `scripts`, `assets` i `.github`.
2. Zaloguj się na konto `codeprojects000`. Otwórz https://github.com/codeprojects000/KodAIireszta . Jeśli repozytorium jeszcze nie istnieje: przycisk **+ → New repository**, nazwa **KodAIireszta**, widoczność **Public**, **Create repository**.
3. W repozytorium kliknij **Add file → Upload files**. Przy pustym repozytorium kliknij **uploading an existing file**.
4. Przeciągnij ZAWARTOŚĆ rozpakowanego folderu, razem z folderami `.github`, `scripts`, `assets`, `examples`. Nie przesyłaj ZIP-a ani całego nadrzędnego folderu jako dodatkowego poziomu.
5. Kliknij **Commit changes**; docelowa gałąź to **main** (jeśli masz inną domyślną gałąź, użyj jej także w Cloudflare).
6. Sprawdź, czy `index.html` jest od razu w głównym widoku repozytorium, a w `.github/workflows/` jest `sync-youtube.yml`.
7. **Settings → Actions → General → Workflow permissions**: jeśli jest taka możliwość, wybierz **Read and write permissions → Save**. Workflow ma już zadeklarowane prawo zapisu; nie potrzebuje własnego tokena ani sekretów.
8. **Actions → Sync portal content → Run workflow → main → Run workflow**. Poczekaj na zielony wynik. Jeśli Actions są wyłączone, wcześniej włącz je w tym repozytorium.

Na potrzeby tej strony nie włączaj GitHub Pages — hostingiem jest Cloudflare Pages. Publikacja aplikacji w pozostałych repozytoriach działa osobno.

## 2. Połącz Cloudflare Pages z GitHubem

1. Zaloguj się lub załóż konto na https://dash.cloudflare.com/ .
2. Otwórz **Workers & Pages → Create application → Pages → Connect to Git**. W niektórych wersjach panelu najpierw trzeba wybrać odnośnik do tworzenia projektu Pages.
3. Wybierz **GitHub**, zezwól na dostęp tylko do repozytorium **KodAIireszta**, następnie wybierz je i kliknij **Begin setup**.
4. Wpisz ustawienia:

| Pole | Wartość |
| --- | --- |
| Project name | `kodaiireszta` (jeśli zajęte, inna dostępna nazwa) |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `node scripts/build-site.cjs` |
| Build output directory | `dist` |
| Root directory | pozostaw puste / domyślne |
| Environment variable | `NODE_VERSION` = `24` |

5. Kliknij **Save and Deploy**. Po powodzeniu otwórz nadany adres `*.pages.dev` i sprawdź PL/EN, miniatury, aplikacje oraz ustawienia.
6. Pozostaw automatyczne publikowanie gałęzi produkcyjnej włączone. Każdy nowy commit, także z automatu treści, ma uruchamiać publikację.

## 3. Dodaj domenę do Cloudflare

1. W głównym panelu Cloudflare wybierz **Add a domain / Onboard a domain** i wpisz **kodaiireszta.pl** (bez `www` i bez `https://`).
2. Wybierz plan **Free**, uruchom skan istniejących rekordów DNS.
3. Jeśli masz pocztę w tej domenie, sprawdź, czy przeniesiono jej rekordy MX i TXT (SPF, DKIM, DMARC). Uzupełnij brakujące przed zmianą serwerów DNS.
4. Cloudflare pokaże dwa przydzielone serwery nazw, np. indywidualne nazwy kończące się `.ns.cloudflare.com`. Skopiuj dokładnie SWOJE DWIE nazwy z panelu — nie korzystaj z przykładów znalezionych w internecie.

## 4. Przeklikaj OVH

1. Wejdź na https://www.ovh.com/manager/ → **Web Cloud → Domeny / Domain names → kodaiireszta.pl**.
2. Jeżeli DNSSEC jest aktywny u obecnego operatora DNS, wyłącz go i poczekaj na zakończenie operacji przed zmianą serwerów nazw. Stary podpis DNSSEC nie może pozostać po migracji. Po uruchomieniu nowego DNS można skonfigurować DNSSEC ponownie według danych Cloudflare.
3. Wejdź w zakładkę **Serwery DNS / DNS servers → Zmień serwery DNS / Modify DNS servers**.
4. Zastąp stare serwery DWOMA dokładnymi nazwami przydzielonymi przez Cloudflare. Zatwierdź zmianę. Służy do tego zakładka Serwery DNS, nie ręczna zmiana rekordów NS w Strefie DNS.
5. Wróć do Cloudflare i wybierz sprawdzenie serwerów nazw. Zaczekaj, aż domena otrzyma status **Active**. Propagacja może potrwać do 48 godzin.

Domena nadal jest opłacana i odnawiana w OVH. Hosting OVH nie jest potrzebny do tego układu.

## 5. Podłącz oba adresy do strony

1. Cloudflare → **Workers & Pages → kodaiireszta → Custom domains → Set up a domain**.
2. Dodaj **www.kodaiireszta.pl**, potwierdź proponowany rekord DNS i zakończ konfigurację.
3. Powtórz dla **kodaiireszta.pl**. Oba adresy powinny uzyskać status aktywny. Nie wystarczy sam wpis CNAME — domeny muszą być dodane do projektu Pages.
4. Jeśli Cloudflare zgłosi konflikt rekordu A, AAAA lub CNAME dla `@` bądź `www`, zastąp tylko kolidujący rekord strony rekordem wskazanym przez Pages. Zachowaj rekordy poczty. Nie wpisuj adresów IP GitHuba.
5. Poczekaj na aktywację certyfikatu HTTPS. Sprawdź `https://www.kodaiireszta.pl/` i `https://kodaiireszta.pl/`.
6. Głównym adresem w metadanych strony jest wersja `www`. Jeśli chcesz jednolity adres w pasku przeglądarki, w Cloudflare dla domeny otwórz **Rules → Redirect Rules → Create rule → Single Redirect**: nazwa „Domena na www”, warunek **Hostname equals kodaiireszta.pl**, docelowy URL dynamiczny `concat("https://www.kodaiireszta.pl", http.request.uri.path)`, kod **301**, **Preserve query string** włączone. Zapisz i sprawdź także ścieżkę `/en`.

## 6. Jak sprawdzić automat

**Actions → Sync portal content → Run workflow** pozwala odświeżyć treści od razu. Harmonogram próbuje uruchamiać aktualizację co 6 godzin (UTC); GitHub może opóźnić przebieg. Publiczne repozytoria bez aktywności przez 60 dni mogą mieć harmonogram wyłączony — wtedy włącz go ponownie w Actions.

Nowy publiczny film → pobranie z kanału → commit na GitHubie → publikacja w Cloudflare. Nowy publiczny projekt profilu `codeprojects000` → nazwa i opis z GitHuba, prosta okładka → publikacja. Automat nie generuje sam rozbudowanych recenzji, tłumaczeń AI ani zrzutów ekranu nowej aplikacji; własny opis i obrazek możesz dostarczyć przez `portal.json` zgodnie z `AUTOMATYZACJA.md`.

Repozytorium **KodAIireszta** jest pomijane w `github.config.json`. Własny plik `portal.json` z `hidden: true` i pomijanie aktualnego repozytorium w Actions stanowią dodatkowe zabezpieczenia. Nie usuwaj tego znacznika.

Po ręcznym uruchomieniu sprawdź zielony wynik Actions i nową publikację w zakładce Deployments projektu Cloudflare. Jeśli nie ma zmian treści, automat nie tworzy pustego commita — brak nowego wdrożenia jest wtedy prawidłowy.

## Dokumentacja źródłowa

- Wgrywanie plików: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Integracja Pages z GitHubem: https://developers.cloudflare.com/pages/get-started/git-integration/
- Podłączanie domen: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Przenoszenie obsługi DNS: https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- Serwery DNS w OVH: https://docs.ovhcloud.com/en/guides/web-cloud/domains/dns-server-edit

Instrukcja zweryfikowana z publiczną dokumentacją 16.11.2026. Nazwy przycisków mogą się różnić zależnie od języka panelu.
