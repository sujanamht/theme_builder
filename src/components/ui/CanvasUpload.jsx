import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CropOverlay from './CropOverlay.jsx'

function UploadIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

/**
 * Wraps an image area with two visual states:
 *
 * hasImage = false  →  Placeholder (muted bg, dashed border, icon + label).
 *                      Always visible. Clicking uploads when `isActive`,
 *                      otherwise propagates to select the section.
 *
 * hasImage = true   →  Renders children (the actual image) normally.
 *                      When `isActive` + hovered, shows a small "Replace" pill.
 *
 * Props:
 *   hasImage  – boolean
 *   isActive  – whether this section is selected
 *   onUpload  – (dataUrl: string) => void
 *   style     – merged onto the wrapper div (must provide size when hasImage=false)
 *   compact   – true for small targets (avatars): hides text label, smaller icon
 *   shape     – 'rect' (default) | 'circle'
 */
export default function CanvasUpload({
  children,
  hasImage,
  onUpload,
  isActive,
  style,
  compact = false,
  shape = 'rect',
  aspectRatio,
  onCrop,
}) {
  const inputRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [pendingSrc, setPendingSrc] = useState(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (onCrop) {
        setPendingSrc(ev.target.result)
      } else {
        onUpload(ev.target.result)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const borderRadius = shape === 'circle' ? '50%' : 'inherit'

  return (
    <div
      style={{ position: 'relative', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hasImage ? (
        /* ── Placeholder state ── */
        <div
          onClick={e => {
            if (isActive) {
              e.stopPropagation()
              inputRef.current?.click()
            }
            // else: propagate so clicking the section selects it first
          }}
          style={{
            position:        'absolute',
            inset:           0,
            background:      hovered && isActive
              ? 'rgba(99,102,241,0.08)'
              : 'rgba(148,163,184,0.10)',
            border:          `2px dashed ${hovered && isActive
              ? 'rgba(99,102,241,0.50)'
              : 'rgba(148,163,184,0.40)'}`,
            borderRadius,
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            cursor:          isActive ? 'pointer' : 'default',
            gap:             compact ? '2px' : '5px',
            color:           hovered && isActive
              ? 'rgba(99,102,241,0.85)'
              : 'rgba(148,163,184,0.70)',
            transition:      'background 0.15s, border-color 0.15s, color 0.15s',
          }}
        >
          {compact
            ? <span style={{ fontSize: '16px', lineHeight: 1, fontWeight: 300 }}>+</span>
            : <UploadIcon size={18} />
          }
          {!compact && (
            <span style={{
              fontSize:      '10px',
              fontWeight:    500,
              fontFamily:    'Inter, sans-serif',
              letterSpacing: '0.03em',
              whiteSpace:    'nowrap',
            }}>
              Upload image
            </span>
          )}
        </div>
      ) : (
        /* ── Image state ── */
        <>
          {children}

          {isActive && hovered && (
            <button
              onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
              style={{
                position:      'absolute',
                top:           6,
                right:         6,
                zIndex:        10,
                background:    'rgba(0,0,0,0.68)',
                border:        'none',
                borderRadius:  '4px',
                color:         '#fff',
                fontSize:      '10px',
                fontWeight:    600,
                padding:       '3px 8px',
                cursor:        'pointer',
                fontFamily:    'Inter, sans-serif',
                letterSpacing: '0.02em',
                transition:    'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.90)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.68)' }}
            >
              Replace
            </button>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {pendingSrc && createPortal(
        <CropOverlay
          src={pendingSrc}
          aspectRatio={aspectRatio || '16/9'}
          onCrop={url => { onUpload(url); setPendingSrc(null) }}
          onClose={() => setPendingSrc(null)}
        />,
        document.body
      )}
    </div>
  )
}
