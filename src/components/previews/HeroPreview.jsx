import { useTheme } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'

export default function HeroPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.hero
  const selectedId = useSelection()
  const isActive = selectedId === 'hero' || selectedId?.startsWith('hero-')

  const textAlign  = template.textAlign || 'center'
  const textColor  = template.textColor || '#ffffff'
  const minHeight  = template.minHeight || '480px'
  const hasBgImage = Boolean(data.bgImage)

  const justifyContent =
    textAlign === 'left'  ? 'flex-start' :
    textAlign === 'right' ? 'flex-end'   : 'center'

  const sectionStyle = {
    position:        'relative',
    width:           '100%',
    minHeight,
    boxSizing:       'border-box',
    backgroundColor: template.bgColor || '#0f172a',
    backgroundImage: hasBgImage ? `url(${data.bgImage})` : 'none',
    backgroundSize:  'cover',
    backgroundPosition: 'center',
    display:         'flex',
    alignItems:      'center',
    justifyContent,
    padding:         '64px 48px',
    textAlign,
    overflow:        'hidden',
  }

  /* Dark scrim so text stays readable over a photo */
  const scrimStyle = {
    position:   'absolute',
    inset:       0,
    background:  hasBgImage
      ? 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 100%)'
      : 'none',
    pointerEvents: 'none',
    zIndex:      0,
  }

  const contentStyle = {
    position:  'relative',
    zIndex:    1,
    maxWidth:  '680px',
    width:     '100%',
  }

  const headlineStyle = {
    color:         textColor,
    fontSize:      'clamp(28px, 5vw, 52px)',
    fontWeight:    '800',
    lineHeight:    '1.15',
    letterSpacing: '-0.02em',
    margin:        '0 0 16px',
  }

  const subheadlineStyle = {
    color:      textColor,
    fontSize:   'clamp(14px, 2vw, 18px)',
    fontWeight: '400',
    lineHeight: '1.6',
    opacity:    0.8,
    margin:     '0 0 36px',
  }

  const btnStyle = {
    display:         'inline-block',
    backgroundColor: template.btnBg   || '#6366f1',
    color:           template.btnText || '#ffffff',
    fontSize:        '15px',
    fontWeight:      '600',
    padding:         '13px 32px',
    borderRadius:    template.btnRadius || '8px',
    border:          'none',
    cursor:          'pointer',
    textDecoration:  'none',
    lineHeight:      '1',
    transition:      'opacity 0.15s',
  }

  return (
    <CanvasUpload
      hasImage={hasBgImage}
      isActive={isActive}
      onUpload={v => updateSection('hero', 'data', { ...data, bgImage: v })}
      style={sectionStyle}
    >
      {/* Scrim */}
      <div style={scrimStyle} />

      {/* Content */}
      <div style={contentStyle}>
        {data.headline && (
          <h1 style={headlineStyle}>{data.headline}</h1>
        )}
        {data.subheadline && (
          <p style={subheadlineStyle}>{data.subheadline}</p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaUrl || '#'}
            style={btnStyle}
            onClick={e => e.preventDefault()}
          >
            {data.ctaText}
          </a>
        )}
        {!data.headline && !data.subheadline && !data.ctaText && (
          <p style={{ color: textColor, opacity: 0.3, fontSize: '14px', margin: 0 }}>
            Add content in the editor →
          </p>
        )}
      </div>
    </CanvasUpload>
  )
}
