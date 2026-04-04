# Writefy

## Current State
- PWA screenplay writing app with dark/green theme
- Fixed header (menu left, title center, settings right)
- Bottom nav with 4 tabs: Home, Library, Create, Play
- Library screen uses 2-column grid cards (height: 130px, border with accent top band)
- Inline title editing exists in header but may not be fully functional
- Bottom nav height: 60px, Create icon has `writefy-create-icon` with drop-shadow glow
- CSS in index.css with custom writefy classes
- Some residual glow on elements beyond active tab/Create button/cursor

## Requested Changes (Diff)

### Add
- Tap-to-edit title: when user taps the title in the header (on Create tab), it becomes an inline input, auto-saves on blur or Enter, reverts on Escape
- Library card subtle border glow effect (border with accent color at low opacity)

### Modify
- **Bottom nav**: reduce height from 60px to ~52px; make icons equal size (22px) except Create (26px); remove any circle/background shape behind Create icon; keep only a soft drop-shadow glow on Create when active (reduce from 0.45 to 0.2 opacity); equal flex spacing; labels 10px clean text
- **Library cards**: reduce height from 130px to ~105px; tighter vertical layout; rounded corners (12px); title bold, type label "Screenplay", time small; spacing between cards tighter (gap: 8px); subtle border: `1px solid rgba(accent, 0.15)`
- **Header**: tighten padding (reduce from 10px to 8px vertical); keep icon buttons at 36px instead of 40px for tighter feel; reduce title font-size slightly if too large
- **Global glow reduction**: reduce all box-shadows and glows except: active nav tab label/icon color, Create button soft glow, editor cursor glow (`caretColor`). Remove or reduce `.editor-line.active-line` box-shadow intensity
- **writefy-screen padding**: adjust to match slimmer nav (padding-bottom: 56px)

### Remove
- Any large circle or filled background behind Create (+) icon in bottom nav
- Excessive glow on non-active elements
- Residual `--green-glow-strong` usages outside of designated areas

## Implementation Plan
1. Update `index.css`: slim bottom nav height to 52px, reduce create icon glow opacity, tighten header padding, reduce library card height to 105px, tighten card gap to 8px, update card border to subtle accent glow, adjust screen padding-bottom
2. Update `App.tsx`: ensure title click → input works correctly; `startTitleEdit` fires on Create tab; input blurs save; keyboard Enter saves, Escape cancels; keep same font/size/position
3. Update `LibraryScreen.tsx`: card height 105px, gap 8px, border with subtle accent glow, ensure title bold, type label, time text are well-spaced and centered
4. Ensure no large circle element exists in bottom nav Create button area (currently handled via CSS class, confirm no background/border-radius full on the icon wrapper)
