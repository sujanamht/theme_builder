import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

export default function AboutPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.about
  const selectedId = useSelection()
  const isActive = selectedId === 'about' || selectedId?.startsWith('about-')
  const darkMode = useDarkMode()

  const { ref: containerRef, width: containerWidth } = useContainerWidth()
  const isMobile = containerWidth < 500

  const textColor     = template.textColor     || (darkMode ? '#f4f4f5' : '#0a0a0a')
  const imagePosition = template.imagePosition || 'left'
  const hasImage      = Boolean(data.image)
  const isEmpty       = !data.heading && !data.body

  const padV = isMobile ? '32px' : (template.padding ?? '64px')
  const padH = isMobile ? '16px' : '48px'

  const sectionStyle = {
    backgroundColor: template.bgColor || (darkMode ? '#18181b' : '#ffffff'),
    paddingTop:      padV,
    paddingBottom:   padV,
    paddingLeft:     padH,
    paddingRight:    padH,
    width:           '100%',
    boxSizing:       'border-box',
  }

  const rowStyle = {
    display:       'flex',
    flexDirection: isMobile
      ? 'column'
      : imagePosition === 'right' ? 'row-reverse' : 'row',
    gap:           isMobile ? '24px' : '48px',
    alignItems:    'center',
    maxWidth:      '1100px',
    margin:        '0 auto',
  }

  const colStyle = {
    flex:     '1 1 0',
    minWidth: 0,
    width:    isMobile ? '100%' : undefined,
  }

  const headingStyle = {
    color:         textColor,
    fontSize:      isMobile ? '1.5rem' : '2rem',
    fontWeight:    800,
    margin:        '0 0 16px',
    lineHeight:    '1.2',
  }

  const bodyStyle = {
    color:      darkMode ? '#a1a1aa' : '#374151',
    fontSize:   isMobile ? '14px' : (template.fontSize ?? '16px'),
    lineHeight: '1.75',
    margin:     '0 0 28px',
  }

  const btnStyle = {
    display:         'inline-block',
    backgroundColor: template.buttonBg   || (darkMode ? '#f4f4f5' : '#0a0a0a'),
    color:           template.buttonText || (darkMode ? '#18181b' : '#ffffff'),
    fontSize:        '0.95rem',
    fontWeight:      600,
    padding:         '12px 28px',
    borderRadius:    '8px',
    border:          'none',
    cursor:          'pointer',
    textDecoration:  'none',
    lineHeight:      '1',
  }

  const imgStyle = {
    width:     '100%',
    height:    '100%',
    objectFit: 'cover',
    display:   'block',
  }

  // ── skeleton ────────────────────────────────────────────────────────────────

  const skeletonBox = (w, h, mb = 0) => ({
    width:           w,
    height:          h,
    borderRadius:    '6px',
    backgroundColor: darkMode ? '#3f3f46' : '#d1d5db',
    marginBottom:    mb,
  })

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <section style={sectionStyle}>
        <div style={rowStyle}>
          {/* Image column */}
          <div style={colStyle}>
            <CanvasUpload
              hasImage={hasImage}
              isActive={isActive}
              onUpload={v => updateSection('about', 'data', { ...data, image: v })}
              aspectRatio="4/3"
              onCrop={v => updateSection('about', 'data', { ...data, image: v })}
              style={{ width: '100%', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
            >
              <img src={data.image} alt="" style={imgStyle} />
            </CanvasUpload>
          </div>

          {/* Text column */}
          <div style={{ ...colStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isEmpty ? (
              <>
                <div style={skeletonBox('60%', '28px', 16)} />
                <div style={skeletonBox('100%', '14px', 8)} />
                <div style={skeletonBox('95%',  '14px', 8)} />
                <div style={skeletonBox('98%',  '14px', 8)} />
                <div style={skeletonBox('75%',  '14px', 28)} />
                <div style={skeletonBox('120px', '40px', 0)} />
              </>
            ) : (
              <>
                {data.heading && <h2 style={headingStyle}>{data.heading}</h2>}
                {data.body    && <p  style={bodyStyle}>{data.body}</p>}
                {data.buttonText && (
                  <a
                    href={data.buttonUrl || '#'}
                    style={btnStyle}
                    onClick={e => e.preventDefault()}
                  >
                    {data.buttonText}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
