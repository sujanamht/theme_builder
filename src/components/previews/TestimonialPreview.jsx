import { useTheme } from '../../store/themeStore.jsx'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Deterministic pastel bg from name string
function avatarColor(name) {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']
  let hash = 0
  for (let i = 0; i < (name?.length ?? 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function TestimonialPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.testimonial

  const heading = data.heading || 'What our customers say'
  const items   = data.items   || []

  const sectionStyle = {
    backgroundColor: template.bgColor  || '#f9fafb',
    color:           template.textColor || '#111827',
    fontSize:        template.fontSize  || '14px',
    padding:         template.padding   || '48px 24px',
    width:           '100%',
    boxSizing:       'border-box',
  }

  const headingStyle = {
    color:        template.textColor || '#111827',
    fontSize:     `calc(${template.fontSize || '14px'} * 1.6)`,
    fontWeight:   '700',
    marginBottom: '28px',
    textAlign:    'center',
  }

  const scrollRowStyle = {
    display:       'flex',
    gap:           '16px',
    overflowX:     'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'thin',
  }

  const cardStyle = {
    backgroundColor: template.cardBg       || '#ffffff',
    borderRadius:    template.borderRadius  || '12px',
    padding:         '20px',
    minWidth:        '240px',
    maxWidth:        '280px',
    flexShrink:      0,
    boxShadow:       '0 1px 4px rgba(0,0,0,0.08)',
    display:         'flex',
    flexDirection:   'column',
    gap:             '16px',
  }

  const quoteStyle = {
    color:      template.textColor || '#111827',
    fontSize:   template.fontSize  || '14px',
    lineHeight: '1.6',
    flex:       1,
  }

  const nameStyle = {
    color:      template.textColor || '#111827',
    fontSize:   `calc(${template.fontSize || '14px'} * 0.95)`,
    fontWeight: '600',
    margin:     0,
  }

  const roleStyle = {
    color:    template.textColor || '#111827',
    fontSize: `calc(${template.fontSize || '14px'} * 0.85)`,
    opacity:  0.6,
    margin:   0,
  }

  const avatarBaseStyle = {
    width:        '36px',
    height:       '36px',
    borderRadius: '50%',
    flexShrink:   0,
    objectFit:    'cover',
  }

  const emptyState = {
    color:      template.textColor || '#9ca3af',
    fontSize:   template.fontSize  || '14px',
    opacity:    0.4,
    textAlign:  'center',
    padding:    '24px 0',
  }

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>{heading}</h2>

      {items.length === 0 ? (
        <p style={emptyState}>No testimonials yet — add some in the editor.</p>
      ) : (
        <div style={scrollRowStyle}>
          {items.map((item, i) => (
            <div key={i} style={cardStyle}>
              {/* Quote */}
              <p style={quoteStyle}>"{item.quote || 'Their quote will appear here.'}"</p>

              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={avatarBaseStyle}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div style={{
                    ...avatarBaseStyle,
                    background:     avatarColor(item.name),
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          '#fff',
                    fontSize:       '12px',
                    fontWeight:     '600',
                  }}>
                    {getInitials(item.name)}
                  </div>
                )}
                <div>
                  <p style={nameStyle}>{item.name || 'Name'}</p>
                  <p style={roleStyle}>{item.role || 'Role'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
