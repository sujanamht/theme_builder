import { useTheme } from '../../store/themeStore.jsx'

/* ── Inline SVG icons ──────────────────────────────────────────────── */
function IconInstagram({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/>
    </svg>
  )
}

function IconTwitterX({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function IconLinkedIn({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function IconFacebook({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: IconInstagram,
  twitter:   IconTwitterX,
  linkedin:  IconLinkedIn,
  facebook:  IconFacebook,
}

const SOCIAL_KEYS = ['instagram', 'twitter', 'linkedin', 'facebook']

export default function ContactPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.contact

  const bgColor     = template.bgColor     || '#f9fafb'
  const textColor   = template.textColor   || '#111827'
  const accentColor = template.accentColor || '#6366f1'
  const inputBg     = template.inputBg     || '#ffffff'
  const fontSize    = template.fontSize    || '14px'
  const padding     = template.padding     || '64px'

  const nameLabel    = data.nameLabel    || 'Your Name'
  const emailLabel   = data.emailLabel   || 'Email Address'
  const messageLabel = data.messageLabel || 'Message'
  const submitText   = data.submitText   || 'Send Message'

  const hasMap     = Boolean(data.mapUrl)
  const socialUrls = SOCIAL_KEYS.filter(k => data[k])

  const sectionStyle = {
    backgroundColor: bgColor,
    padding:         `${parseInt(padding) || 64}px 32px`,
    width:           '100%',
    boxSizing:       'border-box',
    color:           textColor,
    fontSize,
  }

  const innerStyle = {
    display:             'grid',
    gridTemplateColumns: hasMap ? '1fr 1fr' : '1fr',
    gap:                 '40px',
    maxWidth:            '860px',
    margin:              '0 auto',
    alignItems:          'start',
  }

  const labelStyle = {
    display:      'block',
    fontSize:     `calc(${fontSize} * 0.9)`,
    fontWeight:   '500',
    color:        textColor,
    marginBottom: '5px',
  }

  const inputStyle = {
    width:        '100%',
    boxSizing:    'border-box',
    padding:      '9px 12px',
    fontSize,
    color:        textColor,
    background:   inputBg,
    border:       `1px solid ${accentColor}33`,
    borderRadius: '6px',
    outline:      'none',
    display:      'block',
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight:  '100px',
    resize:     'vertical',
    fontFamily: 'inherit',
  }

  const submitStyle = {
    backgroundColor: accentColor,
    color:           '#ffffff',
    fontSize,
    fontWeight:      '600',
    padding:         '10px 28px',
    borderRadius:    '6px',
    border:          'none',
    cursor:          'pointer',
    marginTop:       '4px',
    display:         'inline-block',
  }

  const socialRowStyle = {
    display:    'flex',
    gap:        '14px',
    marginTop:  '20px',
    flexWrap:   'wrap',
    alignItems: 'center',
  }

  const iconLinkStyle = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    width:          '38px',
    height:         '38px',
    borderRadius:   '50%',
    background:     `${accentColor}18`,
    flexShrink:     0,
    textDecoration: 'none',
  }

  const mapStyle = {
    width:        '100%',
    aspectRatio:  '4/3',
    borderRadius: '10px',
    border:       'none',
    display:      'block',
  }

  const mapPlaceholderStyle = {
    width:          '100%',
    aspectRatio:    '4/3',
    borderRadius:   '10px',
    background:     `${accentColor}10`,
    border:         `2px dashed ${accentColor}40`,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    color:          textColor,
    opacity:        0.4,
    fontSize:       `calc(${fontSize} * 0.9)`,
  }

  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        {/* Left — form + social */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={labelStyle}>{nameLabel}</span>
              <input readOnly style={inputStyle} placeholder={nameLabel} />
            </div>
            <div>
              <span style={labelStyle}>{emailLabel}</span>
              <input readOnly style={inputStyle} placeholder={emailLabel} />
            </div>
            <div>
              <span style={labelStyle}>{messageLabel}</span>
              <textarea readOnly style={textareaStyle} placeholder={messageLabel} />
            </div>
            <div>
              <button style={submitStyle}>{submitText}</button>
            </div>
          </div>

          {socialUrls.length > 0 && (
            <div style={socialRowStyle}>
              {socialUrls.map(key => {
                const Icon = SOCIAL_ICONS[key]
                return (
                  <a
                    key={key}
                    href={data[key]}
                    style={iconLinkStyle}
                    onClick={e => e.preventDefault()}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    <Icon size={18} color={accentColor} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Right — map (only rendered if hasMap or always shown as placeholder in two-col) */}
        {hasMap ? (
          <iframe
            src={data.mapUrl}
            style={mapStyle}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />
        ) : null}
      </div>
    </section>
  )
}
