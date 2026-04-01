import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import { useSelection } from '../../store/selectionContext.jsx'
import { useContainerWidth } from '../../hooks/useContainerWidth.js'
import { CONTENT_MAX_WIDTH } from '../../constants/layout.js'

const FIELD_PLACEHOLDERS = {
  name:    'Your name',
  email:   'Email address',
  phone:   'Phone number',
  subject: 'Subject',
  message: 'Your message',
}

export default function FormPreview() {
  const { theme } = useTheme()
  const { data, template } = theme.form
  const { globalTheme } = theme
  const selectedId = useSelection()
  const isActive = selectedId === 'form' || selectedId?.startsWith('form-')
  const darkMode = useDarkMode()

  const { ref, width } = useContainerWidth()
  const isMobile = width < 500

  const bg        = template.bgColor    || (darkMode ? '#18181b' : '#ffffff')
  const textColor = template.textColor  || (darkMode ? '#f4f4f5' : '#111827')
  const buttonBg  = template.buttonBg   || globalTheme.primaryColor || '#6366f1'
  const buttonTxt = template.buttonText || '#ffffff'
  const padding   = isMobile
    ? `24px 20px`
    : `${template.padding ?? 48}px 32px`

  const enabledFields = Object.entries(data.fields ?? {}).filter(([, on]) => on)
  const isEmpty = !data.heading && !data.subheading && enabledFields.length === 0

  const innerStyle = { maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', width: '100%', boxSizing: 'border-box' }

  const inputStyle = {
    display:         'block',
    width:           '100%',
    padding:         '10px 14px',
    fontSize:        '14px',
    color:           textColor,
    background:      darkMode ? 'transparent' : '#f9fafb',
    border:          darkMode ? `1px solid ${textColor}33` : '1px solid #d1d5db',
    borderRadius:    '6px',
    boxSizing:       'border-box',
    outline:         'none',
    fontFamily:      'inherit',
    resize:          'none',
  }

  const skeletonBox = (w, h, mb = 0) => ({
    width:           w,
    height:          h,
    borderRadius:    '6px',
    backgroundColor: darkMode ? '#3f3f46' : '#d1d5db',
    marginBottom:    mb,
  })

  return (
    <section ref={ref} style={{ backgroundColor: bg, padding, width: '100%', boxSizing: 'border-box', fontFamily: template.fontFamily || globalTheme.fontFamily || 'inherit' }}>
      <div style={innerStyle}><div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {isEmpty ? (
          <>
            <div style={skeletonBox('50%', '28px', 12)} />
            <div style={skeletonBox('75%', '14px', 32)} />
            <div style={skeletonBox('100%', '40px', 12)} />
            <div style={skeletonBox('100%', '40px', 12)} />
            <div style={skeletonBox('100%', '88px', 20)} />
            <div style={skeletonBox('120px', '42px', 0)} />
          </>
        ) : (
          <>
            {data.heading && (
              <h2 style={{ color: textColor, fontSize: isMobile ? '20px' : '26px', fontWeight: '700', margin: '0 0 8px', lineHeight: '1.2' }}>
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p style={{ color: textColor, fontSize: '15px', opacity: 0.7, margin: '0 0 28px', lineHeight: '1.6' }}>
                {data.subheading}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {enabledFields.map(([key]) => (
                key === 'message' ? (
                  <textarea
                    key={key}
                    placeholder={FIELD_PLACEHOLDERS[key]}
                    rows={4}
                    readOnly
                    style={inputStyle}
                  />
                ) : key === 'consent' ? (
                  <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'default' }}>
                    <input type="checkbox" readOnly style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ color: textColor, fontSize: '13px', opacity: 0.8, lineHeight: '1.5' }}>
                      {data.consentText || 'I agree to the privacy policy.'}
                    </span>
                  </label>
                ) : (
                  <input
                    key={key}
                    type="text"
                    placeholder={FIELD_PLACEHOLDERS[key]}
                    readOnly
                    style={inputStyle}
                  />
                )
              ))}

              <button
                style={{
                  alignSelf:       'flex-start',
                  padding:         '12px 28px',
                  background:      buttonBg,
                  color:           buttonTxt,
                  border:          'none',
                  borderRadius:    '7px',
                  fontSize:        '14px',
                  fontWeight:      '600',
                  cursor:          'default',
                  fontFamily:      'inherit',
                  lineHeight:      '1',
                  marginTop:       '4px',
                }}
              >
                {data.submitLabel || 'Submit'}
              </button>
            </div>
          </>
        )}
      </div></div>
    </section>
  )
}
