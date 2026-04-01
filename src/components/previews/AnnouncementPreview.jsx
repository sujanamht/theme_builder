import { useState } from 'react'
import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

export default function AnnouncementPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.announcement
  const darkMode = useDarkMode()
  const selectedId = useSelection()
  const isActive = selectedId === 'announcement'

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const barStyle = {
    backgroundColor: template.bgColor   || (darkMode ? '#18181b' : '#1d4ed8'),
    color:           template.textColor || (darkMode ? '#f4f4f5' : '#ffffff'),
    fontSize:        isMobile ? '12px' : (template.fontSize || '14px'),
    padding:         isMobile ? '8px 16px' : (template.padding || '8px 16px'),
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '8px',
    width:           '100%',
    boxSizing:       'border-box',
    position:        'relative',
  }

  const linkStyle = {
    color:          template.textColor || (darkMode ? '#f4f4f5' : '#ffffff'),
    fontWeight:     '600',
    textDecoration: 'underline',
    fontSize:       isMobile ? '12px' : (template.fontSize || '14px'),
  }

  const message  = data.message  || 'Your announcement message goes here.'
  const linkText = data.linkText
  const linkUrl  = data.linkUrl  || '#'
  const speed    = template.marqueeSpeed ?? 30

  const closeBtn = !isActive && (
    <button
      onClick={() => setDismissed(true)}
      style={{
        position:   'absolute',
        right:      0,
        top:        '50%',
        transform:  'translateY(-50%)',
        background: 'none',
        border:     'none',
        color:      'inherit',
        cursor:     'pointer',
        opacity:    0.7,
        padding:    '0 12px',
        fontSize:   '16px',
        lineHeight: 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
      aria-label="Dismiss announcement"
    >
      ×
    </button>
  )

  if (isMobile && template.marquee) {
    const trackItem = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingRight: '4rem' }}>
        <span>{message}</span>
        {linkText && (
          <a href={linkUrl} style={linkStyle} target="_blank" rel="noreferrer">{linkText}</a>
        )}
      </span>
    )

    return (
      <div ref={ref} style={barStyle}>
        <style>{`
          @keyframes announcement-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
        <div style={{ overflow: 'hidden', flex: 1, marginRight: closeBtn ? '32px' : 0 }}>
          <div
            style={{
              display:    'inline-flex',
              whiteSpace: 'nowrap',
              animation:  `announcement-scroll ${speed}s linear infinite`,
            }}
            onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused' }}
            onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running' }}
          >
            {trackItem}
            {trackItem}
          </div>
        </div>
        {closeBtn}
      </div>
    )
  }

  return (
    <div ref={ref} style={barStyle}>
      {isMobile ? (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: closeBtn ? '32px' : 0 }}>
          {message}
        </span>
      ) : (
        <>
          <span>{message}</span>
          {linkText && (
            <a href={linkUrl} style={linkStyle} target="_blank" rel="noreferrer">{linkText}</a>
          )}
        </>
      )}
      {closeBtn}
    </div>
  )
}
