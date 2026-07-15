import { create } from 'zustand';
import { storage } from '../utils/storage';
import { buildStickersFromSections, totalFromSections } from '../utils/albumPresets';

export const STATUS = {
  MISSING: 'missing',
  HAVE: 'have',
  DUPLICATE: 'duplicate',
  GLUED: 'glued',
};

export const STATUS_LABEL = {
  missing: 'Falta',
  have: 'Já tenho',
  duplicate: 'Repetida',
  glued: 'Colada',
};

const defaultState = {
  album: null,
  stickers: {},
  pages: {},
  friends: {},
  gameResults: {}, // { [gameId]: { homeScore, awayScore, favorite, notes, prediction: {home, away} } }
  favoriteTeams: [], // ['BRA', 'ARG', ...]
  settings: { onboarded: false },
};

function loadInitial() {
  const saved = storage.load();
  if (!saved) return defaultState;
  return { ...defaultState, ...saved };
}

function persist(state) {
  const { album, stickers, pages, friends, gameResults, favoriteTeams, settings } = state;
  storage.save({ album, stickers, pages, friends, gameResults, favoriteTeams, settings });
}

export const useStore = create((set, get) => ({
  ...loadInitial(),

  // Setup do álbum com seções pré-definidas
  setupAlbum: (name, sections) => {
    const stickers = buildStickersFromSections(sections);
    const album = {
      name,
      sections,
      total: totalFromSections(sections),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newState = {
      album,
      stickers,
      pages: {},
      friends: {},
      settings: { ...get().settings, onboarded: true },
    };
    set(newState);
    persist({ ...get(), ...newState });
  },

  updateAlbumName: (name) => {
    set((state) => {
      const album = { ...state.album, name, updatedAt: Date.now() };
      const next = { ...state, album };
      persist(next);
      return { album };
    });
  },

  // Atualiza uma figurinha (status, duplicates, name)
  updateSticker: (code, patch) => {
    set((state) => {
      const sticker = state.stickers[code];
      if (!sticker) return {};
      const updated = { ...sticker, ...patch };
      const stickers = { ...state.stickers, [code]: updated };
      persist({ ...state, stickers });
      return { stickers };
    });
  },

  setStatus: (code, status) => {
    set((state) => {
      const sticker = state.stickers[code];
      if (!sticker) return {};
      const updated = { ...sticker, status };
      // Se virou repetida e ainda não tem duplicates, começa em 1
      if (status === STATUS.DUPLICATE && (!sticker.duplicates || sticker.duplicates < 1)) {
        updated.duplicates = 1;
      }
      // Se saiu de duplicate, zera duplicates
      if (status !== STATUS.DUPLICATE && sticker.status === STATUS.DUPLICATE) {
        updated.duplicates = 0;
      }
      const stickers = { ...state.stickers, [code]: updated };
      persist({ ...state, stickers });
      return { stickers };
    });
  },

  bulkSetStatus: (codes, status) => {
    set((state) => {
      const stickers = { ...state.stickers };
      for (const code of codes) {
        const s = stickers[code];
        if (!s) continue;
        const updated = { ...s, status };
        if (status === STATUS.DUPLICATE && (!s.duplicates || s.duplicates < 1)) {
          updated.duplicates = 1;
        }
        if (status !== STATUS.DUPLICATE && s.status === STATUS.DUPLICATE) {
          updated.duplicates = 0;
        }
        stickers[code] = updated;
      }
      persist({ ...state, stickers });
      return { stickers };
    });
  },

  incrementDuplicate: (code, delta) => {
    set((state) => {
      const sticker = state.stickers[code];
      if (!sticker) return {};
      const newCount = Math.max(0, (sticker.duplicates || 0) + delta);
      const updated = {
        ...sticker,
        duplicates: newCount,
        status: newCount > 0 ? STATUS.DUPLICATE : (sticker.status === STATUS.DUPLICATE ? STATUS.HAVE : sticker.status),
      };
      const stickers = { ...state.stickers, [code]: updated };
      persist({ ...state, stickers });
      return { stickers };
    });
  },

  // Pages CRUD
  addPage: (page) => {
    set((state) => {
      const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const pages = { ...state.pages, [id]: { ...page, id } };
      persist({ ...state, pages });
      return { pages };
    });
  },

  updatePage: (id, patch) => {
    set((state) => {
      if (!state.pages[id]) return {};
      const pages = { ...state.pages, [id]: { ...state.pages[id], ...patch } };
      persist({ ...state, pages });
      return { pages };
    });
  },

  removePage: (id) => {
    set((state) => {
      const pages = { ...state.pages };
      delete pages[id];
      persist({ ...state, pages });
      return { pages };
    });
  },

  // Friends CRUD
  addFriend: (name) => {
    const id = `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    set((state) => {
      const friends = { ...state.friends, [id]: { id, name, missing: [], duplicates: {} } };
      persist({ ...state, friends });
      return { friends };
    });
    return id;
  },

  updateFriend: (id, patch) => {
    set((state) => {
      if (!state.friends[id]) return {};
      const friends = { ...state.friends, [id]: { ...state.friends[id], ...patch } };
      persist({ ...state, friends });
      return { friends };
    });
  },

  removeFriend: (id) => {
    set((state) => {
      const friends = { ...state.friends };
      delete friends[id];
      persist({ ...state, friends });
      return { friends };
    });
  },

  // Game results
  setGameResult: (gameId, patch) => {
    set((state) => {
      const current = state.gameResults[gameId] || {};
      const updated = { ...current, ...patch };
      const hasContent = updated.homeScore != null || updated.awayScore != null || updated.favorite || updated.notes || updated.prediction;
      const gameResults = { ...state.gameResults };
      if (hasContent) {
        gameResults[gameId] = updated;
      } else {
        delete gameResults[gameId];
      }
      persist({ ...state, gameResults });
      return { gameResults };
    });
  },

  toggleFavoriteGame: (gameId) => {
    set((state) => {
      const current = state.gameResults[gameId] || {};
      const updated = { ...current, favorite: !current.favorite };
      const gameResults = { ...state.gameResults };
      if (updated.favorite || updated.homeScore != null || updated.awayScore != null || updated.notes || updated.prediction) {
        gameResults[gameId] = updated;
      } else {
        delete gameResults[gameId];
      }
      persist({ ...state, gameResults });
      return { gameResults };
    });
  },

  setPrediction: (gameId, home, away) => {
    set((state) => {
      const current = state.gameResults[gameId] || {};
      const updated = { ...current };
      if (home == null && away == null) {
        delete updated.prediction;
      } else {
        updated.prediction = { home, away };
      }
      const gameResults = { ...state.gameResults };
      const hasContent = updated.favorite || updated.homeScore != null || updated.awayScore != null || updated.notes || updated.prediction;
      if (hasContent) {
        gameResults[gameId] = updated;
      } else {
        delete gameResults[gameId];
      }
      persist({ ...state, gameResults });
      return { gameResults };
    });
  },

  toggleFavoriteTeam: (prefix) => {
    set((state) => {
      const favoriteTeams = state.favoriteTeams || [];
      const idx = favoriteTeams.indexOf(prefix);
      const newFavs = idx === -1
        ? [...favoriteTeams, prefix]
        : favoriteTeams.filter(p => p !== prefix);
      persist({ ...state, favoriteTeams: newFavs });
      return { favoriteTeams: newFavs };
    });
  },

  // Backup
  replaceAll: (data) => {
    const newState = { ...defaultState, ...data };
    set(newState);
    persist(newState);
  },

  reset: () => {
    set(defaultState);
    storage.clear();
  },
}));

// Stats por seção + totais
export function getStats(stickers, sections) {
  const list = Object.values(stickers);
  const total = list.length;
  let missing = 0, have = 0, duplicate = 0, glued = 0;
  let dupCount = 0;
  for (const s of list) {
    if (s.status === 'missing') missing++;
    else if (s.status === 'have') have++;
    else if (s.status === 'duplicate') { duplicate++; dupCount += (s.duplicates || 0); }
    else if (s.status === 'glued') glued++;
  }
  const haveOrGlued = have + glued + duplicate;
  const percent = total === 0 ? 0 : Math.round((haveOrGlued / total) * 100);

  // Por seção
  const bySection = (sections || []).map(sec => {
    const secStickers = list.filter(s => s.prefix === sec.prefix);
    const secTotal = secStickers.length;
    let secMissing = 0, secHave = 0;
    for (const s of secStickers) {
      if (s.status === 'missing') secMissing++;
      else secHave++;
    }
    return {
      prefix: sec.prefix,
      name: sec.name,
      total: secTotal,
      have: secHave,
      missing: secMissing,
      percent: secTotal === 0 ? 0 : Math.round((secHave / secTotal) * 100),
    };
  });

  return { total, missing, have, duplicate, glued, dupCount, haveOrGlued, percent, bySection };
}
