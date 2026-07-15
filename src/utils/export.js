import jsPDF from 'jspdf';

// Agrupa figurinhas por seção e formata como texto
function groupByPrefix(stickers) {
  const groups = {};
  for (const s of stickers) {
    const key = s.prefix || 'OUTROS';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  // Ordena por order (que mantém a ordem original do álbum)
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  return groups;
}

export function buildMissingText(stickers, albumName) {
  const missing = stickers.filter(s => s.status === 'missing');
  if (missing.length === 0) return `🏆 ${albumName || 'Álbum'}: NENHUMA FALTANDO!`;
  const groups = groupByPrefix(missing);
  let text = `🟡 FALTAM em "${albumName || 'meu álbum'}" (${missing.length}):\n\n`;
  for (const prefix of Object.keys(groups)) {
    const items = groups[prefix];
    const sectionName = items[0]?.sectionName || prefix;
    text += `${sectionName}:\n`;
    text += items.map(s => s.code).join(', ');
    text += '\n\n';
  }
  return text.trim();
}

export function buildDuplicatesText(stickers, albumName) {
  const dups = stickers.filter(s => s.status === 'duplicate' && (s.duplicates || 0) > 0);
  if (dups.length === 0) return `Não tenho figurinhas repetidas no momento.`;
  const groups = groupByPrefix(dups);
  let text = `🔁 REPETIDAS em "${albumName || 'meu álbum'}" (${dups.length}):\n\n`;
  for (const prefix of Object.keys(groups)) {
    const items = groups[prefix];
    const sectionName = items[0]?.sectionName || prefix;
    text += `${sectionName}:\n`;
    text += items.map(s => s.duplicates > 1 ? `${s.code} (x${s.duplicates})` : s.code).join(', ');
    text += '\n\n';
  }
  return text.trim();
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function shareWhatsApp(text) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

export function exportPDF(title, text) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header com cores do Brasil
  doc.setFillColor(0, 156, 59); // verde
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setFillColor(255, 223, 0); // amarelo
  doc.rect(0, 60, pageWidth, 8, 'F');
  doc.setFillColor(0, 39, 118); // azul
  doc.rect(0, 68, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(title, 40, 38);

  // Conteúdo
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, pageWidth - 80);
  let y = 100;
  const lineHeight = 16;
  for (const line of lines) {
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 50;
    }
    doc.text(line, 40, y);
    y += lineHeight;
  }

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Gerado por Álbum da Copa em ${new Date().toLocaleDateString('pt-BR')}`, 40, pageHeight - 20);

  const stamp = new Date().toISOString().slice(0, 10);
  const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  doc.save(`${safeTitle}-${stamp}.pdf`);
}

export async function exportImage(title, text) {
  const canvas = document.createElement('canvas');
  const dpi = 2;
  const width = 720;
  const lineHeight = 22;
  const padding = 40;

  // Calcula tamanho necessário
  const ctx0 = canvas.getContext('2d');
  ctx0.font = '15px sans-serif';
  const allLines = [];
  for (const paragraph of text.split('\n')) {
    if (paragraph === '') {
      allLines.push('');
      continue;
    }
    const words = paragraph.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx0.measureText(test).width > width - padding * 2) {
        allLines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) allLines.push(line);
  }
  const contentHeight = allLines.length * lineHeight;
  const height = 130 + contentHeight + 60;

  canvas.width = width * dpi;
  canvas.height = height * dpi;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpi, dpi);

  // Background
  ctx.fillStyle = '#FFFBEA';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#009C3B';
  ctx.fillRect(0, 0, width, 80);
  ctx.fillStyle = '#FFDF00';
  ctx.fillRect(0, 80, width, 10);
  ctx.fillStyle = '#002776';
  ctx.fillRect(0, 90, width, 5);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(title, padding, 50);

  // Texto
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '15px sans-serif';
  let y = 130;
  for (const line of allLines) {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  }

  // Rodapé
  ctx.fillStyle = '#666';
  ctx.font = '11px sans-serif';
  ctx.fillText(`Álbum da Copa • ${new Date().toLocaleDateString('pt-BR')}`, padding, height - 25);

  // Download
  const stamp = new Date().toISOString().slice(0, 10);
  const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}-${stamp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Formato curto pra display
export function shortCode(code) {
  return code;
}
