import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from '../ui/ColorInput.jsx'
import RangeField from '../ui/RangeField.jsx'

export default function BlogListBuilder({ activeTab = 'content' }) {
  const { theme, updateSection } = useTheme()
  const { data, template } = theme.bloglist

  const heading    = data.heading    ?? ''
  const subheading = data.subheading ?? ''
  const posts      = data.posts      ?? []

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

  function handleTagsChange(index, value) {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean)
    handlePostChange(index, 'tags', tags)
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
            <div className="space-y-4">
              {posts.map((post, i) => (
                <div key={post.id ?? i} style={{ borderRadius: '8px', border: '1px solid #3a3a3a', padding: '12px', position: 'relative' }}>
                  <button onClick={() => removePost(i)} title="Remove post"
                    style={{ position: 'absolute', top: '8px', right: '8px' }}>×</button>
                  <div className="space-y-2 pr-6">
                    <label className="flex flex-col gap-1">
                      Title
                      <input type="text" value={post.title ?? ''} placeholder="Post title"
                        onChange={e => handlePostChange(i, 'title', e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1">
                      Excerpt
                      <textarea rows={3} value={post.excerpt ?? ''} placeholder="Short summary..."
                        onChange={e => handlePostChange(i, 'excerpt', e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1">
                      Author
                      <input type="text" value={post.author ?? ''} placeholder="Author name"
                        onChange={e => handlePostChange(i, 'author', e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1">
                      Date
                      <input type="date" value={post.date ?? ''}
                        onChange={e => handlePostChange(i, 'date', e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1">
                      Tags (comma-separated)
                      <input type="text" value={(post.tags ?? []).join(', ')} placeholder="e.g. Design, Culture"
                        onChange={e => handleTagsChange(i, e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1">
                      Cover Image URL
                      <input type="text" value={post.coverImage ?? ''} placeholder="https://..."
                        onChange={e => handlePostChange(i, 'coverImage', e.target.value)} />
                    </label>
                  </div>
                </div>
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
