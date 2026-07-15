import { useState, useRef } from 'react';
import { Camera, Upload, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore, STATUS } from '../store/useStore';
import { analyzePagePhoto, fileToDataURL } from '../utils/photoAnalysis';
import { useToast } from '../components/Toast';
import { makeCode } from '../utils/albumPresets';

export default function PhotoScan() {
  const album = useStore(s => s.album);
  const pages = useStore(s => s.pages);
  const stickers = useStore(s => s.stickers);
  const bulkSetStatus = useStore(s => s.bulkSetStatus);
  const toast = useToast();
  const fileInputRef = useRef();
  const cameraInputRef = useRef();
  const [step, setStep] = useState('select'); // select | analyzing | review
  const [selectedPageId, setSelectedPageId] = useState('');
  const [imageData, setImageData] = useState(null);
  const [cells, setCells] = useState([]);

  const pagesList = Object.values(pages);
  const selectedPage = pages[selectedPageId];

  const handleFile = async (file) => {
    if (!file || !selectedPage) return;
    setStep('analyzing');
    try {
      const dataUrl = await fileToDataURL(file);
      setImageData(dataUrl);
      const result = await analyzePagePhoto(dataUrl, selectedPage.gridRows, selectedPage.gridCols);
      // Mapeia cada célula com o código da figurinha correspondente
      const interval = selectedPage.to - selectedPage.from + 1;
      const mapped = result.cells.slice(0, interval).map((cell, idx) => {
        const numberInSection = selectedPage.from + idx;
        const code = makeCode(selectedPage.prefix || 'N', numberInSection);
        const sticker = stickers[code];
        return {
          ...cell,
          code,
          numberInSection,
          sticker,
          // Estado: 'glued' se preenchido, 'missing' se vazio
          decided: cell.filled ? 'glued' : 'missing',
        };
      });
      setCells(mapped);
      setStep('review');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao analisar a foto');
      setStep('select');
    }
  };

  const toggleCell = (idx) => {
    setCells(prev => prev.map((c, i) => i === idx ? { ...c, decided: c.decided === 'glued' ? 'missing' : 'glued' } : c));
  };

  const apply = () => {
    const glued = cells.filter(c => c.decided === 'glued').map(c => c.code);
    const missing = cells.filter(c => c.decided === 'missing').map(c => c.code);
    if (glued.length) bulkSetStatus(glued, STATUS.GLUED);
    if (missing.length) bulkSetStatus(missing, STATUS.MISSING);
    toast.success(`${glued.length} marcadas como coladas, ${missing.length} como faltantes`);
    setStep('select');
    setImageData(null);
    setCells([]);
  };

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-verde-500 mx-auto mb-3" />
          <p className="font-semibold">Analisando foto...</p>
          <p className="text-sm text-zinc-500">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    const gluedCount = cells.filter(c => c.decided === 'glued').length;
    const missingCount = cells.filter(c => c.decided === 'missing').length;
    return (
      <div className="min-h-screen bg-zinc-50 pb-48">
        <Header title="Revisar leitura" subtitle="Confira e ajuste se preciso" />

        <div className="px-4 pt-3 space-y-3">
          <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-3 text-sm">
            💡 Toque em cada figurinha pra alternar entre <strong>colada</strong> e <strong>vazio</strong>.
            <br />Coladas terão <strong className="text-azul-700">borda azul</strong>; vazias <strong className="text-zinc-600">borda cinza</strong>.
          </div>

          <div className="bg-white rounded-xl p-3 border border-zinc-200">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Página</div>
            <div className="font-display font-extrabold">{selectedPage?.name}</div>
            <div className="text-xs text-zinc-500">
              {selectedPage?.prefix} {selectedPage?.from} até {selectedPage?.prefix} {selectedPage?.to}
            </div>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${selectedPage.gridCols}, 1fr)` }}
          >
            {cells.map((cell, idx) => {
              const isGlued = cell.decided === 'glued';
              return (
                <button
                  key={idx}
                  onClick={() => toggleCell(idx)}
                  className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center transition active:scale-95 ${
                    isGlued
                      ? 'bg-azul-500 border-azul-700 text-white'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-500 border-dashed'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-80">
                    {cell.sticker?.prefix === '00' ? '' : (cell.sticker?.prefix || '')}
                  </span>
                  <span className="text-base font-display font-extrabold leading-tight">
                    {cell.numberInSection}
                  </span>
                  {isGlued && <Check className="w-4 h-4 mt-0.5" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer fixo com botões de ação - z-index alto pra ficar SOBRE qualquer outra coisa */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-zinc-200 px-4 py-3 shadow-2xl"
          style={{ zIndex: 100, paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-around text-sm mb-2">
            <div><span className="font-bold text-azul-600">{gluedCount}</span> coladas</div>
            <div><span className="font-bold text-zinc-600">{missingCount}</span> faltam</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep('select')} className="btn btn-secondary flex-1">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button onClick={apply} className="btn btn-primary flex-1">
              <Check className="w-4 h-4" /> Confirmar
            </button>
          </div>
        </div>

        {/* Sem BottomNav nessa tela - o footer com Voltar/Confirmar substitui a navegação */}
      </div>
    );
  }

  // Step "select"
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Ler página por foto" subtitle="Identifica figurinhas coladas" />

      <div className="px-4 pt-3 space-y-4">
        <div className="bg-azul-50 border-2 border-azul-200 rounded-xl p-3 text-sm">
          📷 Tire uma foto da página do álbum, bem em cima, com boa iluminação. O sistema vai analisar quais figurinhas estão coladas.
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">1️⃣ Qual página você vai fotografar?</label>
          <select
            value={selectedPageId}
            onChange={e => setSelectedPageId(e.target.value)}
            className="input"
          >
            <option value="">Escolha uma página...</option>
            {pagesList.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.prefix} {p.from} a {p.to}
              </option>
            ))}
          </select>
          {pagesList.length === 0 && (
            <p className="text-sm text-rose-700 mt-2">
              Você precisa cadastrar pelo menos uma página em <strong>Páginas</strong> antes de usar a foto.
            </p>
          )}
        </div>

        {selectedPage && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">2️⃣ Tirar foto ou enviar da galeria:</div>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-azul-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition shadow-md"
            >
              <Camera className="w-5 h-5" />
              Tirar foto agora
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-2 border-zinc-300 text-zinc-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Upload className="w-5 h-5" />
              Escolher da galeria
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => handleFile(e.target.files?.[0])} className="hidden" />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} className="hidden" />
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
