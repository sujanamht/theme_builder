import { parsePx } from './style.js'

export function headingStyle({ template, globalTheme, textColor }) {
  return {
    color:      textColor,
    fontSize:   template.headingSize || globalTheme.headingSize || '2rem',
    fontWeight: '800',
    margin:     '0 0 10px',
    lineHeight: '1.2',
    textAlign:  'center',
  }
}

export function subheadingStyle({ template, globalTheme, textColor, fontSize }) {
  return {
    color:      textColor,
    fontSize:   template.subheadingSize || globalTheme.bodySize || `${fontSize}px`,
    fontWeight: '400',
    opacity:    0.6,
    margin:     '0 0 32px',
    lineHeight: '1.6',
    textAlign:  'center',
  }
}
