import { useRef, useState } from 'react'
import { useAssets } from '../../store/themeStore.jsx'

export default function AssetsPanel({ t }) {
  const { assets, addAsset, deleteAsset, renameAsset } = useAssets()
  const fileInputRef = useRef(null)

  const [hoveredId,   setHoveredId]   = useState(null)
  const [editingId,   setEditingId]   = useState(null)
  const [editingName, setEditingName] = useState('')

  function handleInputChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => addAsset({ name: file.name, dataUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function startRename(asset) {
    setEditingId(asset.id)
    setEditingName(asset.name)
  }

  function commitRename() {
    if (editingId && editingName.trim()) {
      renameAsset(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  function handleRenameKeyDown(e) {
    if (e.key === 'Enter')  commitRename()
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Section label */}
      <div style={{ padding: '10px 16px 4px', flexShrink: 0 }}>
        <span style={{ color: t.textLabel, fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Assets
        </span>
      </div>

      {/* Scrollable grid area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px 8px' }}>
        {assets.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '6px', padding: '32px 16px',
            textAlign: 'center',
          }}>
            <span style={{ color: t.textMuted, fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
              No assets yet.
            </span>
            <span style={{ color: t.textLabel, fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
              Upload an image to get started.
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingBottom: '8px' }}>
            {assets.map(asset => (
              <div
                key={asset.id}
                onMouseEnter={() => setHoveredId(asset.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  border:       `1px solid ${t.border}`,
                  borderRadius: '8px',
                  overflow:     'hidden',
                  background:   t.canvasBg,
                  display:      'flex',
                  flexDirection:'column',
                  transition:   'border-color 0.15s',
                  ...(hoveredId === asset.id ? { borderColor: '#6366f1' } : {}),
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: t.hoverBg }}>
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Delete button — visible only on card hover */}
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    title="Delete asset"
                    style={{
                      position:       'absolute',
                      top:            '5px',
                      right:          '5px',
                      width:          '20px',
                      height:         '20px',
                      borderRadius:   '4px',
                      border:         'none',
                      background:     'rgba(0,0,0,0.5)',
                      color:          '#fff',
                      fontSize:       '11px',
                      lineHeight:     1,
                      cursor:         'pointer',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      padding:        0,
                      opacity:        hoveredId === asset.id ? 1 : 0,
                      transition:     'opacity 0.15s, background 0.15s',
                      pointerEvents:  hoveredId === asset.id ? 'auto' : 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)' }}
                  >
                    ✕
                  </button>
                </div>

                {/* File name — double-click to rename */}
                <div style={{ padding: '5px 7px' }}>
                  {editingId === asset.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={handleRenameKeyDown}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width:        '100%',
                        boxSizing:    'border-box',
                        background:   'transparent',
                        border:       '1px solid #6366f1',
                        borderRadius: '4px',
                        color:        t.textActive,
                        fontSize:     '10px',
                        padding:      '1px 4px',
                        outline:      'none',
                        fontFamily:   'Inter, sans-serif',
                        minWidth:     0,
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={e => { e.stopPropagation(); startRename(asset) }}
                      title={`${asset.name} — double-click to rename`}
                      style={{
                        display:      'block',
                        fontSize:     '10px',
                        color:        t.textMuted,
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace:   'nowrap',
                        fontFamily:   'Inter, sans-serif',
                        cursor:       'text',
                        userSelect:   'none',
                      }}
                    >
                      {asset.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload button footer */}
      <div style={{ padding: '10px 12px', flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
        <button
          onClick={() => fileInputRef.current?.click()}
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
          <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      </div>

    </div>
  )
}
