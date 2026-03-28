import { createContext, useContext, useState } from 'react'

const HOME_SECTIONS = ['announcement', 'navbar', 'carousel', 'about', 'services', 'testimonial', 'footer']

const INITIAL_PAGES = [
  { id: 'home',    label: 'Home',    sections: HOME_SECTIONS },
  { id: 'about',   label: 'About',   sections: ['about', 'cta'] },
  { id: 'contact', label: 'Contact', sections: ['contact', 'form'] },
  { id: 'blog',    label: 'Blog',    sections: [] },
  { id: 'custom',  label: 'Custom',  sections: [] },
]

/* Syncs navbar links with a pages list.
   - Updates labels for existing page links
   - Removes links whose pageId no longer exists
   - Appends new links for pages with no existing link
   - Leaves external links (no pageId) untouched */
function syncNavbarLinks(links, pages) {
  const synced = links
    .filter(l => !l.pageId || pages.some(p => p.id === l.pageId))
    .map(l => {
      if (!l.pageId) return l
      const page = pages.find(p => p.id === l.pageId)
      return page ? { ...l, label: page.label } : l
    })
  const existing = new Set(synced.filter(l => l.pageId).map(l => l.pageId))
  const additions = pages
    .filter(p => !existing.has(p.id))
    .map(p => ({ label: p.label, url: '#', pageId: p.id }))
  return [...synced, ...additions]
}

const SHARED_CONTACT = {
  address: '240 Kent Avenue, Suite 4B, Brooklyn, NY 11249',
  phone:   '+1 (718) 555-0143',
  email:   'hello@arcova.io',
}

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
    list: INITIAL_PAGES,
  },

  announcement: {
    data: {
      message: '🎉 Arcova 2.0 is here — smarter workflows, faster results. Limited early access available.',
      linkText: 'Claim your spot',
      linkUrl:  '#',
    },
    template: {},
  },

  navbar: {
    data: {
      logoText: '',
      links: INITIAL_PAGES.map(p => ({ label: p.label, url: '#', pageId: p.id })),
    },
    template: {},
  },

  hero: {
    data: {
      headline:    'Run your entire operation from one place',
      subheadline: 'Arcova brings your projects, people, and performance data into a single workspace — so your team can focus on what actually moves the needle.',
      ctaText:     'Start free trial',
      ctaUrl:      '#',
      bgImage:     'https://placehold.co/1200x600',
    },
    template: {},
  },

  carousel: {
    data: {
      slides: [
        {
          image:      'https://placehold.co/1200x500',
          title:      'Unified project management',
          subtitle:   'Plan, track, and deliver work without switching tabs.',
        },
        {
          image:      'https://placehold.co/1200x500',
          title:      'Real-time team collaboration',
          subtitle:   'Comments, assignments, and status updates — all in context.',
        },
        {
          image:      'https://placehold.co/1200x500',
          title:      'Powerful reporting built in',
          subtitle:   'Get the insights you need to ship faster and plan smarter.',
        },
      ],
    },
    template: {},
  },

  about: {
    data: {
      heading:    'Built for teams that move fast',
      body:       'Arcova was founded in 2020 by a team of engineers and operators who were tired of duct-taping five tools together just to run a sprint. We built the product we always wanted — one that adapts to how your team works, not the other way around. Today, over 8,000 teams rely on Arcova to run their day-to-day.',
      image:      'https://placehold.co/600x400',
      buttonText: 'Meet the team',
      buttonUrl:  '#',
    },
    template: {},
  },

  services: {
    template: {},
    data: {
      heading:    'Everything your team needs',
      subheading: 'One platform to replace the fragmented stack slowing you down.',
      items: [
        {
          icon:        '🗂️',
          title:       'Project Workspaces',
          description: 'Organise tasks, timelines, and docs in one structured workspace. Works for sprints, campaigns, or long-term roadmaps.',
          linkText:    'See how it works',
          linkUrl:     '#',
        },
        {
          icon:        '📊',
          title:       'Live Analytics',
          description: 'Track team velocity, project health, and delivery metrics in real time. No spreadsheets required.',
          linkText:    'Explore analytics',
          linkUrl:     '#',
        },
        {
          icon:        '🔗',
          title:       'Deep Integrations',
          description: 'Connect Arcova to Slack, GitHub, Jira, and 40+ other tools your team already uses — in minutes.',
          linkText:    'View integrations',
          linkUrl:     '#',
        },
      ],
    },
  },

  testimonial: {
    template: {},
    data: {
      heading: 'Trusted by teams at fast-growing companies',
      items: [
        {
          name:   'Natalie Chen',
          role:   'VP of Engineering, Luma Health',
          quote:  'Arcova cut our sprint planning time in half. The visibility it gives across the whole eng org is something we couldn\'t get anywhere else.',
          avatar: 'https://i.pravatar.cc/80?img=47',
        },
        {
          name:   'Marcus Lindqvist',
          role:   'Head of Product, Folio',
          quote:  'We evaluated six tools before landing on Arcova. Nothing else came close for cross-functional collaboration. Our roadmap process is night and day.',
          avatar: 'https://i.pravatar.cc/80?img=12',
        },
        {
          name:   'Aisha Okonkwo',
          role:   'CEO, Stackline',
          quote:  'From onboarding to our first full sprint, it took less than a day. The team adopted it without any training — that never happens.',
          avatar: 'https://i.pravatar.cc/80?img=31',
        },
      ],
    },
  },

  gallery: {
    template: {},
    data: {
      heading:    'Product in action',
      subheading: 'A look at what your team\'s workspace could look like.',
      items: [
        { image: 'https://placehold.co/600x400', caption: 'Project dashboard overview' },
        { image: 'https://placehold.co/600x400', caption: 'Sprint board with live status' },
        { image: 'https://placehold.co/600x400', caption: 'Analytics & velocity report' },
        { image: 'https://placehold.co/600x400', caption: 'Team workspace — doc view' },
      ],
    },
  },

  cta: {
    data: {
      heading:             'Ready to bring your team together?',
      subheading:          'Join 8,000+ teams using Arcova to ship faster, collaborate better, and hit their goals.',
      primaryButtonText:   'Start free — no credit card',
      primaryButtonUrl:    '#',
      secondaryButtonText: 'Book a demo',
      secondaryButtonUrl:  '#',
    },
    template: {},
  },

  footer: {
    data: {
      brand:    'Arcova',
      tagline:  'The workspace for high-performing teams.',
      links: [
        { label: 'Home',     href: '#' },
        { label: 'About',    href: '#' },
        { label: 'Blog',     href: '#' },
        { label: 'Careers',  href: '#' },
        { label: 'Press',    href: '#' },
      ],
      serviceLinks: [
        { label: 'Features',     href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'Pricing',      href: '#' },
        { label: 'Changelog',    href: '#' },
        { label: 'Status',       href: '#' },
      ],
      copyright: `© ${new Date().getFullYear()} Arcova, Inc. All rights reserved.`,
      ...SHARED_CONTACT,
    },
    template: {},
  },

  socialmedia: {
    data: {
      heading:    'Follow us on social',
      subheading: 'Stay up to date with the latest from Arcova — product updates, team stories, and more.',
      embeds: [
        { platform: 'youtube',   url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',                                                                                          enabled: true },
        { platform: 'instagram', url: 'https://www.instagram.com/p/C8pHjMZNG9b/embed',                                                                                      enabled: true },
        { platform: 'tiktok',    url: 'https://www.tiktok.com/embed/v2/7310742018639400235',                                                                                 enabled: true },
        { platform: 'facebook',  url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F',          enabled: true },
      ],
    },
    template: {
      bgColor:   '#ffffff',
      textColor: '#111827',
      padding:   64,
      textAlign: 'center',
    },
  },

  contact: {
    data: {
      heading:    'Get in touch',
      subheading: 'Have a question or want to see Arcova in action? We\'d love to hear from you — our team typically replies within a few hours.',
      ...SHARED_CONTACT,
      hours:   'Monday – Friday, 9 am – 6 pm ET',
      mapsUrl: '',
      socials: {
        instagram: 'https://instagram.com/arcova',
        facebook:  'https://facebook.com/arcova',
        tiktok:    'https://tiktok.com/@arcova',
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
      heading:     'Request a demo',
      subheading:  'Tell us a bit about yourself and we\'ll set up a personalised walkthrough of Arcova for your team.',
      submitLabel: 'Request demo',
      fields: {
        name:    true,
        email:   true,
        phone:   true,
        subject: false,
        message: true,
        consent: true,
      },
      consentText: 'I agree to Arcova\'s privacy policy and consent to being contacted about my request.',
    },
    template: {
      bgColor:    '#ffffff',
      textColor:  '#000000',
      buttonBg:   '#6366f1',
      buttonText: '#ffffff',
      padding:    48,
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
      const num     = prev.pages.list.length + 1
      const id      = `page-${Date.now()}`
      const newList = [...prev.pages.list, { id, label: `Page ${num}`, sections: [] }]
      return {
        ...prev,
        pages:  { activePage: id, list: newList },
        navbar: { ...prev.navbar, data: { ...prev.navbar.data, links: syncNavbarLinks(prev.navbar.data.links ?? [], newList) } },
      }
    })
  }

  function addCustomPage(label) {
    setTheme(prev => {
      const id      = `page-${Date.now()}`
      const newList = [...prev.pages.list, { id, label, sections: [] }]
      return {
        ...prev,
        pages:  { ...prev.pages, list: newList },
        navbar: { ...prev.navbar, data: { ...prev.navbar.data, links: syncNavbarLinks(prev.navbar.data.links ?? [], newList) } },
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
        pages:  { activePage: newActive, list: nextList },
        navbar: { ...prev.navbar, data: { ...prev.navbar.data, links: syncNavbarLinks(prev.navbar.data.links ?? [], nextList) } },
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
    setTheme(prev => {
      const newList = prev.pages.list.map(p => p.id === id ? { ...p, label } : p)
      return {
        ...prev,
        pages:  { ...prev.pages, list: newList },
        navbar: { ...prev.navbar, data: { ...prev.navbar.data, links: syncNavbarLinks(prev.navbar.data.links ?? [], newList) } },
      }
    })
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
    setTheme(prev => {
      if (prev[id]) return prev
      return { ...prev, [id]: { data: {}, template: {} } }
    })
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

export function useDarkMode() {
  const { theme } = useTheme()
  return theme.globalTheme.darkMode ?? false
}
