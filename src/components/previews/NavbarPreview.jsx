import { useState, useRef } from 'react'
import { useTheme } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'

function DropdownLink({ link, linkStyle, textColor, fontSize }) {
  const [open, setOpen] = useState(false)
  const dropdown = link.dropdown ?? []
  const hasDropdown = dropdown.length > 0

  const dropdownBoxStyle = {
    position:        'absolute',
    top:             '100%',
    left:            0,
    marginTop:       '6px',
    background:      '#ffffff',
    borderRadius:    '8px',
    boxShadow:       '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
    minWidth:        '160px',
    padding:         '4px 0',
    zIndex:          100,
    listStyle:       'none',
    margin:          '6px 0 0 0',
  }

  const subItemStyle = {
    display:    'block',
    padding:    '8px 16px',
    color:      textColor || '#111827',
    fontSize:   fontSize  || '14px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 0.1s',
  }

  return (
    <li style={{ position: 'relative' }}
      onMouseEnter={() => hasDropdown && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={link.url || '#'}
        style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}
      >
        {link.label || 'Link'}
        {hasDropdown && (
          <span style={{ fontSize: '10px', opacity: 0.6, lineHeight: 1 }}>▾</span>
        )}
      </a>

      {hasDropdown && open && (
        <ul style={dropdownBoxStyle}>
          {dropdown.map((sub, si) => (
            <li key={si}>
              <a
                href={sub.url || '#'}
                style={subItemStyle}
                onMouseEnter={e => e.currentTarget.style.background = '#f4f4f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {sub.label || `Sub-link ${si + 1}`}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function NavbarPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.navbar
  const selectedId = useSelection()
  const isActive = selectedId === 'navbar' || selectedId?.startsWith('navbar-')

  const logo     = data.logo     || ''
  const logoText = data.logoText || ''
  const links    = data.links    || []
  const isImage  = logo.startsWith('http') || logo.startsWith('data:')

  const logoInputRef = useRef()
  const [logoBadgeHovered, setLogoBadgeHovered] = useState(false)

  function handleLogoFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateSection('navbar', 'data', { ...data, logo: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const navStyle = {
    backgroundColor: template.bgColor  || '#ffffff',
    padding:         template.padding  || '12px 24px',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    width:           '100%',
    boxSizing:       'border-box',
    borderBottom:    '1px solid #e5e7eb',
  }

  const logoStyle = {
    color:          template.textColor || '#111827',
    fontSize:       template.fontSize  || '18px',
    fontWeight:     '700',
    textDecoration: 'none',
  }

  const linkListStyle = {
    display:    'flex',
    alignItems: 'center',
    gap:        template.linkSpacing || '24px',
    listStyle:  'none',
    margin:     0,
    padding:    0,
  }

  const linkStyle = {
    color:          template.textColor || '#111827',
    fontSize:       template.fontSize  || '16px',
    textDecoration: 'none',
    cursor:         'pointer',
  }

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isImage ? (
          <CanvasUpload
            hasImage
            isActive={isActive}
            onUpload={v => updateSection('navbar', 'data', { ...data, logo: v })}
            style={{ borderRadius: '6px', flexShrink: 0, height: '36px', width: 'auto', display: 'inline-block' }}
            aspectRatio="1/1"
            onCrop={v => updateSection('navbar', 'data', { ...data, logo: v })}
          >
            <img src={logo} alt={logoText || 'logo'} style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </CanvasUpload>
        ) : (
          <>
            <button
              onClick={() => isActive && logoInputRef.current?.click()}
              onMouseEnter={() => setLogoBadgeHovered(true)}
              onMouseLeave={() => setLogoBadgeHovered(false)}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                padding:      '4px 10px',
                borderRadius: '6px',
                background:   logoBadgeHovered && isActive
                  ? 'rgba(99,102,241,0.12)'
                  : 'rgba(148,163,184,0.15)',
                color:        logoBadgeHovered && isActive
                  ? 'rgba(99,102,241,0.85)'
                  : '#94a3b8',
                fontSize:     '11px',
                fontWeight:   '600',
                letterSpacing:'0.06em',
                cursor:       isActive ? 'pointer' : 'default',
                userSelect:   'none',
                border:       'none',
                fontFamily:   'Inter, sans-serif',
                transition:   'background 0.15s, color 0.15s',
                flexShrink:   0,
                whiteSpace:   'nowrap',
              }}
            >
              LOGO +
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoFile}
            />
            <a href="#" style={logoStyle}>{logoText || 'Brand'}</a>
          </>
        )}
      </div>

      {links.length > 0 && (
        <ul style={linkListStyle}>
          {links.map((link, i) => (
            <DropdownLink
              key={i}
              link={link}
              linkStyle={linkStyle}
              textColor={template.textColor}
              fontSize={template.fontSize}
            />
          ))}
        </ul>
      )}
    </nav>
  )
}
