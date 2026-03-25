import { useTheme } from '../../store/themeStore.jsx'

export default function FooterPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.footer

  const brand     = data.brand     || 'Brand'
  const tagline   = data.tagline   || ''
  const links     = data.links     || []
  const copyright = data.copyright || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`

  const textColor = template.textColor || '#111827'
  const linkColor = template.linkColor || textColor

  const footerStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    padding:         template.padding  || '40px 32px 24px',
    width:           '100%',
    boxSizing:       'border-box',
    borderTop:       `1px solid ${hexWithAlpha(textColor, 0.2)}`,
  }

  const topRowStyle = {
    display:       'flex',
    alignItems:    'baseline',
    gap:           '12px',
    marginBottom:  links.length > 0 ? '20px' : '0',
    flexWrap:      'wrap',
  }

  const brandStyle = {
    color:      textColor,
    fontSize:   `calc(${template.fontSize || '14px'} * 1.15)`,
    fontWeight: '700',
    margin:     0,
  }

  const taglineStyle = {
    color:    textColor,
    fontSize: template.fontSize || '14px',
    opacity:  0.55,
    margin:   0,
  }

  const linkRowStyle = {
    display:      'flex',
    flexWrap:     'wrap',
    gap:          '4px 24px',
    marginBottom: '24px',
  }

  const linkStyle = {
    color:          linkColor,
    fontSize:       template.fontSize || '14px',
    textDecoration: 'none',
    opacity:        0.8,
  }

  const copyrightStyle = {
    color:     textColor,
    fontSize:  `calc(${template.fontSize || '14px'} * 0.85)`,
    opacity:   0.4,
    textAlign: 'center',
    margin:    0,
    borderTop: `1px solid ${hexWithAlpha(textColor, 0.1)}`,
    paddingTop: '16px',
  }

  return (
    <footer style={footerStyle}>
      {/* Brand + tagline */}
      <div style={topRowStyle}>
        <span style={brandStyle}>{brand}</span>
        {tagline && <span style={taglineStyle}>{tagline}</span>}
      </div>

      {/* Links */}
      {links.length > 0 && (
        <nav style={linkRowStyle}>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url || '#'}
              style={linkStyle}
              target="_blank"
              rel="noreferrer"
            >
              {link.label || `Link ${i + 1}`}
            </a>
          ))}
        </nav>
      )}

      {/* Copyright */}
      <p style={copyrightStyle}>{copyright}</p>
    </footer>
  )
}

/* Convert hex + alpha to rgba for border colors */
function hexWithAlpha(hex, alpha) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return `rgba(0,0,0,${alpha})`
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
