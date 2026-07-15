import { useMemo } from 'react';
import { Copy, MessageCircle, FileText, Image, Trophy } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';
import { buildMissingText, copyToClipboard, shareWhatsApp, exportPDF, exportImage } from '../utils/export';
import { useToast } from '../components/Toast';

export default function Missing() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const toast = useToast();

  const missing = useMemo(() => {
    return Object.values(stickers)
      .filter(s => s.status === 'missing')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [stickers]);

  // Agrupa por prefixo
  const grouped = useMemo(() => {
    const groups = {};
    for (const s of missing) {
      if (!groups[s.prefix]) groups[s.prefix] = { prefix: s.prefix, name: s.sectionName, items: [] };
      groups[s.prefix].items.push(s);
    }
    return Object.values(groups);
  }, [missing]);

  const text = useMemo(() => buildMissingText(missing, album?.name), [missing, album]);

  const onCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Copiado para a área de transferência');
    else toast.error('Não foi possível copiar');
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Figurinhas faltantes" subtitle={`${missing.length} faltando`} />

      {missing.length === 0 ? (
        <div className="px-4 pt-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amarelo-400 to-amarelo-500 rounded-full mb-3 shadow-lg">
            <Trophy className="w-10 h-10 text-zinc-900" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-display font-extrabold mb-1">Sem faltantes!</h2>
          <p className="text-zinc-600">Você já tem todas as figurinhas. 🎉</p>
        </div>
      ) : (
        <>
          {/* Actions */}
          <div className="px-4 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onCopy} className="btn btn-secondary">
                <Copy className="w-4 h-4" /> Copiar
              </button>
              <button onClick={() => shareWhatsApp(text)} className="btn bg-verde-500 text-white">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={() => exportPDF(`Faltantes - ${album?.name || 'Álbum'}`, text)} className="btn bg-rose-500 text-white">
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => exportImage(`Faltantes - ${album?.name || 'Álbum'}`, text)} className="btn bg-azul-500 text-white">
                <Image className="w-4 h-4" /> Imagem
              </button>
            </div>
          </div>

          {/* Lista agrupada por seção */}
          <div className="px-4 mt-5 space-y-4">
            {grouped.map(g => (
              <div key={g.prefix} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="bg-rose-50 px-4 py-2 border-b border-rose-100 flex items-center gap-2">
                  <div className="bg-rose-500 text-white rounded px-2 py-0.5 text-xs font-bold font-mono">
                    {g.prefix === 'N' ? '#' : g.prefix}
                  </div>
                  <div className="font-display font-extrabold text-rose-700 flex-1">{g.name}</div>
                  <div className="text-xs font-bold text-rose-600">{g.items.length}</div>
                </div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {g.items.map(s => (
                    <div key={s.code} className="bg-rose-100 text-rose-800 font-mono font-bold px-2 py-1 rounded-md text-sm">
                      {s.code}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
