import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function IconEye({ color, crossed }) {
  return crossed ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function SortablePanelItem({
  id, label, typeColor, isActive, isVis,
  t,
  onSelect, onToggleVisibility,
}) {
  const [hovered, setHovered] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `panel__${id}` })

  return (
    <li
      ref={setNodeRef}
      style={{
        marginBottom: '2px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 6px 5px 4px', borderRadius: '6px',
          borderLeft: isActive ? `3px solid ${typeColor ?? '#6366f1'}` : '3px solid transparent',
          background: isActive ? t.activeItemBg : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >

        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          title="Drag to reorder"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '20px', flexShrink: 0,
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: 0.4,
          }}
        >
          <span style={{ color: t.textMuted, fontSize: '13px', lineHeight: 1, userSelect: 'none' }}>
            ⠿
          </span>
        </div>

        {/* Label */}
        <button
          onClick={onSelect}
          style={{
            flex: 1, textAlign: 'left', padding: '2px 0',
            border: 'none', background: 'transparent',
            color: isActive ? t.textActive : t.textMuted,
            fontSize: '12px', fontWeight: isActive ? '500' : '400',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            opacity: isVis ? 1 : 0.45,
          }}
        >
          {label}
        </button>

        {/* Visibility toggle */}
        <button
          onClick={onToggleVisibility}
          title={isVis ? 'Hide' : 'Show'}
          style={{
            background: 'none',
            border: `1px solid ${t.border}`,
            borderRadius: '5px',
            padding: '3px 5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconEye color={isVis ? t.textMuted : t.textLabel} crossed={!isVis} />
        </button>

      </div>
    </li>
  )
}
