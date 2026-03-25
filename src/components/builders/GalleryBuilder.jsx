import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

const textTemplateFields = [
  { key: 'fontSize',     label: 'Font Size',      placeholder: 'e.g. 14px' },
  { key: 'borderRadius', label: 'Item Radius',     placeholder: 'e.g. 8px' },
  { key: 'gap',          label: 'Grid Gap',        placeholder: 'e.g. 12px' },
]

export default function GalleryBuilder() {
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

      <section>
        <h3 className="mb-3">Content</h3>
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

      <section>
        <h3 className="mb-3">Gallery Items</h3>
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

      <section>
        <h3 className="mb-3">Style</h3>
        <div className="space-y-3">
          <ColorInput label="Background Color" value={template.bgColor    ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
          <ColorInput label="Text Color"        value={template.textColor  ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
          <ColorInput label="Caption Background" value={template.captionBg ?? '#000000'} onChange={v => handleTemplate('captionBg', v)} />

          {textTemplateFields.map(({ key, label, placeholder }) => (
            <label key={key} className="flex flex-col gap-1">
              {label}
              <input type="text" value={template[key] ?? ''} placeholder={placeholder}
                onChange={e => handleTemplate(key, e.target.value)} />
            </label>
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
        </div>
      </section>
    </div>
  )
}
