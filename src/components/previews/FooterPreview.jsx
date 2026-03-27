import { useTheme } from '../../store/themeStore.jsx'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'

export default function FooterPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.footer

  const brand        = data.brand        || 'Brand'
  const tagline      = data.tagline      || ''
  const links        = data.links        || []
  const serviceLinks = data.serviceLinks || []
  const copyright    = data.copyright    || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`
  const address      = data.address      || ''
  const phone        = data.phone        || ''
  const email        = data.email        || ''

  const bg          = template.bgColor   || '#0f1117'
  const accentColor = template.linkColor || '#6366f1'
  const fontSize    = template.fontSize  || '14px'

  const footerStyle = {
    backgroundColor: bg,
    width:           '100%',
    boxSizing:       'border-box',
    fontFamily:      'Inter, system-ui, -apple-system, sans-serif',
  }

  const innerStyle = {
    padding:   template.padding || '80px 48px',
    boxSizing: 'border-box',
  }

  const brandStyle = {
    color:         '#ffffff',
    fontSize:      '20px',
    fontWeight:    '700',
    margin:        '0 0 10px',
    letterSpacing: '-0.015em',
    lineHeight:    '1.2',
  }

  const taglineStyle = {
    color:      '#6b7280',
    fontSize,
    margin:     '0 0 28px',
    lineHeight: '1.65',
    maxWidth:   '260px',
  }

  const contactColStyle = {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
  }

  const contactLineStyle = {
    color:      '#6b7280',
    fontSize,
    margin:     0,
    display:    'flex',
    alignItems: 'flex-start',
    gap:        '10px',
    lineHeight: '1.55',
  }

  const contactIconStyle = {
    width:      '14px',
    height:     '14px',
    flexShrink: 0,
    marginTop:  '1px',
    color:      '#4b5563',
  }

  const colStyle = {
    display:       'flex',
    flexDirection: 'column',
  }

  const colHeadingStyle = {
    color:         '#374151',
    fontSize:      '11px',
    fontWeight:    '600',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    margin:        '0 0 18px',
  }

  const socialBtnStyle = {
    display:         'inline-flex',
    alignItems:      'center',
    justifyContent:  'center',
    width:           '34px',
    height:          '34px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border:          '1px solid rgba(255,255,255,0.08)',
    borderRadius:    '6px',
    color:           '#6b7280',
    fontSize:        '12px',
    fontWeight:      '700',
    textDecoration:  'none',
    flexShrink:      0,
  }

  const bottomBarStyle = {
    borderTop:     '1px solid rgba(255,255,255,0.06)',
    padding:       '20px 48px',
    textAlign:     'center',
    color:         '#374151',
    fontSize:      '12px',
    letterSpacing: '0.02em',
    lineHeight:    '1.5',
  }

  // Scoped styles for hover effects (can't do :hover with inline styles)
  const scopedCSS = `
    .fp-link {
      display: block;
      color: #6b7280;
      font-size: ${fontSize};
      text-decoration: none;
      padding: 5px 0 5px 14px;
      border-left: 2px solid transparent;
      transition: color 0.18s ease, border-color 0.18s ease;
      line-height: 1.55;
      box-sizing: border-box;
    }
    .fp-link:hover {
      color: #f9fafb;
      border-left-color: ${accentColor};
    }
    .fp-social:hover {
      background: rgba(255,255,255,0.1) !important;
      color: #e5e7eb !important;
      border-color: rgba(255,255,255,0.15) !important;
    }
  `

  const isEmpty = !data.brand && !data.tagline && links.length === 0 && serviceLinks.length === 0

  const skel = (w, h, op = 1) => ({
    width:        w,
    height:       h,
    borderRadius: '3px',
    background:   'rgba(255,255,255,0.06)',
    opacity:      op,
    flexShrink:   0,
  })

  if (isEmpty) {
    return (
      <footer style={footerStyle}>
        <style>{scopedCSS}</style>
        <div style={innerStyle}>
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={48}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={skel('130px', '20px')} />
              <div style={skel('200px', '13px', 0.6)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                <div style={skel('170px', '13px', 0.4)} />
                <div style={skel('140px', '13px', 0.4)} />
                <div style={skel('200px', '13px', 0.4)} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={skel('80px', '10px')} />
              {[100, 125, 90, 115, 105].map((w, i) => <div key={i} style={skel(`${w}px`, '13px', 0.35)} />)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={skel('90px', '10px')} />
              {[120, 95, 135, 100, 115].map((w, i) => <div key={i} style={skel(`${w}px`, '13px', 0.35)} />)}
            </div>
          </ResponsiveGrid>
        </div>
        <div style={bottomBarStyle}>
          <div style={{ width: '240px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', margin: '0 auto' }} />
        </div>
      </footer>
    )
  }

  return (
    <footer style={footerStyle}>
      <style>{scopedCSS}</style>

      <div style={innerStyle}>
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={48}>

          {/* Col 1 — brand, tagline, contact info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={brandStyle}>{brand}</p>
            {tagline && <p style={taglineStyle}>{tagline}</p>}

            <div style={contactColStyle}>
              {email && (
                <p style={contactLineStyle}>
                  <svg style={contactIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="2,4 12,13 22,4" />
                  </svg>
                  <span>{email}</span>
                </p>
              )}
              {phone && (
                <p style={contactLineStyle}>
                  <svg style={contactIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.4 3.36 2 2 0 0 1 3.4 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{phone}</span>
                </p>
              )}
              {address && (
                <p style={contactLineStyle}>
                  <svg style={contactIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span style={{ maxWidth: '230px' }}>{address}</span>
                </p>
              )}
            </div>

            {(data.socialFacebook || data.socialTiktok) && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                {data.socialFacebook && (
                  <a href={data.socialFacebook} className="fp-social" style={socialBtnStyle} target="_blank" rel="noreferrer">f</a>
                )}
                {data.socialTiktok && (
                  <a href={data.socialTiktok} className="fp-social" style={socialBtnStyle} target="_blank" rel="noreferrer">t</a>
                )}
              </div>
            )}
          </div>

          {/* Col 2 — Useful Links */}
          <div style={colStyle}>
            <p style={colHeadingStyle}>Useful Links</p>
            {links.map((link, i) => (
              <a key={i} href={link.url || '#'} className="fp-link" target="_blank" rel="noreferrer">
                {link.label || `Link ${i + 1}`}
              </a>
            ))}
          </div>

          {/* Col 3 — Our Services */}
          <div style={colStyle}>
            <p style={colHeadingStyle}>Our Services</p>
            {serviceLinks.map((link, i) => (
              <a key={i} href={link.url || '#'} className="fp-link" target="_blank" rel="noreferrer">
                {link.label || `Service ${i + 1}`}
              </a>
            ))}
          </div>

        </ResponsiveGrid>
      </div>

      {/* Copyright bar */}
      <div style={bottomBarStyle}>{copyright}</div>
    </footer>
  )
}
