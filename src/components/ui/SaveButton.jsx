import { useTheme } from '../../store/themeStore.jsx'

export default function SaveButton() {
  const { theme, saveStatus, triggerSave } = useTheme()

  if (saveStatus === 'idle') {
    return (
      <span style={{
        fontSize: '12px', color: '#9ca3af',
        fontFamily: 'Inter, sans-serif', padding: '6px 4px',
      }}>
        Saved
      </span>
    )
  }

  if (saveStatus === 'saving') {
    return (
      <span style={{
        fontSize: '12px', color: '#9ca3af',
        fontFamily: 'Inter, sans-serif', padding: '6px 4px',
        animation: 'pulse 1s ease-in-out infinite',
      }}>
        Saving…
      </span>
    )
  }

  if (saveStatus === 'saved') {
    return (
      <span style={{
        fontSize: '12px', color: '#22c55e',
        fontFamily: 'Inter, sans-serif', padding: '6px 4px',
      }}>
        Saved ✓
      </span>
    )
  }

  // error state — clickable retry button
  return (
    <button
      onClick={() => triggerSave(theme)}
      style={{
        background: 'transparent', color: '#ef4444',
        border: '1px solid #ef4444', borderRadius: '6px',
        padding: '6px 12px', fontSize: '12px', fontWeight: '500',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      Save failed — retry
    </button>
  )
}
