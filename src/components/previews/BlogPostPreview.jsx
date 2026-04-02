import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { hexToRgba } from '../../utils/colorUtils.js'
import { parsePx } from '../../utils/style.js'

export default function BlogPostPreview() {
  const { theme, updateSection } = useTheme()
  const { template } = theme.blogpost
  const { globalTheme } = theme
  const darkMode = useDarkMode()
  const { ref, width } = useContainerWidth()

  const posts = theme.bloglist?.data?.posts ?? []
  const { activePostId, blogView } = theme.blogpost.data

  if (blogView !== 'post') return null

  const textColor   = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')
  const accentColor = template.accentColor || globalTheme.primaryColor || '#6366f1'
  const bgColor     = template.bgColor     || (darkMode ? '#18181b' : '#ffffff')
  const fontSize    = parsePx(template.fontSize) || 16
  const padding     = parseInt(template.padding, 10)  || 64
  const maxWidth    = parseInt(template.maxWidth, 10)  || 720

  const activePost = posts.find(p => p.id === activePostId) ?? null

  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const titleFontSize = width < 400 ? '1.6rem' : '2rem'

  return (
    <div ref={ref} style={{ backgroundColor: bgColor, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        flex:      1,
        overflowY: 'auto',
        minHeight: 0,
        padding:   `${padding}px 0`,
        boxSizing: 'border-box',
        fontFamily: template.fontFamily || globalTheme.fontFamily || 'inherit',
      }}>
        <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '0 40px' }}>
          <button
            onClick={() => updateSection('blogpost', 'data', { ...theme.blogpost.data, blogView: 'list' })}
            style={{
              background:  'none',
              border:      'none',
              color:       accentColor,
              fontSize:    '13px',
              fontWeight:  '600',
              cursor:      'pointer',
              padding:     '0 0 24px',
              display:     'block',
            }}
          >
            ← All Posts
          </button>

          {!activePost ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}>
              <p style={{ color: textColor, opacity: 0.35, fontSize: `${fontSize}px`, textAlign: 'center', maxWidth: '320px', lineHeight: '1.6' }}>
                No blog posts have been published yet. Please check back soon.
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
              <CanvasUpload
                hasImage={!!activePost.coverImage}
                isActive={true}
                aspectRatio="16/9"
                onUpload={v => {
                  const updated = posts.map(p => p.id === activePost.id ? { ...p, coverImage: v } : p)
                  updateSection('bloglist', 'data', { ...theme.bloglist.data, posts: updated })
                }}
                onCrop={v => {
                  const updated = posts.map(p => p.id === activePost.id ? { ...p, coverImage: v } : p)
                  updateSection('bloglist', 'data', { ...theme.bloglist.data, posts: updated })
                }}
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}
              >
                <img src={activePost.coverImage} alt={activePost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </CanvasUpload>

              {activePost.tags && activePost.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {activePost.tags.map(tag => (
                    <span key={tag} style={{
                      background:   hexToRgba(accentColor, 0.12),
                      color:        accentColor,
                      fontSize:     '11px',
                      padding:      '3px 8px',
                      borderRadius: '999px',
                      fontWeight:   '600',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 style={{
                color:      textColor,
                fontSize:   titleFontSize,
                fontWeight: '800',
                lineHeight: '1.2',
                margin:     '0 0 12px',
              }}>
                {activePost.title}
              </h1>

              <p style={{ color: textColor, opacity: 0.55, fontSize: '13px', margin: '0 0 24px' }}>
                {activePost.author}{activePost.author && activePost.date ? ' · ' : ''}{formatDate(activePost.date)}
              </p>

              <hr style={{ border: 'none', borderTop: `1px solid ${textColor}`, opacity: 0.12, marginBottom: '28px' }} />

              <p style={{ color: textColor, opacity: 0.8, fontSize: `${fontSize}px`, lineHeight: '1.75', margin: '0 0 20px' }}>
                {activePost.excerpt}
              </p>

              <div style={{ height: '14px', borderRadius: '6px', background: textColor, opacity: 0.10, marginBottom: '12px', width: '100%' }} />
              <div style={{ height: '14px', borderRadius: '6px', background: textColor, opacity: 0.07, marginBottom: '12px', width: '92%' }} />
              <div style={{ height: '14px', borderRadius: '6px', background: textColor, opacity: 0.04, marginBottom: '12px', width: '60%' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
