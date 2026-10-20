// Genera public/og-image.jpg (1200 × 630 px) con el nombre de la marca en Archivo.
// Uso: npm run og-image
// Necesita Chrome o Edge instalado y conexión a internet (para cargar Archivo desde Google Fonts).
// Si el navegador está en otra ruta: CHROME_PATH="C:\ruta\chrome.exe" npm run og-image
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { MARCA } from '../src/data/marca.js'

const SALIDA = fileURLToPath(new URL('../public/og-image.jpg', import.meta.url))

const RUTAS_NAVEGADOR = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

const navegador = RUTAS_NAVEGADOR.find((ruta) => ruta && existsSync(ruta))
if (!navegador) {
  console.error('No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta del ejecutable.')
  process.exit(1)
}

// Misma lógica del Logo: la primera palabra en negrita fuerte y el resto en peso medio.
const [primera, ...resto] = MARCA.nombre.split(' ')
const { graphite, safety, white, concrete } = MARCA.colores

const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" />
    <style>
      * { box-sizing: border-box; margin: 0; }
      body {
        width: 1200px;
        height: 630px;
        background: ${graphite};
        color: ${white};
        font-family: 'Archivo', sans-serif;
        position: relative;
        overflow: hidden;
      }
      .marca {
        position: absolute;
        left: 96px;
        right: 96px;
        top: 50%;
        transform: translateY(-62%);
        font-stretch: 62%;
        font-variation-settings: 'wdth' 62;
        font-size: 140px;
        line-height: 1;
        letter-spacing: 0.025em;
        white-space: nowrap;
      }
      .marca b { font-weight: 900; }
      .marca span { font-weight: 500; }
      .linea { position: absolute; left: 96px; top: 400px; width: 260px; height: 14px; background: ${safety}; }
      .eslogan {
        position: absolute;
        left: 96px;
        right: 96px;
        bottom: 72px;
        font-size: 30px;
        font-weight: 400;
        color: ${concrete};
      }
    </style>
  </head>
  <body>
    <div class="marca"><b>${primera}</b>${resto.length ? `<span> ${resto.join(' ')}</span>` : ''}</div>
    <div class="linea"></div>
    <div class="eslogan">${MARCA.eslogan}</div>
  </body>
</html>`

const browser = await puppeteer.launch({ executablePath: navegador, headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const cargada = await page.evaluate(() => document.fonts.check("900 140px 'Archivo'"))
  if (!cargada) throw new Error('Archivo no se cargó (¿sin internet?). No se generó la imagen.')
  await page.screenshot({ path: SALIDA, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } })
  console.log(`Imagen generada: ${SALIDA}`)
} finally {
  await browser.close()
}
