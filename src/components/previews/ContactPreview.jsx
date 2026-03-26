import { useTheme } from '../../store/themeStore.jsx'

/* ── Inline SVG icons ──────────────────────────────────────────────── */
function IconInstagram({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/>
    </svg>
  )
}

function IconFacebook({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function IconTikTok({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  )
}

function IconPin({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IconPhone({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.19 2 2 0 012 .01h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.17-1.17a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 14.92v2z"/>
    </svg>
  )
}

function IconMail({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function IconClock({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
    </svg>
  )
}

const SOCIAL_ICONS = { instagram: IconInstagram, facebook: IconFacebook, tiktok: IconTikTok }
const SOCIAL_COLORS = { instagram: '#e1306c', facebook: '#1877f2', tiktok: '#010101' }

export default function ContactPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.contact

  const bg          = template.bgColor     || '#ffffff'
  const textColor   = template.textColor   || '#111827'
  const accentColor = template.accentColor || '#6366f1'
  const padding     = `${template.padding ?? 64}px 32px`

  const hasMap     = Boolean(data.mapsUrl)
  const activeSocials = Object.entries(data.socials ?? {}).filter(([, url]) => Boolean(url))

  const infoItems = [
    data.address && { icon: IconPin,   label: 'Address', value: data.address },
    data.phone   && { icon: IconPhone, label: 'Phone',   value: data.phone   },
    data.email   && { icon: IconMail,  label: 'Email',   value: data.email   },
    data.hours   && { icon: IconClock, label: 'Hours',   value: data.hours   },
  ].filter(Boolean)

  const isEmpty = !data.heading && !data.subheading && infoItems.length === 0

  const skel = (w, h, mb = 0) => ({
    width: w, height: h, borderRadius: '6px',
    backgroundColor: '#d1d5db', marginBottom: mb,
  })

  return (
    <section style={{ backgroundColor: bg, padding, width: '100%', boxSizing: 'border-box' }}>
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '48px',
        maxWidth:            '1000px',
        margin:              '0 auto',
        alignItems:          'start',
      }}>

        {/* ── Left: info ── */}
        <div>
          {isEmpty ? (
            <>
              <div style={skel('55%', '28px', 12)} />
              <div style={skel('80%', '14px', 32)} />
              <div style={skel('70%', '14px', 12)} />
              <div style={skel('60%', '14px', 12)} />
              <div style={skel('65%', '14px', 12)} />
            </>
          ) : (
            <>
              {data.heading && (
                <h2 style={{ color: textColor, fontSize: '26px', fontWeight: '700', margin: '0 0 8px', lineHeight: '1.2' }}>
                  {data.heading}
                </h2>
              )}
              {data.subheading && (
                <p style={{ color: textColor, fontSize: '15px', opacity: 0.7, margin: '0 0 28px', lineHeight: '1.6' }}>
                  {data.subheading}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      background: `${accentColor}15`, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={15} color={accentColor} />
                    </div>
                    <div>
                      <div style={{ color: textColor, fontSize: '11px', fontWeight: '600', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                        {label}
                      </div>
                      <div style={{ color: textColor, fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeSocials.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
                  {activeSocials.map(([key, url]) => {
                    const Icon  = SOCIAL_ICONS[key]
                    const color = SOCIAL_COLORS[key] || accentColor
                    return (
                      <a
                        key={key}
                        href={url}
                        onClick={e => e.preventDefault()}
                        title={key.charAt(0).toUpperCase() + key.slice(1)}
                        style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: `${color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          textDecoration: 'none', flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={color} />
                      </a>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right: map ── */}
        <div>
          {hasMap ? (
            <iframe
              src={data.mapsUrl}
              style={{ width: '100%', aspectRatio: '4/3', borderRadius: '10px', border: 'none', display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            />
          ) : (
            <div style={{
              width: '100%', aspectRatio: '4/3', borderRadius: '10px',
              background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35 }}>
                <IconPin size={28} color={textColor} />
                <span style={{ fontSize: '12px', color: textColor, fontFamily: 'Inter, sans-serif' }}>Paste a Maps embed URL</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
