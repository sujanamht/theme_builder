import { useState, useRef } from 'react'
import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'
import { hexToRgba } from '../../utils/colorUtils.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import DotIndicators from '../ui/DotIndicators.jsx'
import { parsePx } from '../../utils/style.js'

export default function ServicesPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.services
  const { globalTheme } = theme
  const darkMode = useDarkMode()

  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

  const heading     = data.heading    || ''
  const subheading  = data.subheading || ''
  const items       = data.items      || []

  const textColor   = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')
  const accentColor = template.accentColor || globalTheme.primaryColor || '#6366f1'
  const fontSize    = parsePx(template.fontSize    || '15px')

  const sectionStyle = {
    backgroundColor: template.bgColor  || (darkMode ? '#18181b' : '#f9fafb'),
    padding:         template.padding  || '64px 32px',
    width:           '100%',
    boxSizing:       'border-box',
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const headingStyle = {
    color:        textColor,
    fontSize:     template.headingSize || globalTheme.headingSize || `${Math.round(fontSize * 1.9)}px`,
    fontWeight:   '800',
    margin:       '0 0 10px',
    textAlign:    'center',
    lineHeight:   '1.2',
  }

  const subheadingStyle = {
    color:      textColor,
    fontSize:   `${Math.round(fontSize * 1.05)}px`,
    opacity:    0.6,
    margin:     '0 0 32px',
    textAlign:  'center',
    lineHeight: '1.6',
  }

  const cardStyle = {
    backgroundColor: template.cardBg       || (darkMode ? '#27272a' : '#ffffff'),
    borderRadius:    template.borderRadius  || '12px',
    border:          darkMode ? '1px solid #3f3f46' : '1px solid #e5e7eb',
    padding:         '24px',
    display:         'flex',
    flexDirection:   'column',
    gap:             '12px',
  }

  const iconCircleStyle = {
    width:           '44px',
    height:          '44px',
    borderRadius:    '50%',
    background:      hexToRgba(accentColor, 0.15),
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    fontSize:        '20px',
    color:           accentColor,
    flexShrink:      0,
  }

  const titleStyle = {
    color:      textColor,
    fontSize:   `${Math.round(fontSize * 1.05)}px`,
    fontWeight: '700',
    margin:     0,
  }

  const descStyle = {
    color:      textColor,
    fontSize:   template.bodySize || globalTheme.bodySize || `${fontSize}px`,
    opacity:    0.65,
    margin:     0,
    lineHeight: '1.6',
    flex:       1,
  }

  const linkStyle = {
    color:          accentColor,
    fontSize:       `${Math.round(fontSize * 0.9)}px`,
    fontWeight:     '600',
    textDecoration: 'none',
    marginTop:      'auto',
  }

  const emptyStyle = {
    color:     textColor,
    opacity:   0.3,
    fontSize:  `${fontSize}px`,
    textAlign: 'center',
    padding:   '24px 0',
  }

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const desktopCols  = parseInt(template.columns) || 3
  const tabletCols   = Math.min(2, desktopCols)
  const displayMode  = template.displayMode || 'grid'
  const visibleItems = displayMode === 'single-row' ? items.slice(0, desktopCols) : items

  function renderCard(item, i) {
    return (
      <>
        {item.icon && <div style={iconCircleStyle}>{item.icon}</div>}
        {item.title && <p style={titleStyle}>{item.title}</p>}
        {item.description && <p style={descStyle}>{item.description}</p>}
        {item.linkText && (
          <a href={item.linkUrl || '#'} style={linkStyle}>{item.linkText} →</a>
        )}
      </>
    )
  }

  function handleScroll(e) {
    const el = e.currentTarget
    const cardWidth = 280 + 24
    setActiveIndex(Math.round(el.scrollLeft / cardWidth))
  }

  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        {heading    && <h2 style={headingStyle}>{heading}</h2>}
        {subheading && <p style={subheadingStyle}>{subheading}</p>}
        {items.length === 0 && <p style={emptyStyle}>No services yet — add some in the editor.</p>}
      </div>

      {items.length > 0 && (displayMode === 'carousel' ? (
        <div style={innerStyle}>
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="services-carousel"
            style={{
              width:                   '100%',
              overflowX:               'auto',
              overflowY:               'visible',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType:          'x mandatory',
              paddingBottom:           '16px',
              boxSizing:               'border-box',
              scrollbarWidth:          'none',
              msOverflowStyle:         'none',
            }}
          >
            <style>{`.services-carousel::-webkit-scrollbar{display:none}`}</style>
            <div style={{
              display:      'inline-flex',
              gap:          '24px',
              paddingLeft:  '32px',
              paddingRight: '32px',
              minWidth:     '100%',
              boxSizing:    'border-box',
            }}>
              {items.map((item, i) => (
                <div key={i} style={{ ...cardStyle, width: '280px', minWidth: '280px', maxWidth: '280px', flex: '0 0 280px', scrollSnapAlign: 'start', boxSizing: 'border-box' }}>
                  {renderCard(item, i)}
                </div>
              ))}
            </div>
          </div>
          <DotIndicators
            count={items.length}
            activeIndex={activeIndex}
            onDotClick={i => {
              carouselRef.current?.scrollTo({ left: i * (280 + 24), behavior: 'smooth' })
              setActiveIndex(i)
            }}
            accentColor={accentColor}
            darkMode={darkMode}
          />
        </div>
      ) : (
        <div style={innerStyle}>
          <ResponsiveGrid cols={{ mobile: 1, tablet: tabletCols, desktop: desktopCols }} gap={24}>
            {visibleItems.map((item, i) => (
              <div key={i} style={cardStyle}>
                {renderCard(item, i)}
              </div>
            ))}
          </ResponsiveGrid>
          {displayMode === 'single-row' && (
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <a href="#" style={{ color: accentColor, fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                View all →
              </a>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
