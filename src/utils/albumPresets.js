// Preset oficial do álbum Copa do Mundo 2026 (Panini)
// Baseado na estrutura real do álbum: 1 + 19 + 48*20 + 14 = 994 figurinhas
export const COPA_2026_PRESET = {
  name: 'Copa do Mundo 2026',
  sections: [
    { prefix: '00', name: 'Início', count: 1 },
    { prefix: 'FWC', name: 'FIFA World Cup', count: 19 },
    // Grupo A
    { prefix: 'MEX', name: 'México', count: 20 },
    { prefix: 'RSA', name: 'África do Sul', count: 20 },
    { prefix: 'KOR', name: 'Coreia do Sul', count: 20 },
    { prefix: 'CZE', name: 'República Tcheca', count: 20 },
    // Grupo B
    { prefix: 'CAN', name: 'Canadá', count: 20 },
    { prefix: 'BIH', name: 'Bósnia-Herzegovina', count: 20 },
    { prefix: 'QAT', name: 'Catar', count: 20 },
    { prefix: 'SUI', name: 'Suíça', count: 20 },
    // Grupo C
    { prefix: 'BRA', name: 'Brasil', count: 20 },
    { prefix: 'MAR', name: 'Marrocos', count: 20 },
    { prefix: 'HAI', name: 'Haiti', count: 20 },
    { prefix: 'SCO', name: 'Escócia', count: 20 },
    // Grupo D
    { prefix: 'USA', name: 'EUA', count: 20 },
    { prefix: 'PAR', name: 'Paraguai', count: 20 },
    { prefix: 'AUS', name: 'Austrália', count: 20 },
    { prefix: 'TUR', name: 'Turquia', count: 20 },
    // Grupo E
    { prefix: 'GER', name: 'Alemanha', count: 20 },
    { prefix: 'CUW', name: 'Curaçao', count: 20 },
    { prefix: 'CIV', name: 'Costa do Marfim', count: 20 },
    { prefix: 'ECU', name: 'Equador', count: 20 },
    // Grupo F
    { prefix: 'NED', name: 'Holanda', count: 20 },
    { prefix: 'JPN', name: 'Japão', count: 20 },
    { prefix: 'SWE', name: 'Suécia', count: 20 },
    { prefix: 'TUN', name: 'Tunísia', count: 20 },
    // Grupo G
    { prefix: 'BEL', name: 'Bélgica', count: 20 },
    { prefix: 'EGY', name: 'Egito', count: 20 },
    { prefix: 'IRN', name: 'Irã', count: 20 },
    { prefix: 'NZL', name: 'Nova Zelândia', count: 20 },
    // Grupo H
    { prefix: 'ESP', name: 'Espanha', count: 20 },
    { prefix: 'CPV', name: 'Cabo Verde', count: 20 },
    { prefix: 'KSA', name: 'Arábia Saudita', count: 20 },
    { prefix: 'URU', name: 'Uruguai', count: 20 },
    // Grupo I
    { prefix: 'FRA', name: 'França', count: 20 },
    { prefix: 'SEN', name: 'Senegal', count: 20 },
    { prefix: 'IRQ', name: 'Iraque', count: 20 },
    { prefix: 'NOR', name: 'Noruega', count: 20 },
    // Grupo J
    { prefix: 'ARG', name: 'Argentina', count: 20 },
    { prefix: 'ALG', name: 'Argélia', count: 20 },
    { prefix: 'AUT', name: 'Áustria', count: 20 },
    { prefix: 'JOR', name: 'Jordânia', count: 20 },
    // Grupo K
    { prefix: 'POR', name: 'Portugal', count: 20 },
    { prefix: 'COD', name: 'Congo RD', count: 20 },
    { prefix: 'UZB', name: 'Uzbequistão', count: 20 },
    { prefix: 'COL', name: 'Colômbia', count: 20 },
    // Grupo L
    { prefix: 'ENG', name: 'Inglaterra', count: 20 },
    { prefix: 'CRO', name: 'Croácia', count: 20 },
    { prefix: 'GHA', name: 'Gana', count: 20 },
    { prefix: 'PAN', name: 'Panamá', count: 20 },
    // Extras
    { prefix: 'CC', name: 'Coca-Cola', count: 14 },
  ],
};

// Calcula o total de figurinhas das seções
export function totalFromSections(sections) {
  return sections.reduce((acc, s) => acc + s.count, 0);
}

// Gera o código a partir do prefixo e número (ex: "MEX", 4 → "MEX 4")
// Para prefixo "00" → "00" (figurinha única)
// Para prefixo "CC" → "CC1", "CC2"... (sem espaço, como no álbum oficial)
export function makeCode(prefix, number) {
  if (prefix === '00') return '00';
  if (prefix === 'CC') return `CC${number}`;
  return `${prefix} ${number}`;
}

// Gera todas as figurinhas (códigos) a partir das seções
export function buildStickersFromSections(sections) {
  const stickers = {};
  let order = 0;
  for (const section of sections) {
    for (let i = 1; i <= section.count; i++) {
      const code = makeCode(section.prefix, i);
      stickers[code] = {
        code,
        prefix: section.prefix,
        sectionName: section.name,
        numberInSection: i,
        order: order++,
        status: 'missing',
        duplicates: 0,
        name: '',
      };
    }
  }
  return stickers;
}
