import { createContext, useContext, useState } from 'react'

const initialState = {
  announcement: { data: {}, template: {} },
  navbar:        { data: {}, template: {} },
  testimonial:   { data: {}, template: {} },
  carousel:      { data: {}, template: {} },
  services:      { data: {}, template: {} },
  gallery:       { data: {}, template: {} },
  cta:           { data: {}, template: {} },
  footer:        { data: {}, template: {} },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialState)

  function updateSection(section, field, value) {
    setTheme(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  function addSection(id) {
    setTheme(prev => ({
      ...prev,
      [id]: { data: {}, template: {} },
    }))
  }

  function removeSection(id) {
    setTheme(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateSection, addSection, removeSection }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
