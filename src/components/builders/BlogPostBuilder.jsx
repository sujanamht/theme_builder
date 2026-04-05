import { useState } from 'react'
import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

export default function BlogPostBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.blogPost

  const [tagInput, setTagInput] = useState((data.tags ?? []).join(', '))

  function handleData(key, value) {
    updateSection('blogPost', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('blogPost', 'template', { ...template, [key]: value })
  }

  function handleTagBlur() {
    handleData('tags', tagInput.split(',').map(t => t.trim()).filter(Boolean))
  }

  function addParagraph() {
    handleData('paragraphs', [...(data.paragraphs ?? []), ''])
  }

  function updateParagraph(i, value) {
    const updated = (data.paragraphs ?? []).map((p, j) => j === i ? value : p)
    handleData('paragraphs', updated)
  }

  function removeParagraph(i) {
    handleData('paragraphs', (data.paragraphs ?? []).filter((_, j) => j !== i))
  }

  if (activeTab === 'content') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold">Blog Post</h2>

        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Post Details</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              Title
              <input
                type="text"
                value={data.title ?? ''}
                placeholder="Post title"
                onChange={e => handleData('title', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Author
              <input
                type="text"
                value={data.author ?? ''}
                placeholder="Author name"
                onChange={e => handleData('author', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Date
              <input
                type="date"
                value={data.date ?? ''}
                onChange={e => handleData('date', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              Tags (comma-separated)
              <input
                type="text"
                value={tagInput}
                placeholder="e.g. Design, Culture"
                onChange={e => setTagInput(e.target.value)}
                onBlur={handleTagBlur}
              />
            </label>
            <label className="flex flex-col gap-1">Featured Image</label>
            <ImageUploader
              label="Upload"
              value={data.coverImage ?? ''}
              onChange={v => handleData('coverImage', v)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Body</h3>
          <div className="flex flex-col gap-2">
            {(data.paragraphs ?? []).map((para, i, arr) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Paragraph {i + 1}</span>
                  {arr.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(i)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={para}
                  placeholder={`Paragraph ${i + 1}…`}
                  onChange={e => updateParagraph(i, e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            ))}
            <button type="button" onClick={addParagraph}>+ Add Paragraph</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Blog Post</h2>
      <section>
        <div className="space-y-3">
          <ColorInput label="Background Color" value={template.bgColor    ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
          <ColorInput label="Text Color"        value={template.textColor  ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
          <ColorInput label="Accent Color"      value={template.accentColor ?? '#000000'} onChange={v => handleTemplate('accentColor', v)} />
          <RangeField label="Body Font Size"    value={template.fontSize   ?? ''} onChange={v => handleTemplate('fontSize', v)}  min={12} max={24} step={1} />
          <RangeField label="Section Padding"   value={template.padding    ?? ''} onChange={v => handleTemplate('padding', v)}   min={0}  max={120} step={8} />
        </div>
      </section>
    </div>
  )
}
