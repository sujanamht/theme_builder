import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../store/themeStore.jsx'
import { hexToRgba } from '../../utils/colorUtils.js'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { SECTION_PADDING_X, SECTION_PADDING_X_MOBILE } from '../../constants/design.js'
import { parsePx } from '../../utils/style.js'
import { headingStyle } from '../../utils/typography.js'

export default function BlogPostPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.blogPost
  const { globalTheme } = theme
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isPreview = pathname.startsWith('/preview')

  const postId = searchParams.get('postId')
  const posts  = theme.bloglist?.data?.posts ?? []
  const post   = (postId ? posts.find(p => p.id === postId) : null) ?? data

  const { ref, width: containerWidth } = useContainerWidth()
  const isMobile = containerWidth < 500

  const textColor   = template.textColor   || '#111827'
  const accentColor = template.accentColor || globalTheme.primaryColor || '#6366f1'
  const bgColor     = template.bgColor     || '#ffffff'
  const fontSize    = parsePx(template.fontSize) || 16
  const padding     = parseInt(template.padding, 10) || 64

  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const paragraphs = post.paragraphs ?? []
  const tags       = post.tags       ?? []

  return (
    <div ref={ref} style={{
      backgroundColor: bgColor,
      width:           '100%',
      boxSizing:       'border-box',
      fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
    }}>
      {/* Featured image — full width, max-height 480px */}
      {post.coverImage && (
        <div style={{ position: 'relative', width: '100%' }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
          />
          {isPreview && (
            <button
              onClick={() => navigate('/preview/blog')}
              style={{
                position:       'absolute',
                top:            '20px',
                left:           '24px',
                background:     'rgba(0,0,0,0.45)',
                border:         'none',
                borderRadius:   '6px',
                cursor:         'pointer',
                color:          '#ffffff',
                fontSize:       '13px',
                fontWeight:     600,
                padding:        '8px 16px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                backdropFilter: 'blur(4px)',
              }}
            >
              ← Back to Blog
            </button>
          )}
        </div>
      )}

      {/* Content container */}
      <div style={{
        maxWidth:      CONTENT_MAX_WIDTH,
        margin:        '0 auto',
        paddingTop:    `${padding}px`,
        paddingBottom: `${padding}px`,
        paddingLeft:   isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
        paddingRight:  isMobile ? `${SECTION_PADDING_X_MOBILE}px` : `${SECTION_PADDING_X}px`,
        boxSizing:     'border-box',
      }}>
        {/* Category tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {tags.map(tag => (
              <span key={tag} style={{
                background:   hexToRgba(accentColor, 0.12),
                color:        accentColor,
                fontSize:     '11px',
                padding:      '3px 10px',
                borderRadius: '999px',
                fontWeight:   '600',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        {post.title && (
          <h1 style={{
            ...headingStyle({ template, globalTheme, textColor }),
            margin: '0 0 16px',
          }}>
            {post.title}
          </h1>
        )}

        {/* Author + date */}
        {(post.author || post.date) && (
          <p style={{ color: textColor, opacity: 0.55, fontSize: '13px', margin: '0 0 28px' }}>
            {post.author}
            {post.author && post.date ? ' · ' : ''}
            {formatDate(post.date)}
          </p>
        )}

        <hr style={{ border: 'none', borderTop: `1px solid ${textColor}`, opacity: 0.1, marginBottom: '32px' }} />

        {/* Body paragraphs */}
        {paragraphs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {paragraphs.map((para, i) => (
              <p key={i} style={{
                color:      textColor,
                opacity:    0.85,
                fontSize:   `${fontSize}px`,
                lineHeight: '1.75',
                margin:     0,
              }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p style={{ color: textColor, opacity: 0.3, fontSize: `${fontSize}px`, fontStyle: 'italic' }}>
            No content yet — add paragraphs in the Blog Post builder.
          </p>
        )}
      </div>
    </div>
  )
}
