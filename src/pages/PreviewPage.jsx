import { useTheme } from '../store/themeStore.jsx'
import { SelectionContext } from '../store/selectionContext.jsx'

import AnnouncementPreview  from '../components/previews/AnnouncementPreview.jsx'
import NavbarPreview        from '../components/previews/NavbarPreview.jsx'
import TestimonialPreview   from '../components/previews/TestimonialPreview.jsx'
import CarouselPreview      from '../components/previews/CarouselPreview.jsx'
import ServicesPreview      from '../components/previews/ServicesPreview.jsx'
import GalleryPreview       from '../components/previews/GalleryPreview.jsx'
import AboutPreview         from '../components/previews/AboutPreview.jsx'
import CTAPreview           from '../components/previews/CTAPreview.jsx'
import FooterPreview        from '../components/previews/FooterPreview.jsx'
import HeroPreview          from '../components/previews/HeroPreview.jsx'
import ContactPreview       from '../components/previews/ContactPreview.jsx'
import FormPreview          from '../components/previews/FormPreview.jsx'
import SocialMediaPreview   from '../components/previews/SocialMediaPreview.jsx'

const PREVIEWS = {
  announcement: <AnnouncementPreview />,
  navbar:       <NavbarPreview />,
  about:        <AboutPreview />,
  services:     <ServicesPreview />,
  testimonial:  <TestimonialPreview />,
  carousel:     <CarouselPreview />,
  gallery:      <GalleryPreview />,
  cta:          <CTAPreview />,
  footer:       <FooterPreview />,
  hero:         <HeroPreview />,
  contact:      <ContactPreview />,
  form:         <FormPreview />,
  socialmedia:  <SocialMediaPreview />,
}

const GLOBAL_TYPES = new Set(['announcement', 'navbar', 'footer'])

function getType(id) { return id.replace(/-\d+$/, '') }

export default function PreviewPage() {
  const { theme } = useTheme()

  const activePageId   = theme.pages?.activePage
  const activePage     = theme.pages?.list?.find(p => p.id === activePageId)
  const activeSections = activePage?.sections ?? []

  const homeSections     = theme.pages?.list?.find(p => p.id === 'home')?.sections ?? []
  const announcementKeys = homeSections.filter(k => getType(k) === 'announcement')
  const navbarKeys       = homeSections.filter(k => getType(k) === 'navbar')
  const footerKeys       = homeSections.filter(k => getType(k) === 'footer')
  const pageKeys         = activeSections.filter(k => !GLOBAL_TYPES.has(getType(k)))

  const allKeys = [...announcementKeys, ...navbarKeys, ...pageKeys, ...footerKeys]

  return (
    <SelectionContext.Provider value={null}>
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        {allKeys.map(key => {
          const component = PREVIEWS[getType(key)]
          if (!component) return null
          return <div key={key}>{component}</div>
        })}
      </div>
    </SelectionContext.Provider>
  )
}
