import { useRef, useEffect, useState } from 'react'

/**
 * Attaches a ResizeObserver to the returned ref and reports the
 * element's content width in pixels.
 *
 * @param {number} [initial=9999]  Value used before the first measurement.
 * @returns {{ ref: React.RefObject, width: number }}
 */
export function useContainerWidth(initial = 9999) {
  const ref   = useRef(null)
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const declared = entry.target.closest('[data-canvas-width]')?.dataset?.canvasWidth
      if (declared) setWidth(Number(declared))
      else setWidth(Math.round(entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, width }
}
