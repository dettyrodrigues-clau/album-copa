import { useState } from 'react';
import { Plus, Trash2, Edit2, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';
import { useToast } from '../components/Toast';

export default function Pages() {
  const album = useStore(s => s.album);
  const pages = useStore(s => s.pages);
  const stickers = useStore(s => s.stickers);
  const addPage = useStore(s => s.addPage);
  const updatePage = useStore(s => s.updatePage);
  const removePage = useStore(s => s.removePage);
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const sections = album?.sections || [];
  const pagesList = Object.values(pages).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Páginas" subtitle={`${pagesList.length} páginas cadastradas`} />

      <div className="px-4 pt-3">
        <div className="bg-azul-50 border-2 border-azul-200 rounded-xl p-3 mb-4 text-sm text-zinc-800">
          💡 <strong>Para que serve?</strong> Cadastre cada página do álbum para usar a leitura por foto. Selecione a seção (ex: México) e o intervalo de figurinhas (ex: MEX 1 a MEX 12).
        </div>

        {!showForm && (
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="w-full bg-verde-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition shadow-md mb-4"
          >
            <Plus className="w-5 h-5" />
            Nova página
          </button>
        )}

        {showForm && (
          <PageForm
            sections={sections}
            stickers={stickers}
            initial={editing}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSave={(data) => {
              if (editing) {
                updatePage(editing.id, data);
                toast.success('Página atualizada');
              } else {
                addPage(data);
                toast.success('Página criada');
              }
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        {/* Lista */}
        <div className="space-y-2 mt-4">
          {pagesList.length === 0 && !showForm && (
            <div className="text-center py-10 text-zinc-500">
              <BookOpen className="w-14 h-14 mx-auto mb-2 opacity-40" />
              <p className="font-semibold">Nenhuma página cadastrada</p>
              <p className="text-sm">Clique em "Nova página" pra começar</p>
            </div>
          )}
          {pagesList.map(p => (
            <div key={p.id} className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-verde-500 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold truncate">{p.name}</div>
                <div className="text-xs text-zinc-600">
                  {p.prefix && (
                    <span className="font-mono font-bold mr-1">{p.prefix}</span>
                  )}
                  {p.from} a {p.to} • Grade {p.gridRows}×{p.gridCols}
                </div>
              </div>
              <button
                onClick={() => { setEditing(p); setShowForm(true); }}
                className="p-2 text-azul-600 hover:bg-azul-50 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir página "${p.name}"?`)) {
                    removePage(p.id);
                    toast.success('Página excluída');
                  }
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function PageForm({ sections, stickers, initial, onCancel, onSave }) {
  // Por padrão, escolhe a primeira seção
  const isCustom = sections.length === 1 && sections[0].prefix === 'N';
  const [prefix, setPrefix] = useState(initial?.prefix || (isCustom ? 'N' : sections[0]?.prefix || ''));
  const [name, setName] = useState(initial?.name || '');
  const [from, setFrom] = useState(initial?.from ?? 1);
  const [to, setTo] = useState(initial?.to ?? 4);
  const [gridRows, setGridRows] = useState(initial?.gridRows ?? 2);
  const [gridCols, setGridCols] = useState(initial?.gridCols ?? 2);

  const fromN = parseInt(from) || 0;
  const toN = parseInt(to) || 0;
  const rows = parseInt(gridRows) || 1;
  const cols = parseInt(gridCols) || 1;
  const interval = Math.max(0, toN - fromN + 1);
  const grid = rows * cols;
  const mismatch = interval !== grid;

  const currentSection = sections.find(s => s.prefix === prefix);
  const sectionMax = currentSection?.count || 999;

  const save = () => {
    if (!name.trim()) return;
    if (fromN < 1 || toN < fromN) return;
    onSave({ name: name.trim(), prefix, from: fromN, to: toN, gridRows: rows, gridCols: cols });
  };

  return (
    <div className="bg-white border-2 border-verde-300 rounded-xl p-4 space-y-3">
      <div className="font-display font-extrabold text-lg">{initial ? 'Editar página' : 'Nova página'}</div>

      {!isCustom && (
        <div>
          <label className="block text-sm font-semibold mb-1">Seção</label>
          <select
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            className="input"
          >
            {sections.map(s => (
              <option key={s.prefix} value={s.prefix}>
                {s.prefix} • {s.name} ({s.count})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">Nome da página</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={`Ex: ${currentSection?.name || 'Página 1'}`}
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-semibold mb-1">Da figurinha</label>
          <input type="number" value={from} onChange={e => setFrom(e.target.value)} min="1" max={sectionMax} className="input" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Até a figurinha</label>
          <input type="number" value={to} onChange={e => setTo(e.target.value)} min="1" max={sectionMax} className="input" />
        </div>
      </div>
      {!isCustom && currentSection && (
        <div className="text-xs text-zinc-500">
          Esta seção tem figurinhas de 1 até {currentSection.count}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">Grade da página (linhas × colunas)</label>
        <div className="flex items-center gap-2">
          <input type="number" value={gridRows} onChange={e => setGridRows(e.target.value)} min="1" max="20" className="input" />
          <span>×</span>
          <input type="number" value={gridCols} onChange={e => setGridCols(e.target.value)} min="1" max="20" className="input" />
        </div>
      </div>

      <div className={`text-sm rounded-lg p-2 ${mismatch ? 'bg-rose-50 text-rose-700' : 'bg-verde-50 text-verde-700'}`}>
        {interval} figurinhas no intervalo • {grid} espaços na grade {mismatch && '• Atenção: número não bate.'}
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel} className="btn btn-secondary flex-1">Cancelar</button>
        <button onClick={save} className="btn btn-primary flex-1">Salvar</button>
      </div>
    </div>
  );
}
