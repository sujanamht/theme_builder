import { useTheme } from '../../store/themeStore.jsx'

const GRID_COLS = { '1': '1fr', '2': '1fr 1fr', '3': '1fr 1fr 1fr' }

function hexToRgba(hex, alpha) {
  const c = hex.replace('#', '')
  if (c.length !== 6) return `rgba(0,0,0,${alpha})`
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function ServicesPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.services

  const heading     = data.heading    || ''
  const subheading  = data.subheading || ''
  const items       = data.items      || []

  const textColor   = template.textColor   || '#111827'
  const accentColor = template.accentColor || '#6366f1'
  const fontSize    = template.fontSize    || '15px'
  const columns     = template.columns     || '3'

  const sectionStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    padding:         template.padding  || '64px 32px',
    width:           '100%',
    boxSizing:       'border-box',
  }

  const headingStyle = {
    color:        textColor,
    fontSize:     `calc(${fontSize} * 1.9)`,
    fontWeight:   '800',
    margin:       '0 0 10px',
    textAlign:    'center',
    lineHeight:   '1.2',
  }

  const subheadingStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.05)`,
    opacity:    0.6,
    margin:     '0 0 40px',
    textAlign:  'center',
    lineHeight: '1.6',
  }

  const gridStyle = {
    display:             'grid',
    gridTemplateColumns: GRID_COLS[columns] || GRID_COLS['3'],
    gap:                 '20px',
  }

  const cardStyle = {
    backgroundColor: template.cardBg       || '#ffffff',
    borderRadius:    template.borderRadius  || '12px',
    padding:         '24px',
    display:         'flex',
    flexDirection:   'column',
    gap:             '12px',
    boxShadow:       '0 1px 4px rgba(0,0,0,0.06)',
  }

  const iconCircleStyle = {
    width:           '44px',
    height:          '44px',
    borderRadius:    '50%',
    background:      hexToRgba(accentColor, 0.15),
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    fontSize:        '20px',
    color:           accentColor,
    flexShrink:      0,
  }

  const titleStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.05)`,
    fontWeight: '700',
    margin:     0,
  }

  const descStyle = {
    color:      textColor,
    fontSize,
    opacity:    0.65,
    margin:     0,
    lineHeight: '1.6',
    flex:       1,
  }

  const linkStyle = {
    color:          accentColor,
    fontSize:       `calc(${fontSize} * 0.9)`,
    fontWeight:     '600',
    textDecoration: 'none',
    marginTop:      'auto',
  }

  const emptyStyle = {
    color:     textColor,
    opacity:   0.3,
    fontSize,
    textAlign: 'center',
    padding:   '24px 0',
  }

  return (
    <section style={sectionStyle}>
      {heading    && <h2 style={headingStyle}>{heading}</h2>}
      {subheading && <p style={subheadingStyle}>{subheading}</p>}

      {items.length === 0 ? (
        <p style={emptyStyle}>No services yet — add some in the editor.</p>
      ) : (
        <div style={gridStyle}>
          {items.map((item, i) => (
            <div key={i} style={cardStyle}>
              {item.icon && (
                <div style={iconCircleStyle}>{item.icon}</div>
              )}
              {item.title && <p style={titleStyle}>{item.title}</p>}
              {item.description && <p style={descStyle}>{item.description}</p>}
              {item.linkText && (
                <a href={item.linkUrl || '#'} style={linkStyle}>
                  {item.linkText} →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
