import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../store/themeStore.jsx'

const FIXED_IDS = new Set(['home'])


function DeletePageFooter({ activePage, deletePage, t }) {
  const [confirming, setConfirming] = useState(false)
  useEffect(() => { setConfirming(false) }, [activePage])

  if (!confirming) return (
    <div style={{ padding: '6px 12px 0', flexShrink: 0 }}>
      <button
        onClick={() => setConfirming(true)}
        style={{
          width: '100%', padding: '6px 0', background: 'transparent',
          border: `1px solid ${t.border}`, borderRadius: '6px',
          color: t.textMuted, fontSize: '11px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted }}
      >
        Delete Page
      </button>
    </div>
  )

  return (
    <div style={{ padding: '6px 12px 0', flexShrink: 0 }}>
      <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px' }}>
        <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#991b1b', fontFamily: 'Inter, sans-serif' }}>
          Delete this page? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => deletePage(activePage)} style={{ flex: 1, padding: '5px 0', background: '#dc2626', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}>Confirm</button>
          <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: '5px 0', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '4px', color: t.textMuted, fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function PagesPanel({ t }) {
  const { theme, deletePage, setActivePage, renamePage, addCustomPage } = useTheme()
  const pages      = theme.pages.list
  const activePage = theme.pages.activePage

  const [editingId,   setEditingId]   = useState(null)
  const [editingName, setEditingName] = useState('')
  const [popupOpen,   setPopupOpen]   = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [nameError,   setNameError]   = useState('')

  const popupRef  = useRef(null)
  const btnRef    = useRef(null)

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

  function handleAddPage() {
    const name = newPageName.trim()
    if (!name) { setNameError('Page name is required'); return }
    if (pages.some(p => p.label.toLowerCase() === name.toLowerCase())) {
      setNameError('A page with this name already exists'); return
    }
    addCustomPage(name)
    setNewPageName('')
    setNameError('')
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
          const isActive  = page.id === activePage
          const isEditing = editingId === page.id

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
                      startRename(page)
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
                    title="Double-click to rename"
                  >
                    {page.label}
                  </span>
                )}

                {/* Edit icon for all pages */}
                {!isEditing && (
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

              </div>
            </li>
          )
        })}
      </ul>


      {/* Add Page footer */}
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
              <div style={{ padding: '10px' }}>
                <input
                  autoFocus
                  value={newPageName}
                  onChange={e => { setNewPageName(e.target.value); setNameError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddPage(); if (e.key === 'Escape') setPopupOpen(false) }}
                  placeholder="Page name…"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '6px 8px',
                    border: `1px solid ${nameError ? '#ef4444' : t.border}`, borderRadius: '5px',
                    background: t.canvasBg, color: t.textActive, fontSize: '12px',
                    outline: 'none', fontFamily: 'Inter, sans-serif', marginBottom: nameError ? '4px' : '8px',
                  }}
                />
                {nameError && <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#ef4444' }}>{nameError}</p>}
                <button
                  onClick={handleAddPage}
                  style={{
                    width: '100%', padding: '6px 0', background: '#6366f1', border: 'none',
                    borderRadius: '5px', color: '#fff', fontSize: '12px', cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

                {/* Delete page — bottom, confirmation */}
      {pages.find(p => p.id === activePage) && !FIXED_IDS.has(activePage) && (
        <DeletePageFooter activePage={activePage} deletePage={deletePage} t={t} />
      )}

        </div>
    </div>
  )
}
