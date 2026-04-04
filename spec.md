# Writefy — Editor & Library UI Refinement

## Current State

Writefy is a PWA screenplay/novel writing app with:
- `App.tsx`: Fixed header (60px), bottom nav (52px), tab routing (Home/Library/Create/Play)
- `ScreenplayEditor.tsx`: Write/Outline tabs, format chip buttons (Slugline/Action/Character/Dialogue/Parenthetical), `.writing-slab` with typed lines (slab-slugline, slab-action, slab-character, slab-dialogue, slab-parenthetical)
- `LibraryScreen.tsx`: Grid/list toggle header, 2-column poster grid (2:3 aspect), list mode with horizontal items
- `index.css`: CSS custom properties, component layer styles for all elements
- `HomeScreen.tsx`: Resume card, quick actions
- `CreateScreen.tsx`: Wraps ScreenplayEditor, handles save/delete/export/import

## Requested Changes (Diff)

### Add
- Consistent green gradient background (radial glow from top-center fading to black) applied via `body` or `.writefy-app` — same across ALL tabs (no per-tab shift)
- `WRITEFY` app name label (12–14px, subtle, above title) in the Create tab header center section
- Subtitle text ("Screenplay • last edited") already exists as `.writefy-doc-meta` — needs size/opacity refinement
- 8px spacing system enforced globally (padding/margin multiples of 8)
- Safe area bottom padding (20–24px) on bottom nav
- Horizontal scrollability to format-chips row (already present; verify padding 8px vertical / 14px horizontal, gap 12px, pill border-radius 20px)
- List view items styled as proper cards: #121212 bg, 14px border-radius, icon square (40–48px) with slightly lighter bg and green icon, 12px gap between items, 72–88px height
- Grid/list toggle buttons: active = green background, inactive = outlined gray, 12px gap between them
- Web-specific max-width 720px for editor content and library content

### Modify
- **Header (Create tab)**: Increase top padding, app name WRITEFY 12–14px with letter-spacing, title "Untitled Script" 24–28px bold, subtitle 12–14px at 60% opacity; 8px between brand and title, 4px between title and subtitle
- **Tabs (Write/Outline)**: Add 16px top margin, min-height 40px for tap targets, 24px gap between tabs, active = 2px green underline
- **Format chips**: Gap 12px, padding 8px vertical / 14px horizontal, border-radius 20px, active = green bg + white text, inactive = #1A1A1A bg + light gray text
- **Writing slab**: Top margin 20px from chips; line-height 1.6–1.8; font-size 16px body, 18px dialogue; slugline margin-bottom 16px, action margin-bottom 12px, character margin-top 20px, dialogue margin-top 6px
- **Text styling**: slugline = uppercase + slight letter-spacing + soft green color (#4CAF50); character = center + bold + slightly larger; dialogue = 70% width centered block; parenthetical = italic + 70% opacity
- **Visual effects**: Significantly reduce glow; replace blur glow with subtle green highlight border; no backdrop blur behind text areas
- **Bottom nav**: padding-bottom 20–24px; active = green icon + label; inactive = gray 60% opacity
- **Library header**: 24px top padding, 16px below header, right-side icons (grid/list + add) aligned same row with equal vertical alignment
- **Library grid cards**: border-radius 16–20px, bg #121212, subtle green border/glow (light), internal padding 16px; content: type (12–13px light gray), title (18–20px bold white), metadata (13–14px 60–70% opacity); 6px between type→title, 6px title→metadata; web hover scale 1.02
- **Library list view**: Full-width cards, horizontal layout, icon square (40–48px) slightly lighter bg + green icon, title bold white, subtitle "Screenplay • time ago" muted gray 60%; card bg #121212, border-radius 14px, 12px between items, 72–88px height
- **Alignment**: Everything centered within max-width container, equal padding both sides
- **All margins on 8px grid**: no random spacing inconsistencies

### Remove
- Heavy glow effects (excessive box-shadow blur sizes)
- Background blur behind text/content areas (backdrop-filter)
- Left-stuck alignment in Library (currently cards may left-align)
- Per-tab background color differences

## Implementation Plan

1. **index.css**: 
   - Add CSS for global radial green gradient background on `.writefy-app` (fixed, consistent)
   - Update `.writefy-header` to accommodate multi-line Create header (brand + title + subtitle) — keep 60px fixed or expand slightly
   - Increase bottom-nav padding-bottom using env(safe-area-inset-bottom) + 20px fallback
   - Update `.editor-tabs`: add margin-top 16px, min-height 40px, button gap 24px, active 2px green underline
   - Update `.format-chips`: gap 12px, padding 8px/14px, border-radius 20px on chips
   - Update `.format-chip` active/inactive: active = green bg + white text, inactive = #1A1A1A + light gray
   - Update `.writing-slab` and all `.slab-*` classes: correct spacing, line-height, font-sizes
   - Update `.slab-slugline`: color #4CAF50, letter-spacing, margin-bottom 16px
   - Update `.slab-action`: margin-bottom 12px
   - Update `.slab-character`: margin-top 20px, slightly larger font
   - Update `.slab-dialogue`: margin-top 6px, font-size 18px
   - Update `.slab-parenthetical`: italic, opacity 0.7
   - Remove or reduce excessive glow box-shadows

2. **App.tsx**: 
   - Update `renderHeaderCenter()` for Create tab: brand label sizing (12–14px, letter-spacing), title sizing (24–28px bold), subtitle sizing (12–14px, 60% opacity), spacing 8px brand→title, 4px title→subtitle
   - Add web max-width media query: editor content max-width 720px

3. **LibraryScreen.tsx**: 
   - Update header to use 24px top padding, consistent container with max-width 720px centered
   - Restyle grid view cards: 16px padding, 16–20px border-radius, subtle green border, text hierarchy (type/title/meta) with correct font sizes and spacing
   - Restyle list view items: full card style (#121212 bg, 14px border-radius, 12px gap, 72–88px min-height), icon square 40–48px with lighter bg + green icon, correct text sizing
   - Grid/list toggle: active = green bg, inactive = outlined gray, 12px gap
   - Ensure everything is centered and aligned within container

4. Validate build (lint + typecheck + build) and fix any errors
