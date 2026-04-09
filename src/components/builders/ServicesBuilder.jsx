import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const textTemplateFields = [
  { key: 'fontSize',     label: 'Font Size',       min: 10, max: 32,  step: 1 },
  { key: 'borderRadius', label: 'Card Radius',      min: 0,  max: 32,  step: 2 },
]

// single source of truth — preview must not invent fallbacks
export default function ServicesBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.services

  const heading    = data.heading    ?? ''
  const subheading = data.subheading ?? ''
  const items      = data.items      ?? []

  function handleData(key, value) {
    updateSection('services', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('services', 'template', { ...template, [key]: value })
  }

  function handleItemChange(index, field, value) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    updateSection('services', 'data', { ...data, items: updated })
  }

  function addItem() {
    updateSection('services', 'data', {
      ...data,
      items: [...items, { icon: '', title: '', description: '', linkText: '', linkUrl: '' }],
    })
  }

  function removeItem(index) {
    updateSection('services', 'data', {
      ...data,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Services</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input type="text" value={heading} placeholder="e.g. What we offer"
                onChange={e => handleData('heading', e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              Subheading
              <input type="text" value={subheading} placeholder="e.g. Everything you need to grow."
                onChange={e => handleData('subheading', e.target.value)} />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Service Items</h3>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '12px', position: 'relative' }}>
              <button onClick={() => removeItem(i)} title="Remove link"
                style={{ position: 'absolute', top: '8px', right: '8px' }}>×</button>
              <div className="space-y-2 pr-6">
                <label className="flex flex-col gap-1">
                  Icon <span style={{ fontWeight: 400, opacity: 0.5 }}>(emoji or text)</span>
                  <input type="text" value={item.icon} placeholder="e.g. 🚀"
                    onChange={e => handleItemChange(i, 'icon', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Title
                  <input type="text" value={item.title} placeholder="e.g. Fast Delivery"
                    onChange={e => handleItemChange(i, 'title', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Description
                  <input type="text" value={item.description} placeholder="e.g. Ship faster with our tools."
                    onChange={e => handleItemChange(i, 'description', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Link Text <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span>
                  <input type="text" value={item.linkText} placeholder="e.g. Learn more"
                    onChange={e => handleItemChange(i, 'linkText', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Link URL
                  <input type="text" value={item.linkUrl} placeholder="https://..."
                    onChange={e => handleItemChange(i, 'linkUrl', e.target.value)} />
                </label>
              </div>
            </div>
          ))}
          <button onClick={addItem}>+ Add Service</button>
        </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor      ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Heading Color"     value={template.headingColor ?? ''} onChange={v => handleTemplate('headingColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor    ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Card Background"   value={template.cardBg       ?? '#000000'} onChange={v => handleTemplate('cardBg', v)} />
            <ColorInput label="Accent Color"      value={template.accentColor  ?? '#000000'} onChange={v => handleTemplate('accentColor', v)} />

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
              Display Mode
              <select value={template.displayMode ?? 'grid'} onChange={e => handleTemplate('displayMode', e.target.value)}
                style={{ width: '100%' }}>
                <option value="grid">Grid (all items)</option>
                <option value="single-row">Single Row + View All</option>
                <option value="carousel">Horizontal Carousel</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              Columns
              <select value={template.columns ?? '3'} onChange={e => handleTemplate('columns', e.target.value)}
                style={{ width: '100%' }}>
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('services', 'template', { ...template, accentColor: null, fontFamily: null })}
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
