import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'
import RangeField from '../ui/RangeField.jsx'

const textTemplateFields = [
  { key: 'fontSize', label: 'Font Size',    min: 10,  max: 32,  step: 1  },
  { key: 'height',   label: 'Slide Height', min: 200, max: 700, step: 20 },
]

export default function CarouselBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.carousel

  const slides = data.slides ?? []

  function handleTemplate(key, value) {
    updateSection('carousel', 'template', { ...template, [key]: value })
  }

  function handleSlideChange(index, field, value) {
    const updated = slides.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    )
    updateSection('carousel', 'data', { ...data, slides: updated })
  }

  function addSlide() {
    updateSection('carousel', 'data', {
      ...data,
      slides: [...slides, { image: '', title: '', subtitle: '' }],
    })
  }

  function removeSlide(index) {
    updateSection('carousel', 'data', {
      ...data,
      slides: slides.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Carousel</h2>

      {activeTab === 'content' && (
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Slides</h3>
          <div className="space-y-4">
            {slides.map((slide, i) => (
              <div key={i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '12px', position: 'relative' }}>
                <button
                  onClick={() => removeSlide(i)}
                  title="Remove link"
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                >
                  ×
                </button>
                <div className="space-y-2 pr-6">
                  <ImageUploader
                    label={`Slide ${i + 1} — Image`}
                    value={slide.image}
                    onChange={v => handleSlideChange(i, 'image', v)}
                  />
                  <label className="flex flex-col gap-1">
                    Title
                    <input type="text" value={slide.title} placeholder="e.g. Bold headline"
                      onChange={e => handleSlideChange(i, 'title', e.target.value)} />
                  </label>
                  <label className="flex flex-col gap-1">
                    Subtitle
                    <input type="text" value={slide.subtitle} placeholder="e.g. Supporting copy"
                      onChange={e => handleSlideChange(i, 'subtitle', e.target.value)} />
                  </label>
                </div>
              </div>
            ))}
            <button onClick={addSlide}>+ Add Slide</button>
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
            <ColorInput
              label="Arrow Color"
              value={template.arrowColor ?? '#000000'}
              onChange={v => handleTemplate('arrowColor', v)}
            />
            <ColorInput
              label="Dot Color"
              value={template.dotColor ?? '#000000'}
              onChange={v => handleTemplate('dotColor', v)}
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

            <button
              onClick={() => updateSection('carousel', 'template', { ...template, accentColor: null, primaryBtnBg: null, secondaryBtnBg: null, fontFamily: null })}
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
