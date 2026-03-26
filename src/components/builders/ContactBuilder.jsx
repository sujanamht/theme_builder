import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

export default function ContactBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.contact

  function handleData(key, value) {
    updateSection('contact', 'data', { ...data, [key]: value })
  }

  function handleSocial(key, value) {
    updateSection('contact', 'data', { ...data, socials: { ...data.socials, [key]: value } })
  }

  function handleTemplate(key, value) {
    updateSection('contact', 'template', { ...template, [key]: value })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Contact</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Heading
              <input
                type="text"
                value={data.heading ?? ''}
                placeholder="e.g. Contact Us"
                onChange={e => handleData('heading', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Subheading
              <input
                type="text"
                value={data.subheading ?? ''}
                placeholder="e.g. We'd love to hear from you."
                onChange={e => handleData('subheading', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Address
              <textarea
                value={data.address ?? ''}
                placeholder="e.g. 123 Main St, Kathmandu, Nepal"
                onChange={e => handleData('address', e.target.value)}
                rows={2}
              />
            </label>
            <label className="flex flex-col gap-1">
              Phone Number
              <input
                type="text"
                value={data.phone ?? ''}
                placeholder="e.g. +977 9851277847"
                onChange={e => handleData('phone', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Email Address
              <input
                type="text"
                value={data.email ?? ''}
                placeholder="e.g. hello@example.com"
                onChange={e => handleData('email', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Business Hours
              <input
                type="text"
                value={data.hours ?? ''}
                placeholder="e.g. Mon–Fri 9am–5pm"
                onChange={e => handleData('hours', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Google Maps Embed URL
              <input
                type="text"
                value={data.mapsUrl ?? ''}
                placeholder="https://www.google.com/maps/embed?pb=..."
                onChange={e => handleData('mapsUrl', e.target.value)}
              />
              <span className="text-xs text-gray-400">
                Google Maps → Share → Embed a map → copy the <code>src</code> URL.
              </span>
            </label>
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Social Links</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Instagram URL
              <input
                type="text"
                value={data.socials?.instagram ?? ''}
                placeholder="https://instagram.com/..."
                onChange={e => handleSocial('instagram', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Facebook URL
              <input
                type="text"
                value={data.socials?.facebook ?? ''}
                placeholder="https://facebook.com/..."
                onChange={e => handleSocial('facebook', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              TikTok URL
              <input
                type="text"
                value={data.socials?.tiktok ?? ''}
                placeholder="https://tiktok.com/@..."
                onChange={e => handleSocial('tiktok', e.target.value)}
              />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor     ?? '#ffffff'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor   ?? '#111827'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Accent Color"      value={template.accentColor ?? '#6366f1'} onChange={v => handleTemplate('accentColor', v)} />
            <RangeField
              label="Padding"
              value={template.padding ?? 64}
              onChange={v => handleTemplate('padding', v)}
              min={0} max={120} step={8}
            />
          </div>
        </section>
      )}
    </div>
  )
}
