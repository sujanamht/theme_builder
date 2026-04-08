● Theme Builder - Project Summary

  What it is: An interactive web-based design tool for visually
  building multi-section website layouts with live preview and
  JSON export.

  ---
  Tech Stack

  - React 18.3.1 + Vite 5.4.8
  - Tailwind CSS 3.4.13 for styling
  - @dnd-kit for drag-and-drop functionality
  - React Context API for state management

  ---
  Features

  Component Library
  - 15 component types: Announcement, Navbar, Hero, About, Services,
    Carousel, Testimonial, Gallery, CTA, Footer, Contact, Form,
    Blog List, Blog Post, Social Media
  - Each section has a Builder (content editor) + Preview (live render) pair
  - Drag-and-drop canvas: reorder components with visual feedback
  - Component duplication: clone any component with its settings
  - "+ Add Section" modal: grid of all section types as cards
  - Visibility toggle per section (eye icon in sidebar list)

  Canvas & Editing
  - Real-time preview: live rendering as you edit
  - Canvas image upload: click directly on image areas in the preview
    to upload (Navbar logo, Carousel slides, Gallery cells, Testimonial
    avatars, Hero background, About image). Placeholder shown when no
    image is set; "Replace" pill appears on hover when image is present
  - Inline sliders: font size, padding, border radius, gap, height,
    link spacing — all use RangeField (range slider + live value label)
  - Demo content: all sections pre-populated with realistic dummy data
    (Acme Co brand, sample nav links, hero copy, about text, services,
    testimonials, gallery captions, footer columns, contact details, etc.)

  Responsive Previews
  - All 15 preview components are container-width responsive
    (ResizeObserver / useContainerWidth hook — not viewport-based)
  - Navbar: hamburger menu with animated mobile dropdown at < 500px
  - Hero: reduced padding, font sizes at < 500px
  - About: stacks image above text at < 500px
  - Services / Gallery: ResponsiveGrid (1 / 2 / 3 cols)
  - Testimonial: carousel at all widths; desktop shows 1–3 cards
    configurable via style panel; mobile always shows 1 card
  - Footer: ResponsiveGrid (1 / 2 / 4 cols)
  - Contact: ResponsiveGrid (1 col mobile, 2 col desktop)
  - CTA / Form / Announcement / Carousel: reduced padding + font at < 500px
  - Blog List: grid → single-column at < 500px
  - Blog Post: fluid max-width; title font scales at < 400px
  - Social Media: embed grid adapts with ResponsiveGrid
  - Mobile block screen: fullscreen message shown when browser
    window < 768px wide (app is desktop-only by design)

  Left Sidebar
  - Three tabs: Components, Theme, Pages
  - Components tab: "+ Add Section" button + ON CANVAS list with
    drag handles, visibility toggles, and section labels.
    Colored accent border on active row.
  - Theme tab: "Default Theme" panel — placeholder for future
    global theme system ("More themes coming soon.")
  - Pages tab: multi-page manager — add pages, rename on double-click,
    delete (disabled when only one page remains), click to switch
    active page. Each page has its own independent section order;
    section data/template is shared across pages.

  UI Details
  - Responsive canvas presets: Desktop (900px), Tablet (768px), Mobile (390px)
  - JSON export: download full theme configuration
  - Dark / light mode: toggle in top bar

  ---
  Architecture

  src/
  ├── App.jsx                    # Shell, drag-drop orchestration,
  │                              #   sidebar tabs, Add Section modal,
  │                              #   mobile block screen
  ├── store/
  │   ├── themeStore.jsx         # Central Context state — all section
  │   │                          #   data/template, globalTheme, pages.
  │   │                          #   All sections pre-filled with dummy data.
  │   └── selectionContext.jsx   # Active selected section ID (used by
  │                              #   preview components for upload overlays)
  ├── hooks/
  │   └── useContainerWidth.js   # ResizeObserver hook — returns { ref, width }
  │                              #   for container-based responsive logic
  ├── components/
  │   ├── builders/              # 15 content + style editors
  │   │   ├── BlogListBuilder.jsx    # Blog list grid + post card management
  │   │   ├── BlogPostBuilder.jsx    # Blog post read view + post selection
  │   │   └── SocialMediaBuilder.jsx # Embedded social feed (YT/IG/TT/FB)
  │   ├── previews/              # 15 live preview renderers (all responsive)
  │   │   ├── BlogListPreview.jsx    # src/components/previews/BlogListPreview.jsx
  │   │   ├── BlogPostPreview.jsx    # src/components/previews/BlogPostPreview.jsx
  │   │   └── SocialMediaPreview.jsx # src/components/previews/SocialMediaPreview.jsx
  │   └── ui/
  │       ├── ColorInput.jsx         # Hex color picker + text input
  │       ├── RangeField.jsx         # Slider with live value label
  │       ├── ImageUploader.jsx      # Sidebar file upload input
  │       ├── CanvasUpload.jsx       # In-preview upload overlay/placeholder
  │       ├── ResponsiveGrid.jsx     # Container-aware CSS grid wrapper
  │       │                          #   (cols: mobile/tablet/desktop, gap)
  │       ├── GlobalThemePanel.jsx   # Theme tab — placeholder
  │       ├── PagesPanel.jsx         # Pages tab content
  │       ├── SortableCanvasItem.jsx # Canvas drag wrapper
  │       └── SortablePanelItem.jsx  # Sidebar list row
  └── exports/exportJSON.js      # JSON download utility

  State model: each section holds { data, template }. data = content
  (text, links, items). template = styling (colors, font size, padding,
  border radius, etc.). Global settings live under globalTheme. Page
  ordering lives under pages[].sections, keyed by activePage.

  ---
  Recent Work (last session)

  - Centralised heading/subheading typography: created
    src/utils/typography.js with headingStyle() and subheadingStyle()
    utility functions — one source of truth for section heading styles
    across all previews
  - Applied to 10 previews: ServicesPreview, TestimonialPreview,
    GalleryPreview, BlogListPreview, CtaPreview, AboutPreview,
    ContactPreview, FormPreview, SocialMediaPreview, TeamPreview
  - Each preview now calls headingStyle({ template, globalTheme, textColor })
    and subheadingStyle({ template, globalTheme, textColor, fontSize })
    instead of defining local style objects; section-specific overrides
    (isMobile sizes, letterSpacing, textAlign) are spread on top

---

## Data layer

### Source of truth

`src/data/theme.json` is the live working file for the entire theme. It is committed to git, so whatever is on disk is what every collaborator — and every fresh app start — will see. There is no localStorage fallback; that approach was removed entirely to keep the source of truth unambiguous.

### How data flows

On mount, `ThemeProvider` calls `themeService.load()`, which fetches `/src/data/theme.json` and hydrates the store with the result. If the fetch fails (e.g. first run before the file exists), the store stays on its `initialState` defaults and a warning is logged to the console.

On every state change, the store's second `useEffect` calls `themeService.save(theme)`. Saves are debounced by 1 second inside the service, so rapid edits coalesce into a single write. When the timer fires, the service POSTs the serialised JSON to `/write-theme`, which a small Vite plugin intercepts and writes back to `src/data/theme.json` on disk.

The `SaveButton` in the toolbar exposes a manual path: clicking it calls `triggerSave(theme)` from the `useSaveStatus` hook, which in turn calls `themeService.saveNow()`. That function cancels any pending debounce and writes immediately, bypassing the 1-second wait.

### Save status

The `SaveButton` (`src/components/ui/SaveButton.jsx`) reflects the current write state at all times. When nothing is pending it shows a quiet grey "Saved" label. While a write is in flight it shows a pulsing "Saving…". On success it shows green "Saved ✓" for two seconds before returning to idle. On failure it becomes a red "Save failed — retry" button; clicking it re-invokes `triggerSave` with the current theme so the user can attempt the write again without reloading.

### Swapping to a real API (production)

Open `src/services/themeService.js` and find the `--- API SWAP POINT ---` comment in `_doSave`. Replace the `fetch('/write-theme', …)` line with your own API call — for example `fetch('/api/theme', { method: 'PUT', body })`. The rest of the service (debounce, `saveNow`, the `load` function, the store hooks, and the `SaveButton`) all stay exactly as they are. `theme.json` becomes your seed or initial-data file for the backend; no other files need to change.

### Adding a new section type

Add the section's default `data` and `template` objects to `src/data/theme.json` under a new key. Register the key in the `BUILDERS` and `PREVIEWS` maps in `App.jsx`, pointing to the new builder and preview component files. The store, save pipeline, and drag-and-drop canvas will pick up the new section automatically.

---

## 🧩 Reusable Components & Utilities

> Check here first before building anything new.

---

### UI Components

#### `ColorInput`
**File:** `src/components/ui/ColorInput.jsx`
**Purpose:** Hex color picker — native `<input type="color">` paired with a validated text field.
**Props:** `label: string`, `value: string` (hex), `onChange: (hex) => void`
**Used in:** All 15 builders, GlobalThemePanel

---

#### `RangeField`
**File:** `src/components/ui/RangeField.jsx`
**Purpose:** Range slider with a live `{value}{unit}` readout. Outputs a px string (e.g. `"16px"`).
**Props:** `label`, `value`, `onChange`, `min`, `max`, `step` (default `1`), `unit` (default `"px"`)
**Used in:** All 15 builders (font size, padding, border radius, gap, height, link spacing, etc.)

---

#### `RangeField` output note
`onChange` fires `"${n}${unit}"` — always a string. Callers store it in `template` and pass it directly to inline styles. Parse with `parseInt(value, 10)` when you need a number.

---

#### `ImageUploader`
**File:** `src/components/ui/ImageUploader.jsx`
**Purpose:** Sidebar file-upload input with file/URL toggle and thumbnail preview.
**Props:** `label`, `value` (url/dataUrl), `onChange`, `textValue` (alt/brand text), `onTextChange`
**Used in:** NavbarBuilder, HeroBuilder, AboutBuilder, TestimonialBuilder, FormBuilder

---

#### `CanvasUpload`
**File:** `src/components/ui/CanvasUpload.jsx`
**Purpose:** In-preview upload overlay. Shows a placeholder when no image is set; shows a "Replace" pill on hover when one is. Optionally opens `CropOverlay`.
**Props:** `children`, `hasImage: bool`, `isActive: bool`, `onUpload: (dataUrl) => void`, `style`, `compact: bool`, `shape: "rect"|"circle"`, `aspectRatio: string` (e.g. `"16/9"`), `onCrop: (url) => void`
**Used in:** NavbarPreview, HeroPreview, CarouselPreview, GalleryPreview, TestimonialPreview, AboutPreview

---

#### `CropOverlay`
**File:** `src/components/ui/CropOverlay.jsx`
**Purpose:** Full-screen modal for interactive aspect-ratio-locked image cropping with a rule-of-thirds grid.
**Props:** `src: string`, `aspectRatio: string`, `onCrop: (croppedUrl) => void`, `onClose: () => void`
**Used in:** Internally by `CanvasUpload` — not consumed directly elsewhere.

---

#### `ResponsiveGrid`
**File:** `src/components/ui/ResponsiveGrid.jsx`
**Purpose:** CSS Grid wrapper that switches column count based on **container width** (ResizeObserver), not viewport.
**Props:** `cols: { mobile, tablet, desktop }` (defaults `1/2/4`), `gap: number` (px, default `24`), `minTablet: number` (default `500`), `minDesktop: number` (default `768`), `style`
**Used in:** ServicesPreview, GalleryPreview, FooterPreview, ContactPreview

---

#### `GlobalThemePanel`
**File:** `src/components/ui/GlobalThemePanel.jsx`
**Purpose:** Sidebar "Theme" tab — edits global font family and primary/secondary colors via `updateGlobalTheme`.
**Props:** none (reads/writes ThemeContext directly)
**Used in:** App.jsx sidebar

---

#### `PagesPanel`
**File:** `src/components/ui/PagesPanel.jsx`
**Purpose:** Sidebar "Pages" tab — add, rename (double-click), delete, and switch pages.
**Props:** `t: object` — theme token object (colors/styles from App shell)
**Used in:** App.jsx sidebar

---

### Drag & Drop

#### `SortableCanvasItem`
**File:** `src/components/ui/SortableCanvasItem.jsx`
**Purpose:** Wraps each canvas section with a dnd-kit `useSortable` drag handle (hover-reveal, left edge). Click triggers section selection.
**Props:** `id: string`, `children`, `onSelect: (id) => void`
**Used in:** App.jsx canvas render loop

---

#### `SortablePanelItem`
**File:** `src/components/ui/SortablePanelItem.jsx`
**Purpose:** Sidebar list row with `useSortable` drag handle (`⠿`), visibility eye toggle, and active-state accent border.
**Props:** `id`, `label`, `typeColor`, `isActive: bool`, `isVis: bool`, `t` (theme tokens), `onSelect`, `onToggleVisibility`
**Used in:** App.jsx sidebar components list

---

#### Drag ID namespacing convention
| Prefix | Context | Handled in |
|--------|---------|------------|
| *(none)* | Canvas section reorder | `handleDragEnd` → `setOrder(arrayMove(...))` |
| `panel__` | Sidebar list reorder | `handleDragEnd` → `setOrder(arrayMove(...))` |
| `navlink__` | Navbar link reorder | `handleDragEnd` → `updateSection('navbar', 'data', ...)` |

All three share the single `DndContext` in `App.jsx`. Add a new prefix + branch in `handleDragEnd` to introduce a new sortable list.

---

### Hooks

#### `useContainerWidth`
**File:** `src/hooks/useContainerWidth.js`
**Purpose:** Returns a `ref` and the current `width` of the attached element (ResizeObserver). Use for container-based breakpoints instead of `window.innerWidth`.
**API:** `useContainerWidth(initial = 9999) => { ref, width: number }`
**Used in:** ResponsiveGrid, most preview components

---

### Store / Context

#### `useTheme` / `ThemeProvider`
**File:** `src/store/themeStore.jsx`
**Purpose:** Central state for all section `data` + `template`, `globalTheme`, and `pages`. Wraps the entire app.
**Key API:**
```
useTheme() => {
  theme,
  updateSection(section, 'data'|'template', value),
  updateGlobalTheme(key, value),
  addSection(id), removeSection(id),
  addCustomPage(label), deletePage(id), renamePage(id, label),
  setActivePage(id), updatePageOrder(pageId, sections),
  removeSectionFromAllPages(sectionId),
}
```
**Section shape:** `theme[sectionKey] = { data: {…}, template: {…} }`
**Used in:** All 15 builders, all 15 previews, GlobalThemePanel, App.jsx

---

#### `useDarkMode`
**File:** `src/store/themeStore.jsx` (exported alongside `useTheme`)
**Purpose:** Convenience hook — returns `theme.globalTheme.darkMode` as a boolean.
**API:** `useDarkMode() => boolean`
**Used in:** Most previews and GlobalThemePanel for dark/light style switching

---

#### `useSelection`
**File:** `src/store/selectionContext.jsx`
**Purpose:** Returns the currently selected section ID string. Used by previews to know when to show upload overlays.
**API:** `useSelection() => string | null`
**Used in:** NavbarPreview, HeroPreview, CarouselPreview, GalleryPreview, TestimonialPreview, AboutPreview (via `CanvasUpload`'s `isActive` prop)

---

### Utilities

#### `exportJSON`
**File:** `src/exports/exportJSON.js`
**Purpose:** Triggers a browser download of the full theme state as `theme.json`.
**API:** `exportJSON(theme: object, filename = 'theme.json') => void`
**Used in:** App.jsx export button

---

#### `hexToRgba`
**File:** `src/utils/colorUtils.js`
**Purpose:** Converts a `#RRGGBB` hex string to an `rgba(r, g, b, alpha)` string. Falls back to `rgba(0,0,0,alpha)` on bad input.
**API:** `hexToRgba(hex: string, alpha: number) => string`
**Used in:** ServicesPreview, GalleryPreview, TestimonialPreview, FooterPreview, ContactPreview

---

#### `headingStyle` / `subheadingStyle`
**File:** `src/utils/typography.js`
**Purpose:** Single source of truth for section heading and subheading inline styles. Change once, all previews update.
**API:**
```
headingStyle({ template, globalTheme, textColor }) => CSSProperties
subheadingStyle({ template, globalTheme, textColor, fontSize }) => CSSProperties
```
- `headingStyle` resolves fontSize via `template.headingSize → globalTheme.headingSize → '2rem'`
- `subheadingStyle` resolves fontSize via `template.subheadingSize → globalTheme.bodySize → \`${fontSize}px\``
- Both default to `textAlign: 'center'`; spread + override for left-aligned layouts
**Used in:** ServicesPreview, TestimonialPreview, GalleryPreview, BlogListPreview, CtaPreview, AboutPreview, ContactPreview, FormPreview, SocialMediaPreview, TeamPreview

---

### Candidates for extraction (defined locally, not yet shared)

| Component | Currently in | Props | Extract to |
|-----------|-------------|-------|-----------|
| `ToggleRow` | NavbarBuilder.jsx | `label, checked, onChange` | `src/components/ui/ToggleRow.jsx` |
| `SortableLinkCard` | NavbarBuilder.jsx | `id, children(listeners, attrs, isDragging)` | `src/components/ui/SortableLinkCard.jsx` |
| `IconEye` | SortablePanelItem.jsx | `color, crossed: bool` | `src/components/ui/icons/` |
