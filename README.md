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
  - 12 component types: Announcement, Navbar, Hero, About, Services,
    Carousel, Testimonial, Gallery, CTA, Footer, Contact, Form
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
  - All 12 preview components are container-width responsive
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
  │   ├── builders/              # 12 content + style editors
  │   ├── previews/              # 12 live preview renderers (all responsive)
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

  - Added Form and About section types (builder + preview)
  - Pre-filled all sections with realistic dummy data (Acme Co)
  - Full responsive pass across all 12 previews using ResizeObserver
  - Created useContainerWidth hook (src/hooks/useContainerWidth.js)
  - Created ResponsiveGrid component; refactored Services, Gallery,
    Testimonial, Footer, Contact to use it
  - Navbar: mobile hamburger with functional dropdown menu
  - Testimonial: replaced scroll row with carousel (arrows + dots);
    desktop supports 1/2/3 visible cards via style panel button toggle;
    mobile always shows 1 card
  - GlobalThemePanel: stripped to heading + placeholder text (theme
    system not yet wired)
  - Mobile block screen added (< 768px window width)
  - Code cleanup: removed unused imports (useSelection from App.jsx,
    RangeField from GlobalThemePanel, GRID_COLS maps from previews,
    isMobile boilerplate replaced by hook)
