# Writefy

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- PWA setup: manifest.json, service worker registration, viewport-fit=cover meta tag
- Fixed top header: left menu icon (☰), center app name "Writefy" + "Untitled Script" title + "Screenplay • Last edited [date]" subtitle, right settings icon (⚙️)
- Screenplay editor (Create screen as main/default view):
  - Two tabs: Write (active, green underline) and Outline
  - Formatting mode selector row: Slugline, Action (default selected), Character, Dialogue, Parenthetical
  - Rich text area: black background, white text, active line highlighted with green glow, green cursor
  - Example content: character name RAMA with dialogue below
- Fixed bottom navigation bar: Home, Library, Create (+, slightly larger), Play — static, no hover/animation, active tab green
- Auto-save: saves to backend every 30 seconds, shows small green dot indicator when saved
- Settings panel (gear icon): accessible from header
- Export functionality: export screenplay as plain text download
- Backend: store screenplay documents with title, content, format metadata, last-edited timestamp

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. Set up PWA manifest and meta tags
2. Create Motoko backend: screenplay document storage (create, read, update, delete, list)
3. Build fixed header component
4. Build bottom navigation with 4 static tabs
5. Build screenplay editor with format mode selector and glow-cursor text area
6. Wire auto-save (30-second debounce) with green dot status indicator
7. Implement export as text file
8. Apply black/green theme throughout
