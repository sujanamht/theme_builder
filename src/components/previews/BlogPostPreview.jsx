import { useState } from 'react'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
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

  const [selectedPostId, setSelectedPostId] = useState(() => posts[0]?.id ?? null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [mobileView, setMobileView]         = useState('list') // 'list' | 'detail'

  const textColor   = template.textColor   || (darkMode ? '#f4f4f5' : '#111827')
  const accentColor = template.accentColor || globalTheme.primaryColor || '#6366f1'
  const bgColor     = template.bgColor     || (darkMode ? '#18181b' : '#ffffff')
  const fontSize    = parsePx(template.fontSize) || 16
  const padding     = parseInt(template.padding, 10)  || 64
  const maxWidth    = parseInt(template.maxWidth, 10)  || 720

  const isNarrow = width < 600

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activePost = posts.find(p => p.id === selectedPostId) ?? null

  const sidebarBg    = darkMode ? '#111113' : '#f9fafb'
  const borderColor  = darkMode ? '#3f3f46' : '#e5e7eb'
  const mutedText    = darkMode ? '#71717a' : '#9ca3af'

  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  /* ── Sidebar ── */
  const sidebar = (
    <div style={{
      width:        '260px',
      minWidth:     '260px',
      borderRight:  `1px solid ${borderColor}`,
      display:      'flex',
      flexDirection:'column',
      overflowY:    'auto',
      minHeight:    0,
      backgroundColor: sidebarBg,
      fontFamily:   template.fontFamily || globalTheme.fontFamily || 'inherit',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
        <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: textColor }}>All Articles</p>
      </div>

      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${borderColor}` }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width:        '100%',
            boxSizing:    'border-box',
            padding:      '8px 12px',
            borderRadius: '8px',
            border:       `1px solid ${borderColor}`,
            fontSize:     '13px',
            background:   bgColor,
            color:        textColor,
            outline:      'none',
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredPosts.length === 0 && (
          <p style={{ padding: '16px', fontSize: '13px', color: mutedText, margin: 0 }}>
            No articles available yet.
          </p>
        )}
        {filteredPosts.map(post => {
          const isActive = post.id === selectedPostId
          return (
            <div
              key={post.id}
              onClick={() => {
                setSelectedPostId(post.id)
                if (isNarrow) setMobileView('detail')
              }}
              style={{
                padding:     '12px 16px',
                cursor:      'pointer',
                borderLeft:  isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                background:  isActive ? hexToRgba(accentColor, 0.07) : 'transparent',
                transition:  'background 0.15s',
              }}
            >
              <p style={{
                margin:          '0 0 4px',
                fontSize:        '13px',
                fontWeight:      '600',
                color:           textColor,
                display:         '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow:        'hidden',
                lineHeight:      '1.4',
              }}>
                {post.title || '(Untitled)'}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: textColor, opacity: 0.5 }}>
                {post.author}{post.author && post.date ? ' · ' : ''}{formatDate(post.date)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )

  /* ── Article content ── */
  const titleFontSize = width < 400 ? '1.6rem' : '2rem'

  const content = (
    <div style={{
      flex:      1,
      overflowY: 'auto',
      minHeight: 0,
      padding:   `${padding}px 0`,
      boxSizing: 'border-box',
      fontFamily: template.fontFamily || globalTheme.fontFamily || 'inherit',
    }}>
      {isNarrow && (
        <button
          onClick={() => setMobileView('list')}
          style={{
            background:    'none',
            border:        'none',
            color:         accentColor,
            fontSize:      '13px',
            fontWeight:    '600',
            cursor:        'pointer',
            padding:       '0 0 20px',
            display:       'block',
          }}
        >
          ← All Posts
        </button>
      )}

      <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '0 40px' }}>
      {!activePost ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1,
minHeight: 0, }}>
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
  )

  /* ── Narrow (mobile) toggling layout ── */
  if (isNarrow) {
    return (
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', flex: 1,
minHeight: 0, backgroundColor: bgColor, overflow: 'hidden' }}>
        {mobileView === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{
              backgroundColor: sidebarBg,
              borderBottom:    `1px solid ${borderColor}`,
              flex:            1,
              overflowY:       'auto',
              fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: textColor }}>All Articles</p>
              </div>
              <div style={{ padding: '10px 12px', borderBottom: `1px solid ${borderColor}` }}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width:        '100%',
                    boxSizing:    'border-box',
                    padding:      '8px 12px',
                    borderRadius: '8px',
                    border:       `1px solid ${borderColor}`,
                    fontSize:     '13px',
                    background:   bgColor,
                    color:        textColor,
                    outline:      'none',
                  }}
                />
              </div>
              {filteredPosts.length === 0 && (
                <p style={{ padding: '16px', fontSize: '13px', color: mutedText, margin: 0 }}>No articles available yet.</p>
              )}
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => { setSelectedPostId(post.id); setMobileView('detail') }}
                  style={{ padding: '12px 16px', cursor: 'pointer', borderLeft: '3px solid transparent' }}
                >
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: textColor,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                    {post.title || '(Untitled)'}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: textColor, opacity: 0.5 }}>
                    {post.author}{post.author && post.date ? ' · ' : ''}{formatDate(post.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: bgColor }}>
            {content}
          </div>
        )}
      </div>
    )
  }

  /* ── Wide layout ── */
  return (
    <div ref={ref} style={{ backgroundColor: bgColor, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display:       'flex',
        flexDirection: 'row',
        flex:          1,
        minHeight:     0,
        maxWidth:      CONTENT_MAX_WIDTH,
        width:         '100%',
        margin:        '0 auto',
      }}>
        {sidebar}
        {content}
      </div>
    </div>
  )
}
