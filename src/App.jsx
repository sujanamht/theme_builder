import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './store/themeStore.jsx'
import { exportJSON } from './exports/exportJSON.js'
import { useTheme } from './store/themeStore.jsx'
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDraggable,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableCanvasItem from './components/ui/SortableCanvasItem.jsx'
import SortablePanelItem  from './components/ui/SortablePanelItem.jsx'

import AnnouncementBuilder  from './components/builders/AnnouncementBuilder.jsx'
import NavbarBuilder        from './components/builders/NavbarBuilder.jsx'
import TestimonialBuilder   from './components/builders/TestimonialBuilder.jsx'
import CarouselBuilder      from './components/builders/CarouselBuilder.jsx'
import ServicesBuilder      from './components/builders/ServicesBuilder.jsx'
import GalleryBuilder       from './components/builders/GalleryBuilder.jsx'
import CTABuilder           from './components/builders/CTABuilder.jsx'
import FooterBuilder        from './components/builders/FooterBuilder.jsx'

import AnnouncementPreview  from './components/previews/AnnouncementPreview.jsx'
import NavbarPreview        from './components/previews/NavbarPreview.jsx'
import TestimonialPreview   from './components/previews/TestimonialPreview.jsx'
import CarouselPreview      from './components/previews/CarouselPreview.jsx'
import ServicesPreview      from './components/previews/ServicesPreview.jsx'
import GalleryPreview       from './components/previews/GalleryPreview.jsx'
import CTAPreview           from './components/previews/CTAPreview.jsx'
import FooterPreview        from './components/previews/FooterPreview.jsx'

/* ─── registries (keyed by type, not instance id) ─── */
const COMPONENT_LABELS = {
  announcement: 'Announcement',
  navbar:       'Navbar',
  services:     'Services',
  testimonial:  'Testimonial',
  carousel:     'Carousel',
  gallery:      'Gallery',
  cta:          'CTA',
  footer:       'Footer',
}

/* Per-type accent colors for the library badge */
const TYPE_COLORS = {
  announcement: '#f59e0b',
  navbar:       '#6366f1',
  services:     '#10b981',
  testimonial:  '#ec4899',
  carousel:     '#3b82f6',
  gallery:      '#8b5cf6',
  cta:          '#ef4444',
  footer:       '#6b7280',
}

const ALL_TYPES = ['announcement', 'navbar', 'services', 'carousel', 'testimonial', 'gallery', 'cta', 'footer']

const BUILDERS = {
  announcement: <AnnouncementBuilder />,
  navbar:       <NavbarBuilder />,
  services:     <ServicesBuilder />,
  testimonial:  <TestimonialBuilder />,
  carousel:     <CarouselBuilder />,
  gallery:      <GalleryBuilder />,
  cta:          <CTABuilder />,
  footer:       <FooterBuilder />,
}

const PREVIEWS = {
  announcement: <AnnouncementPreview />,
  navbar:       <NavbarPreview />,
  services:     <ServicesPreview />,
  testimonial:  <TestimonialPreview />,
  carousel:     <CarouselPreview />,
  gallery:      <GalleryPreview />,
  cta:          <CTAPreview />,
  footer:       <FooterPreview />,
}

const INITIAL_ORDER      = ['announcement', 'navbar', 'services', 'carousel', 'testimonial', 'gallery', 'cta', 'footer']
const INITIAL_VISIBILITY = { announcement: true, navbar: true, services: true, carousel: true, testimonial: true, gallery: true, cta: true, footer: true }

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
    card:         '#ffffff',
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

/* ─── small icon button ─── */
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

/* ─── library item (draggable from library panel) ─── */
function LibraryItem({ type, instanceCount, t }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib__${type}`,
    data: { source: 'library', type },
  })
  const alreadyOnCanvas = instanceCount > 0

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={alreadyOnCanvas ? `${COMPONENT_LABELS[type]} (${instanceCount} on canvas — drag to add another)` : `Drag to add ${COMPONENT_LABELS[type]}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '5px 6px', borderRadius: '6px',
        opacity: isDragging ? 0.3 : alreadyOnCanvas ? 0.5 : 1,
        cursor: 'grab',
        userSelect: 'none',
        transition: 'background 0.1s, opacity 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = t.hoverBg }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {/* Colored type badge */}
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        background: TYPE_COLORS[type] ?? '#6366f1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif',
      }}>
        {COMPONENT_LABELS[type][0]}
      </div>
      <span style={{ flex: 1, color: t.textMuted, fontSize: '12px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
        {COMPONENT_LABELS[type]}
      </span>
      {instanceCount > 0 && (
        <span style={{
          fontSize: '9px', color: t.textLabel,
          background: t.border, borderRadius: '3px',
          padding: '1px 4px', flexShrink: 0,
          fontFamily: 'Inter, sans-serif',
        }}>
          ×{instanceCount}
        </span>
      )}
      <span style={{ color: t.textLabel, fontSize: '12px', userSelect: 'none', flexShrink: 0 }}>⠿</span>
    </div>
  )
}

/* ─── shell ─── */
function Shell({
  selectedComponent, setSelectedComponent,
  isDark, setIsDark,
  leftOpen, setLeftOpen,
  rightOpen, setRightOpen,
  order, setOrder,
  visibility, setVisibility,
}) {
  const { theme, addSection, removeSection } = useTheme()
  const t = tokens(isDark)

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
    setOrder(prev => prev.filter(k => k !== id))
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

    if (aid.startsWith('lib__')) {
      /* ── Library → Canvas: insert new instance ── */
      const type  = aid.replace('lib__', '')
      const newId = generateId(type, order)
      addSection(newId)
      setVisibility(v => ({ ...v, [newId]: true }))
      if (order.includes(oid)) {
        const idx = order.indexOf(oid)
        setOrder(prev => [...prev.slice(0, idx), newId, ...prev.slice(idx)])
      } else {
        setOrder(prev => [...prev, newId])
      }
    } else if (aid.startsWith('panel__')) {
      /* ── Panel list reorder ── */
      const realActive = aid.replace('panel__', '')
      const realOver   = oid.replace('panel__', '')
      if (realActive !== realOver && order.includes(realActive) && order.includes(realOver)) {
        setOrder(arrayMove(order, order.indexOf(realActive), order.indexOf(realOver)))
      }
    } else {
      /* ── Canvas reorder ── */
      if (aid !== oid && order.includes(aid) && order.includes(oid)) {
        setOrder(arrayMove(order, order.indexOf(aid), order.indexOf(oid)))
      }
    }
  }

  const dotPattern  = `radial-gradient(circle, ${t.dotColor} 1px, transparent 1px)`
  const visibleKeys = order.filter(key => visibility[key])

  /* count instances per type (for library badges) */
  const typeCountMap = {}
  order.forEach(id => { const tp = getType(id); typeCountMap[tp] = (typeCountMap[tp] ?? 0) + 1 })

  /* canvas card contents — no own DndContext, uses parent */
  const cardContents = (
    <SortableContext items={visibleKeys} strategy={verticalListSortingStrategy}>
      {visibleKeys.map(key => (
        <SortableCanvasItem
          key={key}
          id={key}
          onSelect={setSelectedComponent}
          onDelete={() => removeItem(key)}
          onDuplicate={() => duplicateItem(key)}
        >
          {PREVIEWS[getType(key)]}
        </SortableCanvasItem>
      ))}
    </SortableContext>
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', height: '100vh', background: t.shell, overflow: 'hidden', transition: allTransition }}>

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

          {/* ── Expanded state: LIBRARY + ON CANVAS ── */}
          {leftOpen && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* LIBRARY section */}
              <div style={{ flexShrink: 0, borderBottom: `1px solid ${t.border}` }}>
                <div style={{ padding: '10px 16px 4px' }}>
                  <span style={{ color: t.textLabel, fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Library
                  </span>
                </div>
                <div style={{ padding: '2px 8px 6px' }}>
                  {ALL_TYPES.map(type => (
                    <LibraryItem
                      key={type}
                      type={type}
                      instanceCount={typeCountMap[type] ?? 0}
                      t={t}
                    />
                  ))}
                </div>
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
                    {order.map((key, index) => (
                      <SortablePanelItem
                        key={key}
                        id={key}
                        label={getLabel(key)}
                        typeColor={TYPE_COLORS[getType(key)] ?? '#6366f1'}
                        isActive={selectedComponent === key}
                        isVis={visibility[key]}
                        index={index}
                        orderLength={order.length}
                        t={t}
                        onSelect={() => setSelectedComponent(key)}
                        onMoveUp={() => moveUp(index)}
                        onMoveDown={() => moveDown(index)}
                        onToggleVisibility={() => toggleVisibility(key)}
                        onDelete={() => removeItem(key)}
                      />
                    ))}
                  </SortableContext>
                </ul>
              </div>
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
              <IconBtn onClick={() => setIsDark(d => !d)} title="Toggle theme" t={t} style={{ border: `1px solid ${t.border}`, padding: '5px 8px' }}>
                {isDark ? <IconSun color={t.textMuted} /> : <IconMoon color={t.textMuted} />}
              </IconBtn>
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
            flexShrink: 0, display: 'flex', alignItems: 'center',
          }}>
            <span style={{ color: t.textActive, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {selectedComponent ? getLabel(selectedComponent) : 'Editor'}
            </span>
          </div>
          <div
            className="builder-panel"
            data-theme={isDark ? 'dark' : 'light'}
            style={{ flex: 1, overflowY: 'auto' }}
          >
            {selectedComponent && BUILDERS[getType(selectedComponent)]
              ? BUILDERS[getType(selectedComponent)]
              : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span style={{ color: t.textMuted, fontSize: '13px', whiteSpace: 'nowrap' }}>← Select a component to edit</span>
                </div>
              )
            }
          </div>
        </aside>

      </div>

      {/* DragOverlay — shown only when dragging from library */}
      <DragOverlay dropAnimation={null}>
        {activeId?.startsWith('lib__') && (
          <div style={{
            padding: '6px 12px',
            background: TYPE_COLORS[activeId.replace('lib__', '')] ?? '#6366f1',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            cursor: 'grabbing',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            + {COMPONENT_LABELS[activeId.replace('lib__', '')]}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

/* ─── root ─── */
export default function App() {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [isDark,      setIsDark]      = useState(true)
  const [leftOpen,    setLeftOpen]    = useState(true)
  const [rightOpen,   setRightOpen]   = useState(true)
  const [order,       setOrder]       = useState(INITIAL_ORDER)
  const [visibility,  setVisibility]  = useState(INITIAL_VISIBILITY)

  return (
    <ThemeProvider>
      <Shell
        selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}
        isDark={isDark}         setIsDark={setIsDark}
        leftOpen={leftOpen}     setLeftOpen={setLeftOpen}
        rightOpen={rightOpen}   setRightOpen={setRightOpen}
        order={order}           setOrder={setOrder}
        visibility={visibility} setVisibility={setVisibility}
      />
    </ThemeProvider>
  )
}
