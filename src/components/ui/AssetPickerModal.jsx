import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme, useAssets } from '../../store/themeStore.jsx'
import { tokens } from '../../utils/tokens.js'

export default function AssetPickerModal({ onSelect, onClose, onUploadNew }) {
  const { theme } = useTheme()
  const { assets } = useAssets()
  const isDark = theme.globalTheme?.darkMode ?? false
  const t = tokens(isDark)

  const fileInputRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    onUploadNew(file)
    e.target.value = ''
  }

  const modal = (
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        background:      'rgba(0,0,0,0.6)',
        zIndex:          9999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '24px',
      }}
    >
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:        '100%',
          maxWidth:     '560px',
          maxHeight:    '70vh',
          background:   t.panel,
          border:       `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow:    isDark
            ? '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 24px 80px rgba(0,0,0,0.18)',
          display:      'flex',
          flexDirection:'column',
          overflow:     'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding:        '14px 16px',
          borderBottom:   `1px solid ${t.border}`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexShrink:     0,
        }}>
          <span style={{
            color:      t.textActive,
            fontSize:   '14px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
          }}>
            Choose an Asset
          </span>
          <button
            onClick={onClose}
            style={{
              background:   'none',
              border:       'none',
              color:        t.textMuted,
              fontSize:     '16px',
              cursor:       'pointer',
              lineHeight:   1,
              padding:      '2px 5px',
              borderRadius: '4px',
              fontFamily:   'Inter, sans-serif',
              transition:   'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = t.textActive }}
            onMouseLeave={e => { e.currentTarget.style.color = t.textMuted }}
          >
            ✕
          </button>
        </div>

        {/* Upload strip */}
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width:          '100%',
              padding:        '8px 0',
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
            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> Upload New Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Scrollable grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {assets.length === 0 ? (
            <div style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '6px',
              padding:        '40px 16px',
              textAlign:      'center',
            }}>
              <span style={{ color: t.textMuted,  fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                No assets yet.
              </span>
              <span style={{ color: t.textLabel, fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                Use &quot;Upload New Image&quot; above to add your first asset.
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {assets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => { onSelect(asset.dataUrl); onClose() }}
                  onMouseEnter={() => setHoveredId(asset.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    border:       `1px solid ${hoveredId === asset.id ? '#6366f1' : t.border}`,
                    borderRadius: '8px',
                    overflow:     'hidden',
                    background:   t.canvasBg,
                    cursor:       'pointer',
                    transition:   'border-color 0.15s',
                    display:      'flex',
                    flexDirection:'column',
                  }}
                >
                  {/* Square thumbnail */}
                  <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: t.hoverBg }}>
                    <img
                      src={asset.dataUrl}
                      alt={asset.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  {/* File name */}
                  <div style={{ padding: '5px 7px' }}>
                    <span style={{
                      display:      'block',
                      fontSize:     '10px',
                      color:        t.textMuted,
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                      fontFamily:   'Inter, sans-serif',
                    }}>
                      {asset.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
