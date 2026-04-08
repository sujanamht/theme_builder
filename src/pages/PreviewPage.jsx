import { useParams } from 'react-router-dom'
import { useTheme } from '../store/themeStore.jsx'
import { SelectionContext, PreviewPageContext } from '../store/selectionContext.jsx'

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
import BlogListPreview      from '../components/previews/BlogListPreview.jsx'
import BlogPostPreview      from '../components/previews/BlogPostPreview.jsx'
import AboutDetailPreview  from '../components/previews/AboutDetailPreview.jsx'
import PageBannerPreview   from '../components/previews/PageBannerPreview.jsx'
import TeamPreview         from '../components/previews/TeamPreview.jsx'
import PartnersPreview     from '../components/previews/PartnersPreview.jsx'

/* ─── registry of preview components by type ───
 * The builder and preview registries are separate because they have different concerns:
 * - Builder: how to edit each section type (form fields, image uploads, etc.)
 * - Preview: how to render each section type based on the theme data
 * Keeping them separate allows for more flexibility and avoids coupling the editing UI with the rendering logic.
 */

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
  bloglist:    <BlogListPreview />,
  blogPost:    <BlogPostPreview />,
  aboutDetail:  <AboutDetailPreview />,
  pageBanner:   <PageBannerPreview />,
  team:         <TeamPreview />,
  partners:     <PartnersPreview />,
}

const GLOBAL_TYPES = new Set(['announcement', 'navbar', 'footer'])

function getType(id) { return id.replace(/-\d+$/, '') }

function UnknownSection({ type }) {
  return (
    <div style={{
      padding:    '14px 20px',
      background: '#fef3c7',
      border:     '1px dashed #f59e0b',
      color:      '#92400e',
      fontFamily: 'monospace',
      fontSize:   '13px',
    }}>
      ⚠ Unknown section type: &quot;{type}&quot;
    </div>
  )
}

export default function PreviewPage() {
  const { theme } = useTheme()
  const { pageId: paramPageId } = useParams()

  // Use the URL param when navigating directly (e.g. /preview/blogpost),
  // otherwise fall back to the builder's active page.
  const activePageId   = paramPageId ?? theme.pages?.activePage
  const activePage     = theme.pages?.list?.find(p => p.id === activePageId)
  const activeSections = activePage?.sections ?? []

  const homeSections     = theme.pages?.list?.find(p => p.id === 'home')?.sections ?? []
  const announcementKeys = homeSections.filter(k => getType(k) === 'announcement')
  const navbarKeys       = homeSections.filter(k => getType(k) === 'navbar')
  const footerKeys       = homeSections.filter(k => getType(k) === 'footer')
  const pageKeys         = activeSections.filter(k => !GLOBAL_TYPES.has(getType(k)))

  const allKeys = [...announcementKeys, ...navbarKeys, ...pageKeys, ...footerKeys]

  return (
    <SelectionContext.Provider value={''}>
    <PreviewPageContext.Provider value={activePageId}>
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        {allKeys.map(key => {
          const type = getType(key)
          const component = PREVIEWS[type]
          if (!component) {
            console.warn(`[ThemeBuilder] Unknown section type "${type}" in PreviewPage`)
            return <UnknownSection key={key} type={type} />
          }
          return <div key={key}>{component}</div>
        })}
      </div>
    </PreviewPageContext.Provider>
    </SelectionContext.Provider>
  )
}
