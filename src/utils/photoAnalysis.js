/**
 * Simple page-photo analysis.
 *
 * Approach: the user provides a page with rows x cols cells.
 * We sample each cell in the photo and compute the COLOR VARIANCE
 * (a proxy for "is there a colorful sticker here?").
 *
 * - Cells with high variance / saturation → likely have sticker (filled).
 * - Cells that are flat (paper-colored, low saturation) → likely empty.
 *
 * The user always confirms the result manually.
 */

export async function analyzePagePhoto(imageDataUrl, rows, cols, options = {}) {
  const img = await loadImage(imageDataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  const { paddingPct = 0.04 } = options
  const W = canvas.width
  const H = canvas.height
  const px = Math.round(W * paddingPct)
  const py = Math.round(H * paddingPct)
  const gridW = W - 2 * px
  const gridH = H - 2 * py
  const cellW = gridW / cols
  const cellH = gridH / rows

  const results = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = Math.round(px + c * cellW)
      const y = Math.round(py + r * cellH)
      const w = Math.round(cellW)
      const h = Math.round(cellH)
      // Crop center 60% of the cell to avoid borders
      const cropPad = 0.2
      const cx = Math.round(x + w * cropPad)
      const cy = Math.round(y + h * cropPad)
      const cw = Math.max(1, Math.round(w * (1 - 2 * cropPad)))
      const ch = Math.max(1, Math.round(h * (1 - 2 * cropPad)))
      const data = ctx.getImageData(cx, cy, cw, ch).data
      const stats = computeStats(data)
      results.push({
        row: r,
        col: c,
        index: r * cols + c,
        ...stats
      })
    }
  }

  // Auto-threshold: a cell is "filled" if its colorfulness OR variance is above the median
  const colors = results.map((r) => r.colorfulness).sort((a, b) => a - b)
  const variances = results.map((r) => r.variance).sort((a, b) => a - b)
  const medianColor = colors[Math.floor(colors.length / 2)] || 0
  const medianVar = variances[Math.floor(variances.length / 2)] || 0
  // We require BOTH measures to be above 70% of the max to be confident "filled".
  const maxColor = colors[colors.length - 1] || 1
  const maxVar = variances[variances.length - 1] || 1

  const enriched = results.map((cell) => {
    const colorScore = cell.colorfulness / maxColor
    const varScore = cell.variance / maxVar
    const score = (colorScore * 0.6 + varScore * 0.4)
    return {
      ...cell,
      score: Math.round(score * 100),
      filled: score > 0.45 // tuned heuristic
    }
  })

  return {
    cells: enriched,
    imageWidth: W,
    imageHeight: H,
    paddingX: px,
    paddingY: py,
    cellWidth: cellW,
    cellHeight: cellH,
    medians: { color: medianColor, variance: medianVar }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function computeStats(data) {
  // Compute brightness mean & variance, and "colorfulness" (mean saturation).
  let sumL = 0
  let sumL2 = 0
  let sumSat = 0
  const n = data.length / 4

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    sumL += l
    sumL2 += l * l
    const maxC = Math.max(r, g, b)
    const minC = Math.min(r, g, b)
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC
    sumSat += sat
  }
  const mean = sumL / n
  const variance = sumL2 / n - mean * mean
  const colorfulness = sumSat / n
  return {
    brightness: mean,
    variance,
    colorfulness
  }
}

// Read a File into a data URL (for uploaded photos)
export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
