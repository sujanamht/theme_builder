export async function load() {
  try {
    const res = await fetch('/src/data/theme.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('themeService.load() failed, falling back to initialState:', e)
    return null
  }
}

// Internal debounce state
let _debounceTimer = null

async function _doSave(theme) {
  const body = JSON.stringify(theme, null, 2)

  // --- API SWAP POINT ---
  // In production, replace the fetch('/write-theme') call below
  // with your real API call, e.g.:
  // return fetch('/api/theme', { method: 'PUT', body })
  // ----------------------

  const res = await fetch('/write-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  return res.ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` }
}

/** Debounced auto-save — fires 1000ms after the last call. */
export function save(theme) {
  return new Promise(resolve => {
    clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      _doSave(theme).then(resolve).catch(e => resolve({ ok: false, error: e.message }))
    }, 1000)
  })
}

/** Immediate save — cancels any pending debounced save and writes right away. */
export function saveNow(theme) {
  clearTimeout(_debounceTimer)
  return _doSave(theme).catch(e => ({ ok: false, error: e.message }))
}
