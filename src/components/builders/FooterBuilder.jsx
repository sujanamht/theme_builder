import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', placeholder: 'e.g. 14px' },
  { key: 'padding',  label: 'Padding',   placeholder: 'e.g. 40px 32px 24px' },
]

export default function FooterBuilder() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.footer

  const brand     = data.brand     ?? ''
  const tagline   = data.tagline   ?? ''
  const links     = data.links     ?? []
  const copyright = data.copyright ?? ''

  function handleData(key, value) {
    updateSection('footer', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('footer', 'template', { ...template, [key]: value })
  }

  function handleLinkChange(index, field, value) {
    const updated = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    )
    updateSection('footer', 'data', { ...data, links: updated })
  }

  function addLink() {
    updateSection('footer', 'data', {
      ...data,
      links: [...links, { label: '', url: '' }],
    })
  }

  function removeLink(index) {
    updateSection('footer', 'data', {
      ...data,
      links: links.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Footer</h2>

      <section>
        <h3 className="mb-3">Content</h3>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            Brand Name
            <input type="text" value={brand} placeholder="e.g. MyBrand"
              onChange={e => handleData('brand', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Tagline
            <input type="text" value={tagline} placeholder="e.g. Building better products."
              onChange={e => handleData('tagline', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Copyright
            <input type="text" value={copyright} placeholder="e.g. © 2025 MyBrand. All rights reserved."
              onChange={e => handleData('copyright', e.target.value)} />
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-3">Links</h3>
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex flex-col gap-1 flex-1">
                <input type="text" value={link.label} placeholder="Label"
                  onChange={e => handleLinkChange(i, 'label', e.target.value)} />
                <input type="text" value={link.url} placeholder="URL"
                  onChange={e => handleLinkChange(i, 'url', e.target.value)} />
              </div>
              <button onClick={() => removeLink(i)} title="Remove link" style={{ marginTop: '4px' }}>
                ×
              </button>
            </div>
          ))}
          <button onClick={addLink}>+ Add Link</button>
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
            label="Link Color"
            value={template.linkColor ?? '#000000'}
            onChange={v => handleTemplate('linkColor', v)}
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
