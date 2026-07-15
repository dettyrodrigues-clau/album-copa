import { STATUS_LABEL } from '../store/useStore'

const statusColors = {
  missing: 'bg-rose-100 text-rose-700',
  have: 'bg-amarelo-100 text-amber-800',
  duplicate: 'bg-azul-100 text-azul-700',
  glued: 'bg-verde-100 text-verde-700'
}

export default function StatusBadge({ status, size = 'md' }) {
  const cls = statusColors[status] || 'bg-cinza-100 text-cinza-700'
  const sizeCls = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-xs px-2.5 py-1'
  return (
    <span className={`chip ${cls} ${sizeCls}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
