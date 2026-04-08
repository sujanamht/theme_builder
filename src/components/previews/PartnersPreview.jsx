import { useState } from 'react'
import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

const KEYFRAME_ID = 'partners-marquee-keyframes'

function ensureKeyframes() {
  if (document.getElementById(KEYFRAME_ID)) return
  const style = document.createElement('style')
  style.id = KEYFRAME_ID
  style.textContent = `
    @keyframes partners-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `
  document.head.appendChild(style)
}

export default function PartnersPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.partners
  const { globalTheme } = theme
  const darkMode = useDarkMode()
  const selectedId = useSelection()
  const isActive = selectedId === 'partners' || selectedId?.startsWith('partners-')

  const [hovered, setHovered] = useState(false)
  const { ref, width } = useContainerWidth()

  ensureKeyframes()

  const items = data.items ?? []
  const autoScroll = template.autoScroll ?? true
  const speed = template.speed ?? 30
  const logoHeight = template.logoHeight ?? '60px'
  const padding = template.padding ?? 48

  const bgColor = template.bgColor || (darkMode ? '#18181b' : '#f9fafb')
  const headingColor = template.headingColor || (darkMode ? '#f4f4f5' : '#111827')

  // Duplicate items for seamless infinite loop
  const displayItems = autoScroll && items.length > 0
    ? [...items, ...items]
    : items

  const logoGap = 60

  function handleLogoUpload(index, imageUrl) {
    const realIndex = index % items.length
    const updated = items.map((item, i) => i === realIndex ? { ...item, image: imageUrl } : item)
    updateSection('partners', 'data', { ...data, items: updated })
  }

  const sectionStyle = {
    backgroundColor: bgColor,
    padding: `${padding}px 24px`,
    fontFamily: globalTheme.fontFamily || 'inherit',
    boxSizing: 'border-box',
    width: '100%',
    outline: isActive ? '2px solid #6366f1' : 'none',
    outlineOffset: '-2px',
  }

  const headingStyle = {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: headingColor,
    marginBottom: '32px',
  }

  const trackStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: `${logoGap}px`,
    ...(autoScroll && items.length > 0 ? {
      animation: `partners-scroll ${speed}s linear infinite`,
      animationPlayState: hovered ? 'paused' : 'running',
      width: 'max-content',
    } : {
      flexWrap: 'wrap',
      justifyContent: 'center',
    }),
  }

  const logoStyle = {
    height: logoHeight,
    width: logoHeight,
    maxWidth: '160px',
    objectFit: 'contain',
    borderRadius: '18px', 
    transition: 'filter 0.2s ease, opacity 0.2s ease',
    flexShrink: 0,
    display: 'block',
  }

  const placeholderStyle = {
    height: logoHeight,
    width: logoHeight,
    borderRadius: '18px',
    backgroundColor: darkMode ? '#2a2a2a' : '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: darkMode ? '#6b7280' : '#9ca3af',
    flexShrink: 0,
  }

  return (
    <div ref={ref} style={sectionStyle}>
      {data.heading && (
        <h2 style={headingStyle}>{data.heading}</h2>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: darkMode ? '#6b7280' : '#9ca3af', fontSize: '14px', padding: '32px 0' }}>
          Add partner logos in the Content tab
        </div>
      ) : (
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div
            style={trackStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {displayItems.map((item, i) => {
              const realIndex = i % items.length
              return (
                <div key={i} style={{ flexShrink: 0 }}>
                  {isActive ? (
                    <CanvasUpload
                      hasImage={!!item.image}
                      isActive={isActive}
                      onUpload={url => handleLogoUpload(realIndex, url)}
                      onCrop={url => handleLogoUpload(realIndex, url)}
                      aspectRatio="1/1"
                      style={{ height: logoHeight, width: logoHeight, borderRadius: '6px' }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name || `Partner ${realIndex + 1}`}
                          style={logoStyle}
                        />
                      )}
                    </CanvasUpload>
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || `Partner ${realIndex + 1}`}
                      style={logoStyle}

                    />
                  ) : (
                    <div style={placeholderStyle}>
                      {item.name || `Partner ${realIndex + 1}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
