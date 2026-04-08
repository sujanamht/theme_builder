import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { useLocation, Link } from 'react-router-dom'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'
import { hexToRgba } from '../../utils/colorUtils.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { parsePx } from '../../utils/style.js'
import { headingStyle, subheadingStyle } from '../../utils/typography.js'

export default function BlogListPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.bloglist
  const { globalTheme } = theme
  const darkMode = useDarkMode()
  const { ref, width } = useContainerWidth()
  const location = useLocation()

  const isPreview = location.pathname.startsWith('/preview')

  const heading    = data.heading    || ''
  const subheading = data.subheading || ''
  const posts      = data.posts      || []

  const textColor   = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')
  const accentColor = template.accentColor || globalTheme.primaryColor || '#6366f1'
  const cardBg      = template.cardBg      || (darkMode ? '#27272a' : '#ffffff')
  const fontSize    = parsePx(template.fontSize) || 15
  const padding     = parseInt(template.padding, 10)  || 64
  const radius      = parseInt(template.borderRadius, 10) ?? 12
  const columns     = parseInt(template.columns, 10) || 3

  const sectionStyle = {
    backgroundColor: template.bgColor || (darkMode ? '#18181b' : '#f9fafb'),
    padding:         `${padding}px 32px`,
    width:           '100%',
    boxSizing:       'border-box',
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const innerStyle = {
    maxWidth:  CONTENT_MAX_WIDTH,
    margin:    '0 auto',
    width:     '100%',
    boxSizing: 'border-box',
  }

  const hStyle = headingStyle({ template, globalTheme, textColor })
  const sStyle = subheadingStyle({ template, globalTheme, textColor, fontSize })

  const cardStyle = {
    backgroundColor: cardBg,
    borderRadius:    `${radius}px`,
    border:          darkMode ? '1px solid #3f3f46' : '1px solid #e5e7eb',
    overflow:        'hidden',
    display:         'flex',
    flexDirection:   'column',
    textDecoration:  'none',
    color:           'inherit',
  }

  const tabletCols = Math.min(2, columns)

  function CardWrapper({ post, children }) {
    if (isPreview) {
      return (
        <Link to={`/preview/blogpost?postId=${post.id}`} style={cardStyle}>
          {children}
        </Link>
      )
    }
    return <div style={{ ...cardStyle, cursor: 'default' }}>{children}</div>
  }

  return (
    <section ref={ref} style={sectionStyle}>
      <div style={innerStyle}>
        {heading    && <h2 style={hStyle}>{heading}</h2>}
        {subheading && <p  style={sStyle}>{subheading}</p>}

        {posts.length === 0 && (
          <p style={{ color: textColor, opacity: 0.3, fontSize: `${fontSize}px`, textAlign: 'center', padding: '24px 0' }}>
            No posts yet — add some in the editor.
          </p>
        )}

        {posts.length > 0 && (
          <ResponsiveGrid cols={{ mobile: 1, tablet: tabletCols, desktop: columns }} gap={24}>
            {posts.map(post => (
              <CardWrapper key={post.id} post={post}>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{
                      width:        '100%',
                      aspectRatio:  '16/9',
                      objectFit:    'cover',
                      borderRadius: `${radius}px ${radius}px 0 0`,
                      display:      'block',
                    }}
                  />
                )}

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {post.tags.map(tag => (
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

                  {post.title && (
                    <p style={{
                      color:              textColor,
                      fontSize:           `${fontSize}px`,
                      fontWeight:         '700',
                      margin:             0,
                      display:            '-webkit-box',
                      WebkitLineClamp:    2,
                      WebkitBoxOrient:    'vertical',
                      overflow:           'hidden',
                      lineHeight:         '1.4',
                    }}>
                      {post.title}
                    </p>
                  )}

                  {post.excerpt && (
                    <p style={{
                      color:           textColor,
                      opacity:         0.65,
                      fontSize:        `${fontSize - 1}px`,
                      margin:          0,
                      lineHeight:      '1.6',
                      display:         '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow:        'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                  )}

                  <p style={{ color: textColor, opacity: 0.5, fontSize: '12px', margin: '0 0 0' }}>
                    {post.author}
                    {post.author && post.date && ' · '}
                    {post.date && new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </CardWrapper>
            ))}
          </ResponsiveGrid>
        )}
      </div>
    </section>
  )
}
