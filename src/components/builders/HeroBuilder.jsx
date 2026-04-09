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

// single source of truth — preview must not invent fallbacks
export default function HeroBuilder({ activeTab = 'content' }) {
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
            <ImageUploader
              label="Background Image"
              value={data.bgImage ?? ''}
              onChange={v => handleData('bgImage', v)}
            />
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor     ?? '#ffffff'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor   ?? '#0a0a0a'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Button Color"      value={template.btnBg       ?? '#0a0a0a'} onChange={v => handleTemplate('btnBg', v)} />
            <ColorInput label="Button Text Color" value={template.btnText     ?? '#ffffff'} onChange={v => handleTemplate('btnText', v)} />

            <label className="flex flex-col gap-1">
              Eyebrow Text
              <input
                type="text"
                value={template.eyebrowText ?? ''}
                placeholder="e.g. Welcome to Arcova"
                onChange={e => handleTemplate('eyebrowText', e.target.value)}
              />
            </label>

            <RangeField
              label="Heading Font Size"
              value={template.headingSize ?? 56}
              onChange={v => handleTemplate('headingSize', v)}
              min={24} max={96} step={2}
            />

            <label className="flex flex-col gap-1">
              Image Position
              <select
                value={template.imagePosition ?? 'right'}
                onChange={e => handleTemplate('imagePosition', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </label>

            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />

            <button
              onClick={() => updateSection('hero', 'template', { ...template, btnBg: null, fontFamily: null })}
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
