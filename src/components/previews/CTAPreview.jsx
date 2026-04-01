import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'

export default function CTAPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.cta
  const { globalTheme } = theme
  const darkMode = useDarkMode()

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const textAlign  = template.textAlign   || 'center'
  const fontSize   = template.fontSize    || '16px'
  const textColor  = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const sectionStyle = {
    backgroundColor: template.bgColor  || (darkMode ? '#18181b' : '#f9fafb'),
    padding:         isMobile ? '32px 20px' : (template.padding || '64px 32px'),
    width:           '100%',
    boxSizing:       'border-box',
    textAlign,
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const headingStyle = {
    color:         textColor,
    fontSize:      isMobile ? '24px' : `calc(${fontSize} * 2)`,
    fontWeight:    '800',
    margin:        '0 0 12px',
    lineHeight:    '1.2',
    letterSpacing: '-0.02em',
  }

  const subheadingStyle = {
    color:      textColor,
    fontSize:   isMobile ? '14px' : `calc(${fontSize} * 1.1)`,
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
    backgroundColor: template.primaryBtnBg   || globalTheme.primaryColor || '#6366f1',
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
    backgroundColor: template.secondaryBtnBg   || globalTheme.secondaryColor || 'transparent',
    color:           template.secondaryBtnText  || textColor,
    fontSize,
    fontWeight:      '600',
    padding:         '11px 28px',
    borderRadius:    '8px',
    border:          `2px solid ${template.secondaryBtnText || globalTheme.secondaryColor || textColor}`,
    cursor:          'pointer',
    textDecoration:  'none',
    display:         'inline-block',
    lineHeight:      '1',
  }

  const hasPrimary   = Boolean(data.primaryButtonText)
  const hasSecondary = Boolean(data.secondaryButtonText)

  return (
    <section ref={ref} style={sectionStyle}>
      <div style={innerStyle}>
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
      </div>
    </section>
  )
}
