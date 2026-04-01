export default function DotIndicators({ count, activeIndex, onDotClick, accentColor, darkMode }) {
  if (count <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          style={{
            width:        i === activeIndex ? '20px' : '8px',
            height:       '8px',
            borderRadius: '4px',
            border:       'none',
            background:   i === activeIndex ? accentColor : (darkMode ? '#52525b' : '#d1d5db'),
            cursor:       'pointer',
            padding:      0,
            transition:   'width 0.3s ease, background 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}
