import { useTheme } from '../../store/themeStore.jsx'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'

export default function FooterPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.footer

  const brand          = data.brand          || 'Brand'
  const tagline        = data.tagline        || ''
  const links          = data.links          || []
  const serviceLinks   = data.serviceLinks   || []
  const copyright      = data.copyright      || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`
  const address        = data.address        || ''
  const phone          = data.phone          || ''
  const email          = data.email          || ''

  const textColor = template.textColor || '#ffffff'
  const linkColor = template.linkColor || textColor
  const fontSize  = template.fontSize  || '14px'

  const footerStyle = {
    backgroundColor: template.bgColor || '#0f1f5c',
    width:           '100%',
    boxSizing:       'border-box',
    color:           textColor,
    fontFamily:      'Inter, sans-serif',
  }

  const gridPadding = {
    padding: template.padding || '40px 32px',
  }

  const col1Style = {
    display:       'flex',
    flexDirection: 'column',
    gap:           '10px',
  }

  const col234Style = {
    display:       'flex',
    flexDirection: 'column',
    gap:           '8px',
  }

  const brandStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.2)`,
    fontWeight: '700',
    margin:     0,
  }

  const taglineStyle = {
    color:    textColor,
    fontSize,
    opacity:  0.7,
    margin:   0,
  }

  const contactLineStyle = {
    color:      textColor,
    fontSize,
    opacity:    0.8,
    margin:     0,
    display:    'flex',
    alignItems: 'flex-start',
    gap:        '6px',
  }

  const colHeadingStyle = {
    color:         textColor,
    fontSize:      `calc(${fontSize} * 0.85)`,
    fontWeight:    '600',
    opacity:       0.6,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin:        '0 0 4px',
  }

  const linkStyle = {
    color:          linkColor,
    fontSize,
    textDecoration: 'none',
    opacity:        0.85,
    display:        'block',
  }

  const socialBtnStyle = {
    display:         'inline-flex',
    alignItems:      'center',
    justifyContent:  'center',
    width:           '32px',
    height:          '32px',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius:    '4px',
    color:           textColor,
    fontSize:        '13px',
    fontWeight:      '700',
    textDecoration:  'none',
    flexShrink:      0,
  }

  const bottomBarStyle = {
    borderTop:  '1px solid rgba(255,255,255,0.1)',
    padding:    '16px 32px',
    textAlign:  'center',
    color:      textColor,
    fontSize:   `calc(${fontSize} * 0.85)`,
    opacity:    0.5,
  }

  const isEmpty = !data.brand && !data.tagline && links.length === 0 && serviceLinks.length === 0

  const skel = (w, h, opacity = 1) => ({
    width:           w,
    height:          h,
    borderRadius:    '4px',
    background:      'rgba(255,255,255,0.15)',
    opacity,
    flexShrink:      0,
  })

  if (isEmpty) {
    return (
      <footer style={footerStyle}>
        <div style={gridPadding}>
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={32}>

            {/* Col 1 skeleton */}
            <div style={col1Style}>
              <div style={skel('120px', '18px')} />
              <div style={skel('160px', '12px', 0.5)} />
              <div style={skel('140px', '11px', 0.4)} />
              <div style={skel('140px', '11px', 0.4)} />
              <div style={skel('140px', '11px', 0.4)} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={skel('32px', '32px')} />
                <div style={skel('32px', '32px')} />
              </div>
            </div>

            {/* Col 2 skeleton */}
            <div style={col234Style}>
              <div style={skel('90px',  '10px')} />
              <div style={skel('100px', '11px')} />
              <div style={skel('120px', '11px')} />
              <div style={skel('80px',  '11px')} />
              <div style={skel('110px', '11px')} />
            </div>

            {/* Col 3 skeleton */}
            <div style={col234Style}>
              <div style={skel('90px',  '10px')} />
              <div style={skel('100px', '11px')} />
              <div style={skel('120px', '11px')} />
              <div style={skel('80px',  '11px')} />
              <div style={skel('110px', '11px')} />
            </div>

            {/* Col 4 skeleton */}
            <div style={col234Style}>
              <div style={skel('100%', '200px')} />
            </div>

          </ResponsiveGrid>
        </div>
        <div style={bottomBarStyle}>
          <div style={{ width: '240px', height: '11px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)', margin: '0 auto' }} />
        </div>
      </footer>
    )
  }

  return (
    <footer style={footerStyle}>
      <div style={gridPadding}>
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={32}>

          {/* Col 1 — brand, contact, socials */}
          <div style={col1Style}>
            <p style={brandStyle}>{brand}</p>
            {tagline  && <p style={taglineStyle}>{tagline}</p>}
            
            {email    && <p style={contactLineStyle}><span>✉</span>{email}</p>}
            {phone    && <p style={contactLineStyle}><span>📞</span>{phone}</p>}
            {address  && <p style={contactLineStyle}><span>📍</span>{address}</p>}
            {(data.socialFacebook || data.socialTiktok) && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {data.socialFacebook && (
                  <a href={data.socialFacebook} style={socialBtnStyle} target="_blank" rel="noreferrer">f</a>
                )}
                {data.socialTiktok && (
                  <a href={data.socialTiktok} style={socialBtnStyle} target="_blank" rel="noreferrer">t</a>
                )}
              </div>
            )}
          </div>

          {/* Col 2 — useful links */}
          <div style={col234Style}>
            <p style={colHeadingStyle}>Useful Links</p>
            {links.map((link, i) => (
              <a key={i} href={link.url || '#'} style={linkStyle} target="_blank" rel="noreferrer">
                › {link.label || `Link ${i + 1}`}
              </a>
            ))}
          </div>

          {/* Col 3 — service links */}
          <div style={col234Style}>
            <p style={colHeadingStyle}>Our Services</p>
            {serviceLinks.map((link, i) => (
              <a key={i} href={link.url || '#'} style={linkStyle} target="_blank" rel="noreferrer">
                › {link.label || `Service ${i + 1}`}
              </a>
            ))}
          </div>

          {/* Col 4 — embed placeholder */}
          {data.embedPlaceholder && (
            <div style={col234Style}>
              <div style={{
                backgroundColor: '#1e3080',
                borderRadius:    '6px',
                height:          '200px',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                color:           textColor,
                opacity:         0.5,
                fontSize,
              }}>
                Embed / Social Feed
              </div>
            </div>
          )}

        </ResponsiveGrid>
      </div>

      {/* Bottom bar */}
      <div style={bottomBarStyle}>{copyright}</div>
    </footer>
  )
}

