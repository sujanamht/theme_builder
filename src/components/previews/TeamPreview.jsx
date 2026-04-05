import { useTheme } from '../../store/themeStore.jsx'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { parsePx } from '../../utils/style.js'

export default function TeamPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.team
  const { globalTheme } = theme

  const paddingY = parsePx(template.paddingY) ?? parsePx(template.sectionPaddingTop) ?? 80

  const displayMode       = template.displayMode       || 'grid'
  const sectionBackground = template.sectionBackground || '#ffffff'
  const columns           = template.columns           || '3'
  const imageHeight       = template.imageHeight       || '280px'
  const imageBorderRadius = template.imageBorderRadius || '8px'
  const headingColor      = template.headingColor      || '#111111'
  const headingSize       = template.headingSize       || globalTheme.headingSize || '2rem'
  const descColor         = template.descColor         || '#888888'
  const descSize          = template.descSize          || globalTheme.bodySize    || '0.95rem'
  const nameColor         = template.nameColor         || '#111111'
  const nameSize          = template.nameSize          || '1rem'
  const roleColor         = template.roleColor         || '#888888'
  const roleSize          = template.roleSize          || '0.875rem'
  const contactColor      = template.contactColor      || '#555555'
  const contactSize       = template.contactSize       || '0.8rem'
  const cardGap           = template.cardGap           || '32px'

  function renderMember(member) {
    return (
      <>
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            style={{
              width:        '100%',
              height:       imageHeight,
              objectFit:    'cover',
              borderRadius: imageBorderRadius,
              marginBottom: '16px',
              display:      'block',
            }}
          />
        ) : (
          <div
            style={{
              width:           '100%',
              height:          imageHeight,
              borderRadius:    imageBorderRadius,
              backgroundColor: '#e5e7eb',
              marginBottom:    '16px',
            }}
          />
        )}
        <p style={{ color: nameColor,    fontSize: nameSize,    fontWeight: 700, margin: '0 0 4px' }}>
          {member.name || ''}
        </p>
        <p style={{ color: roleColor,    fontSize: roleSize,    margin: '0 0 8px' }}>
          {member.role || ''}
        </p>
        <p style={{ color: contactColor, fontSize: contactSize, margin: '0 0 2px' }}>
          {member.email || ''}
        </p>
        <p style={{ color: contactColor, fontSize: contactSize, margin: 0 }}>
          {member.phone || ''}
        </p>
      </>
    )
  }

  return (
    <section
      style={{
        backgroundColor: sectionBackground,
        width:           '100%',
        boxSizing:       'border-box',
        paddingTop:      `${paddingY}px`,
        paddingBottom:   `${paddingY}px`,
      }}
    >
      <div
        style={{
          maxWidth:  CONTENT_MAX_WIDTH,
          margin:    '0 auto',
          padding:   '0 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Heading + Description */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              color:      headingColor,
              fontSize:   headingSize,
              fontWeight: 700,
              margin:     '0 0 16px',
              lineHeight: 1.2,
            }}
          >
            {data.heading || 'Meet Our Team'}
          </h2>
          <p
            style={{
              color:      descColor,
              fontSize:   descSize,
              lineHeight: 1.75,
              margin:     0,
            }}
          >
            {data.description || ''}
          </p>
        </div>

        {/* Member Grid / Single Row / Carousel */}
        {displayMode === 'carousel' ? (
          <div
            style={{
              display:    'flex',
              overflowX:  'auto',
              gap:        cardGap,
              paddingBottom: '8px',
            }}
          >
            {(data.members ?? []).map((member, i) => (
              <div key={i} style={{ minWidth: '260px', flex: '0 0 260px' }}>
                {renderMember(member)}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap:                 cardGap,
              }}
            >
              {(displayMode === 'single-row'
                ? (data.members ?? []).slice(0, parseInt(columns))
                : (data.members ?? [])
              ).map((member, i) => (
                <div key={i}>{renderMember(member)}</div>
              ))}
            </div>
            {displayMode === 'single-row' && (
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <a href="#" style={{ color: '#6366f1', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                  View all →
                </a>
              </div>
            )}
          </>
        )}
      </div>
      
    </section>
  )
}
