import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'

export default function AnnouncementPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.announcement
  const darkMode = useDarkMode()

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

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

  return (
    <div ref={ref} style={barStyle}>
      <span>{message}</span>
      {linkText && (
        <a href={linkUrl} style={linkStyle} target="_blank" rel="noreferrer">
          {linkText}
        </a>
      )}
    </div>
  )
}
