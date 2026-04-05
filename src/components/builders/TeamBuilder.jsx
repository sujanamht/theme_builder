import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const BLANK_MEMBER = { image: '', name: '', role: '', email: '', phone: '' }

export default function TeamBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.team

  function handleData(key, value) {
    updateSection('team', 'data', { ...data, [key]: value })
  }

  function handleMemberField(index, key, value) {
    const members = data.members.map((m, i) => i === index ? { ...m, [key]: value } : m)
    updateSection('team', 'data', { ...data, members })
  }

  function handleTemplate(key, value) {
    updateSection('team', 'template', { ...template, [key]: value })
  }

  function handleImageUpload(index, file) {
    const reader = new FileReader()
    reader.onload = e => handleMemberField(index, 'image', e.target.result)
    reader.readAsDataURL(file)
  }

  // ── Content tab ──────────────────────────────────────────────────────────────
  if (activeTab === 'content') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">Team</h2>

        {/* Section header */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Section Header</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input
                type="text"
                value={data.heading ?? ''}
                placeholder="Meet Our Team"
                onChange={e => handleData('heading', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Description
              <textarea
                value={data.description ?? ''}
                rows={3}
                placeholder="Together we create the future..."
                onChange={e => handleData('description', e.target.value)}
              />
            </label>
          </div>
        </section>

        {/* Members */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Team Members</h3>
          <div className="space-y-6">
            {(data.members ?? []).map((member, i, arr) => (
              <div
                key={i}
                className="space-y-3"
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>Member {i + 1}</span>
                  {arr.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleData('members', arr.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <label className="flex flex-col gap-1">
                  Name
                  <input
                    type="text"
                    value={member.name ?? ''}
                    placeholder="John Doe"
                    onChange={e => handleMemberField(i, 'name', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Role / Title
                  <input
                    type="text"
                    value={member.role ?? ''}
                    placeholder="Director & Partner"
                    onChange={e => handleMemberField(i, 'role', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Email
                  <input
                    type="text"
                    value={member.email ?? ''}
                    placeholder="john@company.com"
                    onChange={e => handleMemberField(i, 'email', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Phone
                  <input
                    type="text"
                    value={member.phone ?? ''}
                    placeholder="+1 234 567 890"
                    onChange={e => handleMemberField(i, 'phone', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Image URL
                  <input
                    type="text"
                    value={member.image && member.image.startsWith('data:') ? '' : (member.image ?? '')}
                    placeholder="https://..."
                    onChange={e => handleMemberField(i, 'image', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files[0] && handleImageUpload(i, e.target.files[0])}
                  />
                </label>

                {member.image && (
                  <button
                    type="button"
                    onClick={() => handleMemberField(i, 'image', '')}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: '0', lineHeight: 1 }}
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleData('members', [...(data.members ?? []), { ...BLANK_MEMBER }])}
            style={{ marginTop: '12px', alignSelf: 'flex-start', background: 'none', border: '1px dashed #d1d5db', borderRadius: '6px', color: '#6b7280', fontSize: '12px', cursor: 'pointer', padding: '6px 12px' }}
          >
            + Add Member
          </button>
        </section>
      </div>
    )
  }

  // ── Style tab ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Team</h2>

      {/* Layout */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Layout</h3>
        <div className="space-y-3">
          <RangeField
            label="Vertical Padding (px)"
            value={template.paddingY ?? '80'}
            onChange={v => handleTemplate('paddingY', v)}
            min={0} max={200} step={8}
          />
          <label className="flex flex-col gap-1">
            Columns
            <select
              value={template.columns ?? '3'}
              onChange={e => handleTemplate('columns', e.target.value)}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Display Mode
            <select value={template.displayMode ?? 'grid'} onChange={e => handleTemplate('displayMode', e.target.value)}>
              <option value="grid">Grid (all members)</option>
              <option value="single-row">Single Row + View All</option>
              <option value="carousel">Horizontal Carousel</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Card Gap
            <input
              type="text"
              value={template.cardGap ?? '32px'}
              placeholder="32px"
              onChange={e => handleTemplate('cardGap', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Image Height
            <input
              type="text"
              value={template.imageHeight ?? '280px'}
              placeholder="280px"
              onChange={e => handleTemplate('imageHeight', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Image Border Radius
            <input
              type="text"
              value={template.imageBorderRadius ?? '8px'}
              placeholder="8px"
              onChange={e => handleTemplate('imageBorderRadius', e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Colors</h3>
        <div className="space-y-3">
          <ColorInput label="Section Background" value={template.sectionBackground ?? '#ffffff'} onChange={v => handleTemplate('sectionBackground', v)} />
          <ColorInput label="Heading Color"      value={template.headingColor      ?? '#111111'} onChange={v => handleTemplate('headingColor', v)} />
          <ColorInput label="Description Color"  value={template.descColor         ?? '#888888'} onChange={v => handleTemplate('descColor', v)} />
          <ColorInput label="Name Color"         value={template.nameColor         ?? '#111111'} onChange={v => handleTemplate('nameColor', v)} />
          <ColorInput label="Role Color"         value={template.roleColor         ?? '#888888'} onChange={v => handleTemplate('roleColor', v)} />
          <ColorInput label="Contact Color"      value={template.contactColor      ?? '#555555'} onChange={v => handleTemplate('contactColor', v)} />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Typography</h3>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            Heading Size
            <input
              type="text"
              value={template.headingSize ?? '2rem'}
              placeholder="2rem"
              onChange={e => handleTemplate('headingSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Description Size
            <input
              type="text"
              value={template.descSize ?? '0.95rem'}
              placeholder="0.95rem"
              onChange={e => handleTemplate('descSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Name Size
            <input
              type="text"
              value={template.nameSize ?? '1rem'}
              placeholder="1rem"
              onChange={e => handleTemplate('nameSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Role Size
            <input
              type="text"
              value={template.roleSize ?? '0.875rem'}
              placeholder="0.875rem"
              onChange={e => handleTemplate('roleSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Contact Size
            <input
              type="text"
              value={template.contactSize ?? '0.8rem'}
              placeholder="0.8rem"
              onChange={e => handleTemplate('contactSize', e.target.value)}
            />
          </label>
        </div>
      </section>
    </div>
  )
}
