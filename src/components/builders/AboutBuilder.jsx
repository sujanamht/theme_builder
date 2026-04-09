import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

// single source of truth — preview must not invent fallbacks
export default function AboutBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.about

  function handleData(key, value) {
    updateSection('about', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('about', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">About</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input
                type="text"
                value={data.heading ?? ''}
                placeholder="e.g. About Us"
                onChange={e => handleData('heading', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              Body
              <textarea
                value={data.body ?? ''}
                placeholder="Your company description..."
                onChange={e => handleData('body', e.target.value)}
                rows={4}
              />
            </label>

            <label className="flex flex-col gap-1">
              Button Text
              <input
                type="text"
                value={data.buttonText ?? ''}
                placeholder="e.g. Learn more"
                onChange={e => handleData('buttonText', e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              Button URL
              <input
                type="text"
                value={data.buttonUrl ?? ''}
                placeholder="https://..."
                onChange={e => handleData('buttonUrl', e.target.value)}
              />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor     ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Heading Color"     value={template.headingColor ?? ''} onChange={v => handleTemplate('headingColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor   ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Button Color"      value={template.buttonBg    ?? '#000000'} onChange={v => handleTemplate('buttonBg', v)} />
            <ColorInput label="Button Text Color" value={template.buttonText  ?? '#000000'} onChange={v => handleTemplate('buttonText', v)} />

            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />
            <RangeField
              label="Font Size"
              value={template.fontSize ?? ''}
              onChange={v => handleTemplate('fontSize', v)}
              min={10} max={32} step={1}
            />

            <label className="flex flex-col gap-1">
              Image Position
              <select
                value={template.imagePosition ?? 'left'}
                onChange={e => handleTemplate('imagePosition', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('about', 'template', { ...template, buttonBg: null, fontFamily: null })}
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
