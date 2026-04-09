import { useTheme } from '../../store/themeStore.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { parsePx } from '../../utils/style.js'
import { headingStyle, subheadingStyle } from '../../utils/typography.js'

export default function CTAPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.cta
  const { globalTheme } = theme
  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const textAlign  = template.textAlign   || 'center'
  const fontSize   = parsePx(template.fontSize    || globalTheme.bodySize || '16px')
  const textColor  = template.textColor   || '#111827'

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const sectionStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    padding:         isMobile ? '32px 20px' : (template.padding || '64px 32px'),
    width:           '100%',
    boxSizing:       'border-box',
    textAlign,
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const hStyle = {
    ...headingStyle({ template, globalTheme, textColor }),
    fontSize:      isMobile ? '24px' : (template.headingSize || globalTheme.headingSize || `${Math.round(fontSize * 2)}px`),
    letterSpacing: '-0.02em',
    margin:        '0 0 12px',
    textAlign,
  }
  const sStyle = {
    ...subheadingStyle({ template, globalTheme, textColor, fontSize }),
    fontSize:  isMobile ? '14px' : (template.bodySize || globalTheme.bodySize || `${Math.round(fontSize * 1.1)}px`),
    opacity:   0.7,
    textAlign,
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
    fontSize:        `${fontSize}px`,
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
    fontSize:        `${fontSize}px`,
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
          <h2 style={hStyle}>{data.heading}</h2>
        )}
        {data.subheading && (
          <p style={sStyle}>{data.subheading}</p>
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
