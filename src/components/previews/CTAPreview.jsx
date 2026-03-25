import { useTheme } from '../../store/themeStore.jsx'

export default function CTAPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.cta

  const textAlign  = template.textAlign   || 'center'
  const fontSize   = template.fontSize    || '16px'
  const textColor  = template.textColor   || '#111827'

  const sectionStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    padding:         template.padding  || '64px 32px',
    width:           '100%',
    boxSizing:       'border-box',
    textAlign,
  }

  const headingStyle = {
    color:        textColor,
    fontSize:     `calc(${fontSize} * 2)`,
    fontWeight:   '800',
    margin:       '0 0 12px',
    lineHeight:   '1.2',
    letterSpacing:'-0.02em',
  }

  const subheadingStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.1)`,
    opacity:    0.7,
    margin:     '0 0 32px',
    lineHeight: '1.6',
  }

  const btnRowStyle = {
    display:        'flex',
    gap:            '12px',
    justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
    flexWrap:       'wrap',
  }

  const primaryBtnStyle = {
    backgroundColor: template.primaryBtnBg   || '#6366f1',
    color:           template.primaryBtnText  || '#ffffff',
    fontSize,
    fontWeight:      '600',
    padding:         '12px 28px',
    borderRadius:    '8px',
    border:          'none',
    cursor:          'pointer',
    textDecoration:  'none',
    display:         'inline-block',
    lineHeight:      '1',
  }

  const secondaryBtnStyle = {
    backgroundColor: template.secondaryBtnBg   || 'transparent',
    color:           template.secondaryBtnText  || textColor,
    fontSize,
    fontWeight:      '600',
    padding:         '11px 28px',
    borderRadius:    '8px',
    border:          `2px solid ${template.secondaryBtnText || textColor}`,
    cursor:          'pointer',
    textDecoration:  'none',
    display:         'inline-block',
    lineHeight:      '1',
  }

  const hasPrimary   = Boolean(data.primaryButtonText)
  const hasSecondary = Boolean(data.secondaryButtonText)

  return (
    <section style={sectionStyle}>
      {data.heading && (
        <h2 style={headingStyle}>{data.heading}</h2>
      )}
      {data.subheading && (
        <p style={subheadingStyle}>{data.subheading}</p>
      )}
      {(hasPrimary || hasSecondary) && (
        <div style={btnRowStyle}>
          {hasPrimary && (
            <a href={data.primaryButtonUrl || '#'} style={primaryBtnStyle}>
              {data.primaryButtonText}
            </a>
          )}
          {hasSecondary && (
            <a href={data.secondaryButtonUrl || '#'} style={secondaryBtnStyle}>
              {data.secondaryButtonText}
            </a>
          )}
        </div>
      )}
    </section>
  )
}
