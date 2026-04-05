import { useState } from 'react'
import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'
import ImageUploader from '../ui/ImageUploader.jsx'

function PostCard({ post, index, isOpen, onToggle, onRemove, onChange }) {
  const [tagInput, setTagInput] = useState((post.tags ?? []).join(', '))

  function handleTagKey(e) {
    if (e.key === ',' || e.key === ' ' || e.key === 'Enter') {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
      onChange(index, 'tags', tags)
    }
  }

  return (
    <div style={{ borderRadius: '8px', border: '1px solid #3a3a3a', overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', cursor:'pointer', userSelect:'none' }}>
        <span style={{ fontSize:'13px', fontWeight:'600', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {post.title || '(Untitled)'}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
          <button onClick={e => { e.stopPropagation(); onRemove(index) }} style={{ background:'none', border:'none', cursor:'pointer', padding:'0 2px', lineHeight:1 }}>×</button>
          <span style={{ fontSize:'11px', opacity:0.5, lineHeight:1 }}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-2" style={{ padding:'0 12px 12px', borderTop:'1px solid #3a3a3a' }}>
          <label className="flex flex-col gap-1" style={{ paddingTop:'10px' }}>
            Title
            <input type="text" value={post.title ?? ''} placeholder="Post title" onChange={e => onChange(index, 'title', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Excerpt
            <textarea rows={3} value={post.excerpt ?? ''} placeholder="Short summary..." onChange={e => onChange(index, 'excerpt', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Author
            <input type="text" value={post.author ?? ''} placeholder="Author name" onChange={e => onChange(index, 'author', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Date
            <input type="date" value={post.date ?? ''} onChange={e => onChange(index, 'date', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            Tags (comma-separated)
            <input
              type="text"
              value={tagInput}
              placeholder="e.g. Design, Culture"
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={() => onChange(index, 'tags', tagInput.split(',').map(t => t.trim()).filter(Boolean))}
            />
          </label>
          <label className="flex flex-col gap-1">Cover Image</label>

          <ImageUploader
            label="Upload"
            value={post.coverImage ?? ''}
            onChange={v => onChange(index, 'coverImage', v)}
          />

          <div>
            <label style={{ fontSize: '12px', fontWeight: 500 }}>Content Paragraphs</label>
            {(post.paragraphs ?? ['']).map((para, pi) => (
              <div key={pi} style={{ position: 'relative', marginBottom: '8px' }}>
                <textarea
                  value={para}
                  rows={4}
                  placeholder="Paragraph text..."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onChange={e => {
                    const newParas = [...(post.paragraphs ?? [''])]
                    newParas[pi] = e.target.value
                    onChange(index, 'paragraphs', newParas)
                  }}
                />
                {(post.paragraphs ?? ['']).length > 1 && (
                  <button
                    onClick={() => {
                      const newParas = (post.paragraphs ?? ['']).filter((_, idx) => idx !== pi)
                      onChange(index, 'paragraphs', newParas)
                    }}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
                  >✕</button>
                )}
              </div>
            ))}
            <button onClick={() => onChange(index, 'paragraphs', [...(post.paragraphs ?? ['']), ''])}>
              + Add Paragraph
            </button>
          </div>


        </div>
      )}
    </div>
  )
}

// single source of truth — preview must not invent fallbacks
export default function BlogListBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.bloglist

  const heading    = data.heading    ?? ''
  const subheading = data.subheading ?? ''
  const posts      = data.posts      ?? []

  const [openIndex, setOpenIndex] = useState(null)

  function handleData(key, value) {
    updateSection('bloglist', 'data', { ...data, [key]: value })
  }

  function handleTemplate(key, value) {
    updateSection('bloglist', 'template', { ...template, [key]: value })
  }

  function handlePostChange(index, field, value) {
    const updated = posts.map((post, i) =>
      i === index ? { ...post, [field]: value } : post
    )
    updateSection('bloglist', 'data', { ...data, posts: updated })
  }

  function addPost() {
    const id = `post-${Date.now()}`
    updateSection('bloglist', 'data', {
      ...data,
      posts: [...posts, {
        id,
        slug: id,
        title: '',
        excerpt: '',
        coverImage: '',
        author: '',
        date: '',
        tags: [],
        paragraphs: [''],
      }],
    })
  }

  function removePost(index) {
    updateSection('bloglist', 'data', {
      ...data,
      posts: posts.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Blog List</h2>

      {activeTab === 'content' && (
        <>
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Content</h3>
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                Heading
                <input type="text" value={heading} placeholder="e.g. From the Blog"
                  onChange={e => handleData('heading', e.target.value)} />
              </label>
              <label className="flex flex-col gap-1">
                Subheading
                <input type="text" value={subheading} placeholder="e.g. Thoughts on product and design."
                  onChange={e => handleData('subheading', e.target.value)} />
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Posts</h3>
            <div className="space-y-3">
              {posts.map((post, i) => (
                <PostCard
                  key={post.id ?? i}
                  post={post}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  onRemove={removePost}
                  onChange={handlePostChange}
                />
              ))}
              <button onClick={addPost}>+ Add Post</button>
            </div>
          </section>
        </>
      )}

      {activeTab === 'style' && (
        <section>
          <div className="space-y-3">
            <ColorInput label="Background Color" value={template.bgColor     ?? '#000000'} onChange={v => handleTemplate('bgColor', v)} />
            <ColorInput label="Text Color"        value={template.textColor   ?? '#000000'} onChange={v => handleTemplate('textColor', v)} />
            <ColorInput label="Card Background"   value={template.cardBg      ?? '#000000'} onChange={v => handleTemplate('cardBg', v)} />
            <ColorInput label="Accent Color"      value={template.accentColor ?? '#000000'} onChange={v => handleTemplate('accentColor', v)} />

            <RangeField label="Font Size"       value={template.fontSize     ?? ''} onChange={v => handleTemplate('fontSize', v)}     min={12} max={24}  step={1} />
            <RangeField label="Section Padding" value={template.padding      ?? ''} onChange={v => handleTemplate('padding', v)}      min={0}  max={120} step={8} />
            <RangeField label="Card Radius"     value={template.borderRadius ?? ''} onChange={v => handleTemplate('borderRadius', v)} min={0}  max={24}  step={2} />

            <label className="flex flex-col gap-1">
              Columns
              <select value={template.columns ?? '3'} onChange={e => handleTemplate('columns', e.target.value)}
                style={{ width: '100%' }}>
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              Display Mode
              <select value={template.displayMode ?? 'grid'} onChange={e => handleTemplate('displayMode', e.target.value)}
                style={{ width: '100%' }}>
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
                <option value="single-row">Single Row</option>
              </select>
            </label>

            <button
              onClick={() => updateSection('bloglist', 'template', { ...template, accentColor: null, fontFamily: null })}
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
