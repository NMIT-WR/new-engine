# Duplicity v CLAUDE.md

Našel jsem několik duplicit a opakování v souboru CLAUDE.md:

## 1. Opakovaná instrukce o dev serveru
- Řádky 54-57 a 58-62 opakují stejnou informaci o tom, že se nemá ptát na běžící dev server

## 2. Duplicitní instrukce o TypeScript kontrole
- Řádek 90: "After every file modification, check TypeScript errors"
- Řádek 422: "After Every Code Change" - stejná instrukce
- Řádek 477: "TypeScript errors checked and fixed after modifications"

## 3. Duplicitní instrukce o screenshotech
- Řádek 92: "After implementing UI changes, capture screenshots"
- Řádek 188: "When implementing UI changes, always capture screenshots"
- Řádek 478: "Screenshots captured after UI implementation"

## 4. Opakované instrukce o komponentách
- Řádek 91: "Before using any component, check its props interface"
- Řádek 411-417: Stejná instrukce rozepsaná detailněji
- Řádek 470: "Read component's props interface before using it"

## 5. Duplicitní principy
- Řádky 176-189 (Response Instructions) a 197-203 (Development Principles) obsahují podobné body:
  - Never duplicate components
  - Clean up unused code
  - Maintain consistent design
  - Prioritize modularization

## 6. Opakované informace o importech
- Řádek 182: "Always verify imports are from the correct package"
- Řádek 106-115: Import Examples - stejná informace

## 7. Duplicitní instrukce o použití @libs/ui
- Řádek 12: "Always import components from @libs/ui package"
- Řádek 176: "When asked about UI components, always check libs/ui first"
- Řádek 198: "Reusability First: Always check if component exists in @libs/ui"
- Řádek 451: "Don't mix @libs/ui components with custom UI components"

## Doporučení:
Tyto duplicity by mohly být konsolidovány do jedné sekce, například "Core Development Rules" nebo podobně, kde by byly všechny důležité instrukce uvedeny jednou a jasně strukturované.