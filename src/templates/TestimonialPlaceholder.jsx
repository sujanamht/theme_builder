const BOX = '#c8d0dc'
const R = '4px'

function Bar({ width, height = 12, style }) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: BOX,
      borderRadius: R,
      flexShrink: 0,
      ...style,
    }} />
  )
}

function Card() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Quote lines */}
      <Bar width="100%" height={10} />
      <Bar width="92%"  height={10} />
      <Bar width="96%"  height={10} />
      <Bar width="80%"  height={10} />
      {/* Spacer */}
      <div style={{ height: 8 }} />
      {/* Name */}
      <Bar width="55%"  height={12} />
      {/* Role */}
      <Bar width="38%"  height={10} />
    </div>
  )
}

export default function TestimonialPlaceholder() {
  return (
    <section style={{
      backgroundColor: '#4A90D9',
      padding: '52px 40px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Heading bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <Bar width="260px" height={20} />
      </div>

      {/* 3-column cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <Card />
        <Card />
        <Card />
      </div>

      {/* Pagination dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '40px',
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: i === 2 ? BOX : 'transparent',
            border: `2px solid ${BOX}`,
            boxSizing: 'border-box',
          }} />
        ))}
      </div>
    </section>
  )
}
