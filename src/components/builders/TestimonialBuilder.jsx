import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

const textTemplateFields = [
  { key: 'fontSize',     label: 'Font Size',       placeholder: 'e.g. 14px' },
  { key: 'borderRadius', label: 'Card Radius',      placeholder: 'e.g. 12px' },
  { key: 'padding',      label: 'Section Padding',  placeholder: 'e.g. 48px 24px' },
]

export default function TestimonialBuilder() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.testimonial

  const heading = data.heading ?? ''
  const items   = data.items   ?? []

  function handleHeading(value) {
    updateSection('testimonial', 'data', { ...data, heading: value })
  }

  function handleTemplate(key, value) {
    updateSection('testimonial', 'template', { ...template, [key]: value })
  }

  function handleItemChange(index, field, value) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    updateSection('testimonial', 'data', { ...data, items: updated })
  }

  function addItem() {
    updateSection('testimonial', 'data', {
      ...data,
      items: [...items, { name: '', role: '', quote: '', avatar: '' }],
    })
  }

  function removeItem(index) {
    updateSection('testimonial', 'data', {
      ...data,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Testimonial</h2>

      <section>
        <h3 className="mb-3">Content</h3>
        <label className="flex flex-col gap-1">
          Section Heading
          <input
            type="text"
            value={heading}
            placeholder="e.g. What our customers say"
            onChange={e => handleHeading(e.target.value)}
          />
        </label>
      </section>

      <section>
        <h3 className="mb-3">Testimonials</h3>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '12px', position: 'relative' }}>
              <button
                onClick={() => removeItem(i)}
                title="Remove link"
                style={{ position: 'absolute', top: '8px', right: '8px' }}
              >
                ×
              </button>
              <div className="space-y-2 pr-6">
                <label className="flex flex-col gap-1">
                  Name
                  <input type="text" value={item.name} placeholder="e.g. Jane Doe"
                    onChange={e => handleItemChange(i, 'name', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Role
                  <input type="text" value={item.role} placeholder="e.g. CEO, Acme Inc."
                    onChange={e => handleItemChange(i, 'role', e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  Quote
                  <input type="text" value={item.quote} placeholder="e.g. This product changed everything."
                    onChange={e => handleItemChange(i, 'quote', e.target.value)} />
                </label>
                <ImageUploader
                  label="Avatar"
                  value={item.avatar}
                  onChange={v => handleItemChange(i, 'avatar', v)}
                />
              </div>
            </div>
          ))}
          <button onClick={addItem}>+ Add Testimonial</button>
        </div>
      </section>

      <section>
        <h3 className="mb-3">Style</h3>
        <div className="space-y-3">
          <ColorInput
            label="Background Color"
            value={template.bgColor ?? '#000000'}
            onChange={v => handleTemplate('bgColor', v)}
          />
          <ColorInput
            label="Text Color"
            value={template.textColor ?? '#000000'}
            onChange={v => handleTemplate('textColor', v)}
          />
          <ColorInput
            label="Card Background"
            value={template.cardBg ?? '#000000'}
            onChange={v => handleTemplate('cardBg', v)}
          />
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
        </div>
      </section>
    </div>
  )
}
