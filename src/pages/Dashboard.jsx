import { Link } from 'react-router-dom';
import { Camera, Search, BookOpen, ListChecks, Copy, Users, ChevronRight, Trophy, Settings as SettingsIcon, CalendarDays, Zap, Tv, Clock } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ProgressRing from '../components/ProgressRing';
import { useStore, getStats } from '../store/useStore';
import { TEAM_FLAGS, TEAM_NAMES, COPA_2026_GAMES, CHANNELS, isToday, GROUPS } from '../data/copa2026Games';
import TeamFlag from '../components/TeamFlag';

export default function Dashboard() {
  const album = useStore(s => s.album);
  const stickers = useStore(s => s.stickers);
  const stats = getStats(stickers, album?.sections);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-verde-500 via-verde-600 to-azul-600 text-white px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Brazilian flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-verde-500 via-amarelo-500 to-azul-500"></div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Meu álbum</p>
              <Link to="/configuracoes" className="p-1 -m-1 text-white/80 hover:text-white">
                <SettingsIcon className="w-4 h-4" />
              </Link>
            </div>
            <h1 className="text-2xl font-display font-extrabold leading-tight">{album?.name}</h1>
          </div>
          <ProgressRing percent={stats.percent} size={88} stroke={8} />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-6">
          <Stat label="Total" value={stats.total} />
          <Stat label="Tenho" value={stats.haveOrGlued} color="text-amarelo-300" />
          <Stat label="Faltam" value={stats.missing} color="text-rose-200" />
          <Stat label="Repet." value={stats.dupCount} color="text-amarelo-300" />
        </div>

        {/* Linear progress */}
        <div className="mt-5">
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amarelo-400 via-amarelo-300 to-white transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <div className="text-xs opacity-90 mt-1 text-right">{stats.percent}% completo</div>
        </div>
      </div>

      {/* Big shortcut to QuickAdd - DESTAQUE */}
      <div className="px-5 -mt-2 mb-3">
        <Link
          to="/adicionar"
          className="block bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 text-white rounded-2xl p-4 shadow-lg active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-7xl opacity-20">⚡</div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 fill-white" strokeWidth={2.5} />
              <div className="font-display font-extrabold text-lg">Adicionar Rápido</div>
            </div>
            <div className="text-sm font-semibold opacity-95">
              Abriu envelope? Digite, cole em lote ou tire foto do código!
            </div>
          </div>
        </Link>
      </div>

      {/* Big shortcut to games */}
      <div className="px-5 mb-3">
        <Link
          to="/jogos"
          className="block bg-gradient-to-br from-amarelo-400 via-amarelo-500 to-amber-500 text-zinc-900 rounded-2xl p-4 shadow-lg active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-6xl opacity-20">⚽</div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5" strokeWidth={2.5} />
              <div className="font-display font-extrabold text-lg">Jogos da Copa</div>
            </div>
            <div className="text-sm font-semibold opacity-80">
              Calendário, resultados e jogos do Brasil 🇧🇷
            </div>
          </div>
        </Link>
      </div>

      {/* Hoje na Copa */}
      <TodayInCopa />

      {/* Actions */}
      <div className="px-5">
        <div className="grid grid-cols-3 gap-3">
          <ActionCard to="/foto" icon={Camera} label="Ler foto" color="bg-amarelo-500 text-zinc-900" />
          <ActionCard to="/buscar" icon={Search} label="Buscar" color="bg-azul-500 text-white" />
          <ActionCard to="/faltantes" icon={ListChecks} label="Faltantes" color="bg-rose-500 text-white" />
          <ActionCard to="/repetidas" icon={Copy} label="Repetidas" color="bg-amarelo-400 text-zinc-900" />
          <ActionCard to="/paginas" icon={BookOpen} label="Páginas" color="bg-verde-500 text-white" />
          <ActionCard to="/trocas" icon={Users} label="Trocas" color="bg-azul-600 text-white" />
        </div>
      </div>

      {/* Sections progress (per team) */}
      {stats.bySection && stats.bySection.length > 1 && (
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-extrabold text-zinc-800 uppercase tracking-wide">Progresso por seção</h2>
            <Link to="/figurinhas" className="text-xs font-bold text-azul-600 flex items-center gap-1">
              Ver tudo <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden divide-y divide-zinc-100 max-h-96 overflow-y-auto">
            {stats.bySection.map(sec => (
              <div key={sec.prefix} className="px-4 py-3 flex items-center gap-3">
                <TeamFlag prefix={sec.prefix} size="md" className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-sm font-semibold text-zinc-800 truncate">{sec.name}</div>
                    <div className="text-xs font-bold text-zinc-600 ml-2">{sec.have}/{sec.total}</div>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${sec.percent === 100 ? 'bg-verde-500' : 'bg-azul-500'}`}
                      style={{ width: `${sec.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trophy message when complete */}
      {stats.percent === 100 && (
        <div className="mx-5 mt-6 bg-gradient-to-br from-amarelo-300 to-amarelo-500 rounded-2xl p-5 text-zinc-900 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-2" strokeWidth={2.5} />
          <div className="font-display font-extrabold text-lg">PARABÉNS!</div>
          <div className="text-sm">Você completou o álbum! 🎉</div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function Stat({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-2 text-center">
      <div className={`text-xl font-display font-extrabold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-90 font-semibold">{label}</div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, label, color }) {
  return (
    <Link
      to={to}
      className={`${color} rounded-2xl p-3 shadow-md active:scale-95 transition flex flex-col items-center justify-center aspect-square`}
    >
      <Icon className="w-7 h-7 mb-1" strokeWidth={2.5} />
      <span className="text-xs font-display font-bold">{label}</span>
    </Link>
  );
}

function TodayInCopa() {
  const todayGames = COPA_2026_GAMES.filter(g => isToday(g.date)).slice(0, 4);
  if (todayGames.length === 0) {
    // Próximo jogo do Brasil
    const today = new Date().toISOString().slice(0, 10);
    const nextBR = COPA_2026_GAMES
      .filter(g => (g.home === 'BRA' || g.away === 'BRA') && g.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!nextBR) return null;

    return (
      <div className="px-5 mb-3">
        <Link to="/jogos" className="block bg-gradient-to-br from-verde-500 to-verde-700 text-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇧🇷</span>
            <div className="text-xs uppercase tracking-wider font-bold opacity-90">Próximo jogo do Brasil</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TeamFlag prefix={nextBR.home} size="xl" />
              <span className="font-display font-extrabold">vs</span>
              <TeamFlag prefix={nextBR.away} size="xl" />
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold">{nextBR.date.split('-').reverse().slice(0, 2).join('/')}</div>
              <div className="text-sm opacity-90">{nextBR.time}</div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 mb-3">
      <Link to="/jogos" className="block bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4" />
          <div className="text-xs uppercase tracking-wider font-bold opacity-90">⚡ Hoje na Copa</div>
          <div className="ml-auto text-xs font-bold bg-white/20 rounded px-2 py-0.5">{todayGames.length} jogos</div>
        </div>
        <div className="space-y-1.5">
          {todayGames.map(g => (
            <div key={g.id} className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-2 py-1.5">
              <div className="text-xs font-bold w-12">{g.time}</div>
              <TeamFlag prefix={g.home} size="md" />
              <span className="font-bold truncate">{TEAM_NAMES[g.home]}</span>
              <span className="opacity-60">×</span>
              <span className="font-bold truncate">{TEAM_NAMES[g.away]}</span>
              <TeamFlag prefix={g.away} size="md" />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
