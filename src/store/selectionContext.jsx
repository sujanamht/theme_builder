import { createContext, useContext } from 'react'

export const SelectionContext = createContext(null)

export function useSelection() {
  return useContext(SelectionContext)
}

// Carries the resolved page ID in a full-page preview (/preview/:pageId).
// Components like PageBannerPreview read this to look up per-page data
// instead of relying on theme.pages.activePage (which reflects the builder's
// last selected page, not the URL).
export const PreviewPageContext = createContext(null)

export function usePreviewPageId() {
  return useContext(PreviewPageContext)
}
