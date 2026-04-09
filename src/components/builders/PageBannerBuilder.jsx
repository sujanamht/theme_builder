import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

export default function PageBannerBuilder({ activeTab = 'content' }) {
  const { theme, updateSection, updatePageBannerData } = useTheme()
  const activePage = theme.pages?.activePage ?? 'home'
  const pageData   = theme.pageBanner?.pages?.[activePage] ?? {}
  const template   = theme.pageBanner?.template ?? {}

  function handleData(key, value) {
    updatePageBannerData(activePage, key, value)
  }

  function handleTemplate(key, value) {
    updateSection('pageBanner', 'template', { ...template, [key]: value })
  }

  const pageLabel = activePage.charAt(0).toUpperCase() + activePage.slice(1)

  // ── Content tab ──────────────────────────────────────────────────────────────
  if (activeTab === 'content') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">Page Banner</h2>

        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Editing: {pageLabel}</p>

        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            Heading
            <input
              type="text"
              value={pageData.heading ?? ''}
              placeholder="Page Title"
              onChange={e => handleData('heading', e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            Subheading
            <input
              type="text"
              value={pageData.subheading ?? ''}
              placeholder="optional — leave blank to hide"
              onChange={e => handleData('subheading', e.target.value)}
            />
          </label>

          <ImageUploader
            label="Background Image"
            value={pageData.backgroundImage ?? ''}
            onChange={v => updatePageBannerData(activePage, 'backgroundImage', v)}
          />
        </div>
      </div>
    )
  }

  // ── Style tab ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Page Banner</h2>

      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Style changes apply to all pages</p>

      {/* Layout */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Layout</h3>
        <div className="space-y-3">
          <RangeField
            label="Vertical Padding"
            value={parseInt(template.padding ?? 48)}
            onChange={v => handleTemplate('padding', parseInt(v))}
            min={30} max={180} step={10}
            unit="px"
          />
          <label className="flex flex-col gap-1">
            Banner Height
            <input
              type="text"
              value={template.bannerHeight ?? '400px'}
              placeholder="400px"
              onChange={e => handleTemplate('bannerHeight', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Text Align
            <select
              value={template.textAlign ?? 'center'}
              onChange={e => handleTemplate('textAlign', e.target.value)}
            >
              <option value="center">center</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </label>
        </div>
      </section>

      {/* Overlay */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Overlay</h3>
        <div className="space-y-3">
          <ColorInput
            label="Overlay Color"
            value={template.overlayColor ?? '#000000'}
            onChange={v => handleTemplate('overlayColor', v)}
          />
          <RangeField
            label="Overlay Opacity"
            value={parseFloat(template.overlayOpacity) || 0.45}
            onChange={v => handleTemplate('overlayOpacity', v)}
            min={0} max={1} step={0.05}
            unit=""
          />
        </div>
      </section>

      {/* Heading */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Heading</h3>
        <div className="space-y-3">
          <ColorInput
            label="Heading Color"
            value={template.headingColor ?? '#ffffff'}
            onChange={v => handleTemplate('headingColor', v)}
          />
          <label className="flex flex-col gap-1">
            Heading Size
            <input
              type="text"
              value={template.headingSize ?? '2.8rem'}
              placeholder="2.8rem"
              onChange={e => handleTemplate('headingSize', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            Heading Weight
            <select
              value={template.headingWeight ?? '700'}
              onChange={e => handleTemplate('headingWeight', e.target.value)}
            >
              <option value="400">400</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
            </select>
          </label>
        </div>
      </section>

      {/* Subheading */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Subheading</h3>
        <div className="space-y-3">
          <ColorInput
            label="Subheading Color"
            value={template.subheadingColor ?? '#eeeeee'}
            onChange={v => handleTemplate('subheadingColor', v)}
          />
          <label className="flex flex-col gap-1">
            Subheading Size
            <input
              type="text"
              value={template.subheadingSize ?? '1rem'}
              placeholder="1rem"
              onChange={e => handleTemplate('subheadingSize', e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Background */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Background</h3>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            Background Size
            <select
              value={template.backgroundSize ?? 'cover'}
              onChange={e => handleTemplate('backgroundSize', e.target.value)}
            >
              <option value="cover">cover</option>
              <option value="contain">contain</option>
              <option value="auto">auto</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Background Position
            <select
              value={template.backgroundPosition ?? 'center'}
              onChange={e => handleTemplate('backgroundPosition', e.target.value)}
            >
              <option value="center">center</option>
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="top left">top left</option>
              <option value="top right">top right</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  )
}
