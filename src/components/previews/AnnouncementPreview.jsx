import { useTheme } from '../../store/themeStore.jsx'

export default function AnnouncementPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.announcement

  const barStyle = {
    backgroundColor: template.bgColor   || '#1d4ed8',
    color:           template.textColor || '#ffffff',
    fontSize:        template.fontSize  || '14px',
    padding:         template.padding   || '8px 16px',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '8px',
    width:           '100%',
    boxSizing:       'border-box',
  }

  const linkStyle = {
    color:          template.textColor || '#ffffff',
    fontWeight:     '600',
    textDecoration: 'underline',
    fontSize:       template.fontSize  || '14px',
  }

  const message  = data.message  || 'Your announcement message goes here.'
  const linkText = data.linkText
  const linkUrl  = data.linkUrl  || '#'

  return (
    <div style={barStyle}>
      <span>{message}</span>
      {linkText && (
        <a href={linkUrl} style={linkStyle} target="_blank" rel="noreferrer">
          {linkText}
        </a>
      )}
    </div>
  )
}
