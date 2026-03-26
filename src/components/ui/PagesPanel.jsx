import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../store/themeStore.jsx'

const FIXED_IDS = new Set(['home', 'about', 'contact', 'blog', 'custom'])

const ALL_PAGES = [
  { id: 'home',    label: 'Home'    },
  { id: 'about',   label: 'About'   },
  { id: 'contact', label: 'Contact' },
  { id: 'blog',    label: 'Blog'    },
  { id: 'custom',  label: 'Custom'  },
]

export default function PagesPanel({ t }) {
  const { theme, deletePage, setActivePage, renamePage, addCustomPage } = useTheme()
  const pages      = theme.pages.list
  const activePage = theme.pages.activePage

  const [editingId,   setEditingId]   = useState(null)
  const [editingName, setEditingName] = useState('')
  const [popupOpen,   setPopupOpen]   = useState(false)

  const popupRef  = useRef(null)
  const btnRef    = useRef(null)

  const existingIds   = new Set(pages.map(p => p.id))
  const availablePages = ALL_PAGES.filter(p => !existingIds.has(p.id))
  const allAdded       = availablePages.length === 0

  useEffect(() => {
    if (!popupOpen) return
    function onMouseDown(e) {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) {
        setPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [popupOpen])

  function startRename(page) {
    setEditingId(page.id)
    setEditingName(page.label)
  }

  function commitRename() {
    if (editingId && editingName.trim()) {
      renamePage(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  commitRename()
    if (e.key === 'Escape') setEditingId(null)
  }

  function handleAddPage(page) {
    addCustomPage(page.label)
    setPopupOpen(false)
  }

  const rowBase = {
    display:      'flex',
    alignItems:   'center',
    gap:          '8px',
    padding:      '6px 8px',
    borderRadius: '6px',
    cursor:       'pointer',
    transition:   'background 0.1s',
    userSelect:   'none',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px 4px', flexShrink: 0 }}>
        <span style={{ color: t.textLabel, fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Pages
        </span>
      </div>

      <ul style={{ flex: 1, margin: 0, padding: '0 8px', listStyle: 'none', overflowY: 'auto', overflowX: 'hidden' }}>
        {pages.map(page => {
          const isActive    = page.id === activePage
          const isEditing   = editingId === page.id
          const isDeletable = !FIXED_IDS.has(page.id)

          return (
            <li key={page.id} style={{ marginBottom: '2px' }}>
              <div
                style={{
                  ...rowBase,
                  background:  isActive ? t.activeItemBg : 'transparent',
                  borderLeft:  isActive ? '3px solid #6366f1' : '3px solid transparent',
                  paddingLeft: isActive ? '5px' : '8px',
                }}
                onClick={() => !isEditing && setActivePage(page.id)}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Active dot */}
                <div style={{
                  width:        '6px',
                  height:       '6px',
                  borderRadius: '50%',
                  background:   isActive ? '#6366f1' : t.textMuted,
                  opacity:      isActive ? 1 : 0.35,
                  flexShrink:   0,
                }} />

                {/* Label — editable on double-click for custom pages */}
                {isEditing ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex:         1,
                      background:   'transparent',
                      border:       '1px solid #6366f1',
                      borderRadius: '4px',
                      color:        t.textActive,
                      fontSize:     '12px',
                      padding:      '1px 5px',
                      outline:      'none',
                      fontFamily:   'Inter, sans-serif',
                      minWidth:     0,
                    }}
                  />
                ) : (
                  <span
                    onDoubleClick={e => {
                      e.stopPropagation()
                      if (isDeletable) startRename(page)
                    }}
                    style={{
                      flex:         1,
                      fontSize:     '12px',
                      fontWeight:   isActive ? '500' : '400',
                      color:        isActive ? t.textActive : t.textMuted,
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                      minWidth:     0,
                    }}
                    title={isDeletable ? 'Double-click to rename' : page.label}
                  >
                    {page.label}
                  </span>
                )}

                {/* Edit icon for custom (non-fixed) pages */}
                {isDeletable && !isEditing && (
                  <button
                    onClick={e => { e.stopPropagation(); startRename(page) }}
                    title="Rename page"
                    style={{
                      flexShrink:     0,
                      width:          '18px',
                      height:         '18px',
                      borderRadius:   '4px',
                      border:         'none',
                      background:     'transparent',
                      color:          t.textMuted,
                      cursor:         'pointer',
                      opacity:        0.55,
                      fontSize:       '11px',
                      lineHeight:     1,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      padding:        0,
                      fontFamily:     'Inter, sans-serif',
                      transition:     'opacity 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.55' }}
                  >
                    ✎
                  </button>
                )}

                {/* Delete button — only for non-fixed pages */}
                {isDeletable && (
                  <button
                    onClick={e => { e.stopPropagation(); deletePage(page.id) }}
                    title="Delete page"
                    style={{
                      flexShrink:     0,
                      width:          '18px',
                      height:         '18px',
                      borderRadius:   '4px',
                      border:         'none',
                      background:     'transparent',
                      color:          t.textMuted,
                      cursor:         'pointer',
                      opacity:        0.55,
                      fontSize:       '13px',
                      lineHeight:     1,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      padding:        0,
                      fontFamily:     'Inter, sans-serif',
                      transition:     'opacity 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.55' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Add Page footer */}
      {!allAdded && (
        <div style={{ padding: '10px 12px', flexShrink: 0, borderTop: `1px solid ${t.border}`, position: 'relative' }}>
          <button
            ref={btnRef}
            onClick={() => setPopupOpen(o => !o)}
            style={{
              width:          '100%',
              padding:        '7px 0',
              background:     popupOpen ? t.activeItemBg : 'transparent',
              border:         `1px dashed ${popupOpen ? '#6366f1' : t.border}`,
              borderRadius:   '6px',
              color:          popupOpen ? '#6366f1' : t.textMuted,
              fontSize:       '12px',
              fontWeight:     '500',
              cursor:         'pointer',
              fontFamily:     'Inter, sans-serif',
              transition:     'border-color 0.15s, color 0.15s, background 0.15s',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '5px',
            }}
            onMouseEnter={e => { if (!popupOpen) { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' } }}
            onMouseLeave={e => { if (!popupOpen) { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.textMuted } }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> Add Page
          </button>

          {/* Inline popup */}
          {popupOpen && (
            <div
              ref={popupRef}
              style={{
                position:     'absolute',
                bottom:       'calc(100% + 4px)',
                left:         '12px',
                right:        '12px',
                background:   t.panel,
                border:       `1px solid ${t.border}`,
                borderRadius: '8px',
                boxShadow:    '0 4px 16px rgba(0,0,0,0.3)',
                overflow:     'hidden',
                zIndex:       50,
              }}
            >
              {availablePages.map((page, i) => (
                <button
                  key={page.id}
                  onClick={() => handleAddPage(page)}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '8px',
                    width:      '100%',
                    padding:    '8px 12px',
                    background: 'transparent',
                    border:     'none',
                    borderTop:  i === 0 ? 'none' : `1px solid ${t.border}`,
                    color:      t.textMuted,
                    fontSize:   '12px',
                    fontWeight: '400',
                    cursor:     'pointer',
                    fontFamily: 'Inter, sans-serif',
                    textAlign:  'left',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.hoverBg; e.currentTarget.style.color = t.textActive }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.textMuted, opacity: 0.35, flexShrink: 0 }} />
                  {page.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
