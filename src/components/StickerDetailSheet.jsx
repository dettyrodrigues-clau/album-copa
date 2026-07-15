import { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useStore, STATUS, STATUS_LABEL } from '../store/useStore';
import { TEAM_FLAGS } from '../data/copa2026Games';
import TeamFlag from './TeamFlag';

const statusOptions = [
  { value: STATUS.MISSING, label: 'Falta', color: 'bg-zinc-100 border-zinc-400 text-zinc-700', active: 'bg-zinc-700 text-white border-zinc-700' },
  { value: STATUS.HAVE, label: 'Já tenho', color: 'bg-verde-50 border-verde-300 text-verde-700', active: 'bg-verde-500 text-white border-verde-500' },
  { value: STATUS.DUPLICATE, label: 'Repetida', color: 'bg-amarelo-50 border-amarelo-400 text-zinc-800', active: 'bg-amarelo-500 text-zinc-900 border-amarelo-500' },
  { value: STATUS.GLUED, label: 'Colada', color: 'bg-azul-50 border-azul-300 text-azul-700', active: 'bg-azul-500 text-white border-azul-500' },
];

export default function StickerDetailSheet({ sticker, onClose }) {
  const setStatus = useStore(s => s.setStatus);
  const incrementDuplicate = useStore(s => s.incrementDuplicate);
  const updateSticker = useStore(s => s.updateSticker);
  const [name, setName] = useState(sticker?.name || '');

  useEffect(() => {
    setName(sticker?.name || '');
  }, [sticker?.code]);

  if (!sticker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-verde-500 to-azul-500 text-white px-5 py-4 sm:rounded-t-2xl rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TeamFlag prefix={sticker.prefix} size="xl" />
            <div>
              <div className="text-xs font-medium opacity-90">{sticker.sectionName}</div>
              <div className="text-2xl font-display font-extrabold">{sticker.code}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status */}
          <div>
            <div className="text-sm font-semibold text-zinc-700 mb-2">Status</div>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(opt => {
                const isActive = sticker.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(sticker.code, opt.value)}
                    className={`py-3 px-4 rounded-xl border-2 font-bold transition ${isActive ? opt.active : opt.color}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duplicates counter */}
          {sticker.status === STATUS.DUPLICATE && (
            <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-4">
              <div className="text-sm font-semibold text-zinc-700 mb-2">Quantas repetidas?</div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => incrementDuplicate(sticker.code, -1)}
                  className="w-12 h-12 rounded-full bg-white border-2 border-amarelo-500 flex items-center justify-center active:scale-95 transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-4xl font-display font-extrabold">{sticker.duplicates || 0}</div>
                <button
                  onClick={() => incrementDuplicate(sticker.code, +1)}
                  className="w-12 h-12 rounded-full bg-amarelo-500 border-2 border-amarelo-600 flex items-center justify-center active:scale-95 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Name (optional) */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Nome do jogador (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => updateSticker(sticker.code, { name })}
              placeholder="Ex: Neymar Jr."
              className="input"
            />
          </div>

          <button onClick={onClose} className="btn btn-secondary w-full">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
