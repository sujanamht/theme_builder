import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'
import RangeField from '../ui/RangeField.jsx'

const textTemplateFields = [
  { key: 'fontSize',    label: 'Font Size',    min: 10, max: 32, step: 1 },
  { key: 'padding',     label: 'Padding',      min: 0,  max: 64, step: 4 },
  { key: 'linkSpacing', label: 'Link Spacing', min: 8,  max: 48, step: 4 },
]

export default function NavbarBuilder() {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.navbar

  const logo     = data.logo     ?? ''
  const logoText = data.logoText ?? ''
  const links    = data.links    ?? []

  function setLinks(next) {
    updateSection('navbar', 'data', { ...data, links: next })
  }

  function handleLogo(value)     { updateSection('navbar', 'data', { ...data, logo: value }) }
  function handleLogoText(value) { updateSection('navbar', 'data', { ...data, logoText: value }) }
  function handleTemplate(key, value) {
    updateSection('navbar', 'template', { ...template, [key]: value })
  }

  /* ── top-level link helpers ── */
  function handleLinkChange(i, field, value) {
    const next = links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)
    setLinks(next)
  }
  function addLink() {
    setLinks([...links, { label: '', url: '', dropdown: [] }])
  }
  function removeLink(i) {
    setLinks(links.filter((_, idx) => idx !== i))
  }
  function toggleDropdown(i) {
    const link = links[i]
    const hasDropdown = (link.dropdown ?? []).length > 0 || link._dropdownOpen
    handleLinkChange(i, '_dropdownOpen', !hasDropdown)
  }

  /* ── sub-link helpers ── */
  function handleSubChange(linkIdx, subIdx, field, value) {
    const next = links.map((l, i) => {
      if (i !== linkIdx) return l
      const dropdown = (l.dropdown ?? []).map((s, si) =>
        si === subIdx ? { ...s, [field]: value } : s
      )
      return { ...l, dropdown }
    })
    setLinks(next)
  }
  function addSubLink(linkIdx) {
    const next = links.map((l, i) =>
      i === linkIdx ? { ...l, dropdown: [...(l.dropdown ?? []), { label: '', url: '' }] } : l
    )
    setLinks(next)
  }
  function removeSubLink(linkIdx, subIdx) {
    const next = links.map((l, i) =>
      i === linkIdx ? { ...l, dropdown: (l.dropdown ?? []).filter((_, si) => si !== subIdx) } : l
    )
    setLinks(next)
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Navbar</h2>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
        <ImageUploader
          label="Logo / Brand"
          value={logo}
          onChange={handleLogo}
          textValue={logoText}
          onTextChange={handleLogoText}
        />
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Nav Links</h3>
        <div className="space-y-3">
          {links.map((link, i) => {
            const dropdown    = link.dropdown ?? []
            const showSub     = link._dropdownOpen || dropdown.length > 0

            return (
              <div key={i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Link row */}
                <div className="flex gap-2 items-start">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={link.label}
                      placeholder="Label"
                      onChange={e => handleLinkChange(i, 'label', e.target.value)}
                    />
                    <input
                      type="text"
                      value={link.url}
                      placeholder="URL"
                      onChange={e => handleLinkChange(i, 'url', e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeLink(i)} title="Remove link" style={{ marginTop: '2px' }}>×</button>
                </div>

                {/* Dropdown toggle */}
                <button
                  onClick={() => toggleDropdown(i)}
                  style={{
                    alignSelf: 'flex-start', fontSize: '11px', fontWeight: '500',
                    padding: '2px 8px', borderRadius: '4px', cursor: 'pointer',
                    border: '1px solid #3a3a3a', background: showSub ? '#6366f1' : 'transparent',
                    color: showSub ? '#fff' : undefined, fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {showSub ? '▾ Dropdown on' : '▾ Add Dropdown'}
                </button>

                {/* Sub-links */}
                {showSub && (
                  <div style={{ paddingLeft: '10px', borderLeft: '2px solid #3a3a3a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {dropdown.map((sub, si) => (
                      <div key={si} className="flex gap-2 items-start">
                        <div className="flex flex-col gap-1 flex-1">
                          <input
                            type="text"
                            value={sub.label}
                            placeholder="Sub-label"
                            onChange={e => handleSubChange(i, si, 'label', e.target.value)}
                          />
                          <input
                            type="text"
                            value={sub.url}
                            placeholder="Sub-URL"
                            onChange={e => handleSubChange(i, si, 'url', e.target.value)}
                          />
                        </div>
                        <button onClick={() => removeSubLink(i, si)} title="Remove link" style={{ marginTop: '2px' }}>×</button>
                      </div>
                    ))}
                    <button onClick={() => addSubLink(i)}>+ Add Sub-link</button>
                  </div>
                )}
              </div>
            )
          })}

          <button onClick={addLink}>+ Add Link</button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Style</h3>
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
    </div>
  )
}
