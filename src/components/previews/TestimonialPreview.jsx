import { useState } from 'react'
import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

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

function ArrowBtn({ dir, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:     'none',
        border:         `1.5px solid ${color}33`,
        borderRadius:   '50%',
        width:          '36px',
        height:         '36px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        flexShrink:     0,
        color,
        fontSize:       '16px',
        lineHeight:     1,
      }}
    >
      {dir === 'prev' ? '‹' : '›'}
    </button>
  )
}

export default function TestimonialPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.testimonial
  const selectedId = useSelection()
  const isActive = selectedId === 'testimonial' || selectedId?.startsWith('testimonial-')

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const [activeIndex, setActiveIndex] = useState(0)
  const darkMode = useDarkMode()

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

  const textColor = template.textColor || (darkMode ? '#f4f4f5' : '#111827')

  const sectionStyle = {
    backgroundColor: template.bgColor  || (darkMode ? '#18181b' : '#f9fafb'),
    color:           textColor,
    fontSize:        template.fontSize  || '14px',
    padding:         template.padding   || '48px 24px',
    width:           '100%',
    boxSizing:       'border-box',
  }

  const headingStyle = {
    color:        textColor,
    fontSize:     `calc(${template.fontSize || '14px'} * 1.6)`,
    fontWeight:   '700',
    marginBottom: '28px',
    textAlign:    'center',
  }

  const cardStyle = {
    backgroundColor: template.cardBg      || (darkMode ? '#27272a' : '#ffffff'),
    borderRadius:    template.borderRadius || '12px',
    border:          darkMode ? '1px solid #3f3f46' : '1px solid #e5e7eb',
    padding:         '24px',
    display:         'flex',
    flexDirection:   'column',
    gap:             '16px',
  }

  const quoteStyle = {
    color:      textColor,
    fontSize:   template.fontSize || '14px',
    lineHeight: '1.6',
    flex:       1,
  }

  const nameStyle = {
    color:      textColor,
    fontSize:   `calc(${template.fontSize || '14px'} * 0.95)`,
    fontWeight: '600',
    margin:     0,
  }

  const roleStyle = {
    color:    textColor,
    fontSize: `calc(${template.fontSize || '14px'} * 0.85)`,
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
                <div key={j} style={{ width: w, height: '12px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb' }} />
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
              : <div style={{ width: '90px', height: '10px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb', marginBottom: '6px' }} />
            }
            {item.role
              ? <p style={roleStyle}>{item.role}</p>
              : <div style={{ width: '60px', height: '10px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb' }} />
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
          <div key={j} style={{ width: w, height: '12px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ width: '90px', height: '10px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb' }} />
          <div style={{ width: '60px', height: '10px', borderRadius: '4px', backgroundColor: darkMode ? '#3f3f46' : '#e5e7eb' }} />
        </div>
      </div>
    </div>
  )

  return (
    <section ref={ref} style={sectionStyle}>
      {heading
        ? <h2 style={headingStyle}>{heading}</h2>
        : <div style={{ width: '280px', height: '28px', borderRadius: '6px', backgroundColor: darkMode ? '#3f3f46' : '#d1d5db', margin: '0 auto 28px' }} />
      }

      {count === 0 ? (
        skeletonCard
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ArrowBtn dir="prev" onClick={prev} color={textColor} />
            <div style={{
              flex:                1,
              minWidth:            0,
              display:             'grid',
              gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
              gap:                 '16px',
            }}>
              {visibleItems.map(({ item, index }) => renderCard(item, index))}
            </div>
            <ArrowBtn dir="next" onClick={next} color={textColor} />
          </div>

          {count > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width:        i === safeIndex ? '20px' : '8px',
                    height:       '8px',
                    borderRadius: '4px',
                    border:       'none',
                    background:   i === safeIndex ? '#6366f1' : `${textColor}33`,
                    cursor:       'pointer',
                    padding:      0,
                    transition:   'width 0.3s ease, background 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
