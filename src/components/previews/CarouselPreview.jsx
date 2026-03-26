import { useState } from 'react'
import { useTheme } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'

function ArrowLeft({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ArrowRight({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function CarouselPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.carousel
  const selectedId = useSelection()
  const isActive = selectedId === 'carousel' || selectedId?.startsWith('carousel-')

  const [activeIndex, setActiveIndex] = useState(0)

  const slides = data.slides ?? []
  const count  = slides.length

  function handleSlideUpload(index, imageUrl) {
    const updated = slides.map((s, i) => i === index ? { ...s, image: imageUrl } : s)
    updateSection('carousel', 'data', { ...data, slides: updated })
  }

  const arrowColor = template.arrowColor || '#ffffff'
  const dotColor   = template.dotColor   || '#ffffff'
  const height     = template.height     || '360px'

  // Clamp active index when slides shrink
  const safeIndex = count === 0 ? 0 : Math.min(activeIndex, count - 1)

  function prev() { setActiveIndex(i => (i - 1 + count) % count) }
  function next() { setActiveIndex(i => (i + 1) % count) }

  /* ── styles ── */
  const wrapperStyle = {
    position:   'relative',
    width:      '100%',
    height,
    overflow:   'hidden',
    backgroundColor: template.bgColor || '#1e1e2e',
    boxSizing:  'border-box',
  }

  const trackStyle = {
    display:   'flex',
    height:    '100%',
    transform: `translateX(-${safeIndex * 100}%)`,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  const slideBaseStyle = {
    minWidth:           '100%',
    height:             '100%',
    position:           'relative',
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    backgroundRepeat:   'no-repeat',
    boxSizing:          'border-box',
    display:            'flex',
    alignItems:         'center',
    justifyContent:     'center',
  }

  const overlayStyle = {
    position:        'absolute',
    inset:           0,
    background:      'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
    pointerEvents:   'none',
  }

  const textBlockStyle = {
    position:  'absolute',
    bottom:    '48px',
    left:      '32px',
    right:     '32px',
    zIndex:    2,
  }

  const titleStyle = {
    color:      template.textColor || '#ffffff',
    fontSize:   `calc(${template.fontSize || '16px'} * 1.5)`,
    fontWeight: '700',
    margin:     '0 0 6px',
    lineHeight: '1.3',
  }

  const subtitleStyle = {
    color:    template.textColor || '#ffffff',
    fontSize: template.fontSize  || '16px',
    opacity:  0.85,
    margin:   0,
  }

  const arrowBtnStyle = {
    position:        'absolute',
    top:             '50%',
    transform:       'translateY(-50%)',
    zIndex:          3,
    background:      'rgba(0,0,0,0.35)',
    border:          'none',
    borderRadius:    '50%',
    width:           '40px',
    height:          '40px',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    cursor:          'pointer',
    transition:      'background 0.15s',
  }

  const dotsRowStyle = {
    position:       'absolute',
    bottom:         '16px',
    left:           0,
    right:          0,
    display:        'flex',
    justifyContent: 'center',
    gap:            '8px',
    zIndex:         3,
  }

  if (count === 0) {
    return (
      <CanvasUpload
        hasImage={false}
        isActive={isActive}
        onUpload={v => {
          updateSection('carousel', 'data', { ...data, slides: [{ image: v, title: '', subtitle: '' }] })
        }}
        style={{ ...wrapperStyle }}
      />
    )
  }

  return (
    <div style={wrapperStyle}>
      {/* Slide track */}
      <div style={trackStyle}>
        {slides.map((slide, i) => (
          <CanvasUpload
            key={i}
            hasImage={!!slide.image}
            isActive={isActive && i === safeIndex}
            onUpload={v => handleSlideUpload(i, v)}
            style={slide.image
              ? { ...slideBaseStyle, backgroundImage: `url(${slide.image})` }
              : slideBaseStyle
            }
          >
            {/* Dim gradient overlay */}
            <div style={overlayStyle} />

            {/* Title / subtitle */}
            {(slide.title || slide.subtitle) && (
              <div style={textBlockStyle}>
                {slide.title    && <p style={titleStyle}>{slide.title}</p>}
                {slide.subtitle && <p style={subtitleStyle}>{slide.subtitle}</p>}
              </div>
            )}
          </CanvasUpload>
        ))}
      </div>

      {/* Prev arrow */}
      {count > 1 && (
        <button
          onClick={prev}
          style={{ ...arrowBtnStyle, left: '12px' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
        >
          <ArrowLeft color={arrowColor} />
        </button>
      )}

      {/* Next arrow */}
      {count > 1 && (
        <button
          onClick={next}
          style={{ ...arrowBtnStyle, right: '12px' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
        >
          <ArrowRight color={arrowColor} />
        </button>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div style={dotsRowStyle}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width:        i === safeIndex ? '20px' : '8px',
                height:       '8px',
                borderRadius: '4px',
                border:       'none',
                background:   i === safeIndex ? dotColor : `${dotColor}66`,
                cursor:       'pointer',
                padding:      0,
                transition:   'width 0.3s ease, background 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
