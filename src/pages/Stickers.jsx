import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import StickerTile from '../components/StickerTile';
import StickerDetailSheet from '../components/StickerDetailSheet';
import { useStore, STATUS } from '../store/useStore';
import { TEAM_FLAGS } from '../data/copa2026Games';
import TeamFlag from '../components/TeamFlag';

const filters = [
  { value: 'all', label: 'Todas', color: 'bg-zinc-100 text-zinc-800 border-zinc-200', active: 'bg-zinc-800 text-white border-zinc-800' },
  { value: STATUS.MISSING, label: 'Faltam', color: 'bg-rose-50 text-rose-700 border-rose-200', active: 'bg-rose-500 text-white border-rose-500' },
  { value: STATUS.HAVE, label: 'Já tenho', color: 'bg-verde-50 text-verde-700 border-verde-200', active: 'bg-verde-500 text-white border-verde-500' },
  { value: STATUS.DUPLICATE, label: 'Repetidas', color: 'bg-amarelo-50 text-zinc-800 border-amarelo-300', active: 'bg-amarelo-500 text-zinc-900 border-amarelo-500' },
  { value: STATUS.GLUED, label: 'Coladas', color: 'bg-azul-50 text-azul-700 border-azul-200', active: 'bg-azul-500 text-white border-azul-500' },
];

export default function Stickers() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const [filter, setFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [sectionPickerOpen, setSectionPickerOpen] = useState(false);

  const sections = album?.sections || [];

  const filtered = useMemo(() => {
    let list = Object.values(stickers);
    if (filter !== 'all') list = list.filter(s => s.status === filter);
    if (sectionFilter !== 'all') list = list.filter(s => s.prefix === sectionFilter);
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [stickers, filter, sectionFilter]);

  // Agrupa por seção quando vendo "all"
  const grouped = useMemo(() => {
    if (sectionFilter !== 'all') return null;
    const groups = {};
    for (const s of filtered) {
      if (!groups[s.prefix]) groups[s.prefix] = { prefix: s.prefix, name: s.sectionName, items: [] };
      groups[s.prefix].items.push(s);
    }
    return Object.values(groups);
  }, [filtered, sectionFilter]);

  const currentSection = sectionFilter === 'all' ? null : sections.find(s => s.prefix === sectionFilter);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Figurinhas" subtitle={`${Object.keys(stickers).length} cadastradas`} />

      {/* Section picker */}
      {sections.length > 1 && (
        <div className="px-4 pt-3">
          <button
            onClick={() => setSectionPickerOpen(true)}
            className="w-full bg-white border-2 border-zinc-200 rounded-xl px-4 py-2.5 flex items-center justify-between active:bg-zinc-50"
          >
            <div className="text-left flex items-center gap-2">
{currentSection && <TeamFlag prefix={currentSection.prefix} size="md" />}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Seção</div>
                <div className="font-display font-extrabold text-zinc-800">
                  {currentSection ? `${currentSection.prefix} • ${currentSection.name}` : 'Todas as seções'}
                </div>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      )}

      {/* Status filters */}
      <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-3 border-b border-zinc-100">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {filters.map(f => {
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-bold text-sm border-2 transition ${isActive ? f.active : f.color}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stickers grid */}
      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="font-semibold">Nenhuma figurinha encontrada</p>
            <p className="text-sm">Tente outro filtro</p>
          </div>
        ) : grouped ? (
          <div className="space-y-5">
            {grouped.map(g => (
              <div key={g.prefix}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <TeamFlag prefix={g.prefix} size="md" />
                  <div className="bg-verde-500 text-white rounded-md px-2 py-0.5 text-xs font-bold font-mono">
                    {g.prefix === 'N' ? '#' : g.prefix}
                  </div>
                  <div className="text-sm font-display font-extrabold text-zinc-800">{g.name}</div>
                  <div className="text-xs text-zinc-500 ml-auto">{g.items.length}</div>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {g.items.map(s => (
                    <StickerTile key={s.code} sticker={s} onClick={setSelected} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {filtered.map(s => (
              <StickerTile key={s.code} sticker={s} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Section picker modal */}
      {sectionPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setSectionPickerOpen(false)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-5 py-3">
              <div className="font-display font-extrabold text-lg">Escolher seção</div>
            </div>
            <div className="p-3">
              <button
                onClick={() => { setSectionFilter('all'); setSectionPickerOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl mb-1 ${sectionFilter === 'all' ? 'bg-verde-500 text-white' : 'hover:bg-zinc-100'}`}
              >
                <div className="font-bold">Todas as seções</div>
              </button>
              {sections.map(s => (
                <button
                  key={s.prefix}
                  onClick={() => { setSectionFilter(s.prefix); setSectionPickerOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-2 ${sectionFilter === s.prefix ? 'bg-verde-500 text-white' : 'hover:bg-zinc-100'}`}
                >
                  <TeamFlag prefix={s.prefix} size="md" />
                  <div className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${sectionFilter === s.prefix ? 'bg-white/20' : 'bg-zinc-200'}`}>
                    {s.prefix === 'N' ? '#' : s.prefix}
                  </div>
                  <div className="font-bold flex-1">{s.name}</div>
                  <div className="text-xs opacity-70">{s.count}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected && <StickerDetailSheet sticker={selected} onClose={() => setSelected(null)} />}
      <BottomNav />
    </div>
  );
}
