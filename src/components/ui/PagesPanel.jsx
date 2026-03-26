import { useState } from 'react'
import { useTheme } from '../../store/themeStore.jsx'

export default function PagesPanel({ t }) {
  const { theme, addPage, deletePage, setActivePage, renamePage } = useTheme()
  const pages      = theme.pages      ?? []
  const activePage = theme.activePage ?? pages[0]?.id

  const [editingId,   setEditingId]   = useState(null)
  const [editingName, setEditingName] = useState('')

  function startRename(page) {
    setEditingId(page.id)
    setEditingName(page.name)
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
                  background: isActive ? t.activeItemBg : 'transparent',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
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

                {/* Name — editable on double-click */}
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
                      border:       `1px solid #6366f1`,
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
                    onDoubleClick={e => { e.stopPropagation(); startRename(page) }}
                    style={{
                      flex:        1,
                      fontSize:    '12px',
                      fontWeight:  isActive ? '500' : '400',
                      color:       isActive ? t.textActive : t.textMuted,
                      overflow:    'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:  'nowrap',
                      minWidth:    0,
                    }}
                    title="Double-click to rename"
                  >
                    {page.name}
                  </span>
                )}

                {/* Delete button */}
                <button
                  disabled={pages.length <= 1}
                  onClick={e => {
                    e.stopPropagation()
                    deletePage(page.id)
                  }}
                  title={pages.length <= 1 ? 'Cannot delete the only page' : 'Delete page'}
                  style={{
                    flexShrink:  0,
                    width:       '18px',
                    height:      '18px',
                    borderRadius:'4px',
                    border:      'none',
                    background:  'transparent',
                    color:       t.textMuted,
                    cursor:      pages.length <= 1 ? 'not-allowed' : 'pointer',
                    opacity:     pages.length <= 1 ? 0.25 : 0.55,
                    fontSize:    '13px',
                    lineHeight:  1,
                    display:     'flex',
                    alignItems:  'center',
                    justifyContent: 'center',
                    padding:     0,
                    fontFamily:  'Inter, sans-serif',
                    transition:  'opacity 0.1s',
                  }}
                  onMouseEnter={e => { if (pages.length > 1) e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { if (pages.length > 1) e.currentTarget.style.opacity = '0.55' }}
                >
                  ×
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Add Page button */}
      <div style={{ padding: '10px 12px', flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
        <button
          onClick={addPage}
          style={{
            width:          '100%',
            padding:        '7px 0',
            background:     'transparent',
            border:         `1px dashed ${t.border}`,
            borderRadius:   '6px',
            color:          t.textMuted,
            fontSize:       '12px',
            fontWeight:     '500',
            cursor:         'pointer',
            fontFamily:     'Inter, sans-serif',
            transition:     'border-color 0.15s, color 0.15s',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '5px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.textMuted }}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> Add Page
        </button>
      </div>
    </div>
  )
}
