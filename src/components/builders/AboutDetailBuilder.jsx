import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const CARD_LABELS = ['Card 1 — Mission', 'Card 2 — Vision', 'Card 3 — Goal']

export default function AboutDetailBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.aboutDetail

  function handleData(key, value) {
    updateSection('aboutDetail', 'data', { ...data, [key]: value })
  }

  function handleCardField(index, key, value) {
    const cards = data.cards.map((c, i) => i === index ? { ...c, [key]: value } : c)
    updateSection('aboutDetail', 'data', { ...data, cards })
  }

  function handleTemplate(key, value) {
    updateSection('aboutDetail', 'template', { ...template, [key]: value })
  }

  // ── Content tab ──────────────────────────────────────────────────────────────
  if (activeTab === 'content') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">About Detail</h2>

        {/* Section heading + description */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Section Header</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input
                type="text"
                value={data.heading ?? ''}
                placeholder="About Us"
                onChange={e => handleData('heading', e.target.value)}
              />
            </label>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: '#374151' }}>Description Paragraphs</span>
              {(data.descriptions ?? ['']).map((para, i, arr) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Paragraph {i + 1}</span>
                    {arr.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleData('descriptions', arr.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    value={para}
                    rows={4}
                    onChange={e => {
                      const next = arr.map((p, j) => j === i ? e.target.value : p)
                      handleData('descriptions', next)
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleData('descriptions', [...(data.descriptions ?? ['']), ''])}
                style={{ alignSelf: 'flex-start', background: 'none', border: '1px dashed #d1d5db', borderRadius: '6px', color: '#6b7280', fontSize: '12px', cursor: 'pointer', padding: '4px 10px' }}
              >
                + Add Paragraph
              </button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Cards</h3>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>
            Icon: Font Awesome class e.g. <code>fa-solid fa-layer-group</code>
          </p>
          <div className="space-y-6">
            {data.cards.map((card, i) => (
              <div
                key={i}
                className="space-y-3"
                style={{ paddingBottom: '16px', borderBottom: i < data.cards.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <p className="text-sm font-medium" style={{ color: '#374151' }}>{CARD_LABELS[i]}</p>

                <label className="flex flex-col gap-1">
                  Icon Class
                  <input
                    type="text"
                    value={card.iconClass ?? ''}
                    placeholder="fa-solid fa-layer-group"
                    onChange={e => handleCardField(i, 'iconClass', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Title
                  <input
                    type="text"
                    value={card.title ?? ''}
                    placeholder="Our Mission"
                    onChange={e => handleCardField(i, 'title', e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Body
                  <textarea
                    value={card.body ?? ''}
                    placeholder="Card description..."
                    rows={3}
                    onChange={e => handleCardField(i, 'body', e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // ── Style tab ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">About Detail</h2>

      {/* Layout */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Layout</h3>
        <div className="space-y-3">
          <RangeField
            label="Top Padding (px)"
            value={template.sectionPaddingTop ?? '80'}
            onChange={v => handleTemplate('sectionPaddingTop', v)}
            min={0} max={200} step={8}
          />
          <RangeField
            label="Bottom Padding (px)"
            value={template.sectionPaddingBottom ?? '80'}
            onChange={v => handleTemplate('sectionPaddingBottom', v)}
            min={0} max={200} step={8}
          />
        </div>
      </section>

      {/* Colors */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Colors</h3>
        <div className="space-y-3">
          <ColorInput label="Section Background" value={template.sectionBackground ?? '#f8f8f8'} onChange={v => handleTemplate('sectionBackground', v)} />
          <ColorInput label="Heading Color"      value={template.headingColor      ?? '#111111'} onChange={v => handleTemplate('headingColor', v)} />
          <ColorInput label="Description Color"  value={template.descColor         ?? '#666666'} onChange={v => handleTemplate('descColor', v)} />
          <ColorInput label="Card Background"    value={template.cardBackground    ?? '#ffffff'} onChange={v => handleTemplate('cardBackground', v)} />
          <ColorInput label="Icon Color"         value={template.iconColor         ?? '#6366f1'} onChange={v => handleTemplate('iconColor', v)} />
          <ColorInput label="Title Color"        value={template.titleColor        ?? '#111111'} onChange={v => handleTemplate('titleColor', v)} />
          <ColorInput label="Body Color"         value={template.bodyColor         ?? '#888888'} onChange={v => handleTemplate('bodyColor', v)} />
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
              value={template.headingSize ?? '2.2rem'}
              placeholder="2.2rem"
              onChange={e => handleTemplate('headingSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Description Size
            <input
              type="text"
              value={template.descSize ?? '1rem'}
              placeholder="1rem"
              onChange={e => handleTemplate('descSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Icon Size
            <input
              type="text"
              value={template.iconSize ?? '2rem'}
              placeholder="2rem"
              onChange={e => handleTemplate('iconSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Card Title Size
            <input
              type="text"
              value={template.titleSize ?? '0.82rem'}
              placeholder="0.82rem"
              onChange={e => handleTemplate('titleSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Card Body Size
            <input
              type="text"
              value={template.bodySize ?? '0.92rem'}
              placeholder="0.92rem"
              onChange={e => handleTemplate('bodySize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Card Padding
            <input
              type="text"
              value={template.cardPadding ?? '40px 32px'}
              placeholder="40px 32px"
              onChange={e => handleTemplate('cardPadding', e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Reset */}
      <button
        onClick={() => updateSection('aboutDetail', 'template', { ...template, iconColor: null })}
        style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline', opacity: 0.8 }}
      >
        ↺ Reset colors to global theme
      </button>
    </div>
  )
}