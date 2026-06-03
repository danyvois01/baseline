# Live Rankings — Information Hierarchy & Expandable Cards

> **Status**: Updated 2026-06-04 based on user feedback and code2.html mockup analysis.

## User Decisions

| Decision | Answer |
|----------|--------|
| Flags | CSS library (`flag-icons`), flag image only, no national ranking number |
| Nationality pill | Show country code "ITA" with flag — no subscript ranking |
| Pros. column | Points **if player wins next match** |
| Max column | Points **if player wins the tournament** |
| Expand trigger | Both: click anywhere on row + click chevron |
| Point delta (Δ pts) | Moved to **expanded card** (live pts - official pts) |
| Rank change (+/−) | Stays in **collapsed primary row** |
| Age | Stays in **collapsed primary row** |

---

## Collapsed Row (Primary) — 7 columns

```
#  │  🇮🇹 Jannik Sinner  ITA  │  24  │  ● Out – Roland Garros (R64)  │  13,500  │  MR  │  ▸
```

| Zone | Column Def | Content | Alignment |
|------|-----------|---------|-----------|
| **Rank** | `80px` | Bold large number | Left |
| **Player** | `1fr` | Flag + Name + Nationality pill (e.g. "ITA") | Left |
| **Age** | `60px` | Player age | Center |
| **Live Status** | `1fr` | Status dot + "Active/Out – Tournament (Round)" | Left |
| **Points** | `140px` | Live points (bold, large, tabular-nums) | Right |
| **+/−** | `80px` | Rank change badge (▲2 / ▼3 / MR / NMR) | Center |
| **Expand** | `50px` | Chevron icon (▸ / ▾) | Right |

### Key Changes vs Current:
- **Removed from collapsed**: MAX column → moved to expansion
- **Added**: Country flag (CSS library) inline before player name
- **Added**: Chevron expand/collapse icon in last column
- **Kept**: Age stays in primary row
- **Changed**: Live Status now shows round in parentheses: "Out – Roland Garros (R64)"
- **Changed**: +/− shows only rank change, not point delta

---

## Expanded Card (Secondary)

Slides open below the row with a smooth animated transition. Background uses `surface-container-low/50` for subtle contrast.

### Content: 4 data blocks aligned with parent columns

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  1   🇮🇹 Jannik Sinner ITA    24    ● Out – Roland Garros (R64)    13,500    MR    ▾       │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                      │  │
│  │   NEXT MATCH WIN           TOURNAMENT WIN         OFFICIAL PTS        DIFF            │  │
│  │   13,700 pts               14,200 pts             13,500              ▼1,250          │  │
│  │   If wins next match       If wins tournament     Current official    Live vs Official │  │
│  │                                                                                      │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Expanded card fields:

| Field | Label | Example | Description | Style |
|-------|-------|---------|-------------|-------|
| **Pros** | "Next Match Win" | 13,700 pts | Points if wins next match | Bold, `text-primary-olive` |
| **Max** | "Tournament Win" | 14,200 pts | Points if wins the tournament | Bold, `text-deep-navy` |
| **Official** | "Official Points" | 13,500 | Current official ranking points | Bold, `text-deep-navy` |
| **Diff** | "Diff" | ▼1,250 | Live points − Official points | Badge (green/red) |

### Alignment Strategy (fixing code2.html issue):

The expanded card uses the **same grid as the parent row** to ensure perfect column alignment:

```
grid-cols-[80px_1fr_60px_1fr_140px_80px_50px]
          ↑rank  ↑player ↑age ↑status ↑points ↑+/- ↑chevron
```

The expanded content spans from the **Player column through the Chevron column** (skipping the Rank column) and distributes 4 data blocks evenly using an inner `grid-cols-4` layout. This ensures:
- The expanded area starts at the same left edge as the player name
- Data blocks are evenly spaced across the available width
- No misalignment with the row above

---

## Interaction Design

### Expand/Collapse:
- **Trigger**: Click anywhere on the row OR click the chevron icon
- **Animation**: Smooth height transition (`max-height` or CSS `grid-rows` animation)
- **Chevron**: Rotates 180° on expand (▸ → ▾)
- **State**: Only one row expanded at a time? Or multiple? → **Multiple** (user can compare players)

### Visual Cues:
- Expanded row gets a subtle border highlight
- Chevron transitions with `rotate-180` on expand
- Expanded area has `bg-surface-container-low/50` background + subtle top border

---

## Data Model Updates

### Current `LiveRankingEntry` type:
```ts
{
  rank, player, points, movement, liveStatus, careerHigh
}
```

### Updated type:
```ts
{
  rank: number;
  player: {
    id: string;
    name: string;
    initials: string;
    nationality: string;       // "ITA"
    countryCode: string;       // "it" (ISO 3166-1 alpha-2 for flag-icons)
    age: number;
  };
  points: number;              // Live points
  movement: {
    type: "up" | "down" | "none" | "mr" | "nmr";
    value?: number;            // Rank positions changed
  };
  liveStatus: {
    isActive: boolean;
    tournament: string;
    stage: string;             // "R64", "SF", "QF", "F"
  };
  // --- NEW FIELDS for expanded card ---
  officialPoints: number;      // Current official ranking points
  pointsDiff: number;          // Live − Official (can be negative)
  nextMatchPoints: number;     // Pros: points if wins next match
  maxPoints: number;           // Max: points if wins tournament
}
```

---

## Files to Modify

### New Dependencies
- `flag-icons` CSS library (npm package)

### Modified Components
| File | Change |
|------|--------|
| `globals.css` | Add expand animation keyframes |
| `rankings-table.tsx` | Add expand/collapse state, chevron column, flag import, click handler |
| `player-avatar.tsx` | Keep as-is (initials fallback) |
| `live-status-cell.tsx` | Show round in parentheses format: "Out – Roland Garros (R64)" |
| `movement-badge.tsx` | No change |
| `mock-data.ts` | Add new fields: officialPoints, pointsDiff, nextMatchPoints, maxPoints, countryCode |

### New Components
| File | Purpose |
|------|---------|
| `expanded-card.tsx` | Renders the 4-block expanded info panel |

---

## Mock Data Example

```ts
{
  rank: 1,
  player: {
    id: "sinner",
    name: "Jannik Sinner",
    initials: "JS",
    nationality: "ITA",
    countryCode: "it",
    age: 24,
  },
  points: 13500,
  movement: { type: "mr" },
  liveStatus: {
    isActive: false,
    tournament: "Roland Garros",
    stage: "R64",
  },
  officialPoints: 13500,
  pointsDiff: -1250,
  nextMatchPoints: 13700,
  maxPoints: 14200,
}
```
