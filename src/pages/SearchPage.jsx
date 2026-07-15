import { useState, useMemo, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import StickerTile from '../components/StickerTile';
import StickerDetailSheet from '../components/StickerDetailSheet';
import { useStore, STATUS_LABEL } from '../store/useStore';

// Normaliza o input do usuário pra encontrar o código
// "mex 4" -> "MEX 4", "mex4" -> "MEX 4", "MEX-4" -> "MEX 4", "cc1" -> "CC1"
function normalizeQuery(q) {
  const trimmed = q.trim().toUpperCase().replace(/[-_]/g, ' ');
  // tenta extrair prefix + número (ex "MEX4" -> ["MEX", "4"])
  const match = trimmed.match(/^([A-Z]+)\s*(\d+)$/);
  if (match) {
    const [, prefix, num] = match;
    if (prefix === 'CC') return `CC${num}`;
    return `${prefix} ${num}`;
  }
  return trimmed;
}

export default function SearchPage() {
  const stickers = useStore(s => s.stickers);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalizedQuery = normalizeQuery(query);

  const exactMatch = useMemo(() => {
    if (!query.trim()) return null;
    return stickers[normalizedQuery] || null;
  }, [query, stickers, normalizedQuery]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const qNorm = normalizedQuery.toLowerCase();
    return Object.values(stickers)
      .filter(s => {
        return (
          s.code.toLowerCase().includes(qNorm) ||
          s.code.toLowerCase().includes(q) ||
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.sectionName && s.sectionName.toLowerCase().includes(q)) ||
          (s.prefix && s.prefix.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 60);
  }, [query, stickers, normalizedQuery]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Buscar figurinha" subtitle="Por código ou nome" />

      <div className="px-4 pt-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex: MEX 4, BRA 7, FWC 12, Neymar..."
            className="input pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Resultado exato */}
      {exactMatch && (
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-br from-verde-500 to-azul-600 text-white rounded-2xl p-5 shadow-lg">
            <div className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">Resultado exato</div>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white text-zinc-900 rounded-xl px-3 py-2 font-display font-extrabold text-2xl">
                {exactMatch.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{exactMatch.sectionName}</div>
                {exactMatch.name && <div className="text-sm opacity-90 truncate">{exactMatch.name}</div>}
              </div>
            </div>
            <div className="bg-white/15 rounded-lg p-3 text-sm">
              <strong>Status:</strong> {STATUS_LABEL[exactMatch.status]}
              {exactMatch.status === 'duplicate' && (exactMatch.duplicates || 0) > 1 && (
                <> ({exactMatch.duplicates} repetidas)</>
              )}
            </div>
            <button
              onClick={() => setSelected(exactMatch)}
              className="mt-3 w-full bg-white text-verde-700 font-bold py-2.5 rounded-xl active:scale-95 transition"
            >
              Editar status
            </button>
          </div>
        </div>
      )}

      {/* Outros resultados */}
      <div className="px-4 mt-5">
        {!query.trim() ? (
          <div className="text-center py-10 text-zinc-500">
            <SearchIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-semibold">Digite um código ou nome</p>
            <p className="text-sm">Ex: MEX 1, BRA, Neymar, Brasil...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            <p className="font-semibold">Nada encontrado</p>
          </div>
        ) : (
          <>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-1">
              {filtered.length} resultado{filtered.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {filtered.map(s => (
                <StickerTile key={s.code} sticker={s} onClick={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>

      {selected && <StickerDetailSheet sticker={selected} onClose={() => setSelected(null)} />}
      <BottomNav />
    </div>
  );
}
