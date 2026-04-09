import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const PLATFORM_OPTIONS = ['youtube', 'instagram', 'tiktok', 'facebook']

const PLATFORM_LABELS = {
  facebook:  'Facebook',
  instagram: 'Instagram',
  tiktok:    'TikTok',
  youtube:   'YouTube',
}

const PLATFORM_PLACEHOLDER = {
  facebook:  'https://www.facebook.com/plugins/video.php?href=...',
  instagram: 'https://www.instagram.com/p/...',
  tiktok:    'https://www.tiktok.com/embed/v2/...',
  youtube:   'https://www.youtube.com/watch?v=...',
}

// single source of truth — preview must not invent fallbacks
export default function SocialMediaBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.socialmedia

  const embeds = data.embeds ?? []

  function setEmbeds(next) {
    updateSection('socialmedia', 'data', { ...data, embeds: next })
  }

  function handleData(key, value) {
    updateSection('socialmedia', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('socialmedia', 'template', { ...template, [key]: value })
  }

  function addEmbed() {
    setEmbeds([...embeds, { platform: 'youtube', url: '', enabled: true }])
  }

  function removeEmbed(i) {
    setEmbeds(embeds.filter((_, idx) => idx !== i))
  }

  function updateEmbed(i, key, value) {
    setEmbeds(embeds.map((e, idx) => idx === i ? { ...e, [key]: value } : e))
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Social Media</h2>

      {activeTab === 'content' && (
        <>
          {/* Heading */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Heading</h3>
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                Heading
                <input
                  type="text"
                  value={data.heading ?? ''}
                  placeholder="e.g. Follow us on social"
                  onChange={e => handleData('heading', e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                Subheading
                <input
                  type="text"
                  value={data.subheading ?? ''}
                  placeholder="e.g. Stay connected with the latest updates."
                  onChange={e => handleData('subheading', e.target.value)}
                />
              </label>
            </div>
          </section>
        {/* Embeds list */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Embeds</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {embeds.map((embed, i) => (
              <div
                key={i}
                style={{
                  background:   '#18181b',
                  border:       '1px solid #27272a',
                  borderRadius: '10px',
                  padding:      '14px',
                  display:      'flex',
                  flexDirection:'column',
                  gap:          '10px',
                  width:        '100%',
                }}
              >
                {/* Top row: platform select + toggle + remove */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={embed.platform}
                    onChange={e => updateEmbed(i, 'platform', e.target.value)}
                    style={{
                      flex:         '1 1 auto',
                      minWidth:     0,
                      padding:      '6px 8px',
                      fontSize:     '13px',
                      fontWeight:   '600',
                      color:        '#f4f4f5',
                      background:   '#27272a',
                      border:       '1px solid #3f3f46',
                      borderRadius: '6px',
                      cursor:       'pointer',
                    }}
                  >
                    {PLATFORM_OPTIONS.map(p => (
                      <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                    ))}
                  </select>

                  {/* remove grouped */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>


                    <button
                      onClick={() => removeEmbed(i)}
                      style={{
                        background: 'none',
                        border:     'none',
                        cursor:     'pointer',
                        color:      '#ef4444',
                        fontSize:   '16px',
                        lineHeight: 1,
                        padding:    '2px 4px',
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* URL input */}
                <input
                  type="text"
                  value={embed.url ?? ''}
                  placeholder={PLATFORM_PLACEHOLDER[embed.platform] || 'Paste embed URL…'}
                  onChange={e => updateEmbed(i, 'url', e.target.value)}
                  style={{
                    width:        '100%',
                    padding:      '7px 10px',
                    fontSize:     '12px',
                    color:        embed.enabled !== false ? '#e4e4e7' : '#52525b',
                    background:   '#0f0f11',
                    border:       '1px solid #27272a',
                    borderRadius: '6px',
                    boxSizing:    'border-box',
                    fontFamily:   'monospace',
                    opacity:      embed.enabled !== false ? 1 : 0.5,
                  }}
                />
              </div>
            ))}

            <button
              onClick={addEmbed}
              style={{
                width:        '100%',
                padding:      '10px',
                border:       '1.5px dashed #4f46e5',
                borderRadius: '10px',
                background:   'none',
                cursor:       'pointer',
                fontSize:     '13px',
                color:        '#6366f1',
                fontWeight:   '600',
                letterSpacing:'0.01em',
              }}
            >
              + Add Embed
            </button>
          </div>
        </section>
                </>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor      ?? '#ffffff'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Heading Color"    value={template.headingColor ?? ''} onChange={v => handleTemplate('headingColor', v)} />
            <ColorInput label="Text Color"       value={template.textColor    ?? '#111827'} onChange={v => handleTemplate('textColor', v)} />
            <RangeField
              label="Font Size"
              value={template.fontSize ?? 16}
              onChange={v => handleTemplate('fontSize', v)}
              min={12} max={28} step={1}
              unit="px"
            />
            <RangeField
              label="Vertical Padding"
              value={parseInt(template.padding ?? 48)}
              onChange={v => handleTemplate('padding', parseInt(v))}
              min={30} max={180} step={10}
              unit="px"
            />
            <label className="flex flex-col gap-1">
              Text Align
              <select
                value={template.textAlign ?? 'center'}
                onChange={e => handleTemplate('textAlign', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('socialmedia', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
