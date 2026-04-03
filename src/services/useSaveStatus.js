import { useState } from 'react'
import { saveNow } from './themeService.js'

export function useSaveStatus() {
  const [status, setStatus] = useState('idle')

  async function triggerSave(theme) {
    setStatus('saving')
    try {
      const result = await saveNow(theme)
      if (result.ok) {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return { status, triggerSave }
}
