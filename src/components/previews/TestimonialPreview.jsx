import { useState } from 'react'
import { useTheme } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { SECTION_PADDING_X, SECTION_PADDING_X_MOBILE } from '../../constants/design.js'
import DotIndicators from '../ui/DotIndicators.jsx'
import { parsePx } from '../../utils/style.js'
import { headingStyle } from '../../utils/typography.js'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Deterministic pastel bg from name string
function avatarColor(name) {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']
  let hash = 0
  for (let i = 0; i < (name?.length ?? 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}



export default function TestimonialPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.testimonial
  const { globalTheme } = theme
  const selectedId = useSelection()
  const isActive = selectedId === 'testimonial' || selectedId?.startsWith('testimonial-')

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const [activeIndex, setActiveIndex] = useState(0)

  const heading      = data.heading || ''
  const items        = data.items   || []
  const count        = items.length
  const visibleCount = isMobile ? 1 : Math.min(Number(template.visibleCount) || 1, count || 1)

  function prev() { setActiveIndex(i => (i - 1 + count) % count) }
  function next() { setActiveIndex(i => (i + 1) % count) }

  const safeIndex = count === 0 ? 0 : Math.min(activeIndex, count - 1)

  // Slice a window of visibleCount items with wrapping
  const visibleItems = count === 0
    ? []
    : Array.from({ length: visibleCount }, (_, j) => ({
        item:  items[(safeIndex + j) % count],
        index: (safeIndex + j) % count,
      }))

  function handleAvatarUpload(index, imageUrl) {
    const updated = items.map((item, i) => i === index ? { ...item, avatar: imageUrl } : item)
    updateSection('testimonial', 'data', { ...data, items: updated })
  }

  const fontSize  = parsePx(template.fontSize) || parsePx(globalTheme.bodySize) || 14
  const textColor = template.textColor || '#111827'

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const sectionStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    color:           textColor,
    fontSize:        `${fontSize}px`,
    paddingTop:      `${parseInt(template.padding ?? 48)}px`,
    paddingBottom:   `${parseInt(template.padding ?? 48)}px`,
    paddingLeft:     isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
    paddingRight:    isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
    width:           '100%',
    boxSizing:       'border-box',
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const hStyle = headingStyle({ template, globalTheme, textColor })

  const cardStyle = {
    backgroundColor: template.cardBg      || '#ffffff',
    borderRadius:    template.borderRadius || '12px',
    border:          '1px solid #e5e7eb',
    padding:         '24px',
    display:         'flex',
    flexDirection:   'column',
    gap:             '16px',
  }

  const quoteStyle = {
    color:      textColor,
    fontSize:   `${fontSize}px`,
    lineHeight: '1.6',
    flex:       1,
  }

  const nameStyle = {
    color:      textColor,
    fontSize:   `${Math.round(fontSize * 0.95)}px`,
    fontWeight: '600',
    margin:     0,
  }

  const roleStyle = {
    color:    textColor,
    fontSize: `${Math.round(fontSize * 0.85)}px`,
    opacity:  0.6,
    margin:   0,
  }

  const avatarBaseStyle = {
    width:        '36px',
    height:       '36px',
    borderRadius: '50%',
    flexShrink:   0,
    objectFit:    'cover',
  }

  function renderCard(item, i) {
    return (
      <div style={cardStyle}>
        {item.quote
          ? <p style={quoteStyle}>"{item.quote}"</p>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              {['100%', '85%', '60%'].map((w, j) => (
                <div key={j} style={{ width: w, height: '12px', borderRadius: '4px', backgroundColor: '#e5e7eb' }} />
              ))}
            </div>
        }
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CanvasUpload
            hasImage={!!item.avatar}
            isActive={isActive}
            onUpload={v => handleAvatarUpload(i, v)}
            style={avatarBaseStyle}
            compact
            shape="circle"
            aspectRatio="1/1"
            onCrop={v => handleAvatarUpload(i, v)}
          >
            <img
              src={item.avatar}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </CanvasUpload>
          <div>
            {item.name
              ? <p style={nameStyle}>{item.name}</p>
              : <div style={{ width: '90px', height: '10px', borderRadius: '4px', backgroundColor: '#e5e7eb', marginBottom: '6px' }} />
            }
            {item.role
              ? <p style={roleStyle}>{item.role}</p>
              : <div style={{ width: '60px', height: '10px', borderRadius: '4px', backgroundColor: '#e5e7eb' }} />
            }
          </div>
        </div>
      </div>
    )
  }

  const skeletonCard = (
    <div style={cardStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {['100%', '85%', '60%'].map((w, j) => (
          <div key={j} style={{ width: w, height: '12px', borderRadius: '4px', backgroundColor: '#e5e7eb' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e5e7eb', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ width: '90px', height: '10px', borderRadius: '4px', backgroundColor: '#e5e7eb' }} />
          <div style={{ width: '60px', height: '10px', borderRadius: '4px', backgroundColor: '#e5e7eb' }} />
        </div>
      </div>
    </div>
  )

  return (
    <section ref={ref} style={sectionStyle}>
      <div style={innerStyle}>
      {heading
        ? <h2 style={hStyle}>{heading}</h2>
        : <div style={{ width: '280px', height: '28px', borderRadius: '6px', backgroundColor: '#d1d5db', margin: '0 auto 28px' }} />
      }

      {count === 0 ? (
        skeletonCard
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           
            <div style={{
              flex:                1,
              minWidth:            0,
              display:             'grid',
              gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
              gap:                 '16px',
            }}>
              {visibleItems.map(({ item, index }) => renderCard(item, index))}
            </div>
           
          </div>

          <DotIndicators
            count={count}
            activeIndex={safeIndex}
            onDotClick={i => setActiveIndex(i)}
            accentColor={globalTheme.primaryColor || '#6366f1'}
          />
        </>
      )}
      </div>
    </section>
  )
}
