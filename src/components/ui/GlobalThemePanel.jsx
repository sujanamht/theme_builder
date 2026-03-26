import { useTheme } from '../../store/themeStore.jsx'

export default function GlobalThemePanel({ isDark, setIsDark }) {
  const { updateGlobalTheme } = useTheme()

  function handleDarkMode(value) {
    updateGlobalTheme('darkMode', value)
    setIsDark(value)
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto flex-1">
      <h2 className="text-lg font-semibold">Default Theme</h2>
    <p className="text-sm text-gray-500 mt-1">
      More themes coming soon.
    </p>
    </div>
  )
}
