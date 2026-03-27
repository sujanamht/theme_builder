import { useTheme, useDarkMode } from '../../store/themeStore.jsx'
import ColorInput from './ColorInput.jsx'

const FONT_OPTIONS = [
  'Inter',
  'Syne',
  'DM Sans',
  'Playfair Display',
  'Montserrat',
  'Poppins',
  'Roboto Slab',
  'Space Grotesk',
]

export default function GlobalThemePanel() {
  const { theme, updateGlobalTheme } = useTheme()
  const { globalTheme } = theme
  const darkMode = useDarkMode()

  const labelColor  = darkMode ? '#aaaaaa' : '#52525b'
  const selectStyle = {
    width:        '100%',
    background:   darkMode ? '#2a2a2a' : '#f9fafb',
    border:       `1px solid ${darkMode ? '#3a3a3a' : '#d1d5db'}`,
    color:        darkMode ? '#ffffff' : '#111111',
    borderRadius: '6px',
    padding:      '6px 10px',
    fontSize:     '13px',
    outline:      'none',
    fontFamily:   'Inter, sans-serif',
    cursor:       'pointer',
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto flex-1">
      <h2 style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: darkMode ? '#ffffff' : '#111111' }}>Theme</h2>

      <div className="space-y-3">
        <ColorInput
          label="Primary Color"
          value={globalTheme.primaryColor ?? '#6366f1'}
          onChange={v => updateGlobalTheme('primaryColor', v)}
        />
        <ColorInput
          label="Secondary Color"
          value={globalTheme.secondaryColor ?? '#f97316'}
          onChange={v => updateGlobalTheme('secondaryColor', v)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: labelColor }}>Font Family</span>
          <select
            value={globalTheme.fontFamily ?? 'Inter'}
            onChange={e => updateGlobalTheme('fontFamily', e.target.value)}
            style={selectStyle}
          >
            {FONT_OPTIONS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
