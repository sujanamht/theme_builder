import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', min: 10, max: 32, step: 1 },
  { key: 'padding',  label: 'Padding',   min: 0,  max: 96, step: 8 },
]

export default function FooterBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.footer

  const brand          = data.brand          ?? ''
  const tagline        = data.tagline        ?? ''
  const links          = data.links          ?? []
  const serviceLinks   = data.serviceLinks   ?? []
  const copyright      = data.copyright      ?? ''
  const address        = data.address        ?? ''
  const phone          = data.phone          ?? ''
  const email          = data.email          ?? ''
  const socialFacebook = data.socialFacebook ?? ''
  const socialTiktok   = data.socialTiktok   ?? ''

  function handleData(key, value) {
    updateSection('footer', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('footer', 'template', { ...template, [key]: value })
  }

  // ── useful links ──────────────────────────────────────────────────────────

  function handleLinkChange(index, field, value) {
    const updated = links.map((link, i) => i === index ? { ...link, [field]: value } : link)
    updateSection('footer', 'data', { ...data, links: updated })
  }

  function addLink() {
    updateSection('footer', 'data', { ...data, links: [...links, { label: '', url: '' }] })
  }

  function removeLink(index) {
    updateSection('footer', 'data', { ...data, links: links.filter((_, i) => i !== index) })
  }

  // ── service links ─────────────────────────────────────────────────────────

  function handleServiceLinkChange(index, field, value) {
    const updated = serviceLinks.map((link, i) => i === index ? { ...link, [field]: value } : link)
    updateSection('footer', 'data', { ...data, serviceLinks: updated })
  }

  function addServiceLink() {
    updateSection('footer', 'data', { ...data, serviceLinks: [...serviceLinks, { label: '', url: '' }] })
  }

  function removeServiceLink(index) {
    updateSection('footer', 'data', { ...data, serviceLinks: serviceLinks.filter((_, i) => i !== index) })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Footer</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
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
            Address
            <input type="text" value={address} placeholder="e.g. Swayambhu, Kathmandu"
              onChange={e => handleData('address', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Phone
            <input type="text" value={phone} placeholder="e.g. +977 9851277847"
              onChange={e => handleData('phone', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Email
            <input type="text" value={email} placeholder="e.g. info@example.com"
              onChange={e => handleData('email', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Facebook URL
            <input type="text" value={socialFacebook} placeholder="https://..."
              onChange={e => handleData('socialFacebook', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            TikTok URL
            <input type="text" value={socialTiktok} placeholder="https://..."
              onChange={e => handleData('socialTiktok', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Copyright
            <input type="text" value={copyright} placeholder="e.g. © 2025 MyBrand. All rights reserved."
              onChange={e => handleData('copyright', e.target.value)} />
          </label>
          <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.embedPlaceholder ?? false}
              onChange={e => handleData('embedPlaceholder', e.target.checked)}
            />
            Show Embed / Social Feed column
          </label>
        </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Useful Links</h3>
          <div className="space-y-3">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex flex-col gap-1 flex-1">
                  <input type="text" value={link.label} placeholder="Label"
                    onChange={e => handleLinkChange(i, 'label', e.target.value)} />
                  <input type="text" value={link.url} placeholder="URL"
                    onChange={e => handleLinkChange(i, 'url', e.target.value)} />
                </div>
                <button onClick={() => removeLink(i)} title="Remove link" style={{ marginTop: '4px' }}>×</button>
              </div>
            ))}
            <button onClick={addLink}>+ Add Link</button>
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Service Links</h3>
          <div className="space-y-3">
            {serviceLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex flex-col gap-1 flex-1">
                  <input type="text" value={link.label} placeholder="Label"
                    onChange={e => handleServiceLinkChange(i, 'label', e.target.value)} />
                  <input type="text" value={link.url} placeholder="URL"
                    onChange={e => handleServiceLinkChange(i, 'url', e.target.value)} />
                </div>
                <button onClick={() => removeServiceLink(i)} title="Remove link" style={{ marginTop: '4px' }}>×</button>
              </div>
            ))}
            <button onClick={addServiceLink}>+ Add Service Link</button>
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor    ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor  ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Link Color"        value={template.linkColor  ?? '#000000'} onChange={v => handleTemplate('linkColor', v)} />
            {textTemplateFields.map(({ key, label, min, max, step }) => (
              <RangeField
                key={key}
                label={label}
                value={template[key] ?? ''}
                onChange={v => handleTemplate(key, v)}
                min={min} max={max} step={step}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
