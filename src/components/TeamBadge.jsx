import { TEAM_FLAGS, TEAM_NAMES } from '../data/copa2026Games';

// Mostra: 🇧🇷 BRA (configurável)
export function TeamFlag({ prefix, size = 'md', className = '' }) {
  const flag = TEAM_FLAGS[prefix];
  if (!flag) return null;
  const sizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
  };
  return <span className={`${sizes[size] || sizes.md} ${className}`}>{flag}</span>;
}

// Badge completo: bandeira + nome do time
export function TeamBadge({ prefix, showName = true, size = 'md', layout = 'row' }) {
  const name = TEAM_NAMES[prefix] || prefix;
  if (layout === 'col') {
    return (
      <div className="flex flex-col items-center gap-1">
        <TeamFlag prefix={prefix} size={size} />
        {showName && <span className="text-xs font-bold truncate">{name}</span>}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <TeamFlag prefix={prefix} size={size} />
      {showName && <span className="font-bold truncate">{name}</span>}
    </div>
  );
}
