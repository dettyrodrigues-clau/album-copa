import { useState, useMemo } from 'react';
import { Star, Trophy, Calendar, MapPin, Clock, X, Edit, Tv, Target, TrendingUp, Award, Heart, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TeamFlag from '../components/TeamFlag';
import { useStore } from '../store/useStore';
import {
  COPA_2026_GAMES, TEAM_NAMES, TEAM_FLAGS, GROUPS, CHANNELS,
  formatGameDate, isToday, isPast, isBrazilGame, BRAZIL_PATH, getCopaStats
} from '../data/copa2026Games';

const filterTabs = [
  { value: 'today', label: '⚡ Hoje', priority: true },
  { value: 'next', label: 'Próximos' },
  { value: 'brazil', label: '🇧🇷 Brasil' },
  { value: 'favorites', label: '⭐ Favoritos' },
  { value: 'all', label: 'Todos' },
  { value: 'stats', label: '📊 Stats' },
  { value: 'path', label: '🏆 Brasil mata-mata' },
];

const phaseTabs = [
  { value: 'all', label: 'Todas as fases' },
  { value: 'groups', label: 'Fase de grupos' },
  { value: 'r32', label: '32-avos' },
  { value: 'r16', label: 'Oitavas' },
  { value: 'qf', label: 'Quartas' },
  { value: 'sf', label: 'Semifinais' },
  { value: '3rd', label: 'Disputa 3º' },
  { value: 'final', label: 'Final' },
];

export default function Games() {
  const gameResults = useStore(s => s.gameResults);
  const [filter, setFilter] = useState('today');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [editingGame, setEditingGame] = useState(null);

  // Conteúdos especiais
  if (filter === 'stats') {
    return (
      <div className="min-h-screen bg-zinc-50 pb-24">
        <Header title="Minhas estatísticas" subtitle="Sua Copa pessoal" />
        <FilterStrip filter={filter} setFilter={setFilter} />
        <StatsView />
        <BottomNav />
      </div>
    );
  }

  if (filter === 'path') {
    return (
      <div className="min-h-screen bg-zinc-50 pb-24">
        <Header title="Caminho do Brasil 🇧🇷" subtitle="Possíveis adversários no mata-mata" />
        <FilterStrip filter={filter} setFilter={setFilter} />
        <BrazilPathView />
        <BottomNav />
      </div>
    );
  }

  // Filtro normal de lista
  const filtered = useMemo(() => {
    let games = [...COPA_2026_GAMES];

    if (filter === 'brazil') {
      games = games.filter(isBrazilGame);
    } else if (filter === 'today') {
      games = games.filter(g => isToday(g.date));
    } else if (filter === 'favorites') {
      games = games.filter(g => gameResults[g.id]?.favorite);
    } else if (filter === 'next') {
      const today = new Date();
      const in7 = new Date(today.getTime() + 7 * 86400000);
      games = games.filter(g => {
        if (!g.date) return false;
        const [y, m, d] = g.date.split('-').map(Number);
        const gameDate = new Date(y, m - 1, d);
        return gameDate >= new Date(today.toDateString()) && gameDate <= in7;
      });
    }

    if (phaseFilter !== 'all') {
      games = games.filter(g => g.phase === phaseFilter);
    }
    if (groupFilter !== 'all') {
      games = games.filter(g => g.group === groupFilter);
    }

    games.sort((a, b) => {
      if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '');
      return (a.time || '').localeCompare(b.time || '');
    });

    return games;
  }, [filter, phaseFilter, groupFilter, gameResults]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const game of filtered) {
      const key = game.date || 'tbd';
      if (!groups[key]) groups[key] = [];
      groups[key].push(game);
    }
    return Object.entries(groups);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Header title="Jogos da Copa" subtitle="Calendário 2026" />
      <FilterStrip filter={filter} setFilter={setFilter} />

      {/* Sub-filtros */}
      <div className="px-4 py-2 bg-zinc-50">
        <div className="grid grid-cols-2 gap-2">
          <select
            value={phaseFilter}
            onChange={e => setPhaseFilter(e.target.value)}
            className="text-sm bg-white border-2 border-zinc-200 rounded-lg px-2 py-1.5 font-semibold"
          >
            {phaseTabs.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="text-sm bg-white border-2 border-zinc-200 rounded-lg px-2 py-1.5 font-semibold"
          >
            <option value="all">Todos os grupos</option>
            {Object.keys(GROUPS).map(letter => <option key={letter} value={letter}>Grupo {letter}</option>)}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 pt-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-semibold">Nenhum jogo encontrado</p>
            <p className="text-sm">Tente outro filtro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(([date, games]) => {
              const dateInfo = date === 'tbd' ? null : formatGameDate(date);
              const today = isToday(date);
              return (
                <div key={date}>
                  <div className={`text-sm font-display font-extrabold mb-2 px-1 flex items-center gap-2 ${today ? 'text-verde-600' : 'text-zinc-700'}`}>
                    {today && <span className="bg-verde-500 text-white text-xs rounded-full px-2 py-0.5">HOJE</span>}
                    {dateInfo ? `${dateInfo.weekday}, ${dateInfo.day} de ${dateInfo.month}` : 'Data a definir'}
                  </div>
                  <div className="space-y-2">
                    {games.map(game => (
                      <GameCard
                        key={game.id}
                        game={game}
                        result={gameResults[game.id]}
                        onEdit={() => setEditingGame(game)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingGame && (
        <GameEditSheet
          game={editingGame}
          result={gameResults[editingGame.id]}
          onClose={() => setEditingGame(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

function FilterStrip({ filter, setFilter }) {
  return (
    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-3 border-b border-zinc-100">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {filterTabs.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-bold text-sm border-2 transition whitespace-nowrap ${
              filter === f.value
                ? 'bg-verde-500 text-white border-verde-500'
                : f.priority
                  ? 'bg-amarelo-100 text-zinc-800 border-amarelo-400'
                  : 'bg-white text-zinc-700 border-zinc-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GameCard({ game, result, onEdit }) {
  const toggleFavorite = useStore(s => s.toggleFavoriteGame);
  const favoriteTeams = useStore(s => s.favoriteTeams) || [];
  const isBR = isBrazilGame(game);
  const past = isPast(game.date, game.time);
  const hasResult = result && (result.homeScore != null || result.awayScore != null);
  const hasPrediction = result && result.prediction;
  const isFav = result?.favorite;
  const knockout = game.phase !== 'groups';
  const today = isToday(game.date);
  const homeFav = favoriteTeams.includes(game.home);
  const awayFav = favoriteTeams.includes(game.away);
  const hasFavTeam = homeFav || awayFav;

  // Verificar palpite
  let predictionStatus = null;
  if (hasPrediction && hasResult) {
    const exactScore = result.prediction.home === result.homeScore && result.prediction.away === result.awayScore;
    const predDiff = result.prediction.home - result.prediction.away;
    const realDiff = result.homeScore - result.awayScore;
    const sameWinner = (predDiff > 0 && realDiff > 0) || (predDiff < 0 && realDiff < 0) || (predDiff === 0 && realDiff === 0);
    if (exactScore) predictionStatus = 'exact';
    else if (sameWinner) predictionStatus = 'partial';
    else predictionStatus = 'wrong';
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
        isBR ? 'border-verde-400 ring-2 ring-verde-100' :
        hasFavTeam ? 'border-amarelo-400 ring-1 ring-amarelo-100' :
        today ? 'border-rose-400' : 'border-zinc-200'
      }`}
    >
      <div className="flex items-stretch">
        <div className={`w-1.5 ${
          isBR ? 'bg-gradient-to-b from-verde-500 to-amarelo-500' :
          game.group ? GROUPS[game.group].color : 'bg-zinc-300'
        }`} />

        <div className="flex-1 p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Clock className="w-3 h-3" />
              <span className="font-bold">{game.time || '--:--'}</span>
              {game.group && (
                <span className="bg-zinc-100 text-zinc-700 rounded px-1.5 py-0.5 font-bold ml-1">
                  Grupo {game.group}
                </span>
              )}
              {knockout && (
                <span className="bg-amber-100 text-amber-800 rounded px-1.5 py-0.5 font-bold ml-1">
                  {game.label}
                </span>
              )}
            </div>
            <button onClick={() => toggleFavorite(game.id)} className="p-1 -m-1">
              <Star className={`w-5 h-5 transition ${isFav ? 'fill-amarelo-400 text-amarelo-500' : 'text-zinc-300'}`} />
            </button>
          </div>

          {/* Times + placar */}
          <button onClick={onEdit} className="w-full text-left">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <TeamFlag prefix={game.home} size="lg" />
                <div className="min-w-0">
                  <div className="font-display font-extrabold truncate text-sm flex items-center gap-1">
                    {TEAM_NAMES[game.home] || game.home}
                    {homeFav && <Heart className="w-3 h-3 fill-rose-400 text-rose-500 flex-shrink-0" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 font-display font-extrabold text-lg px-2">
                {hasResult ? (
                  <>
                    <span className={result.homeScore > result.awayScore ? 'text-verde-600' : 'text-zinc-500'}>{result.homeScore}</span>
                    <span className="text-zinc-400">×</span>
                    <span className={result.awayScore > result.homeScore ? 'text-verde-600' : 'text-zinc-500'}>{result.awayScore}</span>
                  </>
                ) : (
                  <span className="text-zinc-300 text-xs font-normal">vs</span>
                )}
              </div>

              <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <div className="font-display font-extrabold truncate text-sm flex items-center gap-1 justify-end">
                    {awayFav && <Heart className="w-3 h-3 fill-rose-400 text-rose-500 flex-shrink-0" />}
                    {TEAM_NAMES[game.away] || game.away}
                  </div>
                </div>
                <TeamFlag prefix={game.away} size="lg" />
              </div>
            </div>
          </button>

          {/* Palpite */}
          {hasPrediction && (
            <div className={`mt-2 text-xs rounded-lg p-2 flex items-center gap-2 font-semibold ${
              predictionStatus === 'exact' ? 'bg-verde-100 text-verde-800' :
              predictionStatus === 'partial' ? 'bg-amarelo-100 text-zinc-800' :
              predictionStatus === 'wrong' ? 'bg-rose-100 text-rose-700' :
              'bg-azul-50 text-azul-800'
            }`}>
              <Target className="w-3 h-3" />
              <span>
                Seu palpite: {result.prediction.home} × {result.prediction.away}
                {predictionStatus === 'exact' && ' 🎯 ACERTOU EM CHEIO!'}
                {predictionStatus === 'partial' && ' ✓ Acertou o vencedor'}
                {predictionStatus === 'wrong' && ' ✗ Errou'}
              </span>
            </div>
          )}

          {/* Onde assistir */}
          {game.broadcasts && game.broadcasts.length > 0 && !past && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <Tv className="w-3 h-3 text-zinc-500" />
              {game.broadcasts.slice(0, 4).map(ch => {
                const channel = CHANNELS[ch];
                if (!channel) return null;
                return (
                  <span key={ch} className={`text-[10px] font-bold text-white rounded px-1.5 py-0.5 ${channel.color}`}>
                    {channel.short}
                  </span>
                );
              })}
              {game.broadcasts.length > 4 && (
                <span className="text-[10px] text-zinc-500 font-bold">+{game.broadcasts.length - 4}</span>
              )}
            </div>
          )}

          {/* Local */}
          {game.city && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{game.city}{game.stadium && ` · ${game.stadium}`}</span>
            </div>
          )}

          {result?.notes && (
            <div className="mt-2 text-xs bg-amarelo-50 text-zinc-700 rounded p-2 italic">
              💭 {result.notes}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={onEdit}
              className="flex-1 text-xs font-bold py-1.5 px-2 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 flex items-center justify-center gap-1"
            >
              <Edit className="w-3 h-3" />
              {hasResult ? 'Editar' : hasPrediction ? 'Editar palpite' : (past ? 'Marcar placar' : 'Palpitar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameEditSheet({ game, result, onClose }) {
  const setGameResult = useStore(s => s.setGameResult);
  const setPrediction = useStore(s => s.setPrediction);
  const [tab, setTab] = useState(result?.homeScore != null || isPast(game.date, game.time) ? 'result' : 'prediction');
  const [homeScore, setHomeScore] = useState(result?.homeScore ?? '');
  const [awayScore, setAwayScore] = useState(result?.awayScore ?? '');
  const [predHome, setPredHome] = useState(result?.prediction?.home ?? '');
  const [predAway, setPredAway] = useState(result?.prediction?.away ?? '');
  const [notes, setNotes] = useState(result?.notes ?? '');

  const saveResult = () => {
    setGameResult(game.id, {
      homeScore: homeScore === '' ? null : parseInt(homeScore),
      awayScore: awayScore === '' ? null : parseInt(awayScore),
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const savePrediction = () => {
    setPrediction(
      game.id,
      predHome === '' ? null : parseInt(predHome),
      predAway === '' ? null : parseInt(predAway)
    );
    if (notes.trim() !== (result?.notes || '')) {
      setGameResult(game.id, { notes: notes.trim() || undefined });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-verde-500 to-azul-500 text-white px-5 py-4 sm:rounded-t-2xl rounded-t-3xl flex items-center justify-between z-10">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium opacity-90">
              {game.group ? `Grupo ${game.group}` : (game.label || game.phase)}
              {game.date && ` · ${formatGameDate(game.date).full}`}
            </div>
            <div className="text-base font-display font-extrabold truncate flex items-center gap-1.5">
              <TeamFlag prefix={game.home} size="sm" />
              <span>{TEAM_NAMES[game.home]}</span>
              <span className="opacity-60 mx-1">vs</span>
              <span>{TEAM_NAMES[game.away]}</span>
              <TeamFlag prefix={game.away} size="sm" />
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full ml-2 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Palpite / Resultado */}
        <div className="bg-white border-b border-zinc-100 px-3 pt-3 flex gap-1 sticky top-[68px] z-10">
          <button
            onClick={() => setTab('prediction')}
            className={`flex-1 py-2 px-3 rounded-t-lg font-bold text-sm transition flex items-center justify-center gap-1.5 ${
              tab === 'prediction' ? 'bg-azul-500 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            <Target className="w-4 h-4" /> Palpite
          </button>
          <button
            onClick={() => setTab('result')}
            className={`flex-1 py-2 px-3 rounded-t-lg font-bold text-sm transition flex items-center justify-center gap-1.5 ${
              tab === 'result' ? 'bg-verde-500 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            <Trophy className="w-4 h-4" /> Resultado
          </button>
        </div>

        {tab === 'prediction' && (
          <div className="p-5 space-y-4">
            <div className="bg-azul-50 border border-azul-200 rounded-xl p-3 text-sm">
              🎯 <strong>Chute o placar</strong> antes do jogo. Depois, quando o jogo acabar, marca o resultado real na aba "Resultado" e o sistema diz se você acertou!
            </div>
            <ScoreInput
              home={game.home} homeName={TEAM_NAMES[game.home]}
              away={game.away} awayName={TEAM_NAMES[game.away]}
              homeScore={predHome} setHomeScore={setPredHome}
              awayScore={predAway} setAwayScore={setPredAway}
            />
            <button onClick={savePrediction} className="btn btn-primary w-full py-3">
              <Target className="w-4 h-4" /> Salvar palpite
            </button>
          </div>
        )}

        {tab === 'result' && (
          <div className="p-5 space-y-4">
            <div className="bg-verde-50 border border-verde-200 rounded-xl p-3 text-sm">
              ⚽ <strong>Quanto acabou o jogo?</strong> Marca o placar final e suas anotações.
            </div>
            <ScoreInput
              home={game.home} homeName={TEAM_NAMES[game.home]}
              away={game.away} awayName={TEAM_NAMES[game.away]}
              homeScore={homeScore} setHomeScore={setHomeScore}
              awayScore={awayScore} setAwayScore={setAwayScore}
            />
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">📝 Diário do jogo</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Vi com a família, gol incrível do Vinícius..."
                rows={3}
                className="input"
                style={{ minHeight: '80px' }}
              />
            </div>
            <button onClick={saveResult} className="btn btn-primary w-full py-3">
              <Trophy className="w-4 h-4" /> Salvar resultado
            </button>
          </div>
        )}

        {/* Onde assistir + Local */}
        {game.broadcasts && (
          <div className="bg-zinc-50 px-5 py-3 border-t border-zinc-100">
            <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">📺 Onde assistir</div>
            <div className="flex flex-wrap gap-1.5">
              {game.broadcasts.map(ch => {
                const channel = CHANNELS[ch];
                if (!channel) return null;
                return (
                  <span key={ch} className={`text-xs font-bold text-white rounded px-2 py-1 ${channel.color}`}>
                    {channel.name} {channel.free && '🆓'}
                  </span>
                );
              })}
            </div>
            {game.city && (
              <div className="text-xs text-zinc-600 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {game.city} · {game.stadium}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreInput({ home, homeName, away, awayName, homeScore, setHomeScore, awayScore, setAwayScore }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 text-center">
        <div className="text-xs text-zinc-500 mb-1 truncate flex items-center justify-center gap-1"><TeamFlag prefix={home} size="xs" /><span>{homeName}</span></div>
        <input
          type="number"
          value={homeScore}
          onChange={e => setHomeScore(e.target.value)}
          min="0" max="99" placeholder="0"
          className="input text-center text-3xl font-display font-extrabold py-3"
        />
      </div>
      <div className="text-2xl text-zinc-400 font-bold">×</div>
      <div className="flex-1 text-center">
        <div className="text-xs text-zinc-500 mb-1 truncate flex items-center justify-center gap-1"><TeamFlag prefix={away} size="xs" /><span>{awayName}</span></div>
        <input
          type="number"
          value={awayScore}
          onChange={e => setAwayScore(e.target.value)}
          min="0" max="99" placeholder="0"
          className="input text-center text-3xl font-display font-extrabold py-3"
        />
      </div>
    </div>
  );
}

function StatsView() {
  const gameResults = useStore(s => s.gameResults);
  const favoriteTeams = useStore(s => s.favoriteTeams) || [];
  const toggleFavoriteTeam = useStore(s => s.toggleFavoriteTeam);
  const stats = getCopaStats(gameResults);

  // Top times pelos quais você palpitou
  const teamFavStats = {};
  for (const teamPrefix of Object.keys(TEAM_FLAGS)) {
    const gamesOfTeam = COPA_2026_GAMES.filter(g => g.home === teamPrefix || g.away === teamPrefix);
    const withResult = gamesOfTeam.filter(g => {
      const r = gameResults[g.id];
      return r && r.homeScore != null;
    });
    if (withResult.length > 0) {
      teamFavStats[teamPrefix] = withResult.length;
    }
  }

  const percentExact = stats.userPredictions > 0
    ? Math.round((stats.correctPredictions / stats.userPredictions) * 100)
    : 0;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Hero stats */}
      <div className="bg-gradient-to-br from-verde-500 via-verde-600 to-azul-600 text-white rounded-2xl p-5">
        <div className="text-xs uppercase tracking-wider opacity-80 font-bold mb-2">Seu desempenho</div>
        <div className="grid grid-cols-2 gap-3">
          <StatBox icon={Target} value={stats.correctPredictions} label="Palpites perfeitos" />
          <StatBox icon={TrendingUp} value={`${percentExact}%`} label="Taxa de acerto" />
          <StatBox icon={Trophy} value={stats.partialPredictions} label="Acertou vencedor" />
          <StatBox icon={Award} value={stats.userPredictions} label="Palpites totais" />
        </div>
      </div>

      {/* Stats da Copa */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200">
        <div className="text-sm font-display font-extrabold text-zinc-800 mb-3">📊 Sua participação</div>
        <div className="space-y-2 text-sm">
          <StatRow label="Jogos com resultado marcado" value={stats.finishedGroupGames + Object.keys(gameResults).filter(id => {
            const r = gameResults[id];
            const g = COPA_2026_GAMES.find(x => x.id == id);
            return g && g.phase !== 'groups' && r && r.homeScore != null;
          }).length} />
          <StatRow label="Jogos favoritados ⭐" value={stats.favorites} />
          <StatRow label="Jogos com anotações 📝" value={stats.withNotes} />
        </div>
      </div>

      {/* Seleções favoritas */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200">
        <div className="text-sm font-display font-extrabold text-zinc-800 mb-1">⭐ Minhas seleções favoritas</div>
        <div className="text-xs text-zinc-500 mb-3">Toque pra adicionar/remover (jogos delas ficam destacados)</div>
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(TEAM_FLAGS).slice(0, 24).map(prefix => {
            const isFav = favoriteTeams.includes(prefix);
            return (
              <button
                key={prefix}
                onClick={() => toggleFavoriteTeam(prefix)}
                className={`p-2 rounded-lg flex flex-col items-center gap-0.5 border-2 transition ${
                  isFav ? 'bg-rose-50 border-rose-400' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <TeamFlag prefix={prefix} size="md" />
                <span className="text-[10px] font-bold text-zinc-700">{prefix}</span>
                {isFav && <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-zinc-400 mt-2 text-center">Mostrando 24 seleções principais</div>
      </div>

      {/* Diário recente */}
      <DiaryRecent gameResults={gameResults} />
    </div>
  );
}

function DiaryRecent({ gameResults }) {
  const recent = useMemo(() => {
    return Object.entries(gameResults)
      .filter(([, r]) => r.notes)
      .map(([gameId, r]) => {
        const game = COPA_2026_GAMES.find(g => g.id == gameId);
        return { gameId, game, notes: r.notes, homeScore: r.homeScore, awayScore: r.awayScore };
      })
      .filter(x => x.game)
      .sort((a, b) => (a.game.date || '').localeCompare(b.game.date || ''))
      .reverse()
      .slice(0, 5);
  }, [gameResults]);

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 text-center text-sm text-zinc-500">
        <span className="text-3xl block mb-1">📝</span>
        Suas anotações aparecerão aqui<br />
        <span className="text-xs">Marque resultados e adicione comentários nos jogos</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200">
      <div className="text-sm font-display font-extrabold text-zinc-800 mb-3">📝 Diário da Copa</div>
      <div className="space-y-2">
        {recent.map(item => (
          <div key={item.gameId} className="bg-amarelo-50 rounded-lg p-3 text-sm">
            <div className="text-xs font-bold text-zinc-600 mb-1 flex items-center gap-1 flex-wrap">
              <TeamFlag prefix={item.game.home} size="xs" />
              <span>{TEAM_NAMES[item.game.home]}</span>
              <span className="font-display font-extrabold">{item.homeScore} × {item.awayScore}</span>
              <span>{TEAM_NAMES[item.game.away]}</span>
              <TeamFlag prefix={item.game.away} size="xs" />
            </div>
            <div className="italic text-zinc-700">"{item.notes}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-3">
      <Icon className="w-4 h-4 mb-1" />
      <div className="text-2xl font-display font-extrabold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-90 font-semibold">{label}</div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-700">{label}</span>
      <span className="font-bold text-zinc-900 bg-zinc-100 rounded px-2">{value}</span>
    </div>
  );
}

function BrazilPathView() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="bg-gradient-to-br from-verde-500 to-azul-600 text-white rounded-2xl p-5">
        <div className="text-4xl mb-2">🇧🇷</div>
        <div className="text-xl font-display font-extrabold">Caminho do hexa</div>
        <div className="text-sm opacity-90 mt-1">
          Se o Brasil passar em <strong>1º do Grupo C</strong>, esse é o caminho até a final
        </div>
      </div>

      <div className="space-y-2">
        {BRAZIL_PATH.map((phase, i) => (
          <div key={phase.phase} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-gradient-to-r from-verde-500 to-verde-600 text-white px-4 py-2">
              <div className="text-xs uppercase tracking-wider opacity-90 font-semibold">Fase {i + 1}</div>
              <div className="font-display font-extrabold text-lg">{phase.label}</div>
            </div>
            <div className="p-4">
              <div className="text-sm font-bold text-zinc-800 mb-2">vs {phase.opponents}</div>
              <div className="text-xs text-zinc-600 mb-3">{phase.description}</div>
              {phase.teams.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {phase.teams.map(t => (
                    <div key={t} className="bg-zinc-100 rounded-lg px-2 py-1 flex items-center gap-1">
                      <TeamFlag prefix={t} size="sm" />
                      <span className="text-xs font-bold">{TEAM_NAMES[t]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amarelo-50 border-2 border-amarelo-300 rounded-xl p-3 text-sm text-zinc-700">
        💡 <strong>Atenção:</strong> esse é o caminho mais provável se o Brasil passar em 1º do grupo. Os adversários dependem da classificação real dos outros grupos.
      </div>
    </div>
  );
}
