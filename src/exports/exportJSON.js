/**
 * Triggers a browser download of the current theme state as a JSON file.
 * @param {object} theme - The full theme state from ThemeContext
 * @param {string} [filename='theme.json']
 */
export function exportJSON(theme, filename = 'theme.json') {
  const json = JSON.stringify(theme, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}
