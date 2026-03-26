import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

const dataFields = [
  { key: 'headline',      label: 'Headline',        placeholder: 'e.g. Build something great' },
  { key: 'subheadline',   label: 'Subheadline',     placeholder: 'e.g. The fastest way to ship your idea.' },
  { key: 'ctaText',       label: 'CTA Button Text', placeholder: 'e.g. Get Started' },
  { key: 'ctaUrl',        label: 'CTA Button URL',  placeholder: 'https://...' },
]

const textTemplateFields = [
  { key: 'minHeight', label: 'Min Height', min: 200, max: 800, step: 20 },
]

export default function HeroBuilder() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.hero

  function handleData(key, value) {
    updateSection('hero', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('hero', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Hero</h2>

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
          <ImageUploader
            label="Background Image"
            value={data.bgImage ?? ''}
            onChange={v => handleData('bgImage', v)}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Style</h3>
        <div className="space-y-3">
          <ColorInput label="Background Color" value={template.bgColor     ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
          <ColorInput label="Text Color"        value={template.textColor   ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
          <ColorInput label="Button Color"      value={template.btnBg       ?? '#000000'} onChange={v => handleTemplate('btnBg', v)} />
          <ColorInput label="Button Text Color" value={template.btnText     ?? '#000000'} onChange={v => handleTemplate('btnText', v)} />

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
            Button Border Radius
            <RangeField
              label="Button Radius"
              value={template.btnRadius ?? ''}
              onChange={v => handleTemplate('btnRadius', v)}
              min={0} max={32} step={2}
            />
          </label>

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
