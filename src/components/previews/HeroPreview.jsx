import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

export default function HeroPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.hero
  const selectedId = useSelection()
  const isActive = selectedId === 'hero' || selectedId?.startsWith('hero-')
  const darkMode = useDarkMode()

  const { ref: containerRef, width: containerWidth } = useContainerWidth()
  const isMobile = containerWidth < 600

  const accent        = theme.globalTheme?.primaryColor || '#6366f1'
  const hasBgImage    = Boolean(data.bgImage)

  const eyebrowText   = template.eyebrowText  ?? 'Welcome to Arcova'
  const imagePosition = template.imagePosition ?? 'right'
  const bgColor       = template.bgColor       ?? (darkMode ? '#18181b' : '#ffffff')
  const textColor     = template.textColor     ?? (darkMode ? '#f4f4f5' : '#0a0a0a')
  const btnBg         = template.btnBg         ?? (darkMode ? '#f4f4f5' : '#0a0a0a')
  const btnText       = template.btnText       ?? (darkMode ? '#18181b' : '#ffffff')

  return (
    <>
      {/* Google Font injection */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>

      <div ref={containerRef} style={{ width: '100%' }}>
        <section style={{
          backgroundColor: bgColor,
          paddingTop:      isMobile ? '40px' : `${Number(template.padding ?? 64)}px`,
          paddingBottom:   isMobile ? '32px' : `${Number(template.padding ?? 64)}px`,
          paddingLeft:     isMobile ? '20px' : '56px',
          paddingRight:    isMobile ? '20px' : '56px',
          width:           '100%',
          boxSizing:       'border-box',
        }}>

          {/* Two-column row */}
          <div style={{
            display:       'flex',
            flexDirection: isMobile ? 'column' : (imagePosition === 'left' ? 'row-reverse' : 'row'),
            alignItems:    'center',
            gap:           isMobile ? '32px' : '56px',
            maxWidth:      '1100px',
            margin:        '0 auto',
          }}>

            {/* ── Left: text ── */}
            <div style={{ flex: '1 1 0', minWidth: 0 }}>

              {/* Eyebrow */}
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '8px',
                marginBottom:'16px',
              }}>
                <span style={{
                  display:      'inline-block',
                  width:        '8px',
                  height:       '8px',
                  borderRadius: '50%',
                  background:   accent,
                  flexShrink:   0,
                }} />
                <span style={{
                  fontSize:      '11px',
                  fontWeight:    '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         darkMode ? '#a1a1aa' : '#71717a',
                }}>
                  {eyebrowText}
                </span>
              </div>

              {/* Headline */}
              {data.headline ? (
                <h1 style={{
                  fontFamily:    "'Syne', Georgia, serif",
                  fontSize:      isMobile ? '2rem' : `${Number(template.headingSize ?? 56)}px`,
                  fontWeight:    500,
                  lineHeight:    '1.08',
                  letterSpacing: '-0.03em',
                  color:         textColor,
                  margin:        '0 0 20px',
                }}>
                  {data.headline}
                </h1>
              ) : (
                <div style={{ width: '80%', height: isMobile ? '48px' : '80px', borderRadius: '8px', background: darkMode ? '#3f3f46' : '#e5e7eb', marginBottom: '20px' }} />
              )}

              {/* Subheadline */}
              {data.subheadline ? (
                <p style={{
                  fontSize:   isMobile ? '14px' : '16px',
                  color:      textColor,
                  opacity:    0.6,
                  lineHeight: '1.65',
                  margin:     '0 0 32px',
                  maxWidth:   '480px',
                }}>
                  {data.subheadline}
                </p>
              ) : (
                <div style={{ width: '90%', height: '40px', borderRadius: '6px', background: darkMode ? '#3f3f46' : '#e5e7eb', marginBottom: '32px' }} />
              )}

              {/* CTA button */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a
                  href={data.ctaUrl || '#'}
                  onClick={e => e.preventDefault()}
                  style={{
                    display:        'inline-block',
                    padding:        '12px 28px',
                    background:     btnBg,
                    color:          btnText,
                    fontSize:       '14px',
                    fontWeight:     '600',
                    borderRadius:   '999px',
                    textDecoration: 'none',
                    lineHeight:     '1',
                    whiteSpace:     'nowrap',
                    flexShrink:     0,
                  }}
                >
                  {data.ctaText || 'Get started'}
                </a>
              </div>

            </div>

            {/* ── Right: image ── */}
            <div style={{ flex: '0 0 auto', width: isMobile ? '100%' : '44%' }}>
              <CanvasUpload
                hasImage={hasBgImage}
                isActive={isActive}
                onUpload={v => updateSection('hero', 'data', { ...data, bgImage: v })}
                onCrop={v => updateSection('hero', 'data', { ...data, bgImage: v })}
                aspectRatio="4/3"
                style={{
                  width:        '100%',
                  aspectRatio:  '4/3',
                  borderRadius: '16px',
                  overflow:     'hidden',
                  background:   darkMode ? '#3f3f46' : '#e5e5e5',
                  display:      'block',
                }}
              >
                {hasBgImage && (
                  <img
                    src={data.bgImage}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
              </CanvasUpload>
            </div>

          </div>

        </section>
      </div>
    </>
  )
}
