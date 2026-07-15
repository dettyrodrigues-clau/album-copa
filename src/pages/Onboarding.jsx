import { useState } from 'react';
import { Sparkles, Trophy, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { COPA_2026_PRESET, totalFromSections } from '../utils/albumPresets';

export default function Onboarding() {
  const setupAlbum = useStore(s => s.setupAlbum);
  const [step, setStep] = useState(0); // 0 = escolha, 1 = customizado
  const [name, setName] = useState('Álbum da Copa 2026');
  const [total, setTotal] = useState(994);

  const usePreset = () => {
    setupAlbum(COPA_2026_PRESET.name, COPA_2026_PRESET.sections);
  };

  const useCustom = () => {
    const n = parseInt(total) || 0;
    if (n < 1) return;
    // Cria uma única seção "geral" com prefixo vazio (modo simples por número)
    const sections = [
      { prefix: 'N', name: name || 'Figurinhas', count: n }
    ];
    setupAlbum(name || 'Meu Álbum', sections);
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-500 via-verde-600 to-azul-600 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header decorativo */}
          <div className="bg-gradient-to-r from-verde-500 via-amarelo-500 to-azul-500 h-3"></div>
          <div className="bg-gradient-to-br from-verde-500 to-azul-600 text-white px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amarelo-500 rounded-full mb-3 shadow-lg">
              <Trophy className="w-10 h-10 text-zinc-900" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-display font-extrabold mb-1">Álbum da Copa</h1>
            <p className="text-sm opacity-90">Vamos começar sua coleção!</p>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={usePreset}
              className="w-full bg-gradient-to-br from-verde-500 to-verde-600 text-white rounded-2xl p-5 shadow-lg active:scale-[0.98] transition text-left"
            >
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-amarelo-300" />
                <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Recomendado</div>
              </div>
              <div className="text-xl font-display font-extrabold mb-1">Copa do Mundo 2026</div>
              <div className="text-sm opacity-90">
                Pré-configurado com todas as 48 seleções, FWC, CC e códigos certos (MEX 1, BRA 5, FWC 12...).
                Total: <strong>{totalFromSections(COPA_2026_PRESET.sections)} figurinhas</strong>
              </div>
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-zinc-200"></div>
              <span className="text-xs text-zinc-400 font-semibold">OU</span>
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl p-4 transition text-left border-2 border-zinc-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" />
                <div className="font-display font-extrabold">Personalizado</div>
              </div>
              <div className="text-xs text-zinc-600">
                Criar do zero (qualquer álbum, qualquer quantidade)
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1 - Custom
  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-500 via-verde-600 to-azul-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-verde-500 via-amarelo-500 to-azul-500 h-3"></div>
        <div className="bg-gradient-to-br from-verde-500 to-azul-600 text-white px-6 py-6">
          <h1 className="text-2xl font-display font-extrabold">Álbum personalizado</h1>
          <p className="text-sm opacity-90">Configure os dados básicos</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Nome do álbum</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
              placeholder="Ex: Álbum da Copa 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Total de figurinhas</label>
            <input
              type="number"
              value={total}
              onChange={e => setTotal(e.target.value)}
              className="input"
              min="1"
              max="9999"
            />
            <p className="text-xs text-zinc-500 mt-1">
              As figurinhas serão numeradas de 001 até {total || '?'}.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(0)} className="btn btn-secondary flex-1">
              Voltar
            </button>
            <button onClick={useCustom} className="btn btn-primary flex-1">
              Criar álbum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
