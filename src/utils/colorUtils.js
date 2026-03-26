/**
 * Convert a 6-digit hex colour + alpha to an rgba() string.
 * Returns a transparent fallback for malformed input.
 */
export function hexToRgba(hex, alpha) {
  const c = (hex || '').replace('#', '')
  if (c.length !== 6) return `rgba(0,0,0,${alpha})`
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
