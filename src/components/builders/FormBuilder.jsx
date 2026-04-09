import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const FIELD_LABELS = {
  name:    'Name',
  email:   'Email',
  phone:   'Phone',
  subject: 'Subject',
  message: 'Message',
  consent: 'Consent checkbox',
}

// single source of truth — preview must not invent fallbacks
export default function FormBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.form

  function handleData(key, value) {
    updateSection('form', 'data', { ...data, [key]: value })
  }

  function handleField(key, value) {
    updateSection('form', 'data', { ...data, fields: { ...data.fields, [key]: value } })
  }

  function handleTemplate(key, value) {
    updateSection('form', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Form</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input
                type="text"
                value={data.heading ?? ''}
                placeholder="e.g. Get in touch"
                onChange={e => handleData('heading', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Subheading
              <input
                type="text"
                value={data.subheading ?? ''}
                placeholder="e.g. We'll get back to you within 24 hours."
                onChange={e => handleData('subheading', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Submit Button Label
              <input
                type="text"
                value={data.submitLabel ?? ''}
                placeholder="e.g. Send Message"
                onChange={e => handleData('submitLabel', e.target.value)}
              />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Fields</h3>
          <div className="space-y-2">
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={data.fields?.[key] ?? false}
                  onChange={e => handleField(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
          {data.fields?.consent && (
            <div className="space-y-1" style={{ marginTop: '12px' }}>
              <label className="flex flex-col gap-1">
                Consent Text
                <input
                  type="text"
                  value={data.consentText ?? ''}
                  placeholder="e.g. I agree to the privacy policy."
                  onChange={e => handleData('consentText', e.target.value)}
                />
              </label>
            </div>
          )}
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color"  value={template.bgColor    ?? '#ffffff'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"         value={template.textColor  ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Button Color"       value={template.buttonBg   ?? '#6366f1'} onChange={v => handleTemplate('buttonBg', v)} />
            <ColorInput label="Button Text Color"  value={template.buttonText ?? '#ffffff'} onChange={v => handleTemplate('buttonText', v)} />
            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />

            <button
              onClick={() => updateSection('form', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
              style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline', opacity: 0.8 }}
            >
              ↺ Reset to global theme
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
