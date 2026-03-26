import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableCanvasItem({ id, children, onSelect, onDuplicate }) {
  const [hovered, setHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle — left edge, hover-only */}
      <div
        {...listeners}
        {...attributes}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s',
          zIndex: 10,
        }}
      >
        <span style={{
          color: '#6366f1',
          fontSize: '16px',
          lineHeight: 1,
          userSelect: 'none',
          textShadow: '0 1px 4px rgba(99,102,241,0.4)',
        }}>
          ⠿
        </span>
      </div>

      {/* Hover toolbar — top right corner */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            display: 'flex',
            gap: '4px',
            zIndex: 20,
          }}
          onMouseEnter={e => e.stopPropagation()}
        >
          {/* Duplicate button */}
          <button
            onClick={e => { e.stopPropagation(); onDuplicate() }}
            title="Duplicate"
            style={{
              background: 'rgba(20,20,20,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '5px',
              color: '#ccc',
              fontSize: '11px',
              padding: '3px 7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'Inter, sans-serif',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(20,20,20,0.85)'}
          >
            ⧉
          </button>
        </div>
      )}

      {/* Preview — click to select */}
      <div onClick={() => onSelect(id)} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </div>
  )
}
