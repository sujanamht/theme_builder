import { useTheme } from '../../store/themeStore.jsx'

export default function PageBannerPreview() {
  const { theme } = useTheme()
  const activePage = theme.pages?.activePage ?? 'home'
  const pageData   = theme.pageBanner?.pages?.[activePage] ?? {}
  const template   = theme.pageBanner?.template ?? {}

  return (
    <section
      style={{
        position:           'relative',
        overflow:           'hidden',
        width:              '100%',
        height:             template.bannerHeight || '400px',
        backgroundImage:    pageData.backgroundImage ? `url(${pageData.backgroundImage})` : 'none',
        backgroundSize:     template.backgroundSize     || 'cover',
        backgroundPosition: template.backgroundPosition || 'center',
        backgroundRepeat:   'no-repeat',
        backgroundColor:    pageData.backgroundImage ? 'transparent' : '#1e293b',
      }}
    >
      {/* overlay */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          zIndex:          1,
          backgroundColor: template.overlayColor ?? '#000000',
          opacity:         template.overlayOpacity ?? 0.45,
          pointerEvents:   'none',
        }}
      />

      {/* text */}
      <div
        style={{
          position:       'relative',
          zIndex:         2,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          width:          '100%',
          height:         '100%',
          textAlign:      template.textAlign || 'center',
          padding:        '0 32px',
          boxSizing:      'border-box',
        }}
      >
        <h1
          style={{
            color:      template.headingColor  || '#ffffff',
            fontSize:   template.headingSize   || '2.8rem',
            fontWeight: template.headingWeight || '700',
            margin:     0,
            lineHeight: 1.2,
          }}
        >
          {pageData.heading || 'Page Title'}
        </h1>

        {pageData.subheading && (
          <p
            style={{
              color:      template.subheadingColor || '#eeeeee',
              fontSize:   template.subheadingSize  || '1rem',
              margin:     '12px 0 0',
              lineHeight: 1.6,
            }}
          >
            {pageData.subheading}
          </p>
        )}
      </div>
    </section>
  )
}
