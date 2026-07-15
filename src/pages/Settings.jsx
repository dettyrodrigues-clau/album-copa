import { useState, useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle, Smartphone, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';
import { exportBackup, importBackup } from '../utils/storage';
import { useToast } from '../components/Toast';
import { COPA_2026_PRESET } from '../utils/albumPresets';

export default function Settings() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const pages = useStore(s => s.pages);
  const friends = useStore(s => s.friends);
  const settings = useStore(s => s.settings);
  const updateAlbumName = useStore(s => s.updateAlbumName);
  const replaceAll = useStore(s => s.replaceAll);
  const reset = useStore(s => s.reset);
  const setupAlbum = useStore(s => s.setupAlbum);
  const [name, setName] = useState(album?.name || '');
  const fileRef = useRef();
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(0);

  const doExport = () => {
    exportBackup({ album, stickers, pages, friends, settings });
    toast.success('Backup baixado');
  };

  const doImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importBackup(file);
      if (!data.album || !data.stickers) throw new Error('Arquivo inválido');
      if (!confirm('Isso vai substituir TODOS os dados atuais. Continuar?')) return;
      replaceAll(data);
      toast.success('Backup restaurado');
    } catch (err) {
      toast.error('Arquivo inválido');
    }
  };

  const doReset = () => {
    if (confirmReset === 0) {
      setConfirmReset(1);
      setTimeout(() => setConfirmReset(0), 5000);
      return;
    }
    if (confirmReset === 1) {
      reset();
      toast.success('Tudo foi apagado');
    }
  };

  const recreateCopa2026 = () => {
    if (!confirm('Isso vai recriar o álbum Copa 2026 do zero, apagando o que você tem agora. Continuar?')) return;
    setupAlbum(COPA_2026_PRESET.name, COPA_2026_PRESET.sections);
    toast.success('Álbum Copa 2026 recriado');
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Configurações" subtitle="Ajustes do álbum" />

      <div className="px-4 pt-3 space-y-4">
        {/* Nome do álbum */}
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <div className="font-display font-extrabold mb-2">Nome do álbum</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => name.trim() && updateAlbumName(name.trim())}
            className="input"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Total: {Object.keys(stickers).length} figurinhas • {album?.sections?.length || 0} seções
          </p>
        </div>

        {/* Backup */}
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <div className="font-display font-extrabold mb-2">Backup</div>
          <p className="text-xs text-zinc-500 mb-3">
            Exporte um arquivo com todos os seus dados, pra restaurar depois ou em outro celular.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={doExport} className="btn bg-azul-500 text-white">
              <Download className="w-4 h-4" /> Exportar
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn btn-secondary">
              <Upload className="w-4 h-4" /> Importar
            </button>
          </div>
          <input ref={fileRef} type="file" accept="application/json" onChange={doImport} className="hidden" />
        </div>

        {/* PWA */}
        <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-amarelo-700" />
            <div className="font-display font-extrabold text-zinc-800">Instalar no celular</div>
          </div>
          <div className="text-sm text-zinc-700 space-y-1">
            <p><strong>Android (Chrome):</strong> menu (⋮) → "Adicionar à tela inicial"</p>
            <p><strong>iPhone (Safari):</strong> compartilhar (□↑) → "Adicionar à Tela de Início"</p>
          </div>
        </div>

        {/* Reset / recreate */}
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <div className="font-display font-extrabold mb-2">Recriar com preset</div>
          <p className="text-xs text-zinc-500 mb-3">
            Se sua estrutura está errada (ex: você criou personalizado e quer mudar pra Copa 2026 oficial), você pode recriar.
          </p>
          <button onClick={recreateCopa2026} className="btn bg-verde-500 text-white w-full">
            <RefreshCw className="w-4 h-4" /> Recriar como Copa 2026
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <div className="font-display font-extrabold text-rose-700">Apagar tudo</div>
          </div>
          <p className="text-xs text-rose-700 mb-3">
            Remove TODOS os dados (álbum, figurinhas, páginas, amigos). Não tem volta!
          </p>
          <button
            onClick={doReset}
            className={`btn w-full ${confirmReset === 1 ? 'bg-rose-700 text-white animate-pulse' : 'bg-rose-500 text-white'}`}
          >
            <Trash2 className="w-4 h-4" /> {confirmReset === 1 ? 'Tem certeza? Toque de novo!' : 'Apagar tudo'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
