import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'
import RangeField from '../ui/RangeField.jsx'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const textTemplateFields = [
  { key: 'fontSize',    label: 'Font Size',    min: 10, max: 32, step: 1 },
  { key: 'padding',     label: 'Padding',      min: 0,  max: 64, step: 4 },
  { key: 'linkSpacing', label: 'Link Spacing', min: 8,  max: 48, step: 4 },
]

function SortableLinkCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
    >
      {children(listeners, attributes, isDragging)}
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between text-sm cursor-pointer select-none">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange(e.target.checked)}
        className="accent-indigo-500 w-4 h-4 cursor-pointer"
      />
    </label>
  )
}

export default function NavbarBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.navbar
  const pages = theme.pages?.list ?? []

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
  function setLinkInternal(i, pageId) {
    const activePageId = theme.pages?.activePage
    const defaultPageId = (pages.find(p => p.id !== activePageId) ?? pages[0])?.id ?? ''
    setLinks(links.map((l, idx) => idx === i ? { ...l, pageId: pageId ?? defaultPageId, url: '#' } : l))
  }
  function setLinkExternal(i) {
    setLinks(links.map((l, idx) => {
      if (idx !== i) return l
      const { pageId, ...rest } = l
      return rest
    }))
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Navbar</h2>

      {activeTab === 'content' && (
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
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Nav Links</h3>
          <div className="space-y-3">
            <SortableContext
              items={links.map((_, i) => `navlink__${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {links.map((link, i) => {
                const id       = `navlink__${i}`
                const dropdown = link.dropdown ?? []
                const showSub  = link._dropdownOpen || dropdown.length > 0
                return (
                  <SortableLinkCard key={id} id={id}>
                    {(listeners, attributes, isDragging) => (
                      <div style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Link row */}
                        <div className="flex gap-2 items-start">
                          {/* Drag handle */}
                          <span
                            {...listeners}
                            {...attributes}
                            style={{
                              color:      '#555',
                              fontSize:   '15px',
                              lineHeight: 1,
                              paddingTop: '7px',
                              flexShrink: 0,
                              userSelect: 'none',
                              cursor:     isDragging ? 'grabbing' : 'grab',
                            }}
                            title="Drag to reorder"
                          >
                            ⠿
                          </span>
                          <div className="flex flex-col gap-1 flex-1">
                            <input
                              type="text"
                              value={link.label}
                              placeholder="Label"
                              onChange={e => handleLinkChange(i, 'label', e.target.value)}
                            />
                            {/* Link type toggle */}
                            <div style={{ display: 'flex', gap: '3px', marginBottom: '1px' }}>
                              {[['external', 'URL'], ['internal', 'Page']].map(([mode, label]) => {
                                const isActive = mode === 'internal' ? link.pageId != null : link.pageId == null
                                return (
                                  <button
                                    key={mode}
                                    onClick={() => mode === 'internal'
                                      ? setLinkInternal(i)
                                      : setLinkExternal(i)
                                    }
                                    style={{
                                      flex: 1, padding: '2px 0', borderRadius: '4px', border: '1px solid #3a3a3a',
                                      background: isActive ? '#6366f1' : 'transparent',
                                      color: isActive ? '#fff' : '#888',
                                      fontSize: '10px', fontWeight: '500', cursor: 'pointer',
                                      fontFamily: 'Inter, sans-serif', transition: 'background 0.15s, color 0.15s',
                                    }}
                                  >
                                    {label}
                                  </button>
                                )
                              })}
                            </div>
                            {link.pageId != null ? (
                              <select
                                value={link.pageId}
                                onChange={e => handleLinkChange(i, 'pageId', e.target.value)}
                              >
                                {pages.map(p => (
                                  <option key={p.id} value={p.id}>{p.label}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={link.url}
                                placeholder="URL"
                                onChange={e => handleLinkChange(i, 'url', e.target.value)}
                              />
                            )}
                          </div>
                          <button onClick={() => removeLink(i)} title="Remove link" style={{ marginTop: '2px' }}>×</button>
                        </div>

                        {/* Dropdown toggle */}
                        <button
                          onClick={() => toggleDropdown(i)}
                          style={{
                            alignSelf:  'flex-start', fontSize: '11px', fontWeight: '500',
                            padding:    '2px 8px', borderRadius: '4px', cursor: 'pointer',
                            border:     '1px solid #3a3a3a', background: showSub ? '#6366f1' : 'transparent',
                            color:      showSub ? '#fff' : undefined, fontFamily: 'Inter, sans-serif',
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
                    )}
                  </SortableLinkCard>
                )
              })}
            </SortableContext>

            <button onClick={addLink}>+ Add Link</button>
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-4">

            {/* Colors */}
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

            {/* Border Bottom */}
            <div className="space-y-2">
              <ToggleRow
                label="Border Bottom"
                checked={template.borderBottom}
                onChange={v => handleTemplate('borderBottom', v)}
              />
              {template.borderBottom && (
                <ColorInput
                  label="Border Color"
                  value={template.borderBottomColor ?? '#e5e7eb'}
                  onChange={v => handleTemplate('borderBottomColor', v)}
                />
              )}
            </div>

            {/* Existing range fields */}
            {textTemplateFields.map(({ key, label, min, max, step }) => (
              <RangeField
                key={key}
                label={label}
                value={template[key] ?? ''}
                onChange={v => handleTemplate(key, v)}
                min={min} max={max} step={step}
              />
            ))}

            {/* Logo Size */}
            <RangeField
              label="Logo Size"
              value={template.logoSize ?? ''}
              onChange={v => handleTemplate('logoSize', v)}
              min={24} max={64} step={2}
            />

            {/* Navbar Height */}
            <RangeField
              label="Navbar Height"
              value={template.navbarHeight ?? ''}
              onChange={v => handleTemplate('navbarHeight', v)}
              min={48} max={120} step={4}
            />

            {/* Logo Position */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm">Logo Position</span>
              <select
                value={template.logoPosition ?? 'left'}
                onChange={e => handleTemplate('logoPosition', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            {/* Behavior toggles */}
            <div className="space-y-3 pt-1">
              <ToggleRow
                label="Sticky Navbar"
                checked={template.sticky}
                onChange={v => handleTemplate('sticky', v)}
              />
            </div>

            <button
              onClick={() => updateSection('navbar', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
