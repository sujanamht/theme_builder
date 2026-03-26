import { createContext, useContext, useState } from 'react'

const HOME_SECTIONS = ['announcement', 'navbar', 'carousel', 'about', 'services', 'testimonial', 'footer']

const initialState = {
  globalTheme: {
    fontFamily:      'Inter',
    primaryColor:    '#6366f1',
    secondaryColor:  '#f97316',
    accentColor:     '#06b6d4',
    spacingScale:    '4',
    darkMode:        false,
  },

  pages: {
    activePage: 'home',
    list: [
      { id: 'home',    label: 'Home',    sections: HOME_SECTIONS },
      { id: 'about',   label: 'About',   sections: [] },
      { id: 'contact', label: 'Contact', sections: [] },
      { id: 'blog',    label: 'Blog',    sections: [] },
      { id: 'custom',  label: 'Custom',  sections: [] },
    ],
  },

  announcement: {
    data: {
      message: 'Welcome to Acme Co! Free shipping on all orders over $50.',
      linkText: 'Shop now',
      linkUrl: '#',
    },
    template: {},
  },

  navbar: {
    data: {
      logoText: 'Acme Co',
      links: [
        { label: 'Home',     href: '#' },
        { label: 'About',    href: '#' },
        { label: 'Services', href: '#' },
        { label: 'Contact',  href: '#' },
      ],
    },
    template: {},
  },

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

  carousel: {
    data: {
      slides: [
        { image: '', heading: 'Grow Your Business', subheading: 'Tools built for modern teams.' },
        { image: '', heading: 'Design with Confidence', subheading: 'Pixel-perfect components, every time.' },
        { image: '', heading: 'Ship Faster', subheading: 'From idea to launch in record time.' },
      ],
    },
    template: {},
  },

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

  about: {
    data: {
      heading: 'We build products people love',
      body: 'Acme Co was founded in 2018 with a simple mission: make powerful software accessible to everyone. Our team of designers and engineers works tirelessly to craft tools that are fast, reliable, and a joy to use.',
      imageUrl: '',
      buttonText: 'Meet the team',
      buttonUrl: '#',
    },
    template: {},
  },

  cta: {
    data: {
      heading: 'Ready to get started?',
      subheading: 'Join thousands of teams already building with Acme Co.',
      primaryButtonText: 'Start for free',
      primaryButtonUrl: '#',
      secondaryButtonText: 'See pricing',
      secondaryButtonUrl: '#',
    },
    template: {},
  },

  footer: {
    data: {
      brand: 'Acme Co',
      tagline: 'Building better products, together.',
      links: [
        { label: 'Home',    href: '#' },
        { label: 'About',   href: '#' },
        { label: 'Blog',    href: '#' },
        { label: 'Careers', href: '#' },
      ],
      serviceLinks: [
        { label: 'Features',  href: '#' },
        { label: 'Pricing',   href: '#' },
        { label: 'Docs',      href: '#' },
        { label: 'Status',    href: '#' },
      ],
      copyright: '',
      address: '123 Main Street, San Francisco, CA 94103',
      phone: '',
      email: 'hello@acmeco.com',
    },
    template: {},
  },

  hero: {
    data: {
      heading: 'Build something amazing',
      subheading: 'Acme Co gives your team the tools to design, build, and ship — all in one place.',
      buttonText: 'Get started free',
      buttonUrl: '#',
      imageUrl: '',
    },
    template: {},
  },
  contact: {
    data: {
      heading:    'Get in touch',
      subheading: 'We would love to hear from you. Drop us a message and we will get back to you within 24 hours.',
      address:    '123 Main Street, San Francisco, CA 94103',
      phone:      '+1 (415) 555-0192',
      email:      'hello@acmeco.com',
      hours:      'Mon – Fri, 9 am – 6 pm PST',
      mapsUrl:    '',
      socials: {
        instagram: '',
        facebook:  '',
        tiktok:    '',
      },
    },
    template: {
      bgColor:     '#ffffff',
      textColor:   '#111827',
      accentColor: '#6366f1',
      padding:     64,
    },
  },

  form: {
    data: {
      heading:     'Get in Touch',
      subheading:  'Fill out the form below and we\'ll be in touch shortly.',
      submitLabel: 'Send Message',
      fields: {
        name:     true,
        email:    true,
        phone:    false,
        subject:  false,
        message:  true,
        consent:  false,
      },
      consentText: 'I agree to the privacy policy and terms of service.',
    },
    template: {
      bgColor:     '#ffffff',
      textColor:   '#000000',
      buttonBg:    '#6366f1',
      buttonText:  '#ffffff',
      padding:     48,
    },
  },
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

  function updatePageOrder(pageId, newSections) {
    setTheme(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        list: prev.pages.list.map(p =>
          p.id === pageId ? { ...p, sections: newSections } : p
        ),
      },
    }))
  }

  function setPageSections(pageId, sections) {
    setTheme(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        list: prev.pages.list.map(p =>
          p.id === pageId ? { ...p, sections } : p
        ),
      },
    }))
  }

  function addPage() {
    setTheme(prev => {
      const num = prev.pages.list.length + 1
      const id  = `page-${Date.now()}`
      return {
        ...prev,
        pages: {
          activePage: id,
          list: [...prev.pages.list, { id, label: `Page ${num}`, sections: [] }],
        },
      }
    })
  }

  function addCustomPage(label) {
    setTheme(prev => {
      const id = `page-${Date.now()}`
      return {
        ...prev,
        pages: {
          ...prev.pages,
          list: [...prev.pages.list, { id, label, sections: [] }],
        },
      }
    })
  }

  function deletePage(id) {
    setTheme(prev => {
      if (prev.pages.list.length <= 1) return prev
      const nextList  = prev.pages.list.filter(p => p.id !== id)
      const newActive = prev.pages.activePage === id ? nextList[0].id : prev.pages.activePage
      return {
        ...prev,
        pages: { activePage: newActive, list: nextList },
      }
    })
  }

  function setActivePage(id) {
    setTheme(prev => ({
      ...prev,
      pages: { ...prev.pages, activePage: id },
    }))
  }

  function renamePage(id, label) {
    setTheme(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        list: prev.pages.list.map(p => p.id === id ? { ...p, label } : p),
      },
    }))
  }

  function removeSectionFromAllPages(sectionId) {
    setTheme(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        list: prev.pages.list.map(p => ({
          ...p,
          sections: p.sections.filter(k => k !== sectionId),
        })),
      },
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
      updatePageOrder, setPageSections,
      addPage, addCustomPage, deletePage, setActivePage, renamePage, removeSectionFromAllPages,
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
