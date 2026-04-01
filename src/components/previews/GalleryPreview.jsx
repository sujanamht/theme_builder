import { useTheme } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import CanvasUpload from '../ui/CanvasUpload.jsx'
import ResponsiveGrid from '../ui/ResponsiveGrid.jsx'
import { hexToRgba } from '../../utils/colorUtils.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'

export default function GalleryPreview() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.gallery
  const { globalTheme } = theme
  const selectedId = useSelection()
  const isActive = selectedId === 'gallery' || selectedId?.startsWith('gallery-')

  const heading    = data.heading    || ''
  const subheading = data.subheading || ''
  const items      = data.items      || []

  function handleImageUpload(index, imageUrl) {
    const updated = items.map((item, i) => i === index ? { ...item, image: imageUrl } : item)
    updateSection('gallery', 'data', { ...data, items: updated })
  }

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const textColor  = template.textColor    || '#111827'
  const fontSize   = template.fontSize     || '14px'
  const radius     = template.borderRadius || '8px'
  const captionBg  = template.captionBg    || '#000000'

  const sectionStyle = {
    backgroundColor: template.bgColor || '#f9fafb',
    padding:         template.padding || '64px 32px',
    width:           '100%',
    boxSizing:       'border-box',
    fontFamily:      template.fontFamily || globalTheme.fontFamily || 'inherit',
  }

  const headingStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.9)`,
    fontWeight: '800',
    margin:     '0 0 10px',
    textAlign:  'center',
    lineHeight: '1.2',
  }

  const subheadingStyle = {
    color:      textColor,
    fontSize:   `calc(${fontSize} * 1.05)`,
    opacity:    0.6,
    margin:     '0 0 32px',
    textAlign:  'center',
    lineHeight: '1.6',
  }

  const itemWrapStyle = {
    position:     'relative',
    paddingBottom:'75%',
    borderRadius: radius,
    overflow:     'hidden',
    background:   '#e5e7eb',
  }

  const imgStyle = {
    position:   'absolute',
    top:        0,
    left:       0,
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
  }

  const emptyStyle = {
    color:     textColor,
    opacity:   0.3,
    fontSize,
    textAlign: 'center',
    padding:   '24px 0',
  }

  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
      {heading    && <h2 style={headingStyle}>{heading}</h2>}
      {subheading && <p style={subheadingStyle}>{subheading}</p>}

      {items.length === 0 ? (
        <p style={emptyStyle}>No images yet — add some in the editor.</p>
      ) : (
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={16}>
          {items.map((item, i) => (
            <CanvasUpload
              key={i}
              hasImage={!!item.image}
              isActive={isActive}
              onUpload={v => handleImageUpload(i, v)}
              style={itemWrapStyle}
              aspectRatio="4/3"
              onCrop={v => handleImageUpload(i, v)}
            >
              <img src={item.image} alt={item.caption || ''} style={imgStyle} />
              {item.caption && (
                <div style={{
                  position:        'absolute',
                  bottom:          0,
                  left:            0,
                  right:           0,
                  background:      hexToRgba(captionBg, 0.72),
                  color:           textColor,
                  fontSize:        `calc(${fontSize} * 0.85)`,
                  padding:         '6px 10px',
                  backdropFilter:  'blur(4px)',
                }}>
                  {item.caption}
                </div>
              )}
            </CanvasUpload>
          ))}
        </ResponsiveGrid>
      )}
      </div>
    </section>
  )
}
