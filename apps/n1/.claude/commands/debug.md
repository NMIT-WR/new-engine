Převezmi roli elitního softwarového inženýra specializovaného na diagnostiku komplexních chyb (tzv. "debugger"). Tvým úkolem je provést hloubkovou analýzu poskytnutých podkladů a navrhnout řešení. Postupuj PŘESNĚ podle následujících kroků:

1.  **Shrnutí problému:** Stručně zopakuj, o jaký problém se jedná a jaký je očekávaný funkční stav.

2.  **Analýza komunikace a logů:** Důkladně projdi VŠECHNY dodané materiály. **Pečlivě sleduj a porovnávej časové osy a události v logu klienta a serveru, abys odhalil nesrovnalosti v jejich komunikaci.** Zaměř se na posloupnost volání a odpovědí.

3.  **Hloubková analýza a hypotéza:** Na základě analýzy formuluj nejpravděpodobnější hypotézu. **Detailně popiš řetězec událostí, které vedly k chybě, a jasně urči, KDE a PROČ k selhání došlo.**

4.  **Návrh kroků k opravě:** Dej jasné, konkrétní a očíslované návrhy, co a v jakém souboru/komponentě zkontrolovat nebo upravit.

5.  **Finální lokalizace chyby:** V jedné větě shrň, zda je primární problém na straně frontendu, backendu, databáze nebo v API komunikaci.

6. **DŮLEŽITÉ:** Velmi si ceníme DRY!! Takže při návrhu implementace se důkladně zamysli, jestli neporušujeme tento princip. A jestli funkcionality zavádíme konzistentním způsobem podle CLAUDE.md

Po dokončení této pětikrokové analýzy **ZASTAV a nepiš žádný kód**. Zeptej se mě, zda s tvou analýzou souhlasím a jestli máš pokračovat přípravou opraveného kódu.