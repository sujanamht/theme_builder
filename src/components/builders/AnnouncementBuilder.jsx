import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

const dataFields = [
  { key: 'message',  label: 'Message',   placeholder: '' },
  { key: 'linkText', label: 'Link Text', placeholder: '' },
  { key: 'linkUrl',  label: 'Link URL',  placeholder: '' },
]

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', min: 10, max: 32,  step: 1 },
  { key: 'padding',  label: 'Padding',   min: 0,  max: 64,  step: 4 },
]

export default function AnnouncementBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.announcement

  function handleData(key, value) {
    updateSection('announcement', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('announcement', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Announcement Bar</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            {dataFields.map(({ key, label, placeholder }) => (
              <label key={key} className="flex flex-col gap-1 text-sm text-gray-700">
                {label}
                <input
                  type="text"
                  value={data[key] ?? ''}
                  placeholder={placeholder}
                  onChange={e => handleData(key, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
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
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={template.marquee ?? false}
                onChange={e => handleTemplate('marquee', e.target.checked)}
                className="w-4 h-4"
              />
              Marquee on mobile
            </label>
            {template.marquee && (
              <RangeField
                label="Scroll Speed"
                value={template.marqueeSpeed ?? 30}
                onChange={v => handleTemplate('marqueeSpeed', Number(v))}
                min={5} max={60} step={5}
                unit=""
              />
            )}

            <button
              onClick={() => updateSection('announcement', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
