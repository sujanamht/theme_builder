export default function RangeField({ label, value, onChange, min, max, step = 1, unit = 'px' }) {
  const numeric = parseInt(value, 10)
  const current = isNaN(numeric) ? min : Math.min(Math.max(numeric, min), max)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs font-mono text-gray-400">{current}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={e => onChange(`${e.target.value}${unit}`)}
        className="w-full accent-indigo-500 cursor-pointer"
      />
    </div>
  )
}
