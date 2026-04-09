import { parsePx } from './style.js'

export function headingStyle({ template, globalTheme, textColor }) {
  return {
    color:        textColor,
    fontSize:     template.headingSize || globalTheme.headingSize || '2rem',
    fontWeight:   '800',
    lineHeight:   '1.2',
    textAlign:    'center',
    marginTop:    '10px',
    marginBottom: '5px',
    padding:      '18px 0 ',
  }
}

export function subheadingStyle({ template, globalTheme, textColor, fontSize }) {
  return {
    color:        textColor,
    fontSize:     template.subheadingSize || globalTheme.bodySize || `${fontSize}px`,
    fontWeight:   '400',
    opacity:      0.6,
    lineHeight:   '1.6',
    textAlign:    'center',
    marginTop:    0,
    marginBottom: '48px',
  }
}
