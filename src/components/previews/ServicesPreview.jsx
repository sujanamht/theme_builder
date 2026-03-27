import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'
import { hexToRgba } from '../../utils/colorUtils.js'

export default function ServicesPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.services
  const darkMode = useDarkMode()

  const heading     = data.heading    || ''
  const subheading  = data.subheading || ''
  const items       = data.items      || []

  const textColor   = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')
  const accentColor = template.accentColor || '#6366f1'
  const fontSize    = template.fontSize    || '15px'

  const sectionStyle = {
    backgroundColor: template.bgColor  || (darkMode ? '#18181b' : '#f9fafb'),
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
    margin:     '0 0 32px',
    textAlign:  'center',
    lineHeight: '1.6',
  }

  const cardStyle = {
    backgroundColor: template.cardBg       || (darkMode ? '#27272a' : '#ffffff'),
    borderRadius:    template.borderRadius  || '12px',
    border:          darkMode ? '1px solid #3f3f46' : '1px solid #e5e7eb',
    padding:         '24px',
    display:         'flex',
    flexDirection:   'column',
    gap:             '12px',
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
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={24}>
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
        </ResponsiveGrid>
      )}
    </section>
  )
}
