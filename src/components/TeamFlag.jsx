// Bandeiras SVG do flagcdn.com - funciona no Windows, Mac, Android, iPhone, tudo
const COUNTRY_ISO = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
};

const SIZES = { xs: 16, sm: 20, md: 28, lg: 36, xl: 48, '2xl': 64 };

export default function TeamFlag({ prefix, size = 'md', className = '' }) {
  if (prefix === '00') {
    const px = SIZES[size];
    return (
      <span
        className={`inline-flex items-center justify-center bg-gradient-to-br from-amarelo-400 to-amber-500 text-zinc-900 rounded-full font-bold shadow-sm ${className}`}
        style={{ width: px, height: px, fontSize: px * 0.45 }}
      >⭐</span>
    );
  }
  if (prefix === 'FWC') {
    const px = SIZES[size];
    return (
      <span
        className={`inline-flex items-center justify-center bg-gradient-to-br from-verde-500 to-azul-600 text-white rounded-full font-bold shadow-sm ${className}`}
        style={{ width: px, height: px, fontSize: px * 0.45 }}
      >🏆</span>
    );
  }
  if (prefix === 'CC') {
    const px = SIZES[size];
    return (
      <span
        className={`inline-flex items-center justify-center bg-red-600 text-white rounded-full font-bold shadow-sm ${className}`}
        style={{ width: px, height: px, fontSize: px * 0.35 }}
      >CC</span>
    );
  }
  const iso = COUNTRY_ISO[prefix];
  if (!iso) {
    const px = SIZES[size];
    return (
      <span
        className={`inline-flex items-center justify-center bg-zinc-200 text-zinc-700 rounded font-bold ${className}`}
        style={{ width: px, height: px * 0.75, fontSize: px * 0.3 }}
      >{prefix}</span>
    );
  }
  const width = SIZES[size];
  const height = Math.round(width * 0.75);
  return (
    <img
      src={`https://flagcdn.com/${width * 2}x${height * 2}/${iso}.png`}
      alt={prefix}
      width={width}
      height={height}
      className={`inline-block flex-shrink-0 object-cover rounded shadow-sm ${className}`}
      style={{ width, height }}
      loading="lazy"
    />
  );
}
