import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableCanvasItem({ id, children, onSelect }) {
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

      {/* Preview — click to select */}
      <div onClick={e => { if (e.target.closest('button, a')) return; onSelect(id) }} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </div>
  )
}
