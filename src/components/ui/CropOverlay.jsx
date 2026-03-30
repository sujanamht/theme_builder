import { useRef, useState, useEffect } from 'react'

const MIN_W = 80

export default function CropOverlay({ src, aspectRatio, onCrop, onClose }) {
  const [ratioW, ratioH] = aspectRatio.split('/').map(Number)
  const ratio = ratioW / ratioH

  const imgRef        = useRef()
  const imgWrapperRef = useRef()
  const [imgRect, setImgRect] = useState(null)  // viewport coords — mouse math only
  const [crop,    setCrop]    = useState(null)   // relative to image wrapper { x, y, w, h }
  const dragMode = useRef(null)
  // { type: 'move',   dx, dy }
  // { type: 'resize', corner: 'tl'|'tr'|'bl'|'br', startX, startCrop }

  // ── helpers ────────────────────────────────────────────────────────────────

  function getImgViewportRect() {
    if (!imgWrapperRef.current) return null
    const r = imgWrapperRef.current.getBoundingClientRect()
    return { left: r.left, top: r.top, width: r.width, height: r.height }
  }

  function buildInitialCrop(ir) {
    let w, h
    if (ir.width / ir.height > ratio) {
      h = ir.height * 0.85
      w = h * ratio
    } else {
      w = ir.width * 0.85
      h = w / ratio
    }
    return {
      x: (ir.width  - w) / 2,
      y: (ir.height - h) / 2,
      w,
      h,
    }
  }

  function clampMove(c, ir) {
    return {
      ...c,
      x: Math.max(0, Math.min(c.x, ir.width  - c.w)),
      y: Math.max(0, Math.min(c.y, ir.height - c.h)),
    }
  }

  // ── image load (ResizeObserver) ────────────────────────────────────────────

  useEffect(() => {
    const img     = imgRef.current
    const wrapper = imgWrapperRef.current
    if (!img || !wrapper) return

    let initialCropSet = false

    const observer = new ResizeObserver(() => {
      const r = wrapper.getBoundingClientRect()
      const ir = { left: r.left, top: r.top, width: r.width, height: r.height }
      setImgRect(ir)
      if (!initialCropSet) {
        initialCropSet = true
        setCrop(buildInitialCrop(ir))
      }
    })

    function onLoad() { observer.observe(wrapper) }

    if (img.complete && img.naturalWidth > 0) {
      observer.observe(wrapper)
    } else {
      img.addEventListener('load', onLoad)
    }

    return () => {
      observer.disconnect()
      img.removeEventListener('load', onLoad)
    }
  }, [])

  // ── move mousedown ─────────────────────────────────────────────────────────

  function handleCropMouseDown(e) {
    e.preventDefault()
    e.stopPropagation()
    const ir = getImgViewportRect()
    if (ir) setImgRect(ir)
    dragMode.current = { type: 'move', dx: e.clientX - ir.left - crop.x, dy: e.clientY - ir.top - crop.y }
  }

  // ── resize mousedown ───────────────────────────────────────────────────────

  function handleCornerMouseDown(corner, e) {
    e.preventDefault()
    e.stopPropagation()
    const ir = getImgViewportRect()
    if (ir) setImgRect(ir)
    dragMode.current = { type: 'resize', corner, startX: e.clientX, startCrop: { ...crop } }
  }

  // ── global move / up ───────────────────────────────────────────────────────

  function handleOverlayMouseMove(e) {
    const mode = dragMode.current
    if (!mode || !crop || !imgRect) return

    if (mode.type === 'move') {
      setCrop(prev => clampMove(
        { ...prev, x: e.clientX - imgRect.left - mode.dx, y: e.clientY - imgRect.top - mode.dy },
        imgRect,
      ))
      return
    }

    if (mode.type === 'resize') {
      const { corner, startX, startCrop: sc } = mode
      const dx = e.clientX - startX

      // raw new width depends on which side moves
      const rawW = (corner === 'br' || corner === 'tr') ? sc.w + dx : sc.w - dx

      // max width allowed by image bounds for this corner's anchor
      let maxW
      if (corner === 'br') {
        maxW = Math.min(
          imgRect.width  - sc.x,
          (imgRect.height - sc.y) * ratio,
        )
      } else if (corner === 'bl') {
        maxW = Math.min(
          sc.x + sc.w,
          (imgRect.height - sc.y) * ratio,
        )
      } else if (corner === 'tr') {
        maxW = Math.min(
          imgRect.width - sc.x,
          (sc.y + sc.h) * ratio,
        )
      } else { // tl
        maxW = Math.min(
          sc.x + sc.w,
          (sc.y + sc.h) * ratio,
        )
      }

      const newW = Math.max(MIN_W, Math.min(rawW, maxW))
      const newH = newW / ratio

      let newX, newY
      if      (corner === 'br') { newX = sc.x;            newY = sc.y }
      else if (corner === 'bl') { newX = sc.x + sc.w - newW; newY = sc.y }
      else if (corner === 'tr') { newX = sc.x;            newY = sc.y + sc.h - newH }
      else                      { newX = sc.x + sc.w - newW; newY = sc.y + sc.h - newH }

      setCrop({ x: newX, y: newY, w: newW, h: newH })
    }
  }

  function handleOverlayMouseUp() {
    dragMode.current = null
  }

  // ── confirm crop ───────────────────────────────────────────────────────────

  function handleConfirm() {
    if (!crop || !imgRect || !imgRef.current) return
    const img    = imgRef.current
    const scaleX = img.naturalWidth  / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height

    const sx = crop.x * scaleX
    const sy = crop.y * scaleY
    const sw = crop.w * scaleX
    const sh = crop.h * scaleY

    const canvas = document.createElement('canvas')
    canvas.width  = Math.round(sw)
    canvas.height = Math.round(sh)
    canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    onCrop(canvas.toDataURL())
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const corners = [
    { id: 'tl', style: { top: -4, left:  -4, cursor: 'nw-resize' } },
    { id: 'tr', style: { top: -4, right: -4, cursor: 'ne-resize' } },
    { id: 'bl', style: { bottom: -4, left:  -4, cursor: 'sw-resize' } },
    { id: 'br', style: { bottom: -4, right: -4, cursor: 'se-resize' } },
  ]

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.6)',
        zIndex:         1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        userSelect:     'none',
      }}
      onMouseMove={handleOverlayMouseMove}
      onMouseUp={handleOverlayMouseUp}
    >
      <div
        ref={imgWrapperRef}
        style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
          draggable={false}
        />

        {crop && (
          <>
            {/* Crop box */}
            <div
              onMouseDown={handleCropMouseDown}
              style={{
                position:  'absolute',
                left:      crop.x,
                top:       crop.y,
                width:     crop.w,
                height:    crop.h,
                border:    '2px solid #fff',
                boxSizing: 'border-box',
                cursor:    'move',
              }}
            >
              {/* Rule-of-thirds grid */}
              {[1, 2].map(n => (
                <div key={`v${n}`} style={{
                  position:      'absolute',
                  top:           0,
                  bottom:        0,
                  left:          `${(n / 3) * 100}%`,
                  width:         '1px',
                  background:    'rgba(255,255,255,0.3)',
                  pointerEvents: 'none',
                }} />
              ))}
              {[1, 2].map(n => (
                <div key={`h${n}`} style={{
                  position:      'absolute',
                  left:          0,
                  right:         0,
                  top:           `${(n / 3) * 100}%`,
                  height:        '1px',
                  background:    'rgba(255,255,255,0.3)',
                  pointerEvents: 'none',
                }} />
              ))}

              {/* Corner handles */}
              {corners.map(({ id, style }) => (
                <div
                  key={id}
                  onMouseDown={e => handleCornerMouseDown(id, e)}
                  style={{
                    position:   'absolute',
                    width:      8,
                    height:     8,
                    background: '#fff',
                    ...style,
                  }}
                />
              ))}
            </div>

            {/* Confirm button — just below crop box, centered */}
            <button
              onClick={handleConfirm}
              style={{
                position:      'absolute',
                left:          crop.x + crop.w / 2,
                top:           Math.min(crop.y + crop.h + 10, (imgRect?.height ?? 0) - 36),
                transform:     'translateX(-50%)',
                zIndex:        1001,
                background:    '#fff',
                border:        'none',
                borderRadius:  '20px',
                color:         '#111',
                fontSize:      '13px',
                fontWeight:    700,
                padding:       '6px 18px',
                cursor:        'pointer',
                fontFamily:    'Inter, sans-serif',
                letterSpacing: '0.02em',
                whiteSpace:    'nowrap',
              }}
            >
              ✓ Crop
            </button>
          </>
        )}
      </div>

      {/* Cancel button */}
      <button
        style={{
          position:      'fixed',
          top:           16,
          right:         16,
          zIndex:        1001,
          background:    'rgba(0,0,0,0.65)',
          border:        'none',
          borderRadius:  '6px',
          color:         '#fff',
          fontSize:      '13px',
          fontWeight:    600,
          padding:       '6px 14px',
          cursor:        'pointer',
          fontFamily:    'Inter, sans-serif',
          letterSpacing: '0.02em',
        }}
        onClick={onClose}
      >
        ✕ Cancel
      </button>
    </div>
  )
}
