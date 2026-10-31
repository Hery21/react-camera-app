import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

// --- CONFIGURATION ---
const IMAGE_PATH = 'D:/Hery/experiment/mahjong/img/tiles/Bagan Referensi Ubin Mahjong Tradisional (1).png'
const OUTPUT_DIR = 'D:/Hery/experiment/mahjong/img/tiles/cropped'
const COLS = 9
const ROWS = 5
// ---------------------

;(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error(`❌ Error: Could not find the image at: ${IMAGE_PATH}`)
    return
  }

  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const imageBuffer = fs.readFileSync(IMAGE_PATH)
  const base64Image = imageBuffer.toString('base64')
  const dataUrl = `data:image/png;base64,${base64Image}`

  console.log('Scanning image for exact gap locations...')

  const slices = await page.evaluate(
    async ({ dataUrl, cols, rows }) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const sourceCanvas = document.createElement('canvas')
          sourceCanvas.width = img.width
          sourceCanvas.height = img.height
          const ctx = sourceCanvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          const imgData = ctx.getImageData(0, 0, img.width, img.height)
          const data = imgData.data

          // 1. Calculate the total alpha for every row and column
          const rowSums = new Array(img.height).fill(0)
          const colSums = new Array(img.width).fill(0)

          for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
              const alpha = data[(y * img.width + x) * 4 + 3]
              if (alpha > 10) {
                // Ignore faint noise
                rowSums[y]++
                colSums[x]++
              }
            }
          }

          // 2. Find the exact Y cut-lines (the emptiest rows between tiles)
          const cutsY = [0]
          const searchRadiusY = Math.floor((img.height / rows) * 0.25) // Search +/- 25% around the math center
          for (let r = 1; r < rows; r++) {
            const theoreticalY = Math.floor(r * (img.height / rows))
            let bestY = theoreticalY
            let minSum = Infinity
            const startY = Math.max(1, theoreticalY - searchRadiusY)
            const endY = Math.min(img.height - 2, theoreticalY + searchRadiusY)

            for (let y = startY; y <= endY; y++) {
              if (rowSums[y] < minSum) {
                minSum = rowSums[y]
                bestY = y
              }
            }
            cutsY.push(bestY)
          }
          cutsY.push(img.height)

          // 3. Find the exact X cut-lines (the emptiest cols between tiles)
          const cutsX = [0]
          const searchRadiusX = Math.floor((img.width / cols) * 0.25)
          for (let c = 1; c < cols; c++) {
            const theoreticalX = Math.floor(c * (img.width / cols))
            let bestX = theoreticalX
            let minSum = Infinity
            const startX = Math.max(1, theoreticalX - searchRadiusX)
            const endX = Math.min(img.width - 2, theoreticalX + searchRadiusX)

            for (let x = startX; x <= endX; x++) {
              if (colSums[x] < minSum) {
                minSum = colSums[x]
                bestX = x
              }
            }
            cutsX.push(bestX)
          }
          cutsX.push(img.width)

          // 4. Extract tiles using the dynamic cut-lines
          const cropCanvas = document.createElement('canvas')
          const cropCtx = cropCanvas.getContext('2d')
          const tilesData = []
          let maxW = 0
          let maxH = 0

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const startX = cutsX[c]
              const endX = cutsX[c + 1]
              const startY = cutsY[r]
              const endY = cutsY[r + 1]

              const w = endX - startX
              const h = endY - startY

              // Get image data for this specific gap-bounded cell
              const cellData = ctx.getImageData(startX, startY, w, h).data
              let minX = w,
                minY = h,
                maxX = 0,
                maxY = 0
              let hasPixels = false

              // Find the tight bounding box WITHIN this cell
              for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                  const alpha = cellData[(y * w + x) * 4 + 3]
                  if (alpha > 10) {
                    if (x < minX) minX = x
                    if (x > maxX) maxX = x
                    if (y < minY) minY = y
                    if (y > maxY) maxY = y
                    hasPixels = true
                  }
                }
              }

              if (!hasPixels) {
                tilesData.push({ r, c, isEmpty: true })
                continue
              }

              const actualCropX = startX + minX
              const actualCropY = startY + minY
              const actualCropW = maxX - minX + 1
              const actualCropH = maxY - minY + 1

              if (actualCropW > maxW) maxW = actualCropW
              if (actualCropH > maxH) maxH = actualCropH

              tilesData.push({
                r,
                c,
                isEmpty: false,
                sourceX: actualCropX,
                sourceY: actualCropY,
                w: actualCropW,
                h: actualCropH,
              })
            }
          }

          console.log(`Largest tile found: ${maxW}x${maxH}. Normalizing all tiles...`)

          // 5. Save all tiles onto a uniform canvas size
          const results = []
          for (const tile of tilesData) {
            if (tile.isEmpty) {
              results.push({ row: tile.r + 1, col: tile.c + 1, dataUrl: null })
              continue
            }

            cropCanvas.width = maxW
            cropCanvas.height = maxH
            cropCtx.clearRect(0, 0, maxW, maxH)

            // Center the tile inside the uniform canvas
            const offsetX = Math.floor((maxW - tile.w) / 2)
            const offsetY = Math.floor((maxH - tile.h) / 2)

            cropCtx.drawImage(sourceCanvas, tile.sourceX, tile.sourceY, tile.w, tile.h, offsetX, offsetY, tile.w, tile.h)

            results.push({
              row: tile.r + 1,
              col: tile.c + 1,
              dataUrl: cropCanvas.toDataURL('image/png'),
            })
          }

          resolve(results)
        }
        img.onerror = () => reject('Failed to load image in browser context.')
        img.src = dataUrl
      })
    },
    { dataUrl, cols: COLS, rows: ROWS },
  )

  await browser.close()

  console.log(`Saving ${slices.length} tiles...`)
  slices.forEach((tile) => {
    const filename = `tile_r${tile.row}_c${tile.col}.png`
    const filepath = path.join(OUTPUT_DIR, filename)

    if (tile.dataUrl) {
      const base64Data = tile.dataUrl.replace(/^data:image\/png;base64,/, '')
      fs.writeFileSync(filepath, base64Data, 'base64')
      console.log(`✅ Saved: ${filename}`)
    } else {
      console.log(`⚪ Skipped empty cell: ${filename}`)
    }
  })

  console.log(`\n🎉 Done! All tiles are perfectly cropped and normalized.`)
})()
