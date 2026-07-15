import { useMemo } from 'react';
import { Copy, MessageCircle, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';
import { buildDuplicatesText, copyToClipboard, shareWhatsApp } from '../utils/export';
import { useToast } from '../components/Toast';

export default function Duplicates() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const incrementDuplicate = useStore(s => s.incrementDuplicate);
  const toast = useToast();

  const dups = useMemo(() => {
    return Object.values(stickers)
      .filter(s => s.status === 'duplicate' && (s.duplicates || 0) > 0)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [stickers]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const s of dups) {
      if (!groups[s.prefix]) groups[s.prefix] = { prefix: s.prefix, name: s.sectionName, items: [] };
      groups[s.prefix].items.push(s);
    }
    return Object.values(groups);
  }, [dups]);

  const text = useMemo(() => buildDuplicatesText(dups, album?.name), [dups, album]);
  const totalCount = dups.reduce((acc, s) => acc + (s.duplicates || 0), 0);

  const onCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Copiado!');
    else toast.error('Não foi possível copiar');
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Repetidas" subtitle={`${dups.length} tipos • ${totalCount} no total`} />

      <div className="px-4 pt-3">
        {dups.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            <p className="font-semibold">Sem repetidas no momento</p>
            <p className="text-sm">Marque figurinhas como "Repetida" pra elas aparecerem aqui</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={onCopy} className="btn btn-secondary">
                <Copy className="w-4 h-4" /> Copiar
              </button>
              <button onClick={() => shareWhatsApp(text)} className="btn bg-verde-500 text-white">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
            </div>

            <div className="space-y-4">
              {grouped.map(g => (
                <div key={g.prefix} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="bg-amarelo-50 px-4 py-2 border-b border-amarelo-100 flex items-center gap-2">
                    <div className="bg-amarelo-500 text-zinc-900 rounded px-2 py-0.5 text-xs font-bold font-mono">
                      {g.prefix === 'N' ? '#' : g.prefix}
                    </div>
                    <div className="font-display font-extrabold text-zinc-800 flex-1">{g.name}</div>
                    <div className="text-xs font-bold text-zinc-700">{g.items.length}</div>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {g.items.map(s => (
                      <div key={s.code} className="flex items-center gap-3 px-4 py-3">
                        <div className="bg-amarelo-100 text-zinc-900 font-mono font-bold px-3 py-1 rounded-md min-w-[5rem] text-center">
                          {s.code}
                        </div>
                        <div className="flex-1 text-sm text-zinc-600 truncate">{s.name || ''}</div>
                        <button
                          onClick={() => incrementDuplicate(s.code, -1)}
                          className="w-9 h-9 rounded-full bg-white border-2 border-amarelo-400 flex items-center justify-center active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="font-display font-extrabold text-xl w-7 text-center">{s.duplicates}</div>
                        <button
                          onClick={() => incrementDuplicate(s.code, +1)}
                          className="w-9 h-9 rounded-full bg-amarelo-500 border-2 border-amarelo-600 flex items-center justify-center active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
