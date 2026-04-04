# Writefy — UI Polish Pass

## Current State
- Bottom nav is `height: 80px` with a `.writefy-create-icon` that still shows a box-shadow glow
- `.writefy-icon-btn` uses green background fill for menu/settings buttons — feels heavy
- Library grid cards are `height: 160px`, fine but can be tighter; no type label shown
- Title editing already works (input field on click, blur saves) but needs style polish
- Header has large padding, buttons are 44×44 with green background
- Glow effects exist on active-line, save dot, create icon — some are too strong

## Requested Changes (Diff)

### Add
- Type label on each Library card ("Screenplay" hardcoded, small grey text)
- `Screenplay` sub-label below title on library cards

### Modify
- **Bottom nav**: reduce height from `80px` to `60px`; keep icons at 22px but make Create icon 26px; remove box/circle around create icon entirely; only keep a soft glow on active Create (reduce opacity); labels at 10px; equal `flex: 1` spacing
- **Library cards**: reduce fixed height from `160px` to `130px`; tighten grid gap from `12px` to `10px`; add type label ("Screenplay") below title; add subtle border glow `border-color: rgba(29,185,84,0.15)` on cards; reduce padding slightly
- **Header**: reduce padding from `12px 20px 14px` to `10px 16px 10px`; make icon buttons transparent background (no green fill), icon color = white; icon size stays 20px; ensure center title is truly centered with proper flex layout
- **General glow reduction**: `.editor-line.active-line` box-shadow opacity from 25% → 12%; create icon active glow from `0 0 12px` → `0 0 8px` at 50% opacity; remove any other ambient glow that is not active tab / create button / cursor
- **Title input**: keep same style, ensure it visually matches the title text it replaces (same size 22px, same font-weight 800)
- **writefy-screen padding**: adjust `padding-top` from `88px` to match slimmer header (~72px), `padding-bottom` from `88px` to `68px` to match slimmer nav

### Remove
- Green background fill on `.writefy-icon-btn` (replace with transparent background, white icon color)
- Any explicit circle/box wrapping the Create nav icon

## Implementation Plan
1. Update `index.css`:
   - `.writefy-header`: tighten padding
   - `.writefy-icon-btn`: remove green background, use transparent + white icon
   - `.writefy-bottom-nav`: reduce height to 60px
   - `.writefy-create-icon`: remove border-radius box, only soft glow when active
   - `.writefy-screen`: adjust top/bottom padding
   - `.editor-line.active-line`: soften box-shadow
   - Library card styles (inline in LibraryScreen — adjust there)
2. Update `LibraryScreen.tsx`:
   - Reduce card height to 130px
   - Reduce gap to 10px
   - Add `Screenplay` type label below title
   - Add subtle accent border-color on cards
3. Update `App.tsx`:
   - Icon button style cleanup (no green background)
   - Ensure Create nav icon has no wrapping circle div, just the Plus icon with conditional glow class
