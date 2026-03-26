import { createContext, useContext, useState } from 'react'

const HOME_ORDER = ['announcement', 'navbar',  'carousel','about','services', 'testimonial', 'footer']

const initialState = {
  globalTheme: {
    fontFamily:      'Inter',
    primaryColor:    '#6366f1',
    secondaryColor:  '#f97316',
    accentColor:     '#06b6d4',
    spacingScale:    '4',
    darkMode:        false,
  },

  pages: [{ id: 'home', name: 'Home', order: HOME_ORDER }],
  activePage: 'home',

  announcement: { data: {}, template: {} },
  navbar:        { data: {}, template: {} },

  testimonial: {
    template: {},
    data: {
      heading: 'What our customers say',
      items: [
        {
          name: 'Sarah Mitchell',
          role: 'CEO, Brightline Co.',
          quote: 'This product completely changed how our team works. The speed and reliability are unmatched.',
          avatar: '',
        },
        {
          name: 'James Okafor',
          role: 'Lead Designer, Studio Nox',
          quote: 'Incredibly intuitive. We shipped our redesign in half the time we expected.',
          avatar: '',
        },
        {
          name: 'Priya Sharma',
          role: 'Founder, Loopback Labs',
          quote: 'The best investment we made this year. Onboarding was seamless and support is top-notch.',
          avatar: '',
        },
      ],
    },
  },

  carousel: { data: {}, template: {} },

  services: {
    template: {},
    data: {
      heading: 'What we offer',
      subheading: 'Everything you need to build, launch, and grow.',
      items: [
        {
          icon: '⚡',
          title: 'Lightning Fast',
          description: 'Optimised for speed from the ground up. Your users will notice the difference.',
          linkText: 'Learn more',
          linkUrl: '#',
        },
        {
          icon: '🔒',
          title: 'Secure by Default',
          description: 'End-to-end encryption and best-in-class security practices built in.',
          linkText: 'Learn more',
          linkUrl: '#',
        },
        {
          icon: '📈',
          title: 'Built to Scale',
          description: 'Handles millions of users without breaking a sweat. Grow without limits.',
          linkText: 'Learn more',
          linkUrl: '#',
        },
      ],
    },
  },

  gallery: {
    template: {},
    data: {
      heading: 'Our Work',
      subheading: 'A selection of recent projects we are proud of.',
      items: [
        { image: '', caption: 'Brand identity for Solaris' },
        { image: '', caption: 'Mobile app UI — Trackr' },
        { image: '', caption: 'E-commerce redesign' },
        { image: '', caption: 'Dashboard for DataFlow' },
      ],
    },
  },

  about:   { data: {}, template: {} },
  cta:     { data: {}, template: {} },
  footer:  { data: {}, template: {} },
  hero:    { data: {}, template: {} },
  contact: { data: {}, template: {} },
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

  function updatePageOrder(pageId, newOrder) {
    setTheme(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === pageId ? { ...p, order: newOrder } : p),
    }))
  }

  function addPage() {
    setTheme(prev => {
      const num = prev.pages.length + 1
      const id  = `page-${Date.now()}`
      return {
        ...prev,
        pages:      [...prev.pages, { id, name: `Page ${num}`, order: [] }],
        activePage: id,
      }
    })
  }

  function deletePage(id) {
    setTheme(prev => {
      if (prev.pages.length <= 1) return prev
      const next      = prev.pages.filter(p => p.id !== id)
      const newActive = prev.activePage === id ? next[0].id : prev.activePage
      return { ...prev, pages: next, activePage: newActive }
    })
  }

  function setActivePage(id) {
    setTheme(prev => ({ ...prev, activePage: id }))
  }

  function renamePage(id, name) {
    setTheme(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === id ? { ...p, name } : p),
    }))
  }

  function removeSectionFromAllPages(sectionId) {
    setTheme(prev => ({
      ...prev,
      pages: prev.pages.map(p => ({ ...p, order: p.order.filter(k => k !== sectionId) })),
    }))
  }

  function updateGlobalTheme(key, value) {
    setTheme(prev => ({
      ...prev,
      globalTheme: { ...prev.globalTheme, [key]: value },
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
    <ThemeContext.Provider value={{
      theme, setTheme,
      updateSection, updateGlobalTheme,
      updatePageOrder, addPage, deletePage, setActivePage, renamePage, removeSectionFromAllPages,
      addSection, removeSection,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
