import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'
import RangeField from '../ui/RangeField.jsx'

const BLANK_PARTNER = { image: '', name: '' }

export default function PartnersBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.partners

  function handleData(key, value) {
    updateSection('partners', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('partners', 'template', { ...template, [key]: value })
  }

  function handleItemField(index, key, value) {
    const items = data.items.map((item, i) => i === index ? { ...item, [key]: value } : item)
    updateSection('partners', 'data', { ...data, items })
  }

  if (activeTab === 'content') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">Partners</h2>

        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Section Header</h3>
          <label className="flex flex-col gap-1">
            Heading
            <input
              type="text"
              value={data.heading ?? ''}
              placeholder="Our Partners"
              onChange={e => handleData('heading', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Subheading
            <input
              type="text"
              value={data.subheading ?? ''}
              placeholder="Trusted by leading organizations worldwide"
              onChange={e => handleData('subheading', e.target.value)}
            />
          </label>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Partner Logos</h3>
          <div className="space-y-4">
            {(data.items ?? []).map((item, i) => (
              <div
                key={i}
                style={{ padding: '12px', border: '1px solid #3a3a3a', borderRadius: '8px', position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => handleData('items', data.items.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' }}
                >
                  ✕ Remove
                </button>
                <div className="space-y-2 pr-6">
                  <ImageUploader
                    label={`Partner ${i + 1} — Logo`}
                    value={item.image}
                    onChange={v => handleItemField(i, 'image', v)}
                    aspectRatio="1/1"
                  />
                  <label className="flex flex-col gap-1">
                    Name / Alt Text
                    <input
                      type="text"
                      value={item.name ?? ''}
                      placeholder="e.g. Acme Corp"
                      onChange={e => handleItemField(i, 'name', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ))}
            <button onClick={() => handleData('items', [...(data.items ?? []), { ...BLANK_PARTNER }])}>
              + Add Partner
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (activeTab === 'style') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">Partners</h2>
        <section>
          <div className="space-y-3">
            <ColorInput
              label="Background Color"
              value={template.bgColor ?? '#ffffff'}
              onChange={v => handleTemplate('bgColor', v)}
            />
            <ColorInput
              label="Heading Color"
              value={template.headingColor ?? '#111111'}
              onChange={v => handleTemplate('headingColor', v)}
            />
            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />
            <RangeField
              label="Logo Height"
              value={parseInt(template.logoHeight ?? '56px')}
              onChange={v => handleTemplate('logoHeight', `${parseInt(v)}px`)}
              min={30} max={120} step={2}
              unit="px"
            />
            <RangeField
              label="Scroll Speed"
              value={parseInt(template.speed ?? 35)}
              onChange={v => handleTemplate('speed', parseInt(v))}
              min={5} max={80} step={1}
              unit="s"
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={template.autoScroll ?? true}
                onChange={e => handleTemplate('autoScroll', e.target.checked)}
              />
              Auto-scroll (marquee)
            </label>

            <button
              onClick={() => updateSection('partners', 'template', { ...template, bgColor: '', headingColor: '' })}
              style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline', opacity: 0.8 }}
            >
              ↺ Reset to global theme
            </button>
          </div>
        </section>
      </div>
    )
  }

  return null
}
