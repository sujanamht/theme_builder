import { useState, useEffect, useRef, cloneElement } from 'react'
import { SelectionContext } from './store/selectionContext.jsx'
import { exportJSON } from './exports/exportJSON.js'
import { useTheme } from './store/themeStore.jsx'
import SectionErrorBoundary from './components/shared/SectionErrorBoundary.jsx'
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableCanvasItem  from './components/ui/SortableCanvasItem.jsx'
import SortablePanelItem   from './components/ui/SortablePanelItem.jsx'
import GlobalThemePanel    from './components/ui/GlobalThemePanel.jsx'
import PagesPanel          from './components/ui/PagesPanel.jsx'
import SaveButton          from './components/ui/SaveButton.jsx'

import AnnouncementBuilder  from './components/builders/AnnouncementBuilder.jsx'
import NavbarBuilder        from './components/builders/NavbarBuilder.jsx'
import TestimonialBuilder   from './components/builders/TestimonialBuilder.jsx'
import CarouselBuilder      from './components/builders/CarouselBuilder.jsx'
import ServicesBuilder      from './components/builders/ServicesBuilder.jsx'
import GalleryBuilder       from './components/builders/GalleryBuilder.jsx'
import AboutBuilder         from './components/builders/AboutBuilder.jsx'
import CTABuilder           from './components/builders/CTABuilder.jsx'
import FooterBuilder        from './components/builders/FooterBuilder.jsx'
import HeroBuilder          from './components/builders/HeroBuilder.jsx'
import ContactBuilder       from './components/builders/ContactBuilder.jsx'
import FormBuilder          from './components/builders/FormBuilder.jsx'
import SocialMediaBuilder   from './components/builders/SocialMediaBuilder.jsx'
import BlogListBuilder      from './components/builders/BlogListBuilder.jsx'
import BlogPostBuilder      from './components/builders/BlogPostBuilder.jsx'
import AboutDetailBuilder  from './components/builders/AboutDetailBuilder.jsx'
import PageBannerBuilder   from './components/builders/PageBannerBuilder.jsx'
import TeamBuilder         from './components/builders/TeamBuilder.jsx'

import AnnouncementPreview  from './components/previews/AnnouncementPreview.jsx'
import NavbarPreview        from './components/previews/NavbarPreview.jsx'
import TestimonialPreview   from './components/previews/TestimonialPreview.jsx'
import CarouselPreview      from './components/previews/CarouselPreview.jsx'
import ServicesPreview      from './components/previews/ServicesPreview.jsx'
import GalleryPreview       from './components/previews/GalleryPreview.jsx'
import AboutPreview         from './components/previews/AboutPreview.jsx'
import CTAPreview           from './components/previews/CTAPreview.jsx'
import FooterPreview        from './components/previews/FooterPreview.jsx'
import HeroPreview          from './components/previews/HeroPreview.jsx'
import ContactPreview       from './components/previews/ContactPreview.jsx'
import FormPreview          from './components/previews/FormPreview.jsx'
import SocialMediaPreview   from './components/previews/SocialMediaPreview.jsx'
import BlogListPreview      from './components/previews/BlogListPreview.jsx'
import BlogPostPreview      from './components/previews/BlogPostPreview.jsx'
import AboutDetailPreview  from './components/previews/AboutDetailPreview.jsx'
import PageBannerPreview   from './components/previews/PageBannerPreview.jsx'
import TeamPreview         from './components/previews/TeamPreview.jsx'

/* ─── registries (keyed by type, not instance id) ─── */
const COMPONENT_LABELS = {
  announcement: 'Announcement',
  navbar:       'Navbar',
  carousel:     'Carousel',
  hero:         'Hero', 
  about:        'About',
  services:     'Services',
  gallery:      'Gallery',
  testimonial:  'Testimonial',
  contact:      'Contact',
  cta:          'CTA',
  footer:       'Footer',
  form:         'Form',
  socialmedia:  'Social Media',
  bloglist:     'Blog List',
  blogPost:     'Blog Post',
  aboutDetail:  'About Detail',
  pageBanner:   'Page Banner',
  team:         'Team',
}

/* Per-type accent colors for the library badge */
const TYPE_COLORS = {
  announcement: '#f59e0b',
  navbar:       '#6366f1',
  carousel:     '#3b82f6',  
  hero:         '#f97316',
  about:        '#6b7280',
  gallery:      '#8b5cf6',  
  services:     '#10b981',
  testimonial:  '#ec4899',
  cta:          '#ef4444',  
  contact:      '#06b6d4',
  footer:       '#6b7280',
  form:         '#a855f7',
  socialmedia:  '#0ea5e9',
  bloglist:     '#f43f5e',
  blogPost:     '#ec4899',
  aboutDetail:  '#14b8a6',
  pageBanner:   '#0ea5e9',
  team:         '#f59e0b',
}

const ALL_TYPES = ['announcement', 'navbar', 'about', 'aboutDetail', 'pageBanner', 'team', 'services', 'carousel', 'testimonial', 'gallery', 'cta', 'footer', 'hero', 'contact', 'form', 'socialmedia', 'bloglist', 'blogPost']

const GLOBAL_TYPES = new Set(['announcement', 'navbar', 'footer'])

const BUILDERS = {
  announcement: <AnnouncementBuilder />,
  navbar:       <NavbarBuilder />,
  about:        <AboutBuilder />,
  services:     <ServicesBuilder />,
  testimonial:  <TestimonialBuilder />,
  carousel:     <CarouselBuilder />,
  gallery:      <GalleryBuilder />,
  cta:          <CTABuilder />,
  footer:       <FooterBuilder />,
  hero:         <HeroBuilder />,
  contact:      <ContactBuilder />,
  form:         <FormBuilder />,
  socialmedia:  <SocialMediaBuilder />,
  bloglist:     <BlogListBuilder />,
  blogPost:     <BlogPostBuilder />,
  aboutDetail:  <AboutDetailBuilder />,
  pageBanner:   <PageBannerBuilder />,
  team:         <TeamBuilder />,
}

const PREVIEWS = {
  announcement: <AnnouncementPreview />,
  navbar:       <NavbarPreview />,
  about:        <AboutPreview />,
  services:     <ServicesPreview />,
  testimonial:  <TestimonialPreview />,
  carousel:     <CarouselPreview />,
  gallery:      <GalleryPreview />,
  cta:          <CTAPreview />,
  footer:       <FooterPreview />,
  hero:         <HeroPreview />,
  contact:      <ContactPreview />,
  form:         <FormPreview />,
  socialmedia:  <SocialMediaPreview />,
  bloglist:     <BlogListPreview />,
  blogPost:     <BlogPostPreview />,
  aboutDetail:  <AboutDetailPreview />,
  pageBanner:   <PageBannerPreview />,
  team:         <TeamPreview />,
}

const INITIAL_VISIBILITY = { announcement: true, navbar: true, carousel: true, about: true, aboutDetail: true, pageBanner: true, team: true, services: true, testimonial: true, gallery: true, cta: true, footer: true, hero: true, contact: true, form: true, socialmedia: true, bloglist: true, blogPost: true }

/* ─── id helpers ─── */
function getType(id)  { return id.replace(/-\d+$/, '') }
function getLabel(id) {
  const m = id.match(/-(\d+)$/)
  return m ? `${COMPONENT_LABELS[getType(id)]} ${m[1]}` : COMPONENT_LABELS[getType(id)]
}
function generateId(type, currentOrder) {
  const same = currentOrder.filter(id => getType(id) === type)
  if (!same.length) return type
  let max = 1
  same.forEach(id => { const m = id.match(/-(\d+)$/); if (m) max = Math.max(max, +m[1]) })
  return `${type}-${max + 1}`
}

const PRESET_MODES = [
  { key: 'desktop', label: 'Desktop', width: 900 },
  { key: 'tablet',  label: 'Tablet',  width: 768 },
  { key: 'mobile',  label: 'Mobile',  width: 390 },
]
const PRESET_WIDTHS = { desktop: 900, tablet: 768, mobile: 390 }

/* ─── theme tokens ─── */
function tokens(isDark) {
  return isDark ? {
    shell:        '#0f0f0f',
    panel:        '#1a1a1a',
    border:       '#2a2a2a',
    toolbarBorder:'#1e1e1e',
    canvasBg:     '#0f0f0f',
    dotColor:     '#2a2a2a',
    card:         '#0f0f11',
    cardShadow:   '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
    urlBarBorder: '#2a2a2a',
    textMuted:    '#888',
    textActive:   '#ffffff',
    textLabel:    '#444',
    textVersion:  '#333',
    activeItemBg: '#1e1e2e',
    activeBorder: '#6366f1',
    hoverBg:      '#222222',
    canvasLabel:  '#333',
    modeBtnHover: 'rgba(255,255,255,0.06)',
    phoneShell:   '#1a1a1a',
    phoneAccent:  '#2a2a2a',
  } : {
    shell:        '#f4f4f5',
    panel:        '#ffffff',
    border:       '#e4e4e7',
    toolbarBorder:'#e4e4e7',
    canvasBg:     '#e4e4e7',
    dotColor:     '#c4c4c8',
    card:         '#ffffff',
    cardShadow:   '0 8px 40px rgba(0,0,0,0.12)',
    urlBarBorder: '#d4d4d8',
    textMuted:    '#71717a',
    textActive:   '#111111',
    textLabel:    '#71717a',
    textVersion:  '#a1a1aa',
    activeItemBg: '#eef2ff',
    activeBorder: '#6366f1',
    hoverBg:      '#f4f4f5',
    canvasLabel:  '#a1a1aa',
    modeBtnHover: 'rgba(0,0,0,0.05)',
    phoneShell:   '#d4d4d8',
    phoneAccent:  '#c4c4c8',
  }
}

/* ─── icons ─── */
function IconHamburger({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect y="2"  width="16" height="1.5" rx="0.75" fill={color} />
      <rect y="7"  width="16" height="1.5" rx="0.75" fill={color} />
      <rect y="12" width="16" height="1.5" rx="0.75" fill={color} />
    </svg>
  )
}
function IconMoon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function IconSun({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  )
}
function IconEye({ color, crossed }) {
  return crossed ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function IconChevronUp({ color }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}
function IconChevronDown({ color }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}


function IconBtn({ onClick, title, disabled, children, t, style }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        background: 'none',
        border: `1px solid ${t.border}`,
        borderRadius: '5px',
        padding: '3px 5px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.25 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ─── canvas resize handle (the vertical bar on left/right of canvas) ─── */
function DragHandle({ side, onMouseDown, t, active }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '16px',
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'ew-resize',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '4px',
        height: '48px',
        borderRadius: '2px',
        background: active || hovered ? '#6366f1' : t.border,
        transition: 'background 0.15s',
      }} />
    </div>
  )
}

/* ─── fallback for unknown section types ─── */
function UnknownSection({ type }) {
  return (
    <div style={{
      padding:    '14px 20px',
      background: '#fef3c7',
      border:     '1px dashed #f59e0b',
      color:      '#92400e',
      fontFamily: 'monospace',
      fontSize:   '13px',
    }}>
      ⚠ Unknown section type: &quot;{type}&quot;
    </div>
  )
}

/* ─── non-sortable wrapper for global sections (announcement/navbar/footer) ─── */
function GlobalCanvasItem({ id, selectedComponent, onSelect, editable, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editable && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', zIndex: 10,
          cursor: 'default',
        }}>
          <span style={{ color: '#6366f1', fontSize: '16px', lineHeight: 1, userSelect: 'none', textShadow: '0 1px 4px rgba(99,102,241,0.4)' }}>⠿</span>
        </div>
      )}
      <div onClick={e => { if (e.target.closest('button, a')) return; onSelect(id) }} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </div>
  )
}

/* ─── shell ─── */
function Shell({
  selectedComponent, setSelectedComponent,
  leftOpen, setLeftOpen,
  rightOpen, setRightOpen,
  visibility, setVisibility,
}) {
  const { theme, addSection, removeSection, updateSection, updatePageOrder, removeSectionFromAllPages, updateGlobalTheme } = useTheme()
  const isDark = theme.globalTheme.darkMode ?? false

  /* Derive active page order from store */
  const activePageId = theme.pages?.activePage
  const isHomePage   = activePageId === 'home'
  const activePage   = theme.pages?.list?.find(p => p.id === activePageId)
  const order = activePage?.sections ?? []
  function setOrder(v) {
    const next = typeof v === 'function' ? v(order) : v
    updatePageOrder(activePageId, next)
  }

  /* Global sections always sourced from home page */
  const homeSections    = theme.pages?.list?.find(p => p.id === 'home')?.sections ?? []
  const announcementKeys = homeSections.filter(k => getType(k) === 'announcement')
  const navbarKeys       = homeSections.filter(k => getType(k) === 'navbar')
  const footerKeys       = homeSections.filter(k => getType(k) === 'footer')
  const t = tokens(isDark)

  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [addSectionOpen,   setAddSectionOpen]   = useState(false)
  const [leftTab,          setLeftTab]          = useState('components')
  const [editorTab,        setEditorTab]        = useState('content')

  const [isTooNarrow, setIsTooNarrow] = useState(() => window.innerWidth < 1000)
  useEffect(() => {
    function check() { setIsTooNarrow(window.innerWidth < 1000) }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setConfirmingRemove(false) }, [selectedComponent])

  useEffect(() => {
    theme.pages?.list?.forEach(page => {
      page.sections?.forEach(key => {
        const type = getType(key)
        if (!(type in INITIAL_VISIBILITY)) {
          console.warn(`[ThemeBuilder] Unknown section type "${type}" found in page "${page.id}"`)
        }
      })
    })
  }, [theme.pages])

  /* canvas width resizing (renamed from isDragging to avoid conflict with dnd-kit) */
  const [previewMode, setPreviewMode] = useState('desktop')
  const [customWidth,  setCustomWidth]  = useState(null)
  const [isResizing,   setIsResizing]   = useState(false)
  const resizeRef = useRef({ startX: 0, startWidth: 0, side: 'right' })

  const currentWidth    = previewMode ? PRESET_WIDTHS[previewMode] : (customWidth ?? 900)
  const isMobileView    = previewMode === 'mobile' || currentWidth < 500
  const widthTransition = isResizing ? 'none' : 'width 0.3s ease'
  const allTransition   = 'all 0.2s ease'
  const panelTransition = 'width 0.25s ease, opacity 0.25s ease'

  function startResize(e, side) {
    e.preventDefault()
    resizeRef.current = { startX: e.clientX, startWidth: currentWidth, side }
    setPreviewMode(null)
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return
    function onMove(e) {
      const { startX, startWidth, side } = resizeRef.current
      const delta = e.clientX - startX
      const raw   = side === 'right' ? startWidth + delta : startWidth - delta
      setCustomWidth(Math.max(320, Math.min(raw, 1400)))
    }
    function onUp() { setIsResizing(false) }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [isResizing])

  /* reorder helpers */
  function moveUp(index) {
    if (index === 0) return
    const next = [...order]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setOrder(next)
  }
  function moveDown(index) {
    if (index === order.length - 1) return
    const next = [...order]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setOrder(next)
  }
  function toggleVisibility(key) {
    setVisibility(v => ({ ...v, [key]: !v[key] }))
  }

  /* instance management */
  function addItem(type, afterId = null) {
    const newId = generateId(type, order)
    addSection(newId)
    setVisibility(v => ({ ...v, [newId]: true }))
    if (afterId !== null && order.includes(afterId)) {
      const idx = order.indexOf(afterId)
      setOrder(prev => [...prev.slice(0, idx + 1), newId, ...prev.slice(idx + 1)])
    } else {
      setOrder(prev => [...prev, newId])
    }
    return newId
  }

  function removeItem(id) {
    removeSection(id)
    setVisibility(v => { const n = { ...v }; delete n[id]; return n })
    removeSectionFromAllPages(id)
    if (selectedComponent === id) setSelectedComponent(null)
  }

  function duplicateItem(id) {
    addItem(getType(id), id)
  }

  /* dnd-kit — single DndContext wraps everything */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeId, setActiveId] = useState(null)

  function handleDragStart({ active }) {
    setActiveId(String(active.id))
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const aid = String(active.id)
    const oid = String(over.id)

    if (aid.startsWith('panel__')) {
      /* ── Panel list reorder ── */
      const realActive = aid.replace('panel__', '')
      const realOver   = oid.replace('panel__', '')
      if (realActive !== realOver && order.includes(realActive) && order.includes(realOver)) {
        setOrder(arrayMove(order, order.indexOf(realActive), order.indexOf(realOver)))
      }
    } else if (aid.startsWith('navlink__')) {
      /* ── Navbar link reorder ── */
      const ai    = parseInt(aid.replace('navlink__', ''), 10)
      const oi    = parseInt(oid.replace('navlink__', ''), 10)
      const links = theme.navbar.data.links ?? []
      if (ai !== oi && ai >= 0 && oi >= 0 && ai < links.length && oi < links.length) {
        updateSection('navbar', 'data', { ...theme.navbar.data, links: arrayMove(links, ai, oi) })
      }
    } else {
      /* ── Canvas reorder ── */
      if (aid !== oid && order.includes(aid) && order.includes(oid)) {
        setOrder(arrayMove(order, order.indexOf(aid), order.indexOf(oid)))
      }
    }
  }

  const dotPattern      = `radial-gradient(circle, ${t.dotColor} 1px, transparent 1px)`
  const visiblePageKeys = order.filter(key => {
    if (!visibility[key] || GLOBAL_TYPES.has(getType(key))) return false
    return true
  })

  function selectionStyle(key) {
    return {
      outline:      selectedComponent === key ? '2px solid #6366f1' : '2px solid transparent',
      boxShadow:    selectedComponent === key ? '0 0 0 4px #6366f133, 0 4px 24px #6366f166' : 'none',
      borderRadius: '3px',
      transition:   'outline 0.15s ease, box-shadow 0.15s ease',
      overflow:     'visible',
      position:     'relative',
      zIndex:       selectedComponent === key ? 1 : 0,
    }
  }

  function renderGlobalKeys(keys) {
    return keys.filter(k => visibility[k]).map(key => (
      <GlobalCanvasItem
        key={key}
        id={key}
        selectedComponent={selectedComponent}
        onSelect={setSelectedComponent}
        editable={isHomePage}
      >
        <div style={selectionStyle(key)}>
          <SectionErrorBoundary type={getType(key)}>
              {PREVIEWS[getType(key)] ?? <UnknownSection type={getType(key)} />}
            </SectionErrorBoundary>
        </div>
      </GlobalCanvasItem>
    ))
  }

  /* canvas card contents — no own DndContext, uses parent */
  const cardContents = (
    <>
      {renderGlobalKeys(announcementKeys)}
      {renderGlobalKeys(navbarKeys)}

      <SortableContext items={visiblePageKeys} strategy={verticalListSortingStrategy}>
        {visiblePageKeys.map(key => (
          <SortableCanvasItem
            key={key}
            id={key}
            onSelect={setSelectedComponent}
            onDuplicate={() => duplicateItem(key)}
          >
            <div style={selectionStyle(key)}>
              <SectionErrorBoundary type={getType(key)}>
              {PREVIEWS[getType(key)] ?? <UnknownSection type={getType(key)} />}
            </SectionErrorBoundary>
            </div>
          </SortableCanvasItem>
        ))}
      </SortableContext>

      {renderGlobalKeys(footerKeys)}
    </>
  )

  if (isTooNarrow) {
    return (
      <div style={{
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        height:          '100vh',
        width:           '100vw',
        backgroundColor: '#0f0f0f',
        padding:         '32px 24px',
        boxSizing:       'border-box',
        textAlign:       'center',
        gap:             '20px',
      }}>
        <span style={{ fontSize: '48px', lineHeight: 1 }}>🖥️</span>
        <div style={{
          fontSize:      '18px',
          fontWeight:    '800',
          letterSpacing: '-0.03em',
          color:         '#ffffff',
          fontFamily:    'Inter, sans-serif',
        }}>
          Theme<span style={{ color: '#6366f1' }}>Builder</span>
        </div>
        <p style={{
          color:      'rgba(255,255,255,0.55)',
          fontSize:   '14px',
          lineHeight: '1.6',
          maxWidth:   '280px',
          margin:     0,
          fontFamily: 'Inter, sans-serif',
        }}>
          ThemeBuilder is designed for desktop use. Please open this on a larger screen.
        </p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', height: '100vh', background: t.shell, overflow: 'hidden', transition: allTransition, color: t.textActive }}>

        {/* ══ LEFT PANEL ══ */}
        <nav style={{
          width: leftOpen ? '220px' : '48px',
          flexShrink: 0,
          background: t.panel,
          borderRight: `1px solid ${t.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: panelTransition,
        }}>
          {/* Brand row */}
          <div style={{ padding: '0 8px', height: '49px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <IconBtn onClick={() => setLeftOpen(o => !o)} title="Toggle sidebar" t={t} style={{ border: `1px solid ${t.border}`, padding: '5px 8px' }}>
              <IconHamburger color={t.textMuted} />
            </IconBtn>
            {leftOpen && (
              <span style={{ color: t.textActive, fontSize: '14px', fontWeight: '600', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Theme<span style={{ color: '#6366f1' }}>Builder</span>
              </span>
            )}
          </div>

          {/* ── Collapsed state ── */}
          {!leftOpen && (
            <ul style={{ flex: 1, margin: 0, padding: '8px 6px', listStyle: 'none', overflowY: 'auto', overflowX: 'hidden' }}>
              {order.map((key) => {
                const isActive = selectedComponent === key
                const isVis    = visibility[key]
                return (
                  <li key={key} style={{ marginBottom: '2px' }}>
                    <button
                      onClick={() => setSelectedComponent(key)}
                      title={getLabel(key)}
                      style={{
                        width: '100%', textAlign: 'center', padding: '8px 0',
                        borderRadius: '6px', border: 'none',
                        background: isActive ? t.activeItemBg : 'transparent',
                        color: isActive ? t.textActive : t.textMuted,
                        fontSize: '10px', fontWeight: isActive ? '500' : '400',
                        cursor: 'pointer', transition: allTransition,
                        fontFamily: 'Inter, sans-serif', opacity: isVis ? 1 : 0.4,
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.hoverBg }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      {COMPONENT_LABELS[getType(key)].slice(0, 2)}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {/* ── Expanded state: TABS + TAB CONTENT ── */}
          {leftOpen && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Tab bar */}
              <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
                {[['components', 'Components'], ['theme', 'Theme'], ['pages', 'Pages']].map(([key, label]) => {
                  const isActive = leftTab === key
                  return (
                    <button
                      key={key}
                      onClick={() => setLeftTab(key)}
                      style={{
                        flex: 1, padding: '9px 0',
                        border: 'none', borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                        background: isActive ? `${t.activeItemBg}` : 'transparent',
                        color: isActive ? '#6366f1' : t.textMuted,
                        fontSize: '11px', fontWeight: isActive ? '600' : '400',
                        cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '-1px',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Components tab */}
              {leftTab === 'components' && (
                <>
                  {/* Add Section button */}
                  <div style={{ padding: '10px 12px', flexShrink: 0, borderBottom: `1px solid ${t.border}` }}>
                    <button
                      onClick={() => setAddSectionOpen(true)}
                      style={{
                        width: '100%', padding: '7px 0',
                        background: '#6366f1', border: 'none',
                        borderRadius: '6px', color: '#fff',
                        fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#6366f1' }}
                    >
                      <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> Add Section
                    </button>
                  </div>

                  {/* ON CANVAS section */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 16px 4px', flexShrink: 0 }}>
                      <span style={{ color: t.textLabel, fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        On Canvas
                      </span>
                    </div>
                    <ul style={{ flex: 1, margin: 0, padding: '0 8px', listStyle: 'none', overflowY: 'auto', overflowX: 'hidden' }}>
                      <SortableContext items={order.map(k => `panel__${k}`)} strategy={verticalListSortingStrategy}>
                        {order.map((key) => (
                          <SortablePanelItem
                            key={key}
                            id={key}
                            label={getLabel(key)}
                            typeColor={TYPE_COLORS[getType(key)] ?? '#6366f1'}
                            isActive={selectedComponent === key}
                            isVis={visibility[key]}
                            t={t}
                            onSelect={() => setSelectedComponent(key)}
                            onToggleVisibility={() => toggleVisibility(key)}
                          />
                        ))}
                      </SortableContext>
                    </ul>
                  </div>
                </>
              )}

              {/* Theme tab */}
              {leftTab === 'theme' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <GlobalThemePanel />
                </div>
              )}

              {/* Pages tab */}
              {leftTab === 'pages' && (
                <PagesPanel t={t} />
              )}

            </div>
          )}

          {leftOpen && (
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
              <span style={{ color: t.textVersion, fontSize: '11px' }}>v0.1.0 · {isDark ? 'dark' : 'light'} mode</span>
            </div>
          )}
        </nav>

        {/* ══ CENTER PANEL ══ */}
        <main style={{
          flex: 1, background: t.canvasBg,
          backgroundImage: dotPattern, backgroundSize: '20px 20px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', transition: allTransition, position: 'relative',
        }}>

          {/* Toolbar */}
          <div style={{
            padding: '0 12px', height: '49px',
            display: 'flex', alignItems: 'center', gap: '10px',
            borderBottom: `1px solid ${t.toolbarBorder}`,
            flexShrink: 0, background: t.panel, transition: allTransition,
          }}>
            {/* Browser dots */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
            </div>

            {/* Mode switcher */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <div style={{
                display: 'flex', background: t.canvasBg,
                border: `1px solid ${t.border}`, borderRadius: '8px', padding: '3px', gap: '2px',
              }}>
                {PRESET_MODES.map(({ key, label, width }) => {
                  const isActive = previewMode === key
                  return (
                    <button
                      key={key}
                      onClick={() => { setPreviewMode(key); setCustomWidth(null) }}
                      style={{
                        padding: '4px 12px', borderRadius: '5px', border: 'none',
                        background: isActive ? '#6366f1' : 'transparent',
                        color: isActive ? '#ffffff' : t.textMuted,
                        fontSize: '12px', fontWeight: isActive ? '500' : '400',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.modeBtnHover }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                      title={`${label} — ${width}px`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <IconBtn onClick={() => updateGlobalTheme('darkMode', !isDark)} title="Toggle theme" t={t} style={{ border: `1px solid ${t.border}`, padding: '5px 8px' }}>
                {isDark ? <IconSun color={t.textMuted} /> : <IconMoon color={t.textMuted} />}
              </IconBtn>
              <button
                onClick={() => window.open('/preview', '_blank')}
                style={{
                  background: 'transparent', color: t.textMuted, border: `1px solid ${t.border}`,
                  borderRadius: '6px', padding: '6px 12px',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.15s, color 0.15s',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = t.textActive }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted }}
                title="Preview (fullscreen)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Preview
              </button>
              <SaveButton />
              <button
                onClick={() => exportJSON(theme)}
                style={{
                  background: '#6366f1', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
              >
                Export JSON
              </button>
              <IconBtn onClick={() => setRightOpen(o => !o)} title="Toggle editor" t={t} style={{ border: `1px solid ${t.border}`, padding: '5px 8px' }}>
                <IconHamburger color={t.textMuted} />
              </IconBtn>
            </div>
          </div>

          {/* Canvas scroll area */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 0 40px', position: 'relative' }}>

            {/* Floating resize width label */}
            {isResizing && (
              <div style={{
                position: 'sticky', top: 0, zIndex: 20,
                display: 'flex', justifyContent: 'center',
                pointerEvents: 'none', marginBottom: '-28px',
              }}>
                <div style={{
                  background: '#6366f1', color: '#fff',
                  fontSize: '11px', fontWeight: '600',
                  padding: '4px 10px', borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
                }}>
                  {Math.round(currentWidth)}px
                </div>
              </div>
            )}

            {/* Canvas label */}
            <div style={{
              maxWidth: `${currentWidth}px`, margin: '0 auto 8px',
              padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px',
              transition: widthTransition,
            }}>
              <span style={{ color: t.canvasLabel, fontSize: '11px', fontWeight: '500', letterSpacing: '0.04em', userSelect: 'none' }}>
                Preview — {isDark ? 'Dark' : 'Light'}
              </span>
              <span style={{ color: t.canvasLabel, opacity: 0.5, fontSize: '11px' }}>·</span>
              <span style={{ color: t.canvasLabel, fontSize: '11px', opacity: 0.7 }}>
                {theme.pages?.list?.find(p => p.id === activePageId)?.label ?? 'Home'}
              </span>
              <span style={{ color: t.canvasLabel, opacity: 0.5, fontSize: '11px' }}>·</span>
              <span style={{ color: t.canvasLabel, fontSize: '11px', opacity: 0.7 }}>
                {Math.round(currentWidth)}px
              </span>
              <span style={{ color: t.canvasLabel, opacity: 0.5, fontSize: '11px' }}>·</span>
              <span style={{ color: t.canvasLabel, fontSize: '11px', opacity: 0.5 }}>
                {order.filter(k => visibility[k]).length}/{order.length} visible
              </span>
            </div>

            {/* Resize handles + card row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 4px' }}>
              <DragHandle side="left"  onMouseDown={e => startResize(e, 'left')}  t={t} active={isResizing} />

              {/* Card wrapper */}
              <div style={{ width: `${currentWidth}px`, maxWidth: '100%', transition: widthTransition, flexShrink: 0 }}>
                {isMobileView ? (
                  <div style={{
                    background: t.phoneShell, borderRadius: '44px', padding: '16px 10px',
                    boxShadow: `inset 0 0 0 2px ${t.phoneAccent}, 0 24px 80px rgba(0,0,0,0.5)`,
                    transition: widthTransition,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                      <div style={{ width: '64px', height: '6px', background: t.phoneAccent, borderRadius: '3px' }} />
                    </div>
                    <div style={{
                      background: t.card, borderRadius: '28px', overflow: 'hidden',
                      boxShadow: `inset 0 0 0 1px ${t.phoneAccent}`,
                    }}>
                      {cardContents}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <div style={{ width: '88px', height: '4px', background: t.phoneAccent, borderRadius: '2px' }} />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: t.card, borderRadius: '16px',
                    boxShadow: t.cardShadow, overflow: 'hidden', transition: allTransition,
                  }}>
                    {cardContents}
                  </div>
                )}
              </div>

              <DragHandle side="right" onMouseDown={e => startResize(e, 'right')} t={t} active={isResizing} />
            </div>
          </div>

          {/* Reopen tab for right panel */}
          {!rightOpen && (
            <button
              onClick={() => setRightOpen(true)}
              title="Open editor"
              style={{
                position: 'absolute', right: 0, top: '50%',
                transform: 'translateY(-50%)',
                background: t.panel, border: `1px solid ${t.border}`,
                borderRight: 'none', borderRadius: '6px 0 0 6px',
                padding: '10px 6px', cursor: 'pointer',
                color: t.textMuted, fontSize: '12px',
                display: 'flex', alignItems: 'center', transition: allTransition,
              }}
            >
              ‹
            </button>
          )}
        </main>

        {/* ══ RIGHT PANEL ══ */}
        <aside style={{
          width: rightOpen ? '300px' : '0px',
          flexShrink: 0, background: t.panel,
          borderLeft: rightOpen ? `1px solid ${t.border}` : 'none',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', transition: panelTransition,
        }}>
          <div style={{
            padding: '0 16px', height: '49px',
            borderBottom: `1px solid ${t.border}`,
            flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px',
          }}>
            <span style={{ color: t.textActive, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Editor
            </span>
            <span style={{ color: t.textMuted, fontSize: '11px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
              {theme.pages?.list?.find(p => p.id === activePageId)?.label ?? 'Home'}
              {selectedComponent && (
                <> <span style={{ opacity: 0.5 }}>›</span> {getLabel(selectedComponent)}</>
              )}
            </span>
          </div>
          {/* Editor tab bar */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
            {[['content', 'Content'], ['style', 'Style']].map(([key, label]) => {
              const isActive = editorTab === key
              return (
                <button
                  key={key}
                  onClick={() => setEditorTab(key)}
                  style={{
                    flex: 1, padding: '9px 0',
                    border: 'none', borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                    background: isActive ? `${t.activeItemBg}` : 'transparent',
                    color: isActive ? '#6366f1' : t.textMuted,
                    fontSize: '11px', fontWeight: isActive ? '600' : '400',
                    cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '-1px',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div
            className="builder-panel"
            data-theme={isDark ? 'dark' : 'light'}
            style={{ flex: 1, overflowY: 'auto' }}
          >
            {selectedComponent && BUILDERS[getType(selectedComponent)]
              ? cloneElement(BUILDERS[getType(selectedComponent)], { activeTab: editorTab })
              : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span style={{ color: t.textMuted, fontSize: '13px', whiteSpace: 'nowrap' }}>← Select a component to edit</span>
                </div>
              )
            }
          </div>

          {/* Remove Section footer — hidden for global sections on non-home pages */}
          {selectedComponent && (isHomePage || !GLOBAL_TYPES.has(getType(selectedComponent))) && (
            <div style={{ flexShrink: 0, borderTop: `1px solid ${t.border}`, padding: '12px 16px' }}>
              {!confirmingRemove ? (
                <button
                  onClick={() => setConfirmingRemove(true)}
                  style={{
                    width: '100%', padding: '7px 0',
                    background: 'transparent',
                    border: `1px solid ${isDark ? '#3f1f1f' : '#fecaca'}`,
                    borderRadius: '6px',
                    color: isDark ? '#f87171' : '#dc2626',
                    fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  Remove Section
                </button>
              ) : (
                <div style={{
                  background: isDark ? '#1f1212' : '#fff5f5',
                  border: `1px solid ${isDark ? '#3f1f1f' : '#fecaca'}`,
                  borderRadius: '8px', padding: '12px',
                }}>
                  <p style={{
                    margin: '0 0 10px', fontSize: '12px', lineHeight: '1.5',
                    color: isDark ? '#fca5a5' : '#991b1b',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Are you sure you want to remove this section? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        removeItem(selectedComponent)
                        setConfirmingRemove(false)
                      }}
                      style={{
                        flex: 1, padding: '6px 0',
                        background: '#dc2626', border: 'none',
                        borderRadius: '5px', color: '#fff',
                        fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#dc2626' }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmingRemove(false)}
                      style={{
                        flex: 1, padding: '6px 0',
                        background: 'transparent',
                        border: `1px solid ${t.border}`,
                        borderRadius: '5px',
                        color: t.textMuted,
                        fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = t.hoverBg }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

      </div>

      <DragOverlay dropAnimation={null} />

      {/* ── Add Section modal ── */}
      {addSectionOpen && (
        <div
          onClick={() => setAddSectionOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: t.panel,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '20px',
              width: '340px',
              boxShadow: isDark
                ? '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
                : '0 24px 80px rgba(0,0,0,0.18)',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: t.textActive, fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                Add Section
              </span>
              <button
                onClick={() => setAddSectionOpen(false)}
                style={{
                  background: 'none', border: 'none',
                  color: t.textMuted, fontSize: '16px',
                  cursor: 'pointer', lineHeight: 1, padding: '2px 4px',
                  borderRadius: '4px',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = t.textActive }}
                onMouseLeave={e => { e.currentTarget.style.color = t.textMuted }}
              >
                ✕
              </button>
            </div>

            {/* Component type grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ALL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => { addItem(type); setAddSectionOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px',
                    background: t.canvasBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = TYPE_COLORS[type] ?? '#6366f1'
                    e.currentTarget.style.background  = t.hoverBg
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = t.border
                    e.currentTarget.style.background  = t.canvasBg
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: TYPE_COLORS[type] ?? '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif',
                  }}>
                    {COMPONENT_LABELS[type][0]}
                  </div>
                  <span style={{ color: t.textMuted, fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                    {COMPONENT_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </DndContext>
  )
}

/* ─── root ─── */
export default function App() {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [leftOpen,    setLeftOpen]    = useState(true)
  const [rightOpen,   setRightOpen]   = useState(true)
  const [visibility,  setVisibility]  = useState(INITIAL_VISIBILITY)

  return (
    <SelectionContext.Provider value={selectedComponent}>
      <Shell
        selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}
        leftOpen={leftOpen}     setLeftOpen={setLeftOpen}
        rightOpen={rightOpen}   setRightOpen={setRightOpen}
        visibility={visibility} setVisibility={setVisibility}
      />
    </SelectionContext.Provider>
  )
}
