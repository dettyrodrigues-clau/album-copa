import { useState, useRef, useEffect, useMemo } from 'react';
import { Zap, Type, List, Camera, Check, X, ArrowRight, AlertCircle, Plus, Loader2, Upload, Layers, Trash2, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TeamFlag from '../components/TeamFlag';
import { useStore, STATUS } from '../store/useStore';
import { useToast } from '../components/Toast';
import { makeCode } from '../utils/albumPresets';

const statusOptions = [
  { value: STATUS.HAVE, label: 'Já tenho', color: 'bg-verde-500 text-white border-verde-500', shortcut: 'verde' },
  { value: STATUS.GLUED, label: 'Colada', color: 'bg-azul-500 text-white border-azul-500', shortcut: 'azul' },
  { value: STATUS.DUPLICATE, label: 'Repetida', color: 'bg-amarelo-500 text-zinc-900 border-amarelo-500', shortcut: 'amarelo' },
];

// Normaliza o input do usuário ("cod 11", "COD11", "COD-11") → "COD 11"
// "cc1", "cc 1" → "CC1"
// "00" → "00"
export function normalizeCode(input) {
  const t = input.trim().toUpperCase().replace(/[-_]/g, ' ');
  if (t === '00' || t === '0') return '00';
  const m = t.match(/^([A-Z]+)\s*(\d+)$/);
  if (!m) return null;
  const [, prefix, num] = m;
  if (prefix === 'CC') return `CC${parseInt(num)}`;
  return `${prefix} ${parseInt(num)}`;
}

// Extrai códigos de um texto livre (separadores: vírgula, ponto e vírgula, quebra de linha, espaço duplo)
function parseBatch(input) {
  if (!input) return [];
  const tokens = input.split(/[,;\n]+|\s{2,}/).map(t => t.trim()).filter(Boolean);
  const results = [];
  for (const tok of tokens) {
    const code = normalizeCode(tok);
    if (code) results.push(code);
  }
  return results;
}

export default function QuickAdd() {
  const [mode, setMode] = useState('section'); // 'section' | 'single' | 'batch' | 'photo'
  const [defaultStatus, setDefaultStatus] = useState(STATUS.HAVE);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Adicionar rápido" subtitle="Marca várias figurinhas de uma vez" />

      <div className="px-4 pt-3 space-y-4">
        {/* Status padrão */}
        <div className="bg-white rounded-xl p-3 border border-zinc-200">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">Marcar como:</div>
          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDefaultStatus(opt.value)}
                className={`py-2 px-2 rounded-lg text-sm font-bold border-2 transition ${
                  defaultStatus === opt.value
                    ? opt.color
                    : 'bg-white border-zinc-200 text-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode picker */}
        <div className="bg-white rounded-xl p-1 border border-zinc-200 grid grid-cols-4 gap-1">
          <ModeButton active={mode === 'section'} onClick={() => setMode('section')} icon={Layers} label="Seleção" />
          <ModeButton active={mode === 'single'} onClick={() => setMode('single')} icon={Type} label="Digitar" />
          <ModeButton active={mode === 'batch'} onClick={() => setMode('batch')} icon={List} label="Lote" />
          <ModeButton active={mode === 'photo'} onClick={() => setMode('photo')} icon={Camera} label="Foto" />
        </div>

        {/* Mode content */}
        {mode === 'section' && <SectionMode defaultStatus={defaultStatus} />}
        {mode === 'single' && <SingleMode defaultStatus={defaultStatus} />}
        {mode === 'batch' && <BatchMode defaultStatus={defaultStatus} />}
        {mode === 'photo' && <PhotoOCRMode defaultStatus={defaultStatus} />}
      </div>

      <BottomNav />
    </div>
  );
}

function ModeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
        active ? 'bg-verde-500 text-white' : 'text-zinc-600 hover:bg-zinc-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ============================================
// MODO 0: PREENCHER SELEÇÃO INTEIRA (a nova estrela!)
// ============================================
function SectionMode({ defaultStatus }) {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const bulkSetStatus = useStore(s => s.bulkSetStatus);
  const toast = useToast();
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [mode, setMode] = useState('all'); // 'all' | 'range'
  const [rangeFrom, setRangeFrom] = useState('');
  const [rangeTo, setRangeTo] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const sections = album?.sections || [];
  const currentSection = sections.find(s => s.prefix === selectedPrefix);

  // Filtra códigos da seção
  const codesInSection = useMemo(() => {
    if (!selectedPrefix) return [];
    return Object.values(stickers)
      .filter(s => s.prefix === selectedPrefix)
      .sort((a, b) => a.numberInSection - b.numberInSection);
  }, [selectedPrefix, stickers]);

  // Filtra pelo intervalo (se modo === 'range')
  const targetCodes = useMemo(() => {
    if (mode === 'all') return codesInSection.map(s => s.code);
    const from = parseInt(rangeFrom) || 0;
    const to = parseInt(rangeTo) || 0;
    if (from < 1 || to < from) return [];
    return codesInSection
      .filter(s => s.numberInSection >= from && s.numberInSection <= to)
      .map(s => s.code);
  }, [mode, rangeFrom, rangeTo, codesInSection]);

  // Contagem atual de status na seleção
  const currentCounts = useMemo(() => {
    const filtered = codesInSection.filter(s => {
      if (mode === 'all') return true;
      const from = parseInt(rangeFrom) || 0;
      const to = parseInt(rangeTo) || 0;
      return s.numberInSection >= from && s.numberInSection <= to;
    });
    return {
      total: filtered.length,
      missing: filtered.filter(s => s.status === 'missing').length,
      have: filtered.filter(s => s.status === 'have').length,
      duplicate: filtered.filter(s => s.status === 'duplicate').length,
      glued: filtered.filter(s => s.status === 'glued').length,
    };
  }, [codesInSection, mode, rangeFrom, rangeTo]);

  const applyFill = () => {
    if (!targetCodes.length) {
      toast.error('Nenhuma figurinha selecionada');
      return;
    }
    bulkSetStatus(targetCodes, defaultStatus);
    const statusLabel = defaultStatus === 'have' ? 'Já tenho' :
                         defaultStatus === 'glued' ? 'Coladas' :
                         defaultStatus === 'duplicate' ? 'Repetidas' : 'Faltando';
    toast.success(`${targetCodes.length} figurinha${targetCodes.length > 1 ? 's' : ''} marcada${targetCodes.length > 1 ? 's' : ''} como ${statusLabel}`);
    if (mode === 'range') {
      setRangeFrom('');
      setRangeTo('');
    }
  };

  const clearAll = () => {
    if (!targetCodes.length) return;
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    bulkSetStatus(targetCodes, 'missing');
    toast.success(`${targetCodes.length} figurinha${targetCodes.length > 1 ? 's' : ''} zerada${targetCodes.length > 1 ? 's' : ''}`);
    setConfirmClear(false);
    if (mode === 'range') {
      setRangeFrom('');
      setRangeTo('');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-verde-50 to-azul-50 border-2 border-verde-300 rounded-xl p-3 text-sm">
        ⚡ <strong>Preencher seleção inteira:</strong> escolhe um país, marca todas as figurinhas de uma vez. Perfeito quando você recebe uma seleção completa ou precisa limpar!
      </div>

      {/* Seletor de seleção */}
      <div className="bg-white rounded-xl border-2 border-verde-300 p-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">
          1️⃣ Escolha a seleção
        </label>
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-3 py-3 flex items-center justify-between active:bg-zinc-100"
        >
          {currentSection ? (
            <div className="flex items-center gap-3">
              <TeamFlag prefix={currentSection.prefix} size="lg" />
              <div className="text-left">
                <div className="font-display font-extrabold">{currentSection.name}</div>
                <div className="text-xs text-zinc-500">{currentSection.prefix} • {currentSection.count} figurinhas</div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 font-semibold">Toque pra escolher...</div>
          )}
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        </button>

        {/* Modo: todas vs intervalo */}
        {selectedPrefix && (
          <>
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">
                2️⃣ Quais figurinhas?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode('all')}
                  className={`py-3 px-3 rounded-lg text-sm font-bold border-2 transition ${
                    mode === 'all' ? 'bg-verde-500 text-white border-verde-500' : 'bg-white border-zinc-200 text-zinc-700'
                  }`}
                >
                  Todas ({currentSection?.count})
                </button>
                <button
                  onClick={() => setMode('range')}
                  className={`py-3 px-3 rounded-lg text-sm font-bold border-2 transition ${
                    mode === 'range' ? 'bg-verde-500 text-white border-verde-500' : 'bg-white border-zinc-200 text-zinc-700'
                  }`}
                >
                  Intervalo
                </button>
              </div>
            </div>

            {mode === 'range' && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">De</label>
                  <input
                    type="number"
                    value={rangeFrom}
                    onChange={e => setRangeFrom(e.target.value)}
                    min="1"
                    max={currentSection?.count || 99}
                    placeholder="1"
                    className="input text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Até</label>
                  <input
                    type="number"
                    value={rangeTo}
                    onChange={e => setRangeTo(e.target.value)}
                    min="1"
                    max={currentSection?.count || 99}
                    placeholder={String(currentSection?.count || 20)}
                    className="input text-center font-mono font-bold"
                  />
                </div>
              </div>
            )}

            {/* Preview do impacto */}
            {targetCodes.length > 0 && (
              <div className="mt-4 bg-azul-50 border border-azul-200 rounded-lg p-3">
                <div className="text-xs font-bold text-azul-800 mb-1">
                  🎯 {targetCodes.length} figurinha{targetCodes.length > 1 ? 's' : ''} selecionada{targetCodes.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-azul-700 grid grid-cols-2 gap-1 mt-2">
                  {currentCounts.missing > 0 && <div>🔴 Faltam: <strong>{currentCounts.missing}</strong></div>}
                  {currentCounts.have > 0 && <div>🟢 Já tenho: <strong>{currentCounts.have}</strong></div>}
                  {currentCounts.duplicate > 0 && <div>🟡 Repetidas: <strong>{currentCounts.duplicate}</strong></div>}
                  {currentCounts.glued > 0 && <div>🔵 Coladas: <strong>{currentCounts.glued}</strong></div>}
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="mt-4 space-y-2">
              <button
                onClick={applyFill}
                disabled={targetCodes.length === 0}
                className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Marcar {targetCodes.length > 0 && `${targetCodes.length} `}como {defaultStatus === 'have' ? 'Já tenho' : defaultStatus === 'glued' ? 'Coladas' : 'Repetidas'}
              </button>

              <button
                onClick={clearAll}
                disabled={targetCodes.length === 0}
                className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmClear ? 'bg-rose-700 text-white animate-pulse' : 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {confirmClear ? 'CONFIRMAR: zerar tudo?' : `Zerar ${targetCodes.length > 0 ? `${targetCodes.length} ` : ''}(marcar como faltando)`}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de escolha de seleção */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setPickerOpen(false)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-5 py-3 z-10">
              <div className="font-display font-extrabold text-lg">Escolher seleção</div>
              <div className="text-xs text-zinc-500">Todas as seções do álbum</div>
            </div>
            <div className="p-3">
              {sections.map(s => (
                <button
                  key={s.prefix}
                  onClick={() => { setSelectedPrefix(s.prefix); setPickerOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex items-center gap-3 ${
                    selectedPrefix === s.prefix ? 'bg-verde-500 text-white' : 'hover:bg-zinc-100'
                  }`}
                >
                  <TeamFlag prefix={s.prefix} size="md" />
                  <div className="flex-1">
                    <div className="font-bold">{s.name}</div>
                    <div className={`text-xs ${selectedPrefix === s.prefix ? 'opacity-80' : 'text-zinc-500'}`}>
                      {s.prefix} • {s.count} figurinhas
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// MODO 1: DIGITAR 1 A 1 (mais rápido)
// ============================================
function SingleMode({ defaultStatus }) {
  const stickers = useStore(s => s.stickers);
  const setStatus = useStore(s => s.setStatus);
  const incrementDuplicate = useStore(s => s.incrementDuplicate);
  const toast = useToast();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // últimas marcadas pra desfazer
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const code = normalizeCode(input);
    if (!code) {
      toast.error('Código inválido');
      return;
    }
    const sticker = stickers[code];
    if (!sticker) {
      toast.error(`${code} não existe no álbum`);
      return;
    }
    // Se for marcar repetida, incrementa contador
    if (defaultStatus === STATUS.DUPLICATE) {
      incrementDuplicate(code, +1);
      const newCount = (sticker.duplicates || 0) + 1;
      toast.success(`${code} marcada como repetida (${newCount})`);
    } else {
      setStatus(code, defaultStatus);
      toast.success(`${code} marcada!`);
    }
    setHistory(prev => [{ code, prevStatus: sticker.status, prevDups: sticker.duplicates || 0 }, ...prev].slice(0, 10));
    setInput('');
    inputRef.current?.focus();
  };

  const undo = () => {
    if (!history.length) return;
    const [last, ...rest] = history;
    setStatus(last.code, last.prevStatus);
    // Restaura duplicates se for o caso
    const s = stickers[last.code];
    if (s) {
      const delta = last.prevDups - (s.duplicates || 0);
      if (delta !== 0) incrementDuplicate(last.code, delta);
    }
    setHistory(rest);
    toast.info(`Desfeito: ${last.code}`);
  };

  return (
    <>
      <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-3 text-sm">
        ⚡ <strong>Modo rápido:</strong> digite o código (ex: <strong>COD 11</strong>) e aperte <strong>Enter</strong>. O sistema marca e foca no próximo automaticamente!
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border-2 border-verde-300">
        <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1">
          Digite o código da figurinha
        </label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: COD 11"
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          className="input text-2xl font-display font-extrabold text-center py-4"
          style={{ textTransform: 'uppercase' }}
        />
        <button type="submit" className="btn btn-primary w-full mt-2 py-3">
          <Plus className="w-5 h-5" /> Adicionar e próximo
        </button>
      </form>

      {/* Histórico (últimas marcadas) */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl p-3 border border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Últimas marcadas</div>
            <button onClick={undo} className="text-xs font-bold text-azul-600 hover:text-azul-700">
              ↶ Desfazer última
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <div key={i} className="bg-verde-100 text-verde-800 font-mono font-bold text-xs px-2 py-1 rounded">
                {h.code}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// MODO 2: LOTE (várias de uma vez)
// ============================================
function BatchMode({ defaultStatus }) {
  const stickers = useStore(s => s.stickers);
  const bulkSetStatus = useStore(s => s.bulkSetStatus);
  const incrementDuplicate = useStore(s => s.incrementDuplicate);
  const toast = useToast();
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState({ valid: [], invalid: [] });

  // Recalcula preview quando muda input
  useEffect(() => {
    const codes = parseBatch(input);
    const valid = [];
    const invalid = [];
    for (const code of codes) {
      if (stickers[code]) {
        if (!valid.includes(code)) valid.push(code);
      } else {
        invalid.push(code);
      }
    }
    setPreview({ valid, invalid });
  }, [input, stickers]);

  const apply = () => {
    if (preview.valid.length === 0) {
      toast.error('Nenhum código válido');
      return;
    }
    if (defaultStatus === STATUS.DUPLICATE) {
      // Conta repetições no input pra saber quantas vezes incrementar
      const codes = parseBatch(input);
      const counts = {};
      for (const c of codes) {
        if (stickers[c]) counts[c] = (counts[c] || 0) + 1;
      }
      for (const [code, count] of Object.entries(counts)) {
        incrementDuplicate(code, count);
      }
      toast.success(`${preview.valid.length} marcadas como repetidas`);
    } else {
      bulkSetStatus(preview.valid, defaultStatus);
      toast.success(`${preview.valid.length} marcadas com sucesso`);
    }
    setInput('');
  };

  return (
    <>
      <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-3 text-sm">
        📋 <strong>Modo lote:</strong> cole ou digite vários códigos separados por vírgula ou linha. Ex: <code className="bg-white px-1 rounded">COD 11, MEX 5, BRA 18, FWC 3</code>
      </div>

      <div className="bg-white rounded-xl p-4 border-2 border-azul-300">
        <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1">
          Cole/digite os códigos
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="COD 11, MEX 5, BRA 18..."
          rows={5}
          className="input font-mono"
          style={{ minHeight: '120px', textTransform: 'uppercase' }}
        />

        {/* Preview */}
        {(preview.valid.length > 0 || preview.invalid.length > 0) && (
          <div className="mt-3 space-y-2">
            {preview.valid.length > 0 && (
              <div className="bg-verde-50 border border-verde-200 rounded-lg p-2 text-sm">
                <div className="font-bold text-verde-700 mb-1">
                  ✓ {preview.valid.length} código{preview.valid.length > 1 ? 's' : ''} válido{preview.valid.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-verde-700 font-mono">
                  {preview.valid.join(', ')}
                </div>
              </div>
            )}
            {preview.invalid.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-sm">
                <div className="font-bold text-rose-700 mb-1">
                  ✕ {preview.invalid.length} código{preview.invalid.length > 1 ? 's' : ''} inválido{preview.invalid.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-rose-700 font-mono">
                  {preview.invalid.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={apply}
          disabled={preview.valid.length === 0}
          className="btn btn-primary w-full mt-3 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" /> Marcar {preview.valid.length > 0 && `(${preview.valid.length})`}
        </button>
      </div>
    </>
  );
}

// ============================================
// MODO 3: FOTO COM OCR
// ============================================
function PhotoOCRMode({ defaultStatus }) {
  const stickers = useStore(s => s.stickers);
  const setStatus = useStore(s => s.setStatus);
  const incrementDuplicate = useStore(s => s.incrementDuplicate);
  const toast = useToast();
  const [step, setStep] = useState('select'); // 'select' | 'analyzing' | 'result'
  const [detected, setDetected] = useState([]); // candidatos detectados
  const [editingCode, setEditingCode] = useState('');
  const cameraInputRef = useRef();
  const galleryInputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setStep('analyzing');
    try {
      // Carregamento dinâmico do Tesseract pra não bloar o bundle inicial
      const Tesseract = (await import('tesseract.js')).default;
      const result = await Tesseract.recognize(file, 'eng', {
        // logger: m => console.log(m),
      });
      const text = result.data.text;
      // Extrai candidatos: PREFIX + número
      const matches = text.toUpperCase().match(/\b([A-Z]{2,4})\s*(\d{1,3})\b/g) || [];
      const candidates = [];
      const seen = new Set();
      for (const m of matches) {
        const code = normalizeCode(m);
        if (code && stickers[code] && !seen.has(code)) {
          seen.add(code);
          candidates.push(code);
        }
      }
      setDetected(candidates);
      setEditingCode(candidates[0] || '');
      setStep('result');
      if (candidates.length === 0) {
        toast.info('Não consegui ler nenhum código. Tenta digitar.');
      } else {
        toast.success(`${candidates.length} código${candidates.length > 1 ? 's' : ''} detectado${candidates.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar foto');
      setStep('select');
    }
  };

  const apply = (code) => {
    const c = normalizeCode(code);
    if (!c || !stickers[c]) {
      toast.error('Código inválido');
      return;
    }
    if (defaultStatus === STATUS.DUPLICATE) {
      incrementDuplicate(c, +1);
    } else {
      setStatus(c, defaultStatus);
    }
    toast.success(`${c} marcada!`);
    // Remove esse da lista detectada
    setDetected(prev => prev.filter(x => x !== c));
    setEditingCode(detected.filter(x => x !== c)[0] || '');
  };

  if (step === 'analyzing') {
    return (
      <div className="bg-white rounded-xl p-8 border border-zinc-200 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-verde-500 mx-auto mb-3" />
        <p className="font-bold">Lendo o código...</p>
        <p className="text-sm text-zinc-500 mt-1">Pode levar uns segundos na primeira vez</p>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="space-y-3">
        <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-3 text-sm">
          📸 Confira o código detectado. Você pode <strong>editar</strong> se a leitura errou.
        </div>

        {detected.length === 0 ? (
          <div className="bg-white rounded-xl p-4 border border-zinc-200 text-center">
            <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
            <p className="font-bold text-zinc-700">Nenhum código válido encontrado</p>
            <p className="text-sm text-zinc-500 mt-1">Tenta outro modo, ou tire outra foto mais clara</p>
          </div>
        ) : (
          <div className="space-y-2">
            {detected.map((code, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border-2 border-verde-300 flex items-center gap-2">
                <input
                  type="text"
                  value={editingCode === code ? editingCode : code}
                  onChange={e => setEditingCode(e.target.value)}
                  onFocus={() => setEditingCode(code)}
                  className="input flex-1 font-mono font-bold"
                  style={{ textTransform: 'uppercase' }}
                />
                <button
                  onClick={() => apply(editingCode || code)}
                  className="btn btn-primary px-4"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => { setStep('select'); setDetected([]); }} className="btn btn-secondary w-full">
          Tirar outra foto
        </button>
      </div>
    );
  }

  // step === 'select'
  return (
    <div className="space-y-3">
      <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-sm">
        ⚠️ <strong>Atenção:</strong> a leitura por foto NEM SEMPRE funciona perfeitamente. Você precisa de boa iluminação e foco no código. Se errar muito, prefira o modo <strong>"Digitar"</strong> que é bem mais rápido!
      </div>

      <div className="bg-white rounded-xl p-4 border-2 border-azul-300 space-y-2">
        <p className="text-sm text-zinc-700 mb-2">
          📷 Aponte a câmera para o <strong>código no verso da figurinha</strong> (ex: "COD 11", "MEX 4").
        </p>

        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-full bg-azul-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition shadow-md"
        >
          <Camera className="w-5 h-5" /> Tirar foto agora
        </button>
        <button
          onClick={() => galleryInputRef.current?.click()}
          className="w-full bg-white border-2 border-zinc-300 text-zinc-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Upload className="w-5 h-5" /> Da galeria
        </button>

        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => handleFile(e.target.files?.[0])} className="hidden" />
        <input ref={galleryInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} className="hidden" />
      </div>

      <div className="bg-zinc-100 rounded-xl p-3 text-xs text-zinc-600">
        💡 <strong>Dicas para foto sair certa:</strong><br />
        • Boa iluminação (sem sombra)<br />
        • Câmera bem perto, focada no código<br />
        • Sem inclinar muito a figurinha<br />
        • Use o modo "Digitar" se a foto não funcionar
      </div>
    </div>
  );
}
