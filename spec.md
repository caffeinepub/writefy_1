# Writefy — Fixed Slab Protocol (Phase 1)

## Current State
- App has a working backend (createDocument, getDocument, updateDocument, deleteDocument, getAllDocumentsMeta)
- Frontend has Home, Library, Create (ScreenplayEditor), Play tabs
- Bottom nav uses 4 icons (Home, Library, Create, Play)
- Delete button is broken — DeleteConfirm dialog opens but calling deleteDoc.mutateAsync does not navigate away properly and the QueryClient may not be invalidated before onDocumentDeleted fires
- Library shows small cards (105px height), 2-column grid
- Header has ⋮ left, center title, ⚙️ right
- Create (+) nav button goes straight to editor — no type-selection modal
- Home tab shows a list of recent docs, not a Resume Card
- Library has no grid/list view toggle
- Editor is not a single .writing-slab layout; dialogue/character/slugline widths are CSS class-based but not the "slab" architecture

## Requested Changes (Diff)

### Add
- **Dual-card (+) Modal**: Clicking the (+) in bottom nav opens a full-screen blur modal with two vertical cards [NOVEL] and [SCREENPLAY]. Selecting one creates a new doc of that type and navigates to Create.
- **Home: Resume Card** — A single high-glow card showing the most recently edited script. Full width, 180px height, black background, green glow border, title, type, last edited time, and a "Resume Writing" CTA button.
- **Library: View Toggle** — Grid/List toggle button in library header (two icons: grid icon and list icon). Grid = 2-column 2:3 ratio poster cards. List = full-width rows with title + meta.
- **Library: 2:3 poster cards** — `aspect-ratio: 2/3`, `border-radius: 20px`, `background: #121212`, `border: 1px solid #1a1a1a`, with title overlay at bottom.
- **Editor: .writing-slab** — Replace current editor layout. A single scrolling slab: `width: 100%; max-width: 600px; margin: 60px auto 0; background: #000; min-height: 100vh; padding: 40px 0`. Inside: slugline (full width, uppercase, 900 weight), action (full width, #ccc), character (centered, uppercase, green), dialogue (70% width, centered margin).
- **Universal Header height 60px** on all tabs with `height: 60px; border-bottom: 1px solid #1a1a1a`.
- **Clickable Script Title** — In editor header center text is the script title; clicking it turns into an `<input>` for renaming. Blur/Enter saves, Escape cancels.

### Modify
- **Delete button fix** — In CreateScreen.handleDeleteConfirm: await deleteDoc.mutateAsync, then call onDocumentDeleted(). Also add try/catch and ensure setShowDelete(false) + setShowMenu(false) are called correctly. The issue is the mutation resolves before the query invalidation completes — fix by awaiting the mutation result and using a timeout or queryClient.invalidateQueries before calling onDocumentDeleted.
- **Bottom nav Create button** — No longer navigates to Create tab directly. Instead opens the dual-card type-selection modal.
- **Home screen** — Replace list of docs with a single Resume Card for the most recent doc.
- **Library screen** — Poster-style 2:3 ratio grid cards, with a grid/list toggle in the header.
- **ScreenplayEditor** — Restructure to use .writing-slab with proper element classes for slugline, action, character (centered), dialogue (70% width).
- **Header** — Fix height to exactly 60px, show tab name in center on Home/Library/Play tabs, show editable script title on Create tab.

### Remove
- Old HomeScreen list-of-cards UI
- Old LibraryScreen 105px fixed-height cards (replace with 2:3 posters)
- Old screenplay editor layout (replace with .writing-slab)

## Implementation Plan
1. Fix `handleDeleteConfirm` in CreateScreen: wrap in try/catch, ensure both `setShowDelete(false)` and `setShowMenu(false)` before calling `onDocumentDeleted()`, use the mutation's own promise chain properly.
2. Rebuild `App.tsx`: header 60px, center shows tab title (Home/Library/Play) or editable script title (Create), (+) Create button opens NewDocModal instead of navigating.
3. Create `NewDocModal.tsx`: full-screen blur backdrop, two vertical cards [NOVEL] and [SCREENPLAY], selecting one calls handleNewDoc with type, closes modal.
4. Rebuild `HomeScreen.tsx`: show single Resume Card for most recent doc with green glow, title, meta, Resume button.
5. Rebuild `LibraryScreen.tsx`: 2:3 ratio poster cards in 2-col grid, grid/list toggle in header.
6. Rebuild `ScreenplayEditor.tsx`: single .writing-slab with proper CSS classes for each element type.
7. Update `index.css`: add .writing-slab, .slugline, .action, .character, .dialogue, .parenthetical classes per spec.
