import { createContext, useContext, useState, useEffect } from 'react'
import * as themeService from '../services/themeService.js'
import { useSaveStatus } from '../services/useSaveStatus.js'

const HOME_SECTIONS = ['announcement', 'navbar', 'carousel', 'about', 'services', 'testimonial', 'footer']

const INITIAL_PAGES = [
  { id: 'home',    label: 'Home',    sections: HOME_SECTIONS },
  /* 'about' below intentionally reuses the same store key as in HOME_SECTIONS.
     Both the Home page and the About page render from theme.about — single source
     of truth for the "About" content block. If they ever need independent content,
     add a separate 'about2' (or similar) key and split the initial state. */
  { id: 'about',    label: 'About',    sections: ['pageBanner', 'about', 'cta'] },
  { id: 'services', label: 'Services', sections: ['pageBanner', 'services'] },
  { id: 'contact', label: 'Contact', sections: ['contact', 'form'] },
  { id: 'blog',     label: 'Blog',      sections: ['pageBanner', 'bloglist'] },
  { id: 'blogpost', label: 'Blog Post', sections: ['pageBanner', 'blogPost'] },
  { id: 'custom',   label: 'Custom',    sections: [] },
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
    headingSize:     '2rem',
    bodySize:        '1rem',
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
    template: { marquee: true, marqueeSpeed: 30, bgColor: '', textColor: '', fontSize: 14, padding: 8 },
  },

  navbar: {
    data: {
      logoText: '',
      links: INITIAL_PAGES.map(p => ({ label: p.label, url: '#', pageId: p.id })),
    },
    template: {
      bgColor:         '',
      textColor:       '',
      accentColor:     '',
      fontSize:        16,
      padding:         12,
      linkSpacing:     '24px',
      logoSize:        '28px',
      navbarHeight:    '',
      logoPosition:    'left',
      sticky:          false,
      borderBottom:    false,
      borderBottomColor: '',
    },
  },

  hero: {
    data: {
      headline:    'Run your entire operation from one place',
      subheadline: 'Arcova brings your projects, people, and performance data into a single workspace — so your team can focus on what actually moves the needle.',
      ctaText:     'Start free trial',
      ctaUrl:      '#',
      bgImage:     'https://placehold.co/1200x600',
    },
    template: {
      bgColor:       '',
      textColor:     '',
      btnBg:         '',
      btnText:       '',
      eyebrowText:   '',
      headingSize:   56,
      imagePosition: 'right',
      padding:       64,
      minHeight:     480,
    },
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
    template: {
      bgColor:    '',
      textColor:  '#ffffff',
      arrowColor: '#ffffff',
      dotColor:   '#ffffff',
      fontSize:   16,
      height:     560,
    },
  },

  about: {
    data: {
      heading:    'Built for teams that move fast',
      body:       'Arcova was founded in 2020 by a team of engineers and operators who were tired of duct-taping five tools together just to run a sprint. We built the product we always wanted — one that adapts to how your team works, not the other way around. Today, over 8,000 teams rely on Arcova to run their day-to-day.',
      image:      'https://placehold.co/600x400',
      buttonText: 'Meet the team',
      buttonUrl:  '#',
    },
    template: {
      bgColor:       '',
      textColor:     '',
      buttonBg:      '',
      buttonText:    '',
      fontSize:      16,
      padding:       64,
      imagePosition: 'left',
    },
  },

  services: {
    template: {
      bgColor:      '',
      textColor:    '',
      cardBg:       '',
      accentColor:  '',
      fontSize:     15,
      borderRadius: 12,
      padding:      64,
      displayMode:  'grid',
      columns:      '3',
    },
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
    template: {
      bgColor:      '',
      textColor:    '',
      cardBg:       '',
      fontSize:     14,
      borderRadius: 12,
      padding:      48,
      visibleCount: 1,
    },
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
    template: {
      bgColor:      '',
      textColor:    '',
      captionBg:    '#000000',
      fontSize:     14,
      borderRadius: 8,
      gap:          16,
      columns:      '3',
      padding:      64,
    },
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
    template: {
      bgColor:            '',
      textColor:          '',
      primaryBtnBg:       '',
      primaryBtnText:     '',
      secondaryBtnBg:     '',
      secondaryBtnText:   '',
      fontSize:           16,
      padding:            64,
      textAlign:          'center',
    },
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
    template: {
      bgColor:   '',
      textColor: '',
      linkColor: '',
      fontSize:  14,
      padding:   64,
    },
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

  bloglist: {
    data: {
      heading: 'From the Blog',
      subheading: 'Thoughts on product, design, and building fast-growing teams.',
      posts: [
        {
          id: 'post-1',
          slug: 'post-1',
          title: 'How Arcova helped us cut sprint planning time in half',
          excerpt: 'We sat down with the team at Luma Health to understand how they restructured their entire planning process using Arcova workspaces.',
          coverImage: 'https://placehold.co/800x450',
          author: 'Natalie Chen',
          date: '2024-11-12',
          tags: ['Case Study', 'Planning'],
        },
        {
          id: 'post-2',
          slug: 'post-2',
          title: 'Why async-first teams ship 3x faster',
          excerpt: 'Async communication isn\'t just a remote-work hack — it\'s a superpower for distributed teams that want to stay in flow and move quickly.',
          coverImage: 'https://placehold.co/800x450',
          author: 'Marcus Lindqvist',
          date: '2024-10-28',
          tags: ['Culture', 'Remote Work'],
        },
        {
          id: 'post-3',
          slug: 'post-3',
          title: 'Building a product roadmap your whole team will actually use',
          excerpt: 'The best roadmap is one everyone understands. Here\'s how we approach roadmapping at Arcova — and how you can steal our process.',
          coverImage: 'https://placehold.co/800x450',
          author: 'Aisha Okonkwo',
          date: '2024-10-05',
          tags: ['Product', 'Strategy'],
        },
      ],
    },
    template: {
      bgColor: '',
      textColor: '',
      accentColor: '',
      cardBg: '',
      columns: '3',
      padding: 64,
      borderRadius: 12,
      fontSize: 15,
    },
  },

  blogpost: {
    data: {
      activePostId: 'post-1',
      blogView: 'list',
    },
    template: {
      bgColor: '',
      textColor: '',
      accentColor: '',
      fontSize: 16,
      padding: 64,
      maxWidth: 720,
    },
  },

  blogPost: {
    data: {
      title:       'How We Built a Product People Actually Love',
      author:      'Jane Doe',
      date:        '2024-11-01',
      tags:        ['Design', 'Product'],
      coverImage:  'https://placehold.co/1200x480',
      paragraphs:  [
        'Great products are built on empathy — a deep understanding of the people who use them every day.',
        'We started by listening. Hundreds of user interviews, support tickets, and feedback sessions shaped every decision we made.',
        'The result is something we are genuinely proud of: a tool that feels intuitive from the first click and powerful as your needs grow.',
      ],
    },
    template: {
      bgColor:      '',
      textColor:    '',
      accentColor:  '',
      fontSize:     16,
      padding:      64,
    },
  },

  team: {
    data: {
      heading:     'Meet Our Team',
      description: 'Together we create the future with focus on sustainability and innovation.',
      members: [
        { image: '', name: 'John Doe',   role: 'Director & Partner',  email: 'john@company.com', phone: '+1 234 567 890' },
        { image: '', name: 'Jane Smith', role: 'Architect & Partner', email: 'jane@company.com', phone: '+1 234 567 891' },
        { image: '', name: 'Mark Lee',   role: 'Project Manager',     email: 'mark@company.com', phone: '+1 234 567 892' },
        { image: '', name: 'Sara Jones', role: 'Communications',      email: 'sara@company.com', phone: '+1 234 567 893' },
        { image: '', name: 'Tom Brown',  role: 'Interior Architect',  email: 'tom@company.com',  phone: '+1 234 567 894' },
        { image: '', name: 'Lisa Wang',  role: 'Architect',           email: 'lisa@company.com', phone: '+1 234 567 895' },
      ],
    },
    template: {
      sectionBackground: '#ffffff',
      padding: 48,
      displayMode:       'grid',
      columns:           '3',
      imageHeight:          '280px',
      imageBorderRadius:    '8px',
      headingColor:         '#111111',
      headingSize:          '2rem',
      descColor:            '#888888',
      descSize:             '0.95rem',
      nameColor:            '#111111',
      nameSize:             '1rem',
      roleColor:            '#888888',
      roleSize:             '0.875rem',
      contactColor:         '#555555',
      contactSize:          '0.8rem',
      cardGap:              '32px',
    },
  },

  aboutDetail: {
    data: {
      heading:      'About Us',
      descriptions: ['We build tools that help teams collaborate, move faster, and do their best work.'],
      cards: [
        {
          iconClass: 'fa-solid fa-layer-group',
          title:     'OUR MISSION',
          body:      'We are driven by a mission to simplify complex workflows and empower teams to do their best work every single day.',
        },
        {
          iconClass: 'fa-solid fa-drafting-compass',
          title:     'OUR VISION',
          body:      'Our vision is a world where every team — regardless of size — has access to tools that help them collaborate, ship, and grow.',
        },
        {
          iconClass: 'fa-solid fa-bullseye',
          title:     'OUR GOAL',
          body:      'Our goal is to build the most intuitive and powerful workspace platform that teams actually enjoy using every day.',
        },
      ],
    },
    template: {
      overlapAmount:    '80px',
      cardBackground:   '#ffffff',
      cardShadow:       '0 4px 24px rgba(0,0,0,0.10)',
      iconColor:        '',
      iconSize:         '2rem',
      titleColor:       '#111111',
      titleSize:        '0.85rem',
      bodyColor:        '#555555',
      bodySize:         '0.95rem',
      buttonBg:         '',
      buttonTextColor:  '#ffffff',
      cardPadding:      '2.5rem 2rem',
      sectionBackground:  '#ffffff',
      backgroundImage:    '',
      backgroundSize:     'cover',
      backgroundPosition: 'center',
      backgroundRepeat:   'no-repeat',
      overlayColor:          '',
      overlayOpacity:        0,
      padding: 48,
    },
  },

  pageBanner: {
    template: {
      backgroundSize:     'cover',
      backgroundPosition: 'center',
      overlayColor:       '#000000',
      overlayOpacity:     0.45,
      bannerHeight:       '400px',
      headingColor:       '#ffffff',
      headingSize:        '2.8rem',
      headingWeight:      '700',
      subheadingColor:    '#eeeeee',
      subheadingSize:     '1rem',
      textAlign:          'center',
    },
    pages: {
      home:     { heading: 'Welcome',       subheading: '', backgroundImage: '' },
      about:    { heading: 'About Us',      subheading: '', backgroundImage: '' },
      blog:     { heading: 'Blog',          subheading: '', backgroundImage: '' },
      contact:  { heading: 'Contact Us',    subheading: '', backgroundImage: '' },
     
     
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

  partners: {
    data: {
      heading: 'Our Partners',
      items: [
        { image: '', name: 'Partner 1' },
        { image: '', name: 'Partner 2' },
        { image: '', name: 'Partner 3' },
        { image: '', name: 'Partner 4' },
      ],
    },
    template: {
      bgColor:      '',
      headingColor: '',
      padding:      48,
      logoHeight:   '60px',
      autoScroll:   true,
      speed:        30,
    },
  },

  assets: [],
}

export const ThemeContext = createContext(null)


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialState)
  const { status: saveStatus, triggerSave } = useSaveStatus()

  // Load from src/data/theme.json on mount
  useEffect(() => {
    themeService.load().then(data => {
      if (data) setTheme(prev => ({ ...prev, ...data }))
    })
  }, [])

  // Auto-save on state change (debounced inside themeService)
  useEffect(() => {
    themeService.save(theme)
  }, [theme])

  function updatePageBannerData(page, key, value) {
    setTheme(prev => ({
      ...prev,
      pageBanner: {
        ...prev.pageBanner,
        pages: {
          ...prev.pageBanner.pages,
          [page]: {
            ...(prev.pageBanner.pages?.[page] ?? {}),
            [key]: value,
          },
        },
      },
    }))
  }

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

  function setActivePostId(id) {
    setTheme(prev => ({
      ...prev,
      blogpost: {
        ...prev.blogpost,
        data: { ...prev.blogpost.data, activePostId: id },
      },
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

  function addAsset({ name, dataUrl }) {
    setTheme(prev => ({
      ...prev,
      assets: [
        ...(prev.assets ?? []),
        { id: crypto.randomUUID(), name, dataUrl, createdAt: Date.now() },
      ],
    }))
  }

  function deleteAsset(id) {
    setTheme(prev => ({
      ...prev,
      assets: (prev.assets ?? []).filter(a => a.id !== id),
    }))
  }

  function renameAsset(id, newName) {
    setTheme(prev => ({
      ...prev,
      assets: (prev.assets ?? []).map(a => a.id === id ? { ...a, name: newName } : a),
    }))
  }

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      updateSection, updatePageBannerData, updateGlobalTheme,
      updatePageOrder, setPageSections,
      addPage, addCustomPage, deletePage, setActivePage, renamePage, removeSectionFromAllPages, setActivePostId,
      addSection, removeSection,
      addAsset, deleteAsset, renameAsset,
      saveStatus, triggerSave,
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

export function useAssets() {
  const { theme, addAsset, deleteAsset, renameAsset } = useTheme()
  return { assets: theme.assets ?? [], addAsset, deleteAsset, renameAsset }
}

