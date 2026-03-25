import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'

const dataFields = [
  { key: 'message',  label: 'Message',   placeholder: '' },
  { key: 'linkText', label: 'Link Text', placeholder: '' },
  { key: 'linkUrl',  label: 'Link URL',  placeholder: '' },
]

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size', placeholder: 'e.g. 14px' },
  { key: 'padding',  label: 'Padding',   placeholder: 'e.g. 8px 16px' },
]

export default function AnnouncementBuilder() {
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
