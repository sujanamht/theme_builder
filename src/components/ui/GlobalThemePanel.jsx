import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from './ColorInput.jsx'

const FONT_OPTIONS = [
  'Inter',
  'DM Sans',
  'Lato',
  'Poppins',
  'Playfair Display',
  'Merriweather',
]

export default function GlobalThemePanel() {
  const { theme, updateGlobalTheme } = useTheme()
  const { globalTheme } = theme
  const darkMode = globalTheme.darkMode ?? false

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: labelColor }}>Heading Size</span>
          <select
            value={globalTheme.headingSize ?? '2rem'}
            onChange={e => updateGlobalTheme('headingSize', e.target.value)}
            style={selectStyle}
          >
            <option value="1.5rem">Small (1.5rem)</option>
            <option value="2rem">Medium (2rem)</option>
            <option value="2.5rem">Large (2.5rem)</option>
            <option value="3rem">X-Large (3rem)</option>
            <option value="3.5rem">XX-Large (3.5rem)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: labelColor }}>Body Font Size</span>
          <select
            value={globalTheme.bodySize ?? '1rem'}
            onChange={e => updateGlobalTheme('bodySize', e.target.value)}
            style={selectStyle}
          >
            <option value="0.8rem">Small (0.8rem)</option>
            <option value="0.875rem">Medium-Small (0.875rem)</option>
            <option value="1rem">Medium (1rem)</option>
            <option value="1.125rem">Large (1.125rem)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
