import { useTheme } from '../../store/themeStore.jsx'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'
import { parsePx } from '../../utils/style.js'

export default function AboutDetailPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.aboutDetail
  const { globalTheme } = theme

  const sectionPaddingTop    = parsePx(template.sectionPaddingTop)    ?? 80
  const sectionPaddingBottom = parsePx(template.sectionPaddingBottom) ?? 80

  const sectionBackground = template.sectionBackground || '#f8f8f8'
  const headingColor      = template.headingColor      || '#111111'
  const headingSize       = template.headingSize       || globalTheme.headingSize || '2.2rem'
  const descColor         = template.descColor         || '#666666'
  const descSize          = template.descSize          || globalTheme.bodySize   || '1rem'
  const cardBackground    = template.cardBackground    || '#ffffff'
  const cardShadow        = template.cardShadow        || '0 4px 24px rgba(0,0,0,0.08)'
  const cardPadding       = template.cardPadding       || '40px 32px'
  const iconColor         = template.iconColor         || globalTheme?.primaryColor || '#6366f1'
  const iconSize          = template.iconSize          || '2rem'
  const titleColor        = template.titleColor        || '#111111'
  const titleSize         = template.titleSize         || '0.82rem'
  const bodyColor         = template.bodyColor         || '#888888'
  const bodySize          = template.bodySize          || globalTheme.bodySize   || '0.92rem'

  return (
    <section
      style={{
        backgroundColor: sectionBackground,
        width:           '100%',
        boxSizing:       'border-box',
        paddingTop:      `${sectionPaddingTop}px`,
        paddingBottom:   `${sectionPaddingBottom}px`,
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
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              color:      headingColor,
              fontSize:   headingSize,
              fontWeight: 700,
              margin:     '0 0 20px',
              lineHeight: 1.2,
            }}
          >
            {data.heading || 'About Us'}
          </h2>
          <div style={{ margin: '0 auto', textAlign: 'center' }}>
            {(data.descriptions?.length ? data.descriptions : data.description ? [data.description] : ['We build tools that help teams collaborate, move faster, and do their best work.']).map((para, i, arr) => (
              <p
                key={i}
                style={{
                  color:      descColor,
                  fontSize:   descSize,
                  lineHeight: 1.75,
                  margin:     i < arr.length - 1 ? '0 0 1em' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${data.cards.length || 3}, 1fr)`,
            gap:                 '24px',
          }}
        >
          {data.cards.map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: cardBackground,
                boxShadow:       cardShadow,
                padding:         cardPadding,
                borderRadius:    '12px',
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                textAlign:       'center',
              }}
            >
              <i
                className={card.iconClass || 'fa-solid fa-layer-group'}
                style={{ color: iconColor, fontSize: iconSize, lineHeight: 1 }}
              />
              <p
                style={{
                  color:         titleColor,
                  fontSize:      titleSize,
                  fontWeight:    700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin:        '18px 0 12px',
                }}
              >
                {card.title || 'Card Title'}
              </p>
              <p
                style={{
                  color:      bodyColor,
                  fontSize:   bodySize,
                  lineHeight: '1.75',
                  margin:     0,
                }}
              >
                {card.body || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}