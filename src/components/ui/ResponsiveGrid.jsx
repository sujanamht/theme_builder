import { useContainerWidth } from '../../hooks/useContainerWidth.js'

const DEFAULT_COLS = { mobile: 1, tablet: 2, desktop: 4 }

/**
 * A grid wrapper that switches column count based on container width,
 * not viewport width.
 *
 * @param {{ mobile: number, tablet: number, desktop: number }} [cols]
 * @param {number} [gap=24]         Gap between cells in px.
 * @param {number} [minTablet=500]  Width threshold for tablet layout.
 * @param {number} [minDesktop=768] Width threshold for desktop layout.
 */
export default function ResponsiveGrid({
  children,
  cols       = DEFAULT_COLS,
  gap        = 24,
  minTablet  = 500,
  minDesktop = 768,
  style: styleProp,
}) {
  const { ref, width } = useContainerWidth()

  const activeCols =
    width < minTablet  ? cols.mobile  :
    width < minDesktop ? cols.tablet  :
                         cols.desktop

  return (
    <div
      ref={ref}
      style={{
        display:             'grid',
        gridTemplateColumns: `repeat(${activeCols}, 1fr)`,
        gap:                 `${gap}px`,
        width:               '100%',
        boxSizing:           'border-box',
        ...styleProp,
      }}
    >
      {children}
    </div>
  )
}
