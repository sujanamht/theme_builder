import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const formFields = [
  { key: 'nameLabel',    label: 'Name Field Label',    placeholder: 'e.g. Your Name' },
  { key: 'emailLabel',   label: 'Email Field Label',   placeholder: 'e.g. Email Address' },
  { key: 'messageLabel', label: 'Message Field Label', placeholder: 'e.g. Message' },
  { key: 'submitText',   label: 'Submit Button Text',  placeholder: 'e.g. Send Message' },
]

const socialFields = [
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'twitter',   label: 'Twitter / X URL', placeholder: 'https://x.com/...' },
  { key: 'linkedin',  label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/in/...' },
  { key: 'facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/...' },
]

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', min: 10, max: 32,  step: 1 },
  { key: 'padding',  label: 'Padding',   min: 0,  max: 120, step: 8 },
]

export default function ContactBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.contact

  function handleData(key, value) {
    updateSection('contact', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('contact', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Contact</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Contact Form</h3>
          <div className="space-y-3">
            {formFields.map(({ key, label, placeholder }) => (
              <label key={key} className="flex flex-col gap-1">
                {label}
                <input
                  type="text"
                  value={data[key] ?? ''}
                  placeholder={placeholder}
                  onChange={e => handleData(key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Social Links</h3>
          <div className="space-y-3">
            {socialFields.map(({ key, label, placeholder }) => (
              <label key={key} className="flex flex-col gap-1">
                {label}
                <input
                  type="text"
                  value={data[key] ?? ''}
                  placeholder={placeholder}
                  onChange={e => handleData(key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Map Embed</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Google Maps Embed URL
              <input
                type="text"
                value={data.mapUrl ?? ''}
                placeholder="https://www.google.com/maps/embed?pb=..."
                onChange={e => handleData('mapUrl', e.target.value)}
              />
            </label>
            <p className="text-xs text-gray-400">
              In Google Maps → Share → Embed a map → copy the <code>src</code> URL from the iframe code.
            </p>
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor      ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor   ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Accent Color"      value={template.accentColor ?? '#000000'} onChange={v => handleTemplate('accentColor', v)} />
            <ColorInput label="Input Background"  value={template.inputBg     ?? '#000000'} onChange={v => handleTemplate('inputBg', v)} />

            {textTemplateFields.map(({ key, label, min, max, step }) => (
              <RangeField
                key={key}
                label={label}
                value={template[key] ?? ''}
                onChange={v => handleTemplate(key, v)}
                min={min} max={max} step={step}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
