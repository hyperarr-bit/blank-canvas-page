

## Rebuild: Módulo Biblioteca — Notion-style Smart Planner

### Overview

Complete rewrite of `src/pages/Biblioteca.tsx` to match the Notion-style aesthetic used in Estudos, Finanças, and Rotina modules. The module will be transformed from a generic card-based UI into a "planilha inteligente" (smart spreadsheet) feel with colored header bands, uppercase titles, emojis, and all the new features requested.

### New Data Model

The `Book` type will be extended with:
- `status`: adds `"abandonado"` option
- `lentTo`: name of person the book was lent to
- `lentDate`: date lent
- `lentReturnDate`: expected return date
- `quotes`: array of `{ id, text, page, tags[] }` per book
- `goalDate`: target finish date for pace calculator

### Tab Structure (5 tabs)

1. **📖 Lendo Agora** — Hero section with current book, progress bar, pace calculator, quick page update
2. **📚 Estante** — All books by status (Lendo, Lidos, Quero Ler, Abandonados) with search/filter
3. **💡 Insights** — All quotes/citations across books, filterable by tags
4. **📤 Emprestados** — Loan tracker with WhatsApp reminder button
5. **🏆 Desafio** — Annual reading goal with visual shelf + page stats

### Key Features

**1. Pace Calculator (Calculadora de Ritmo)**
- Shows in "Lendo Agora" tab for the current book
- Auto-calculates: pages/day rate → estimated finish date
- User can set a goal date → app shows required pages/day
- Formula: `remainingPages / daysElapsed` for current pace; `remainingPages / daysUntilGoal` for target pace

**2. Loan Tracker (Agiota Literário)**
- Tag on book: "Emprestado para: [Nome]"
- Return date with visual alert (overdue = red badge)
- WhatsApp button: opens `https://wa.me/?text=...` with pre-filled message including book title

**3. Highlight Vault (Cofre de Citações)**
- Per-book quotes with page number and hashtag tags
- Global "Insights" tab aggregates all quotes
- Filter by tag (#Negócios, #Estóico, etc.)
- Notion-style colored cards

**4. Abandoned Status (Cemitério Sem Culpa)**
- New status: `abandonado 🪦`
- Encouraging message on abandon: "A vida é muito curta para ler livros ruins!"
- Visual distinction with gray/muted styling

**5. Visual Goal Shelf (Estante de Metas)**
- Annual goal: "Ler X livros"
- Progress bar + book covers filling a visual shelf
- End-of-year insight: total pages read with fun comparison

**6. URL Import (preserved)**
- Keeps existing edge function for fetching book covers from Amazon/Google/Goodreads links
- Styled to match Notion aesthetic

### Visual Design Pattern

All sections use the established pattern:
```text
┌──────────────────────────────┐
│ bg-orange-200  📖 LENDO AGORA│  ← colored header band
├──────────────────────────────┤
│ bg-orange-50                 │  ← tinted body
│  [Book cover] [Progress]     │
│  [Pace calculator]           │
└──────────────────────────────┘
```

Color palette: Orange (primary), Amber (goals), Green (completed), Sky (quotes), Pink (loans), Gray (abandoned)

### Technical Details

- **File**: Single file rewrite of `src/pages/Biblioteca.tsx` (~800-900 lines)
- **State**: All data persisted via `usePersistedState` with existing key `lib-books` (extended), new keys for quotes (`lib-book-quotes`), loans tracked within book objects
- **Watchlist removed**: Cinema/media section removed — this becomes a pure Library module. Quotes wall becomes book-specific insights.
- **Edge function**: No changes needed — existing `fetch-book-metadata` function stays as-is

### Implementation Steps

1. Rewrite `Biblioteca.tsx` with new types, 5 tab structure, and all Notion-style sections
2. Build "Lendo Agora" hero with pace calculator logic
3. Build "Estante" with 4 status categories (including Abandonado) in Notion cards
4. Build "Insights" tab — aggregated quotes with tag filtering
5. Build "Emprestados" tab with WhatsApp integration
6. Build "Desafio" tab with visual shelf and page stats
7. Preserve URL import with Notion styling

