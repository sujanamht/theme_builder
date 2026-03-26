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
  - 10 component types: Announcement, Navbar, Services, Carousel,
    Testimonial, Gallery, CTA, Footer, Hero, Contact
  - Hero: full-width banner with headline, subheadline, CTA button,
    background image upload, and style controls
  - Contact: contact form (editable labels), social media links
    (Instagram, Twitter/X, LinkedIn, Facebook), Google Maps iframe embed
  - Drag-and-drop canvas: reorder components with visual feedback
  - Component duplication: clone any component with its settings
  - "+ Add Section" modal: click to open a grid of all 10 section
    types as cards; replaces the old drag-from-library approach

  Canvas & Editing
  - Real-time preview: live rendering as you edit
  - Canvas image upload: click directly on image areas in the preview
    to upload (Navbar logo, Carousel slides, Gallery cells, Testimonial
    avatars, Hero background). Placeholder shown when no image is set;
    "Replace" pill appears on hover when image is present
  - Inline sliders: font size, padding, border radius, gap, height,
    link spacing — all use range sliders with live value labels
    (RangeField component) instead of number inputs
  - Demo content: Testimonial, Services, and Gallery sections
    pre-populated with realistic placeholder items in initial state

  Left Sidebar
  - Three tabs: Components, Theme, Pages
  - Components tab: "+ Add Section" button + ON CANVAS list with
    drag handles (left side, always visible), visibility toggles,
    and section labels. Colored accent border on active row.
  - Theme tab: Global Theme panel — font family (6 options),
    primary / secondary / accent colors, base spacing unit slider,
    dark/light mode toggle (synced with top-bar toggle)
  - Pages tab: multi-page manager — add pages, rename on double-click,
    delete (disabled when only one page remains), click to switch
    active page. Each page has its own independent section order;
    section data/template is shared across pages

  UI Details
  - Responsive presets: Desktop (900px), Tablet (768px), Mobile (390px)
  - JSON export: download full theme configuration
  - Dark / light mode: toggle in top bar or Theme tab

  ---
  Architecture

  src/
  ├── App.jsx                    # Shell, drag-drop orchestration,
  │                              #   sidebar tabs, Add Section modal
  ├── store/
  │   ├── themeStore.jsx         # Central Context state — sections,
  │   │                          #   globalTheme, pages, activePage
  │   └── selectionContext.jsx   # Active selected section ID (for
  │                              #   canvas upload overlays)
  ├── components/
  │   ├── builders/              # 10 content editors (text, links,
  │   │                          #   image uploaders, item lists)
  │   ├── previews/              # 10 live preview renderers
  │   └── ui/
  │       ├── ColorInput.jsx     # Hex color picker + text input
  │       ├── RangeField.jsx     # Slider with live value label
  │       ├── ImageUploader.jsx  # Sidebar file upload input
  │       ├── CanvasUpload.jsx   # In-preview upload overlay/placeholder
  │       ├── GlobalThemePanel.jsx  # Theme tab content
  │       ├── PagesPanel.jsx     # Pages tab content
  │       ├── SortableCanvasItem.jsx  # Canvas drag wrapper
  │       └── SortablePanelItem.jsx   # Sidebar list row
  └── exports/exportJSON.js      # JSON download utility

  Each component type has a Builder (content editing UI) + Preview
  (live render) pair. State flows through ThemeContext — each section
  holds data (content) and template (styling). Global settings live
  under globalTheme. Page ordering lives under pages[].order, keyed
  by activePage.

  ---
  Recent Work

  - Drag-and-drop implementation completed
  - Component iteration in progress (commit: "1 ite complete")
  - Added Hero and Contact section types
  - Replaced library drag-drop with "+ Add Section" modal
  - Migrated section order to per-page store (pages manager)
  - Added Global Theme panel (font, colors, spacing, dark mode)
  - Added canvas image upload with placeholder/replace UX
  - Switched numeric style inputs to range sliders (RangeField)
  - Added sidebar tabs: Components / Theme / Pages