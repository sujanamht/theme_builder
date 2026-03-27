import { useState } from 'react'
import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

const PLATFORM_LABELS = {
  facebook:  'Facebook',
  instagram: 'Instagram',
  tiktok:    'TikTok',
  youtube:   'YouTube',
}

const PLATFORM_COLORS = {
  facebook:  '#1877f2',
  instagram: '#e1306c',
  tiktok:    '#010101',
  youtube:   '#ff0000',
}

function toEmbedUrl(platform, url) {
  if (!url) return null
  try {
    const u = url.trim()
    if (platform === 'youtube') {
      const short = u.match(/youtu\.be\/([^?&]+)/)
      if (short) return `https://www.youtube.com/embed/${short[1]}`
      const watch = u.match(/[?&]v=([^&]+)/)
      if (watch) return `https://www.youtube.com/embed/${watch[1]}`
      if (u.includes('youtube.com/embed/')) return u
      return u
    }
    if (platform === 'facebook') {
      if (u.includes('facebook.com/plugins/')) return u
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(u)}&show_text=true&width=500`
    }
    if (platform === 'instagram') {
      const code = u.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/)
      if (code) return `https://www.instagram.com/p/${code[1]}/embed`
      if (u.includes('/embed')) return u
      return u
    }
    if (platform === 'tiktok') {
      const id = u.match(/video\/(\d+)/)
      if (id) return `https://www.tiktok.com/embed/v2/${id[1]}`
      if (u.includes('tiktok.com/embed')) return u
      return u
    }
  } catch {
    return url
  }
  return url
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

export default function SocialMediaPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.socialmedia

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const [activeIndex, setActiveIndex] = useState(0)
  const darkMode = useDarkMode()

  const bg        = template.bgColor   || (darkMode ? '#18181b' : '#ffffff')
  const textColor = template.textColor || (darkMode ? '#f4f4f5' : '#111827')
  const padding   = isMobile ? '32px 20px' : `${template.padding ?? 64}px 32px`

  const embeds       = (data.embeds || []).filter(e => e.enabled !== false && e.url)
  const count        = embeds.length
  const visibleCount = isMobile ? 1 : 2

  const safeIndex  = count === 0 ? 0 : Math.min(activeIndex, count - 1)
  const showCarousel = count > visibleCount

  function prev() { setActiveIndex(i => (i - 1 + count) % count) }
  function next() { setActiveIndex(i => (i + 1) % count) }

  const visibleEmbeds = count === 0
    ? []
    : Array.from({ length: Math.min(visibleCount, count) }, (_, j) => ({
        embed: embeds[(safeIndex + j) % count],
        index: (safeIndex + j) % count,
      }))

  const isEmpty = !data.heading && !data.subheading && count === 0

  const skel = (w, h, mb = 0) => ({
    width: w, height: h, borderRadius: '6px',
    backgroundColor: darkMode ? '#3f3f46' : '#d1d5db', marginBottom: mb,
  })

  function renderEmbed({ embed }) {
    const embedUrl = toEmbedUrl(embed.platform, embed.url)
    const color    = PLATFORM_COLORS[embed.platform] || '#6366f1'
    const label    = PLATFORM_LABELS[embed.platform] || embed.platform
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          borderRadius: '10px',
          overflow:     'hidden',
          background:   darkMode ? '#27272a' : '#f3f4f6',
          height:       '300px',
        }}>
          <iframe
            src={embedUrl}
            title={label}
            style={{ width: '100%', height: '300px', border: 'none', display: 'block' }}
            allowFullScreen
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: textColor, opacity: 0.5, fontWeight: '500' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          {label}
        </div>
      </div>
    )
  }

  return (
    <section ref={ref} style={{ backgroundColor: bg, padding, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Heading */}
        {isEmpty ? (
          <div style={{ marginBottom: '32px' }}>
            <div style={skel('45%', '28px', 12)} />
            <div style={skel('65%', '14px', 0)} />
          </div>
        ) : (
          <div style={{ marginBottom: '32px', textAlign: template.textAlign || 'center' }}>
            {data.heading && (
              <h2 style={{ color: textColor, fontSize: isMobile ? '22px' : '28px', fontWeight: '700', margin: '0 0 8px', lineHeight: '1.2' }}>
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p style={{ color: textColor, fontSize: '15px', opacity: 0.65, margin: 0, lineHeight: '1.6' }}>
                {data.subheading}
              </p>
            )}
          </div>
        )}

        {/* Embeds */}
        {count === 0 ? (
          /* Placeholder boxes when heading exists but no embeds */
          !isEmpty && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
              {[0, 1].map(i => (
                <div key={i} style={{ borderRadius: '10px', background: darkMode ? '#27272a' : '#f3f4f6', height: '300px' }} />
              ))}
            </div>
          )
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showCarousel && <ArrowBtn dir="prev" onClick={prev} color={textColor} />}

              <div style={{
                flex:                1,
                minWidth:            0,
                display:             'grid',
                gridTemplateColumns: `repeat(${Math.min(visibleCount, count)}, 1fr)`,
                gap:                 '20px',
              }}>
                {visibleEmbeds.map(e => (
                  <div key={e.index}>{renderEmbed(e)}</div>
                ))}
              </div>

              {showCarousel && <ArrowBtn dir="next" onClick={next} color={textColor} />}
            </div>

            {/* Dots — only when carousel is active */}
            {showCarousel && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                {embeds.map((_, i) => (
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

      </div>
    </section>
  )
}
