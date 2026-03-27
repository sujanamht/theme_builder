import { useState, useEffect } from 'react'

const HEX_RE      = /^#[0-9a-fA-F]{6}$/
const VALID_CHARS  = /^#[0-9a-fA-F]{0,6}$/

export default function ColorInput({ label, value, onChange }) {
  const [text,    setText]    = useState((value && HEX_RE.test(value)) ? value.toUpperCase() : '#000000')
  const [invalid, setInvalid] = useState(false)

  // Sync when the external value changes
  useEffect(() => {
    if (value && HEX_RE.test(value)) {
      setText(value.toUpperCase())
      setInvalid(false)
    }
  }, [value])

  function handleTextChange(raw) {
    let next = raw
    if (!next.startsWith('#')) next = '#' + next.replace(/#/g, '')
    if (!VALID_CHARS.test(next)) return   // reject invalid chars silently
    next = next.toUpperCase()
    setText(next)
    if (HEX_RE.test(next)) {
      setInvalid(false)
      onChange(next)
    } else {
      setInvalid(next.length > 1)         // only show error after first char
    }
  }

  function handlePickerChange(e) {
    const hex = e.target.value.toUpperCase()
    setText(hex)
    setInvalid(false)
    onChange(hex)
  }

  const safePickerValue = HEX_RE.test(value) ? value : '#000000'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <span style={{ fontSize: '12px', fontWeight: '500', color: 'inherit' }}>{label}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Native color picker — always reflects last valid color */}
        <input
          type="color"
          value={safePickerValue}
          onChange={handlePickerChange}
          style={{
            width:       '36px',
            height:      '36px',
            padding:     '2px',
            borderRadius:'6px',
            cursor:      'pointer',
            flexShrink:  0,
            boxSizing:   'border-box',
          }}
        />
        {/* Hex text input — inline border wins over CSS class border */}
        <input
          type="text"
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          maxLength={7}
          spellCheck={false}
          style={{
            flex:           1,
            fontFamily:     'monospace',
            textTransform:  'uppercase',
            letterSpacing:  '0.05em',
            outline:        'none',
            color: '#111111',
            // Only override border/shadow when invalid; otherwise let .builder-panel CSS rule apply
            ...(invalid ? {
              border:     '1px solid #ef4444',
              boxShadow:  '0 0 0 2px rgba(239,68,68,0.25)',
            } : {}),
          }}
        />
      </div>
    </div>
  )
}
