# Writefy

## Current State
Writefy is a screenplay writing PWA with:
- Motoko backend: createDocument, getDocument, getDocumentMeta, updateDocument, deleteDocument, getAllDocumentsMeta
- React frontend with 4 tabs: Home, Library, Create (editor), Play
- Fixed header with Menu (☰) left, centered Writefy brand + doc title, Settings (⚙) right
- Bottom nav with Home, Library, Create (large green circle button), Play
- ScreenplayEditor with Write/Outline tabs, 5 format chips, line-by-line editor with auto-format
- MenuOverlay (left panel) with Export (.txt), Share, Delete
- SettingsOverlay (right panel) with Permission Manager toggle, Share with Friends
- Auto-save timer (30s), save status dot in header
- No rename feature, no PDF export, no import, no themes, no IndexedDB offline save, no Internet Identity

## Requested Changes (Diff)

### Add
- **Rename script**: Click on doc title in header → inline input to rename; instantly syncs title in Library
- **PDF export**: In three-dot menu, Export generates a proper PDF of the screenplay text
- **Import file**: In three-dot menu, Import opens file picker (.txt / .fountain) and loads content into editor
- **Library grid redesign**: 4 sample cards (The Midnight Runner, City of Ghosts, Whispers of the Past, Code Red) as rectangular cards; titles are clickable to open in editor
- **Library plus button**: Working + in Library header creates new Untitled Script
- **Theme selector in Settings**: 5 themes - Spotify Green, Blood Red, Electric Blue, Nebula Purple, Cyber Gold; updates CSS custom properties for all accents, glows, cursor color
- **IndexedDB offline save**: All scripts autosave to IndexedDB; load from IndexedDB when backend is unavailable
- **Internet Identity login in Settings**: Connect/disconnect II; syncs scripts to/from backend when logged in
- **Settings gear icon**: Already in header (top-right). Keep as-is.

### Modify
- **Bottom nav Create button**: Replace large green filled circle with simple outline + icon, same size as Home/Play icons. Add green glow ONLY when Create tab is active.
- **Header on Create screen**: Remove 'W' background image (none exists currently). Move three-dot (⋮) vertical dots menu to LEFT side of header, replacing the hamburger (☰) icon. Keep Settings (⚙) on right.
- **MenuOverlay**: Convert from left-slide panel to a small dropdown-style or bottom sheet anchored near the ⋮ button. Add Import option. Change Export to generate PDF.
- **Library screen**: Rebuild as a 2-column grid of rectangular cards matching image_14 aesthetic.
- **Nav icons**: Library uses BookOpen/stack-of-books icon. Create uses simple Plus outline icon (no circle).
- **Remove all status bar / browser chrome noise**: No time, battery indicators - already clean but ensure viewport meta is set correctly.
- **Auto-save**: Keep existing 30s timer. Also save to IndexedDB on every content change.

### Remove
- Large green circle background on Create nav button
- Hamburger ☰ icon from header (replaced by ⋮ vertical dots on left)
- Any 'W' branding image or logo in Create header

## Implementation Plan
1. Add IndexedDB utility (idb.ts) for offline script persistence - save/load/list/delete scripts locally
2. Update App.tsx:
   - Change header left button from Menu ☰ to vertical three-dot ⋮ that opens MenuOverlay
   - Make doc title clickable/editable inline with an input
   - Persist theme to localStorage; apply theme CSS variables on body
3. Update index.css:
   - Add 5 theme CSS variable sets (Spotify Green default, Blood Red, Electric Blue, Nebula Purple, Cyber Gold)
   - Modify .writefy-create-btn: remove filled circle, make it just a plain icon container with glow only when active
4. Update App.tsx bottom nav:
   - Use BookOpen icon for Library
   - Use Plus with outline only for Create - no background circle
   - Active state only adds glow, no background fill for Create
5. Update CreateScreen.tsx:
   - Wire ⋮ menu (from App header) with: Export PDF, Import file (.txt/.fountain), Share, Delete
   - On import: read file text → setLocalContent → trigger save
   - On export: use jsPDF or window.print() to generate PDF of screenplay text
6. Update LibraryScreen.tsx:
   - Change layout to 2-column card grid
   - Seed 4 sample scripts if docs < 4 on first load
   - Project titles are clickable (onOpenDoc)
   - + button in header creates new Untitled Script
7. Update SettingsOverlay.tsx:
   - Add Theme Selector section with 5 theme swatches
   - Add Internet Identity login/logout section
   - Apply theme via CSS custom property update on :root
8. Add IndexedDB hooks: save on content change, load as fallback if backend fails
9. Validate, fix lint/type errors
