import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import CropOverlay from './CropOverlay.jsx'
import AssetPickerModal from './AssetPickerModal.jsx'
import { useAssets } from '../../store/themeStore.jsx'

export default function ImageUploader({ label, value, onChange, textValue, onTextChange, aspectRatio = '16/9', onCrop }) {
  const { addAsset } = useAssets()
  const [mode,        setMode]        = useState('url')
  const [showPicker,  setShowPicker]  = useState(false)
  const fileRef = useRef(null)
  const [cropSrc, setCropSrc] = useState(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setCropSrc(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleSelect(dataUrl) {
    onChange(dataUrl)
    setShowPicker(false)
  }

  function handleUploadNew(file) {
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target.result
      addAsset({ name: file.name, dataUrl })
      onChange(dataUrl)
      setShowPicker(false)
    }
    reader.readAsDataURL(file)
  }

  const isImageValue = value && (value.startsWith('http') || value.startsWith('data:'))

  const tabBtn = key => ({
    border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '500',
    padding: '3px 10px', borderRadius: '4px', fontFamily: 'Inter, sans-serif',
    background: mode === key ? '#6366f1' : 'transparent',
    color:      mode === key ? '#fff'    : undefined,
    transition: 'background 0.15s, color 0.15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <span style={{ fontSize: '12px', fontWeight: '500' }}>{label}</span>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', padding: '2px', borderRadius: '6px', width: 'fit-content' }}>
        <button style={tabBtn('url')}    onClick={() => setMode('url')}>URL</button>
        <button style={tabBtn('upload')} onClick={() => setMode('upload')}>Upload</button>
        <button style={tabBtn('assets')} onClick={() => setMode('assets')}>Assets</button>
      </div>

      {/* Tab content + thumbnail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {mode === 'url' && (
          <input
            type="text"
            value={isImageValue ? value : ''}
            placeholder="https://..."
            style={{ flex: 1 }}
            onChange={e => onChange(e.target.value)}
          />
        )}

        {mode === 'upload' && (
          <button onClick={() => fileRef.current?.click()} style={{ flex: 1, textAlign: 'left', cursor: 'pointer' }}>
            {isImageValue ? 'Replace image…' : 'Choose image…'}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </button>
        )}

        {mode === 'assets' && (
          <button
            onClick={() => setShowPicker(true)}
            style={{ flex: 1, textAlign: 'left', cursor: 'pointer' }}
          >
            {isImageValue ? 'Replace from library…' : 'Browse library…'}
          </button>
        )}

        {/* Thumbnail */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '6px', flexShrink: 0,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', opacity: isImageValue ? 1 : 0.3,
        }}>
          {isImageValue
            ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '🖼'}
        </div>
      </div>

      {/* Always-visible text field */}
      {onTextChange && (
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', opacity: 0.5 }}>Brand / Alt Text (optional)</span>
          <input
            type="text"
            value={textValue ?? ''}
            placeholder="e.g. MyBrand"
            style={{ flex: 1 }}
            onChange={e => onTextChange(e.target.value)}
          />
        </label>
      )}

      {cropSrc && createPortal(
        <CropOverlay
          src={cropSrc}
          aspectRatio={aspectRatio}
          onCrop={url => { onChange(url); setCropSrc(null) }}
          onClose={() => setCropSrc(null)}
        />,
        document.body
      )}

      {showPicker && (
        <AssetPickerModal
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
          onUploadNew={handleUploadNew}
        />
      )}
    </div>
  )
}
