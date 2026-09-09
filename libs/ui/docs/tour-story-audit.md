# Tour: audit stories a vlastní logiky

Audit 2026-09-08. Původních 20 stories bylo otevřeno a proklikáno v Chrome
na `http://localhost:6007`. Výsledek: 19 scénářů bez nalezené behaviorální
chyby; v Custom Controls se při jiném pořadí akcí objevil prázdný panel.
Nejde o tvrzení, že bylo vyčerpáno celé API nebo všechny možné kombinace.

## Co se změnilo

Katalog má **7 veřejných ukázek** a jeden skrytý testovací scénář odpojení
komponenty. Dvanáct duplicitních stories bylo skutečně odstraněno, nikoli
jen skryto. RTL a volby interakce/zavírání se zkoušejí přes Controls;
chybějící cíl přes Late Target. Samostatné Navigation/Skip/Escape stories
nahrazují testy stejného Playgroundu.

V Custom Controls bylo možné na kroku `edit` nahradit seznam jen krokem
`done`. Zag pak měl aktivní id, které už v seznamu nebylo: panel zůstal bez
názvu a obsahu. Replace steps je nyní dostupné až na `done`, jehož id nová
sada zachovává. Doplněný test nejprve selhal na původním kódu a po opravě
prošel. Nevznikl automatický přepínač kroků ani nová logika v komponentě.

Late Target a Interactive Wait mají viditelný návod a popisky stavových
výstupů. Controls už nenabízejí interní `id`, `children` nebo ignorované
`steps`. Z komponenty zmizely dva samostatné klávesnicové helpery a jejich
mapa; zůstal lokální handler opravující stejné chování, bez změny API.

## Původních 20 stories

| Původní story | Co bylo ověřeno | Rozhodnutí |
| --- | --- | --- |
| Playground | Tři typy kroků, Next/Back/Finish, progress, fokus a Tab | Ponechat jako hlavní ukázku |
| Dialog | Otevření prvního kroku a zavření | Sloučit do Playgroundu |
| Tooltip | Cíl, spotlight, šipka a zavření | Sloučit do druhého kroku Playgroundu |
| Floating | Poslední krok bez cíle, panel ve viewportu | Sloučit do Playgroundu a Floating Placements |
| Late Target | Start bez cíle, následné přidání cíle | Ponechat, doplnit návod |
| Missing Target | Timeout, cleanup, žádný panel, úspěšný nový start | Sloučit do Late Target; samostatný regresní test zůstává |
| Interactive Wait | Skrytý wait, pokračování, cleanup, progress bez wait | Ponechat; ověřit i zrušení a restart |
| Right To Left | Obrácené šipky a hranice navigace | Playground s `dir=rtl` |
| Interaction Prevented | Existující cíl je při kroku inert | Playground s `preventInteraction=true` |
| Late Target Interaction Prevented | Pozdní cíl je inert; po zavření se obnoví | Late Target se stejným Control |
| Floating Placements | Všech 13 umístění v LTR i RTL | Ponechat: odlišná geometrie |
| Custom Controls | disabled, preventDefault, editace, goto/update/setSteps | Ponechat; opravit předčasné Replace steps |
| Outside Dismissal Disabled | Escape, klik mimo a šipky vypnuté; Close funguje | Playground se třemi Controls nastavenými na false |
| Long Content | 320 × 568, scroll panelu, dosažitelné Finish | Ponechat: odlišný layout |
| Unmount During Wait | Cleanup listeneru při unmount | Pouze testovací fixture mimo sidebar a autodocs |
| Scroll Target | Scroll k cíli, následný scroll a zarovnání spotlightu | Ponechat: odlišné chování |
| Shared Button Contrast Baseline | Samostatná sdílená tlačítka bez Tour | Odstranit z katalogu Tour; nebyla to jeho funkcionalita |
| Navigation | Next/Back/Finish a dokončení | Duplicitní vůči Playgroundu a Playwright testu |
| Skip | Zavření a status skipped | Playwright test Playgroundu |
| Escape And Restart | Dismiss, návrat fokusu a nový start | Playwright test Playgroundu |

Skrytí jediné unmount fixture používá standardní Storybook tagy
`!dev` a `!autodocs`, nikoli vlastní filtrování.
[Dokumentace tagů Storybooku](https://storybook.js.org/docs/writing-stories/tags).

## Co je skutečně ze Zagu

Typy `dialog`, `tooltip`, `floating`, `wait`, cíle, třísekundové čekání na
chybějící DOM element, efekty s cleanupem, navigace, progress, placements,
`goto`, `updateStep`, `setSteps`, RTL a volby interakce jsou schopnosti Zagu,
nikoli nově vymyšlená funkční vrstva.
[Oficiální Tour dokumentace](https://zagjs.com/components/react/tour).

**Wrapper ale není čisté předání `connect()` do JSX.** Z předchozí
implementace zůstávají tyto zásahy do připnutého `@zag-js/tour@1.41.2`:

| Vlastní zásah | Důvod a hranice |
| --- | --- |
| Oprava triggeru `skip` | Pinned connect nemá větev pro string `skip`; wrapper použije nativní callback action map |
| Obalení efektu a cleanup-once | Pinned `effect.dismiss()` neukončuje stav stejně jako DISMISS; cesta not-found neuklidí efekt. Wrapper pošle existující DISMISS a zajistí cleanup |
| Návrat fokusu po skončení/unmount | Zag má `returnFocusOnDeactivate: false`; wrapper vrací fokus až po konci celé tour |
| Lokální klávesnicový handler | Pinned connect testuje LTR hranice před obrácením směru; šipky také odvádějí uživatele z textového vstupu |
| `inert` pro pozdě nalezený cíl | Pinned synchronizace pozdního cíle neaplikuje preventInteraction; běžné cíle zůstávají řízené Zagem |
| CSS vrstvy a scroll panelu | Prezentace ui-kitu; vlastní z-index koriguje inline vrstvu odvozenou Zagem z prvního potomka |

Důkazem pro pinned chování je instalovaný zdroj v
`node_modules/.pnpm/@zag-js+tour@1.41.2/node_modules/@zag-js/tour/dist/`:
`tour.connect.js` (akce/klávesy) a `tour.machine.js` (efekty, cíle, fokus).
Novější upstream se liší; jeho dnešní zdroj nelze vydávat za chování
lokálně připnuté verze.

Opravy nebyly slepě odstraněny: `$deslop` požaduje zachovat chování mimo
prokazatelný bug. Žádná další utilita, stavový stroj, persistence, router
ani konfigurovatelný timeout nebyly přidány. Přechod na striktně nativní
wrapper vyžaduje samostatně vyhodnotit upgrade Zagu a zbývající upstream
limity; audit z 2026-09-08 neupgradoval závislosti ani neodebral veřejné API.

Před prvním commitem 2026-09-09 byly po schválení odstraněny nepoužívané
Context metody `dismiss()` a `skip()`, které pinned `Api` nepřidává.
Stejné akce zůstávají dostupné přes ActionTrigger a callback action map;
opravované chování se nemění. Negativní typové kontrakty hlídají, že se tyto
metody znovu neobjeví, a obě kopie usage skillu popisují zúžené API.
Registrace `tour-usage` v `skill_tree.yaml` byla srovnána s jeho prerequisites.

## Ověření

Původní sada 15 testů prošla před auditem; samotná však chybu nesprávného
pořadí v Custom Controls neodhalila. Po opravě prošla znovu, včetně nové
kontroly nedostupnosti předčasného Replace steps. Testy používají
zredukované stories a args místo odstraněných duplicit.

Ověření po auditu 2026-09-08:

| Kontrola | Výsledek |
| --- | --- |
| Playwright, včetně stavů completed/skipped/dismissed a opravy Custom Controls | 15/15 PASS, 12,3 s |
| Všech 7 veřejných stories v base light i dark | 14/14 PASS; žádné pageerror; panely ve viewportu |
| Skutečný Storybook manager | Přesně 7 odkazů Tour; změna dir přes Controls a následná RTL navigace PASS |
| Mobilní Long Content | 320 × 568, scroll a dosažitelné ovládání PASS |
| TypeScript | PASS |
| check:package | Build, deklarace, Publint, ATTW a 167 export targets PASS |
| Storybook build | PASS; existující varování MDX/icon/volitelné vitest-axe matchers |
| Biome nad třemi změněnými TS/TSX soubory | PASS s plnými sloučenými pravidly repozitáře v izolovaném temp adresáři |

Původní port 6007 během pokračování přestal přijímat spojení; neúspěšný
meziběh testů selhal na ERR_CONNECTION_REFUSED, nikoli na asercích komponenty.
Závěrečná kontrola výše proto proběhla na odděleném statickém buildu na 6008.
Root Biome se opět zasekl; izolovaný běh nepoužil oslabenou sadu pravidel.

Screenshots před/po jsou lokálně v `.scratch/tour-audit/`. Přístupnost není
prohlášena za plně vyřešenou: již známý kontrastní dluh sdíleného Button
v přísnějších AAA/APCA kontrolách zůstává mimo tuto úpravu.

## Předcommitové ověření 2026-09-09

- TypeScript: negativní kontrakty pro Context `dismiss`/`skip` nejprve selhaly
  na původním API; po jeho zúžení celý `tsc --noEmit --incremental false` prošel.
- Nový Storybook build: PASS, se stejnými existujícími varováními jako výše.
- Playwright proti tomuto buildu na portu 6008: 15/15 PASS, 14,6 s.
- Biome: standardní běh nad dvěma změněnými TSX soubory znovu nedokončil
  kontrolu a byl ukončen. Izolovaný běh s plnými sloučenými pravidly nad šesti
  přesnými kopiemi Tour souborů prošel bez oprav; shoda kopií ověřena hashem.
- Metadata: YAML, shodné prerequisites v registraci a skillu, existující
  závislé skilly, verze 1.0.0 a totožný obsah bundle kopie ověřeny.
  Generický Codex `quick_validate.py` nepřijímá místní Intent pole
  (`component_version`, `library`, `requires` apod.); tato pole jsou součástí
  kontraktu repozitáře a nebyla kvůli tomuto validátoru odstraněna.
- Závěrečný `ui-qa-validator`: build `ui-kit` PASS (64 souborů, deklarace
  20,2 s), následně `validate:tokens` FAIL na existujícím
  `skeleton-text.figma.ts:55` / `w-4/5`. Stejný řádek ověřen proti HEAD
  `1802ba32`; soubor není součástí změn Tour. Podle `ui-validate` byl gate
  zastaven na první chybě, další kroky včetně plné vizuální validace neběžely
  a marker pro push nebyl vytvořen. Samostatné cílené kontroly výše tento gate
  nenahrazují; před mergem/pushem zůstává potřeba dokončit celý gate.
- Feature commit `0a7e52009`: kontrola synchronizace komponenty, usage skillu,
  bundle kopie a changelogu prošla nad indexem i ve skutečném pre-commit hooku.
