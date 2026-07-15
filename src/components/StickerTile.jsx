import { Check } from 'lucide-react';
import { STATUS } from '../store/useStore';
import { TEAM_FLAGS } from '../data/copa2026Games';
import TeamFlag from './TeamFlag';

const statusStyles = {
  missing: 'bg-zinc-100 border-zinc-300 text-zinc-500',
  have: 'bg-verde-100 border-verde-500 text-verde-800',
  duplicate: 'bg-amarelo-100 border-amarelo-500 text-zinc-800',
  glued: 'bg-azul-500 border-azul-700 text-white',
};

export default function StickerTile({ sticker, onClick }) {
  const style = statusStyles[sticker.status] || statusStyles.missing;
  const isGlued = sticker.status === STATUS.GLUED;
  const isDup = sticker.status === STATUS.DUPLICATE && (sticker.duplicates || 0) > 0;

  return (
    <button
      onClick={() => onClick(sticker)}
      className={`relative aspect-[3/4] rounded-xl border-2 ${style} flex flex-col items-center justify-center font-display font-bold transition-all active:scale-95 shadow-sm hover:shadow-md p-1`}
    >
      {/* Bandeira no topo */}
      {sticker.prefix !== 'N' && (
        <div className="mb-0.5">
          <TeamFlag prefix={sticker.prefix} size="sm" />
        </div>
      )}
      <span className="text-[10px] font-bold uppercase tracking-tight leading-none opacity-70">
        {sticker.prefix === '00' ? '' : sticker.prefix}
      </span>
      <span className="text-base leading-tight">
        {sticker.prefix === '00' ? '00' : sticker.numberInSection}
      </span>
      {isGlued && (
        <Check className="absolute top-1 right-1 w-3.5 h-3.5" strokeWidth={3} />
      )}
      {isDup && (
        <span className="absolute top-0.5 right-0.5 bg-amarelo-500 text-zinc-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-zinc-900">
          {sticker.duplicates}
        </span>
      )}
    </button>
  );
}
