import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'

const dataFields = [
  { key: 'heading',             label: 'Heading',                  placeholder: 'e.g. Ready to get started?' },
  { key: 'subheading',          label: 'Subheading',               placeholder: 'e.g. Join thousands of happy customers.' },
  { key: 'primaryButtonText',   label: 'Primary Button Text',      placeholder: 'e.g. Get Started' },
  { key: 'primaryButtonUrl',    label: 'Primary Button URL',       placeholder: 'https://...' },
  { key: 'secondaryButtonText', label: 'Secondary Button Text',    placeholder: 'e.g. Learn More' },
  { key: 'secondaryButtonUrl',  label: 'Secondary Button URL',     placeholder: 'https://...' },
]

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', placeholder: 'e.g. 16px' },
  { key: 'padding',  label: 'Padding',   placeholder: 'e.g. 64px 32px' },
]

export default function CTABuilder() {
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

      <section>
        <h3 className="mb-3">Content</h3>
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

      <section>
        <h3 className="mb-3">Style</h3>
        <div className="space-y-3">
          <ColorInput label="Background Color"      value={template.bgColor          ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
          <ColorInput label="Text Color"            value={template.textColor        ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
          <ColorInput label="Primary Button Bg"     value={template.primaryBtnBg     ?? '#000000'} onChange={v => handleTemplate('primaryBtnBg', v)} />
          <ColorInput label="Primary Button Text"   value={template.primaryBtnText   ?? '#000000'} onChange={v => handleTemplate('primaryBtnText', v)} />
          <ColorInput label="Secondary Button Bg"   value={template.secondaryBtnBg   ?? '#000000'} onChange={v => handleTemplate('secondaryBtnBg', v)} />
          <ColorInput label="Secondary Button Text" value={template.secondaryBtnText ?? '#000000'} onChange={v => handleTemplate('secondaryBtnText', v)} />

          {textTemplateFields.map(({ key, label, placeholder }) => (
            <label key={key} className="flex flex-col gap-1">
              {label}
              <input
                type="text"
                value={template[key] ?? ''}
                placeholder={placeholder}
                onChange={e => handleTemplate(key, e.target.value)}
              />
            </label>
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
        </div>
      </section>
    </div>
  )
}
