// Calendário oficial da Copa do Mundo 2026
// Todos os horários em horário de Brasília (UTC-3)
// Estrutura: { id, phase, round, date, time, group, home, away, city, stadium }
// id começa em 1 = jogo 1, etc.

export const GROUPS = {
  A: { letter: 'A', teams: ['MEX', 'RSA', 'KOR', 'CZE'], color: 'bg-emerald-500' },
  B: { letter: 'B', teams: ['CAN', 'BIH', 'QAT', 'SUI'], color: 'bg-rose-500' },
  C: { letter: 'C', teams: ['BRA', 'MAR', 'HAI', 'SCO'], color: 'bg-amber-500' },
  D: { letter: 'D', teams: ['USA', 'PAR', 'AUS', 'TUR'], color: 'bg-purple-500' },
  E: { letter: 'E', teams: ['GER', 'CUW', 'CIV', 'ECU'], color: 'bg-teal-500' },
  F: { letter: 'F', teams: ['NED', 'JPN', 'SWE', 'TUN'], color: 'bg-cyan-500' },
  G: { letter: 'G', teams: ['BEL', 'EGY', 'IRN', 'NZL'], color: 'bg-indigo-500' },
  H: { letter: 'H', teams: ['ESP', 'CPV', 'KSA', 'URU'], color: 'bg-sky-500' },
  I: { letter: 'I', teams: ['FRA', 'SEN', 'IRQ', 'NOR'], color: 'bg-blue-500' },
  J: { letter: 'J', teams: ['ARG', 'ALG', 'AUT', 'JOR'], color: 'bg-pink-500' },
  K: { letter: 'K', teams: ['POR', 'COD', 'UZB', 'COL'], color: 'bg-fuchsia-500' },
  L: { letter: 'L', teams: ['ENG', 'CRO', 'GHA', 'PAN'], color: 'bg-red-500' },
};

export const TEAM_NAMES = {
  '00': 'Início', 'FWC': 'FIFA',
  MEX: 'México', RSA: 'África do Sul', KOR: 'Coreia do Sul', CZE: 'R. Tcheca',
  CAN: 'Canadá', BIH: 'Bósnia', QAT: 'Catar', SUI: 'Suíça',
  BRA: 'Brasil', MAR: 'Marrocos', HAI: 'Haiti', SCO: 'Escócia',
  USA: 'EUA', PAR: 'Paraguai', AUS: 'Austrália', TUR: 'Turquia',
  GER: 'Alemanha', CUW: 'Curaçao', CIV: 'Costa do Marfim', ECU: 'Equador',
  NED: 'Holanda', JPN: 'Japão', SWE: 'Suécia', TUN: 'Tunísia',
  BEL: 'Bélgica', EGY: 'Egito', IRN: 'Irã', NZL: 'Nova Zelândia',
  ESP: 'Espanha', CPV: 'Cabo Verde', KSA: 'Arábia Saudita', URU: 'Uruguai',
  FRA: 'França', SEN: 'Senegal', IRQ: 'Iraque', NOR: 'Noruega',
  ARG: 'Argentina', ALG: 'Argélia', AUT: 'Áustria', JOR: 'Jordânia',
  POR: 'Portugal', COD: 'Congo RD', UZB: 'Uzbequistão', COL: 'Colômbia',
  ENG: 'Inglaterra', CRO: 'Croácia', GHA: 'Gana', PAN: 'Panamá',
};

// Flag emoji por país
export const TEAM_FLAGS = {
  MEX: '🇲🇽', RSA: '🇿🇦', KOR: '🇰🇷', CZE: '🇨🇿',
  CAN: '🇨🇦', BIH: '🇧🇦', QAT: '🇶🇦', SUI: '🇨🇭',
  BRA: '🇧🇷', MAR: '🇲🇦', HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  USA: '🇺🇸', PAR: '🇵🇾', AUS: '🇦🇺', TUR: '🇹🇷',
  GER: '🇩🇪', CUW: '🇨🇼', CIV: '🇨🇮', ECU: '🇪🇨',
  NED: '🇳🇱', JPN: '🇯🇵', SWE: '🇸🇪', TUN: '🇹🇳',
  BEL: '🇧🇪', EGY: '🇪🇬', IRN: '🇮🇷', NZL: '🇳🇿',
  ESP: '🇪🇸', CPV: '🇨🇻', KSA: '🇸🇦', URU: '🇺🇾',
  FRA: '🇫🇷', SEN: '🇸🇳', IRQ: '🇮🇶', NOR: '🇳🇴',
  ARG: '🇦🇷', ALG: '🇩🇿', AUT: '🇦🇹', JOR: '🇯🇴',
  POR: '🇵🇹', COD: '🇨🇩', UZB: '🇺🇿', COL: '🇨🇴',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', CRO: '🇭🇷', GHA: '🇬🇭', PAN: '🇵🇦',
};

// Jogos da fase de grupos (78 jogos = 12 grupos × 6 jogos por grupo, exceto que cada grupo tem 6 jogos: A-B, A-C, A-D, B-C, B-D, C-D)
// Cada grupo de 4 = 6 jogos. 12 grupos × 6 = 72 jogos. + 32 mata-mata = total 104.
// Vou usar id sequencial. Quando o jogo é do Brasil, BRA: true
const GAMES = [];

// 1ª RODADA — 11 a 15 de junho de 2026
const r1 = [
  // 11/jun (qui)
  ['2026-06-11', '16:00', 'A', 'MEX', 'RSA', 'Cidade do México', 'Estádio Azteca'],
  ['2026-06-11', '23:00', 'A', 'KOR', 'CZE', 'Guadalajara', 'Estádio Akron'],
  // 12/jun (sex)
  ['2026-06-12', '16:00', 'B', 'CAN', 'BIH', 'Toronto', 'BMO Field'],
  ['2026-06-12', '22:00', 'D', 'USA', 'PAR', 'Los Angeles', 'SoFi Stadium'],
  // 13/jun (sáb)
  ['2026-06-13', '01:00', 'D', 'AUS', 'TUR', 'Vancouver', 'BC Place'],
  ['2026-06-13', '16:00', 'B', 'QAT', 'SUI', 'San Francisco', 'Levi\'s Stadium'],
  ['2026-06-13', '19:00', 'C', 'BRA', 'MAR', 'Nova York/Nova Jersey', 'MetLife Stadium'],
  ['2026-06-13', '22:00', 'C', 'HAI', 'SCO', 'Boston', 'Gillette Stadium'],
  // 14/jun (dom)
  ['2026-06-14', '14:00', 'E', 'GER', 'CUW', 'Houston', 'NRG Stadium'],
  ['2026-06-14', '17:00', 'F', 'NED', 'JPN', 'Dallas', 'AT&T Stadium'],
  ['2026-06-14', '20:00', 'E', 'CIV', 'ECU', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-14', '23:00', 'F', 'SWE', 'TUN', 'Monterrey', 'Estádio BBVA'],
  // 15/jun (seg)
  ['2026-06-15', '13:00', 'G', 'BEL', 'EGY', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-15', '16:00', 'G', 'IRN', 'NZL', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-15', '19:00', 'H', 'ESP', 'CPV', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-15', '22:00', 'H', 'KSA', 'URU', 'Seattle', 'Lumen Field'],
  // 16/jun (ter)
  ['2026-06-16', '13:00', 'I', 'FRA', 'SEN', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-16', '16:00', 'I', 'IRQ', 'NOR', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-16', '19:00', 'J', 'ARG', 'ALG', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-16', '22:00', 'J', 'AUT', 'JOR', 'Seattle', 'Lumen Field'],
  // 17/jun (qua)
  ['2026-06-17', '16:00', 'K', 'POR', 'COD', 'Houston', 'NRG Stadium'],
  ['2026-06-17', '19:00', 'K', 'UZB', 'COL', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-17', '22:00', 'L', 'ENG', 'CRO', 'Nova York/Nova Jersey', 'MetLife Stadium'],
  ['2026-06-17', '23:00', 'L', 'GHA', 'PAN', 'Monterrey', 'Estádio BBVA'],
];

// 2ª RODADA — 17 a 22 de junho
const r2 = [
  // 17/jun (qua) - alguns jogos da 2a rodada começam
  ['2026-06-18', '13:00', 'A', 'MEX', 'KOR', 'Cidade do México', 'Estádio Azteca'],
  ['2026-06-18', '16:00', 'A', 'CZE', 'RSA', 'Guadalajara', 'Estádio Akron'],
  ['2026-06-18', '19:00', 'B', 'CAN', 'QAT', 'Toronto', 'BMO Field'],
  ['2026-06-18', '22:00', 'B', 'SUI', 'BIH', 'San Francisco', 'Levi\'s Stadium'],
  // 19/jun (sex) - BRASIL
  ['2026-06-19', '13:00', 'D', 'USA', 'AUS', 'Los Angeles', 'SoFi Stadium'],
  ['2026-06-19', '16:00', 'D', 'TUR', 'PAR', 'Vancouver', 'BC Place'],
  ['2026-06-19', '19:00', 'C', 'MAR', 'SCO', 'Boston', 'Gillette Stadium'],
  ['2026-06-19', '21:30', 'C', 'BRA', 'HAI', 'Filadélfia', 'Lincoln Financial Field'],
  // 20/jun (sáb)
  ['2026-06-20', '14:00', 'E', 'GER', 'CIV', 'Houston', 'NRG Stadium'],
  ['2026-06-20', '17:00', 'F', 'NED', 'SWE', 'Dallas', 'AT&T Stadium'],
  ['2026-06-20', '20:00', 'E', 'ECU', 'CUW', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-20', '23:00', 'F', 'TUN', 'JPN', 'Monterrey', 'Estádio BBVA'],
  // 21/jun (dom)
  ['2026-06-21', '13:00', 'G', 'BEL', 'IRN', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-21', '16:00', 'G', 'NZL', 'EGY', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-21', '19:00', 'H', 'ESP', 'KSA', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-21', '22:00', 'H', 'URU', 'CPV', 'Seattle', 'Lumen Field'],
  // 22/jun (seg)
  ['2026-06-22', '13:00', 'I', 'FRA', 'IRQ', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-22', '16:00', 'I', 'NOR', 'SEN', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-22', '19:00', 'J', 'ARG', 'AUT', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-22', '22:00', 'J', 'JOR', 'ALG', 'Seattle', 'Lumen Field'],
  // 23/jun (ter)
  ['2026-06-23', '16:00', 'K', 'POR', 'UZB', 'Houston', 'NRG Stadium'],
  ['2026-06-23', '19:00', 'K', 'COL', 'COD', 'Nova York/Nova Jersey', 'MetLife Stadium'],
  ['2026-06-23', '22:00', 'L', 'ENG', 'GHA', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-23', '23:00', 'L', 'PAN', 'CRO', 'Monterrey', 'Estádio BBVA'],
];

// 3ª RODADA — 24 a 27 de junho (jogos simultâneos no mesmo grupo)
const r3 = [
  // 24/jun (qua) - BRASIL fecha grupo
  ['2026-06-24', '19:00', 'C', 'SCO', 'BRA', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-24', '19:00', 'C', 'HAI', 'MAR', 'Houston', 'NRG Stadium'],
  ['2026-06-24', '16:00', 'A', 'CZE', 'MEX', 'Cidade do México', 'Estádio Azteca'],
  ['2026-06-24', '16:00', 'A', 'RSA', 'KOR', 'Guadalajara', 'Estádio Akron'],
  ['2026-06-24', '22:00', 'B', 'SUI', 'CAN', 'Toronto', 'BMO Field'],
  ['2026-06-24', '22:00', 'B', 'BIH', 'QAT', 'San Francisco', 'Levi\'s Stadium'],
  // 25/jun (qui)
  ['2026-06-25', '16:00', 'D', 'TUR', 'USA', 'Los Angeles', 'SoFi Stadium'],
  ['2026-06-25', '16:00', 'D', 'PAR', 'AUS', 'Vancouver', 'BC Place'],
  ['2026-06-25', '20:00', 'E', 'ECU', 'GER', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-25', '20:00', 'E', 'CUW', 'CIV', 'Houston', 'NRG Stadium'],
  ['2026-06-25', '23:00', 'F', 'TUN', 'NED', 'Monterrey', 'Estádio BBVA'],
  ['2026-06-25', '23:00', 'F', 'JPN', 'SWE', 'Dallas', 'AT&T Stadium'],
  // 26/jun (sex)
  ['2026-06-26', '16:00', 'G', 'NZL', 'BEL', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-26', '16:00', 'G', 'EGY', 'IRN', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-26', '20:00', 'H', 'URU', 'ESP', 'Seattle', 'Lumen Field'],
  ['2026-06-26', '20:00', 'H', 'CPV', 'KSA', 'Miami', 'Hard Rock Stadium'],
  // 27/jun (sáb)
  ['2026-06-27', '16:00', 'I', 'NOR', 'FRA', 'Kansas City', 'Arrowhead Stadium'],
  ['2026-06-27', '16:00', 'I', 'SEN', 'IRQ', 'Atlanta', 'Mercedes-Benz Stadium'],
  ['2026-06-27', '20:00', 'J', 'JOR', 'ARG', 'Seattle', 'Lumen Field'],
  ['2026-06-27', '20:00', 'J', 'ALG', 'AUT', 'Miami', 'Hard Rock Stadium'],
  ['2026-06-27', '16:00', 'K', 'COL', 'POR', 'Nova York/Nova Jersey', 'MetLife Stadium'],
  ['2026-06-27', '16:00', 'K', 'COD', 'UZB', 'Houston', 'NRG Stadium'],
  ['2026-06-27', '20:00', 'L', 'PAN', 'ENG', 'Filadélfia', 'Lincoln Financial Field'],
  ['2026-06-27', '20:00', 'L', 'CRO', 'GHA', 'Monterrey', 'Estádio BBVA'],
];

// Lista de canais/plataformas de transmissão no Brasil
// Códigos: GLO=Globo, SPV=Sportv, GPL=Globoplay, GET=ge tv, CAZ=CazéTV (YouTube), SBT=SBT, NSP=N Sports
const BROADCASTS = {
  // Jogos do Brasil têm transmissão completa: TODOS os canais
  BR: ['GLO', 'SPV', 'GPL', 'GET', 'CAZ', 'SBT', 'NSP'],
  // Abertura
  open: ['SBT', 'GLO', 'GET', 'GPL', 'NSP', 'SPV', 'CAZ'],
  // CazéTV transmite tudo
  caze: ['CAZ'],
  // Jogos premium (com Globo)
  premium: ['GLO', 'SPV', 'GPL', 'CAZ'],
  // Globoplay + outros
  globoplay: ['GPL', 'SPV', 'CAZ'],
};

// Mapa de informações das emissoras (nome completo, cor, ícone)
export const CHANNELS = {
  GLO: { name: 'Globo', short: 'Globo', color: 'bg-red-600', type: 'TV aberta', free: true },
  SPV: { name: 'sportv', short: 'sportv', color: 'bg-zinc-700', type: 'TV paga', free: false },
  GPL: { name: 'Globoplay', short: 'Globoplay', color: 'bg-red-500', type: 'Streaming', free: false },
  GET: { name: 'ge tv', short: 'ge tv', color: 'bg-amber-500', type: 'Streaming', free: true },
  CAZ: { name: 'CazéTV', short: 'CazéTV', color: 'bg-yellow-400', type: 'YouTube', free: true },
  SBT: { name: 'SBT', short: 'SBT', color: 'bg-sky-500', type: 'TV aberta', free: true },
  NSP: { name: 'N Sports', short: 'N Sports', color: 'bg-orange-500', type: 'YouTube', free: true },
};

// Função helper: retorna lista de canais pra um jogo
function getBroadcasts(home, away, isOpening = false, isFinal = false, isBRGame = false) {
  if (isBRGame || home === 'BRA' || away === 'BRA') return BROADCASTS.BR;
  if (isOpening) return BROADCASTS.open;
  if (isFinal) return BROADCASTS.BR;
  // Jogos com seleções "premium" (potências) - Globo costuma exibir
  const premiumTeams = ['ARG', 'FRA', 'ENG', 'ESP', 'GER', 'POR', 'ITA', 'NED', 'JPN', 'USA', 'MEX', 'URU', 'COL'];
  if (premiumTeams.includes(home) || premiumTeams.includes(away)) {
    return BROADCASTS.premium;
  }
  // Jogos comuns: só CazéTV
  return BROADCASTS.caze;
}

let id = 1;
for (const [date, time, group, home, away, city, stadium] of r1) {
  const isOpening = id === 1; // primeiro jogo = abertura
  GAMES.push({
    id: id++, phase: 'groups', round: 1, date, time, group, home, away, city, stadium,
    broadcasts: getBroadcasts(home, away, isOpening),
  });
}
for (const [date, time, group, home, away, city, stadium] of r2) {
  GAMES.push({
    id: id++, phase: 'groups', round: 2, date, time, group, home, away, city, stadium,
    broadcasts: getBroadcasts(home, away),
  });
}
for (const [date, time, group, home, away, city, stadium] of r3) {
  GAMES.push({
    id: id++, phase: 'groups', round: 3, date, time, group, home, away, city, stadium,
    broadcasts: getBroadcasts(home, away),
  });
}

// MATA-MATA (placeholders - times definidos quando a fase de grupos acabar)
const knockoutRounds = [
  // Rodada de 32 (28 jun - 3 jul) - 16 jogos
  { phase: 'r32', label: 'Rodada de 32', count: 16, startDate: '2026-06-28', endDate: '2026-07-03' },
  // Oitavas (4-7 jul) - 8 jogos
  { phase: 'r16', label: 'Oitavas de final', count: 8, startDate: '2026-07-04', endDate: '2026-07-07' },
  // Quartas (9-11 jul) - 4 jogos
  { phase: 'qf', label: 'Quartas de final', count: 4, startDate: '2026-07-09', endDate: '2026-07-11' },
  // Semis (14-15 jul) - 2 jogos
  { phase: 'sf', label: 'Semifinais', count: 2, startDate: '2026-07-14', endDate: '2026-07-15' },
  // 3o lugar (18 jul)
  { phase: '3rd', label: 'Disputa 3º lugar', count: 1, startDate: '2026-07-18', endDate: '2026-07-18' },
  // Final (19 jul)
  { phase: 'final', label: 'FINAL', count: 1, startDate: '2026-07-19', endDate: '2026-07-19' },
];

for (const ko of knockoutRounds) {
  for (let i = 1; i <= ko.count; i++) {
    GAMES.push({
      id: id++,
      phase: ko.phase,
      round: 0,
      label: ko.label,
      date: ko.startDate,
      time: '',
      group: null,
      home: 'TBD',
      away: 'TBD',
      city: ko.phase === 'final' ? 'Nova Jersey' : ko.phase === '3rd' ? 'Miami' : 'A definir',
      stadium: ko.phase === 'final' ? 'MetLife Stadium' : ko.phase === '3rd' ? 'Hard Rock Stadium' : '',
      gameNumber: i,
      broadcasts: ko.phase === 'final' || ko.phase === 'sf' || ko.phase === '3rd' ? BROADCASTS.BR : BROADCASTS.premium,
    });
  }
}

export const COPA_2026_GAMES = GAMES;

// Helpers
export function formatGameDate(dateStr) {
  // dateStr: "2026-06-13"
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return {
    weekday: weekdays[date.getDay()],
    day: d,
    month: months[m - 1],
    full: `${weekdays[date.getDay()]}, ${d} ${months[m - 1]}`,
    iso: dateStr,
  };
}

export function isToday(dateStr) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  return dateStr === todayStr;
}

export function isPast(dateStr, timeStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = (timeStr || '00:00').split(':').map(Number);
  const gameDate = new Date(y, m - 1, d, h, min);
  return gameDate < new Date();
}

export function isBrazilGame(game) {
  return game.home === 'BRA' || game.away === 'BRA';
}

// Caminho do Brasil no mata-mata (cenário se passar em 1º do grupo C)
export const BRAZIL_PATH = [
  {
    phase: 'r32',
    label: '32-avos',
    opponents: 'Vice-líderes do Grupo F',
    teams: ['NED', 'JPN', 'SWE', 'TUN'],
    description: 'Holanda, Japão, Suécia ou Tunísia',
  },
  {
    phase: 'r16',
    label: 'Oitavas',
    opponents: 'Vice-líderes dos Grupos E ou I',
    teams: ['GER', 'CUW', 'CIV', 'ECU', 'FRA', 'SEN', 'IRQ', 'NOR'],
    description: 'Alemanha, França ou outras potências',
  },
  {
    phase: 'qf',
    label: 'Quartas',
    opponents: 'Líderes do Grupo A ou L',
    teams: ['MEX', 'ENG', 'CRO'],
    description: 'México (com torcida), Inglaterra ou Croácia',
  },
  {
    phase: 'sf',
    label: 'Semifinal',
    opponents: 'Outras potências',
    teams: ['ARG', 'POR', 'ESP'],
    description: 'Possivelmente Argentina, Portugal ou Espanha',
  },
  {
    phase: 'final',
    label: 'FINAL 🏆',
    opponents: 'Quem chegar lá',
    teams: [],
    description: '19/jul · MetLife Stadium · Nova Jersey',
  },
];

// Stats da Copa: total de jogos, jogos jogados, etc.
export function getCopaStats(gameResults) {
  const totalGames = COPA_2026_GAMES.length;
  const groupGames = COPA_2026_GAMES.filter(g => g.phase === 'groups').length;
  const finishedGroupGames = COPA_2026_GAMES
    .filter(g => g.phase === 'groups')
    .filter(g => {
      const r = gameResults[g.id];
      return r && r.homeScore != null && r.awayScore != null;
    }).length;

  const userPredictions = Object.values(gameResults).filter(r => r.prediction).length;
  const correctPredictions = Object.values(gameResults).filter(r => {
    if (!r.prediction || r.homeScore == null || r.awayScore == null) return false;
    return r.prediction.home === r.homeScore && r.prediction.away === r.awayScore;
  }).length;
  const partialPredictions = Object.values(gameResults).filter(r => {
    if (!r.prediction || r.homeScore == null || r.awayScore == null) return false;
    // Acertou vencedor mas não placar exato
    const pred = r.prediction.home - r.prediction.away;
    const real = r.homeScore - r.awayScore;
    const sameWinner = (pred > 0 && real > 0) || (pred < 0 && real < 0) || (pred === 0 && real === 0);
    const exactScore = r.prediction.home === r.homeScore && r.prediction.away === r.awayScore;
    return sameWinner && !exactScore;
  }).length;

  const favorites = Object.values(gameResults).filter(r => r.favorite).length;
  const withNotes = Object.values(gameResults).filter(r => r.notes).length;

  return {
    totalGames,
    groupGames,
    finishedGroupGames,
    userPredictions,
    correctPredictions,
    partialPredictions,
    favorites,
    withNotes,
  };
}
