import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'
import RangeField from '../ui/RangeField.jsx'

const textTemplateFields = [
  { key: 'fontSize',     label: 'Font Size',   min: 10, max: 32, step: 1 },
  { key: 'borderRadius', label: 'Item Radius',  min: 0,  max: 32, step: 2 },
  { key: 'gap',          label: 'Grid Gap',     min: 4,  max: 48, step: 4 },
]

// single source of truth — preview must not invent fallbacks
export default function GalleryBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.gallery

  const heading    = data.heading    ?? ''
  const subheading = data.subheading ?? ''
  const items      = data.items      ?? []

  function handleData(key, value) {
    updateSection('gallery', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('gallery', 'template', { ...template, [key]: value })
  }

  function handleItemChange(index, field, value) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    updateSection('gallery', 'data', { ...data, items: updated })
  }

  function addItem() {
    updateSection('gallery', 'data', {
      ...data,
      items: [...items, { image: '', caption: '' }],
    })
  }

  function removeItem(index) {
    updateSection('gallery', 'data', {
      ...data,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Gallery</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input type="text" value={heading} placeholder="e.g. Our Work"
                onChange={e => handleData('heading', e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              Subheading
              <input type="text" value={subheading} placeholder="e.g. A selection of recent projects."
                onChange={e => handleData('subheading', e.target.value)} />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Gallery Items</h3>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '12px', position: 'relative' }}>
              <button onClick={() => removeItem(i)} title="Remove link"
                style={{ position: 'absolute', top: '8px', right: '8px' }}>×</button>
              <div className="space-y-2 pr-6">
                <ImageUploader
                  label={`Image ${i + 1}`}
                  value={item.image}
                  onChange={v => handleItemChange(i, 'image', v)}
                />
                <label className="flex flex-col gap-1">
                  Caption <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span>
                  <input type="text" value={item.caption} placeholder="e.g. Project name"
                    onChange={e => handleItemChange(i, 'caption', e.target.value)} />
                </label>
              </div>
            </div>
          ))}
          <button onClick={addItem}>+ Add Image</button>
        </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color"  value={template.bgColor    ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"         value={template.textColor  ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Caption Background" value={template.captionBg  ?? '#000000'} onChange={v => handleTemplate('captionBg', v)} />
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
              Columns
              <select value={template.columns ?? '3'} onChange={e => handleTemplate('columns', e.target.value)}
                style={{ width: '100%' }}>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('gallery', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
