# NeonArcade - Unblocked Games Portal

A high-performance, dark arcade-themed unblocked games hub that loads playable games via iframe embeds structured in a clean JSON catalog, featuring standalone offline HTML5 games (2048, Snake, Pong, Breakout, Flappy Bird), instant search, category filtering, favorites tracking, fullscreen immersion, and custom game submission.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product requirements and visual directions were confirmed during Phase 1 clarification:

- **Confirmed Catalog**: Pre-populated with self-contained, zero-dependency playable HTML5 web games (2048, Snake, Pong, Breakout, and Flappy) embedded via `<iframe>` tags declared in `games.json`.
- **Confirmed Aesthetic**: Dark arcade portal with deep slate/obsidian canvas (`#0b0f19`), subtle cyan and electric violet neon glow borders, clean geometric typography, and zero-pill typographic metadata.
- **Confirmed Features**: Interactive iframe modal player with true Fullscreen API support, responsive search bar, category tabs, persistent favorites system via browser storage, and a "Add Custom Game" modal supporting custom `<iframe>` code or game URLs.
- **No AI Features**: 100% deterministic, zero LLM dependencies or API calls.

---

### 1. Overview & Core Concept

- **What It Does**: Provides an unblocked web arcade experience where players can browse, filter, search, favorite, and play classic games seamlessly in high-framerate iframes. Users can also expand the library by pasting their own embed codes or URLs.
- **Target Audience & Context**: Casual players and students looking for fast-loading, reliable, distraction-free games that run smoothly in restricted or offline browser environments.
- **Key Value**: Instant load times, no broken external assets, zero ads or invasive trackers, clean fullscreen gameplay, and extensible JSON-driven game storage.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Browse & Discover**: User arrives at the dark neon arcade portal. A curated hero showcases featured and trending games. Below, clean segmented controls filter between "All", "Classics", "Arcade", "Puzzle", and "Favorites".
2. **Search & Filter**: Real-time search instantly filters game cards by title, category, and description with zero latency.
3. **Launch & Play**: Clicking any game card smoothly opens the Game Theater overlay. The game iframe loads instantly with custom play controls:
   - Fullscreen toggle (using native Fullscreen API with keyboard shortcut `F`)
   - Reload / restart game iframe
   - Favorite toggle (persisted to localStorage)
   - Game instructions and keyboard control tips
4. **Custom Game Addition**: Clicking "+ Add Game" opens a clean modal where users can paste an `<iframe>` embed code (or direct game URL), assign title, category, and thumbnail, and save it directly to their personal library.
5. **Quick Disguise / Panic Shortcut**: A discreet hotkey (`Esc` or stealth switch) to immediately minimize sound or swap to a clean educational search screen.

#### Visual Identity & Theme
- **Color Discipline (60-30-10 Budget)**:
  - **60% Canvas**: Obsidian void (`#090d16` and `#0f172a`), giving deep contrast for game visuals.
  - **30% Structural Surfaces**: Dark slate panels (`#131d31`), crisp hairline borders (`rgba(56, 189, 248, 0.15)` and `rgba(168, 85, 247, 0.15)`), and subdued muted text (`#94a3b8`).
  - **10% Accent Glow**: Electric cyan (`#06b6d4` / `#38bdf8`) and arcade neon violet (`#a855f7`) reserved strictly for active tabs, primary play buttons, and focus highlights.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` font stack, bold weights, tight tracking.
  - Body & UI Controls: Clean system sans with generous legibility.
  - Metadata: Clean unboxed text with subtle typographic dot separators (`Arcade · Highscore · Arrow Keys`), adhering strictly to the zero-pill rule.
- **Component Styling & Layout**:
  - 1440px desktop baseline with resilient mobile/tablet responsiveness.
  - Top Bar Contract: Zone 1 (Wordmark "NEON ARCADE"), Zone 2 (Nav links: Browse, Popular, Favorites, Custom), Zone 3 (Action: "+ Add Game").
  - Game Grid: Responsive CSS grid of game cards with smooth hover lift (`transform: translateY(-4px)`), sharp hairline glow, and instantaneous launch.

---

### 3. Key Product Decisions & Trade-Offs

- **Game Hosting Strategy (Standalone Self-Contained HTML5 vs External URLs)**:
  - *Chosen Approach*: Ship standalone, production-ready, zero-dependency HTML5 games directly inside `/public/games/` (e.g., `/public/games/2048/`, `/public/games/snake/`, `/public/games/pong/`, `/public/games/breakout/`, `/public/games/flappy/`), each referenced via clean `<iframe>` markup in `src/data/games.json`.
  - *Why*: External unblocked game links frequently break, get blocked by adblockers/school filters, or inject third-party ads. Self-contained games are guaranteed to work 100% offline and in hermetic environments.
  - *Alternatives Considered*: Pointing to third-party domains (risk of 404s, CSP iframe blocking, and broken sandboxes).
- **Storage & State Strategy**:
  - *Chosen Approach*: Base catalog loaded from static `src/data/games.json` and merged with custom user-added games and favorites stored in `localStorage`.
  - *Why*: Instant client-side performance, works without backend database requirements, persists across browser reloads.
- **Iframe Sandboxing & Security**:
  - *Chosen Approach*: Standard iframe permissions (`allow="fullscreen; autoplay; gamepad; keyboard-map"`), with sanitized HTML parsing when users input raw `<iframe>` strings.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       NeonArcade App                        │
│                                                             │
│  ┌─────────────────────── Top Bar ───────────────────────┐  │
│  │ Brand Wordmark  │  Navigation Links  │  + Add Game CTA│  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────── Controls Strip ───────────────────┐  │
│  │  [Search Games...]  │  [All | Arcade | Puzzle | Favs] │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────── Game Grid ─────────────────────┐  │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │ │ 2048         │ │ Snake Retro  │ │ Pong Classic │    │  │
│  │ │ [Play Now]   │ │ [Play Now]   │ │ [Play Now]   │    │  │
│  │ └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │ │ Breakout     │ │ Flappy Bird  │ │ Custom Game  │    │  │
│  │ │ [Play Now]   │ │ [Play Now]   │ │ [Play Now]   │    │  │
│  │ └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Click Game Card
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Game Theater (Iframe Player)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Title · Category · Fullscreen [F] · Restart · Close    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │          <iframe src="/games/snake/index.html">        │ │
│  │                  (Interactive Canvas)                  │ │
│  │                                                        │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Controls Guide: Arrow keys to steer, Space to pause    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Data Model & Schema (`games.json`)
```typescript
interface GameItem {
  id: string;
  title: string;
  category: 'Classics' | 'Arcade' | 'Puzzle' | 'Action';
  description: string;
  thumbnail: string;
  iframeSrc?: string;      // Direct URL or local path
  iframeHtml?: string;     // Raw iframe HTML snippet
  controls: string;        // E.g. "Arrow keys to move, Space to restart"
  playsCount: number;
  featured?: boolean;
  isCustom?: boolean;
}
```

#### Interactive Component Mapping
- `App.tsx`: Central coordinator managing active game modal, search query, selected category filter, favorite IDs array, and custom game adder modal.
- `GameCard.tsx`: Card component displaying thumbnail/icon, title, unboxed category metadata, play button, and favorite toggle heart.
- `GamePlayerModal.tsx`: Theater mode modal containing the game iframe, Fullscreen API toggle, iframe reload trigger, and keyboard shortcuts.
- `AddGameModal.tsx`: Validated form allowing users to submit title, category, description, and paste an `<iframe>` snippet or URL.
- `public/games/*`: High-polish, responsive standalone canvas games:
  - `2048`: Smooth sliding tile merger with score tracking.
  - `Snake`: Smooth retro grid snake with food, speed tiers, and sound effects.
  - `Pong`: Single-player vs reactive AI paddle with score board.
  - `Breakout`: Classic brick destruction with paddle bouncing and multi-ball physics.
  - `Flappy Bird`: Gravity-based pipe dodger with one-tap jump.
