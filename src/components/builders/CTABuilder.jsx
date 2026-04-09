import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const dataFields = [
  { key: 'heading',             label: 'Heading',               placeholder: 'e.g. Ready to get started?' },
  { key: 'subheading',          label: 'Subheading',            placeholder: 'e.g. Join thousands of happy customers.' },
  { key: 'primaryButtonText',   label: 'Primary Button Text',   placeholder: 'e.g. Get Started' },
  { key: 'primaryButtonUrl',    label: 'Primary Button URL',    placeholder: 'https://...' },
  { key: 'secondaryButtonText', label: 'Secondary Button Text', placeholder: 'e.g. Learn More' },
  { key: 'secondaryButtonUrl',  label: 'Secondary Button URL',  placeholder: 'https://...' },
]

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', min: 10, max: 32,  step: 1 },
]

// single source of truth — preview must not invent fallbacks
export default function CTABuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.cta

  function handleData(key, value) {
    updateSection('cta', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('cta', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">CTA</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            {dataFields.map(({ key, label, placeholder }) => (
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

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color"      value={template.bgColor          ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"            value={template.textColor        ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Primary Button Bg"     value={template.primaryBtnBg     ?? '#000000'} onChange={v => handleTemplate('primaryBtnBg', v)} />
            <ColorInput label="Primary Button Text"   value={template.primaryBtnText   ?? '#000000'} onChange={v => handleTemplate('primaryBtnText', v)} />
            <ColorInput label="Secondary Button Bg"   value={template.secondaryBtnBg   ?? '#000000'} onChange={v => handleTemplate('secondaryBtnBg', v)} />
            <ColorInput label="Secondary Button Text" value={template.secondaryBtnText ?? '#000000'} onChange={v => handleTemplate('secondaryBtnText', v)} />

            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />
            {textTemplateFields.map(({ key, label, min, max, step }) => (
              <RangeField
                key={key}
                label={label}
                value={template[key] ?? ''}
                onChange={v => handleTemplate(key, v)}
                min={min} max={max} step={step}
              />
            ))}

            <label className="flex flex-col gap-1">
              Text Align
              <select
                value={template.textAlign ?? 'center'}
                onChange={e => handleTemplate('textAlign', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('cta', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
