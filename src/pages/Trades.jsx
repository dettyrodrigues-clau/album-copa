import { useState, useMemo } from 'react';
import { Plus, Trash2, ArrowLeft, MessageCircle, Users, ArrowRight, ArrowLeftRight } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';
import { shareWhatsApp } from '../utils/export';
import { useToast } from '../components/Toast';
import { makeCode } from '../utils/albumPresets';

// Parser de input flexível: aceita "MEX 1, MEX 2, BRA 7x3, FWC 5"
function parseCodes(input) {
  if (!input) return [];
  const out = [];
  // Separa por vírgula, ponto-e-vírgula, quebra de linha
  const tokens = input.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);
  for (const tok of tokens) {
    // Aceita: "MEX 1", "MEX1", "MEX-1", "MEX 1x3" (3 repetidas)
    const m = tok.toUpperCase().replace(/[-_]/g, ' ').match(/^([A-Z]+)\s*(\d+)(?:\s*[Xx]\s*(\d+))?$/);
    if (m) {
      const [, prefix, num, qty] = m;
      const code = makeCode(prefix, parseInt(num));
      out.push({ code, qty: qty ? parseInt(qty) : 1 });
    } else {
      // Tenta como "00" sem número
      if (tok.toUpperCase() === '00') out.push({ code: '00', qty: 1 });
    }
  }
  return out;
}

export default function Trades() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const friends = useStore(s => s.friends);
  const addFriend = useStore(s => s.addFriend);
  const removeFriend = useStore(s => s.removeFriend);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [newName, setNewName] = useState('');
  const toast = useToast();

  const friendsList = Object.values(friends);
  const selectedFriend = selectedFriendId ? friends[selectedFriendId] : null;

  const myMissing = useMemo(() =>
    new Set(Object.values(stickers).filter(s => s.status === 'missing').map(s => s.code)),
    [stickers]
  );
  const myDuplicates = useMemo(() => {
    const map = {};
    for (const s of Object.values(stickers)) {
      if (s.status === 'duplicate' && (s.duplicates || 0) > 0) {
        map[s.code] = s.duplicates;
      }
    }
    return map;
  }, [stickers]);

  if (selectedFriend) {
    return <FriendDetail
      friend={selectedFriend}
      stickers={stickers}
      albumName={album?.name}
      myMissing={myMissing}
      myDuplicates={myDuplicates}
      onBack={() => setSelectedFriendId(null)}
    />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Trocas" subtitle={`${friendsList.length} amigos cadastrados`} />

      <div className="px-4 pt-3 space-y-3">
        <div className="bg-azul-50 border-2 border-azul-200 rounded-xl p-3 text-sm">
          💡 <strong>Como funciona?</strong> Cadastre seus amigos e o que cada um precisa/tem repetido. O sistema calcula sozinho quais figurinhas vocês podem trocar.
        </div>

        {/* Adicionar amigo */}
        <div className="bg-white border-2 border-verde-300 rounded-xl p-3">
          <div className="font-display font-extrabold text-sm mb-2">Adicionar amigo</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nome do amigo"
              className="input flex-1"
              onKeyDown={e => {
                if (e.key === 'Enter' && newName.trim()) {
                  const id = addFriend(newName.trim());
                  setNewName('');
                  setSelectedFriendId(id);
                }
              }}
            />
            <button
              onClick={() => {
                if (!newName.trim()) return;
                const id = addFriend(newName.trim());
                setNewName('');
                setSelectedFriendId(id);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lista */}
        {friendsList.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-semibold">Nenhum amigo cadastrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friendsList.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFriendId(f.id)}
                className="w-full bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 active:bg-zinc-50"
              >
                <div className="bg-verde-500 text-white rounded-full w-11 h-11 flex items-center justify-center font-bold text-lg">
                  {f.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-display font-extrabold">{f.name}</div>
                  <div className="text-xs text-zinc-500">
                    Falta: {f.missing.length} • Tem: {Object.keys(f.duplicates).length}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function FriendDetail({ friend, stickers, albumName, myMissing, myDuplicates, onBack }) {
  const updateFriend = useStore(s => s.updateFriend);
  const removeFriend = useStore(s => s.removeFriend);
  const toast = useToast();
  const [missingInput, setMissingInput] = useState(friend.missing.join(', '));
  const [duplicatesInput, setDuplicatesInput] = useState(
    Object.entries(friend.duplicates).map(([code, n]) => n > 1 ? `${code}x${n}` : code).join(', ')
  );

  // Tudo que eu posso DAR ao amigo: minhas repetidas que o amigo precisa
  const iCanGive = useMemo(() => {
    return friend.missing.filter(code => myDuplicates[code] !== undefined);
  }, [friend.missing, myDuplicates]);

  // Tudo que eu posso PEGAR do amigo: repetidas do amigo que eu preciso
  const iWantFromFriend = useMemo(() => {
    return Object.keys(friend.duplicates).filter(code => myMissing.has(code));
  }, [friend.duplicates, myMissing]);

  const saveMissing = () => {
    const parsed = parseCodes(missingInput);
    // Só pegamos códigos que existem no álbum
    const valid = parsed.filter(p => stickers[p.code]).map(p => p.code);
    const unique = Array.from(new Set(valid));
    updateFriend(friend.id, { missing: unique });
    toast.success(`${unique.length} faltantes salvos`);
  };

  const saveDuplicates = () => {
    const parsed = parseCodes(duplicatesInput);
    const map = {};
    for (const p of parsed) {
      if (stickers[p.code]) {
        map[p.code] = (map[p.code] || 0) + p.qty;
      }
    }
    updateFriend(friend.id, { duplicates: map });
    toast.success(`${Object.keys(map).length} repetidas salvas`);
  };

  const shareTradeMessage = () => {
    let msg = `🔄 Troca de figurinhas - ${albumName || 'Álbum da Copa'}\n\nOi ${friend.name}!\n\n`;
    if (iCanGive.length) {
      msg += `Eu tenho repetidas que você precisa (${iCanGive.length}):\n`;
      msg += iCanGive.join(', ') + '\n\n';
    }
    if (iWantFromFriend.length) {
      msg += `Eu precisaria das suas repetidas (${iWantFromFriend.length}):\n`;
      msg += iWantFromFriend.join(', ') + '\n\n';
    }
    if (!iCanGive.length && !iWantFromFriend.length) {
      msg += 'Não encontramos figurinhas pra trocar no momento.\n';
    }
    shareWhatsApp(msg);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title={friend.name} subtitle="Trocas e detalhes" />

      <div className="px-4 pt-3 space-y-4">
        <button onClick={onBack} className="text-sm text-azul-600 font-bold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar para amigos
        </button>

        {/* O que ele precisa */}
        <div className="bg-white border-2 border-rose-200 rounded-xl p-3">
          <div className="font-display font-extrabold text-sm mb-1">📋 O que {friend.name} precisa</div>
          <p className="text-xs text-zinc-500 mb-2">
            Cole aqui os códigos das faltantes do amigo. Ex: MEX 1, MEX 5, BRA 12, FWC 7
          </p>
          <textarea
            value={missingInput}
            onChange={e => setMissingInput(e.target.value)}
            placeholder="MEX 1, MEX 5, BRA 12..."
            rows={3}
            className="input"
            style={{ height: 'auto', minHeight: '70px' }}
          />
          <button onClick={saveMissing} className="btn btn-primary w-full mt-2">Salvar faltantes</button>
        </div>

        {/* O que ele tem repetido */}
        <div className="bg-white border-2 border-amarelo-200 rounded-xl p-3">
          <div className="font-display font-extrabold text-sm mb-1">🔁 O que {friend.name} tem repetido</div>
          <p className="text-xs text-zinc-500 mb-2">
            Use "x" para quantidade. Ex: MEX 4, BRA 7x3, FWC 12x2
          </p>
          <textarea
            value={duplicatesInput}
            onChange={e => setDuplicatesInput(e.target.value)}
            placeholder="MEX 4, BRA 7x3..."
            rows={3}
            className="input"
            style={{ height: 'auto', minHeight: '70px' }}
          />
          <button onClick={saveDuplicates} className="btn btn-primary w-full mt-2">Salvar repetidas</button>
        </div>

        {/* Resultado das trocas */}
        <div className="bg-gradient-to-br from-verde-500 to-azul-600 text-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeftRight className="w-5 h-5" />
            <div className="font-display font-extrabold text-lg">Possíveis trocas</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-bold opacity-90 mb-1">Você dá ({iCanGive.length}):</div>
              <div className="bg-white/15 rounded-lg p-2 min-h-[40px] text-sm font-mono">
                {iCanGive.length ? iCanGive.join(', ') : <span className="opacity-60">Nada por enquanto</span>}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold opacity-90 mb-1">Você recebe ({iWantFromFriend.length}):</div>
              <div className="bg-white/15 rounded-lg p-2 min-h-[40px] text-sm font-mono">
                {iWantFromFriend.length ? iWantFromFriend.join(', ') : <span className="opacity-60">Nada por enquanto</span>}
              </div>
            </div>
          </div>

          <button onClick={shareTradeMessage} className="w-full mt-3 bg-white text-verde-700 font-bold py-2.5 rounded-xl active:scale-95 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Enviar pelo WhatsApp
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm(`Remover ${friend.name}?`)) {
              removeFriend(friend.id);
              onBack();
            }
          }}
          className="w-full text-rose-600 font-bold py-2 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Remover amigo
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
