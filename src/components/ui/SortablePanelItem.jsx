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

function IconChevronUp({ color }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function IconChevronDown({ color }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconBtn({ onClick, title, disabled, children, t }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        background: 'none',
        border: `1px solid ${t.border}`,
        borderRadius: '5px',
        padding: '3px 5px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.25 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}

export default function SortablePanelItem({
  id, label, isActive, isVis,
  index, orderLength, t,
  onSelect, onMoveUp, onMoveDown, onToggleVisibility,
}) {
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
    <li
      ref={setNodeRef}
      style={{
        marginBottom: '2px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        padding: '4px 4px 4px 0', borderRadius: '6px',
        borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
        background: isActive ? t.activeItemBg : 'transparent',
        transition: 'all 0.2s ease',
      }}>
        {/* Label button */}
        <button
          onClick={onSelect}
          style={{
            flex: 1, textAlign: 'left', padding: '4px 8px',
            border: 'none', background: 'transparent',
            color: isActive ? t.textActive : (isVis ? t.textMuted : t.textLabel),
            fontSize: '13px', fontWeight: isActive ? '500' : '400',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            opacity: isVis ? 1 : 0.45,
          }}
        >
          {label}
        </button>

        {/* Up / Down arrows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <IconBtn onClick={onMoveUp}   title="Move up"   disabled={index === 0}             t={t}>
            <IconChevronUp   color={t.textMuted} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} title="Move down" disabled={index === orderLength - 1} t={t}>
            <IconChevronDown color={t.textMuted} />
          </IconBtn>
        </div>

        {/* Visibility toggle */}
        <IconBtn onClick={onToggleVisibility} title={isVis ? 'Hide' : 'Show'} t={t}>
          <IconEye color={isVis ? t.textMuted : t.textLabel} crossed={!isVis} />
        </IconBtn>

        {/* Drag handle — right side, hover-only */}
        <div
          {...listeners}
          {...attributes}
          title="Drag to reorder"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '18px', flexShrink: 0,
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: hovered ? 0.6 : 0,
            transition: 'opacity 0.15s',
            paddingRight: '4px',
          }}
        >
          <span style={{ color: t.textMuted, fontSize: '13px', lineHeight: 1, userSelect: 'none' }}>
            ⠿
          </span>
        </div>
      </div>
    </li>
  )
}
