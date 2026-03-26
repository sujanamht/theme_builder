import { useTheme } from '../../store/themeStore.jsx'
import ColorInput from './ColorInput.jsx'
import RangeField from './RangeField.jsx'

const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Poppins',
  'Playfair Display',
  'Montserrat',
  'DM Sans',
]

export default function GlobalThemePanel({ isDark, setIsDark }) {
  const { theme, updateGlobalTheme } = useTheme()
  const gt = theme.globalTheme

  function handleDarkMode(value) {
    updateGlobalTheme('darkMode', value)
    setIsDark(value)
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto flex-1">
      <h2 className="text-lg font-semibold">Global Theme</h2>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Typography</h3>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Font Family</span>
            <select
              value={gt.fontFamily}
              onChange={e => updateGlobalTheme('fontFamily', e.target.value)}
              style={{ width: '100%' }}
            >
              {FONT_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Colors</h3>
        <div className="space-y-3">
          <ColorInput
            label="Primary Color"
            value={gt.primaryColor}
            onChange={v => updateGlobalTheme('primaryColor', v)}
          />
          <ColorInput
            label="Secondary Color"
            value={gt.secondaryColor}
            onChange={v => updateGlobalTheme('secondaryColor', v)}
          />
          <ColorInput
            label="Accent Color"
            value={gt.accentColor}
            onChange={v => updateGlobalTheme('accentColor', v)}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Spacing</h3>
        <div className="space-y-3">
          <RangeField
            label="Base spacing unit"
            value={gt.spacingScale}
            onChange={v => updateGlobalTheme('spacingScale', v)}
            min={2}
            max={12}
            step={1}
            unit=""
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">Dark Mode</span>
          <button
            onClick={() => handleDarkMode(!isDark)}
            aria-label="Toggle dark mode"
            style={{
              position:        'relative',
              width:           '40px',
              height:          '22px',
              borderRadius:    '11px',
              border:          'none',
              cursor:          'pointer',
              padding:         0,
              background:      isDark ? '#6366f1' : '#d1d5db',
              transition:      'background 0.2s',
              flexShrink:      0,
            }}
          >
            <span style={{
              position:   'absolute',
              top:        '3px',
              left:       isDark ? '21px' : '3px',
              width:      '16px',
              height:     '16px',
              borderRadius: '50%',
              background:  '#ffffff',
              transition:  'left 0.2s',
              boxShadow:   '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </section>
    </div>
  )
}
