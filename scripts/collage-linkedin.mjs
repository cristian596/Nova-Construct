// Genera un collage para LinkedIn (1200 × 627 px, escala 2 → 2400 × 1254 px) a partir de la demo publicada.
// Uso: npm run linkedin -- https://constructora-demo-dp1.pages.dev
// Necesita Chrome o Edge instalado. Si el navegador está en otra ruta:
//   CHROME_PATH="C:\ruta\chrome.exe" npm run linkedin
// Salida: Escritorio\collage\constructora\collage-linkedin.png (cambiar con COLLAGE_SALIDA="C:\ruta\archivo.png").
// No modifica el sitio ni marca.js. El HTML temporal (con estilos inline) se escribe en la carpeta temporal del sistema.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import { esPendiente, MARCA } from '../src/data/marca.js'

const URL_DEMO = process.argv[2] || 'https://constructora-demo-dp1.pages.dev'
const SALIDA = process.env.COLLAGE_SALIDA || join(homedir(), 'Desktop', 'collage', 'constructora', 'collage-linkedin.png')
const FUENTE = fileURLToPath(
  new URL('../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2', import.meta.url),
)

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

const ESCRITORIO = { ancho: 1440, alto: 900, escala: 1, cabecera: 88 }
const MOVIL = {
  ancho: 390,
  alto: 844,
  escala: 2,
  cabecera: 72,
  agente:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
}

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

async function abrir(browser, perfil, esMovil) {
  const page = await browser.newPage()
  await page.setViewport({
    width: perfil.ancho,
    height: perfil.alto,
    deviceScaleFactor: perfil.escala,
    isMobile: esMovil,
    hasTouch: esMovil,
  })
  if (esMovil) await page.setUserAgent(perfil.agente)
  // Antes de cualquier script de la página: el banner de cookies no se muestra.
  await page.evaluateOnNewDocument(() => {
    try {
      window.localStorage.setItem('consentimiento-analitica', 'rechazado')
    } catch {
      /* sin localStorage */
    }
  })
  await page.goto(URL_DEMO, { waitUntil: 'networkidle0', timeout: 60000 })
  await esperar(3000) // animaciones de entrada
  return page
}

async function irA(page, selector, margen) {
  const existe = await page.evaluate(
    (sel, mg) => {
      const el = document.querySelector(sel)
      if (!el) return false
      el.scrollIntoView({ block: 'start', behavior: 'instant' })
      if (mg) window.scrollBy({ top: -mg, behavior: 'instant' })
      return true
    },
    selector,
    margen,
  )
  if (!existe) throw new Error(`No existe el elemento ${selector} en ${URL_DEMO}`)
  await esperar(1200)
}

async function capturar(page) {
  const hayBanner = await page.evaluate(() => Boolean(document.querySelector('section[aria-label="Cookies de análisis"]')))
  if (hayBanner) throw new Error('Aparece el banner de cookies en la captura.')
  const buffer = await page.screenshot({ type: 'png' })
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

// Tamaño real de un PNG leyendo su cabecera.
const dimensionesPng = (ruta) => {
  const datos = readFileSync(ruta)
  return { ancho: datos.readUInt32BE(16), alto: datos.readUInt32BE(20) }
}

// Dos líneas como máximo: el nombre y, si no está pendiente, el eslogan.
const [primera, ...resto] = MARCA.nombre.split(' ')
const lineaEslogan = esPendiente(MARCA.eslogan) ? '' : MARCA.eslogan
const { graphite, safety, white, concrete, cement } = MARCA.colores

function componer({ escritorioHero, escritorioProyectos, movilHero, movilCotizador }) {
  const fuente = readFileSync(FUENTE).toString('base64')
  const marcoEscritorio = (img, estilo) => `
    <div style="position:absolute;${estilo};background:${white};border-radius:12px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.45);">
      <div style="height:22px;background:${concrete};display:flex;align-items:center;gap:6px;padding:0 10px;">
        <span style="width:7px;height:7px;border-radius:50%;background:${cement};"></span>
        <span style="width:7px;height:7px;border-radius:50%;background:${cement};"></span>
        <span style="width:7px;height:7px;border-radius:50%;background:${cement};"></span>
      </div>
      <img src="${img}" style="display:block;width:100%;height:auto;" />
    </div>`
  const marcoMovil = (img, estilo) => `
    <div style="position:absolute;${estilo};width:220px;height:476px;background:${graphite};border:5px solid ${concrete};border-radius:34px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.5);">
      <img src="${img}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:top;" />
    </div>`

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      @font-face { font-family: 'Archivo Variable'; src: url(data:font/woff2;base64,${fuente}) format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
    </style>
  </head>
  <body style="margin:0;width:1200px;height:627px;background:${graphite};color:${white};font-family:'Archivo Variable',sans-serif;position:relative;overflow:hidden;">
    <div style="position:absolute;left:40px;top:32px;width:720px;">
      <div style="font-stretch:62%;font-variation-settings:'wdth' 62;font-size:52px;line-height:1;letter-spacing:0.025em;white-space:nowrap;">
        <b style="font-weight:900;">${primera}</b>${resto.length ? `<span style="font-weight:500;"> ${resto.join(' ')}</span>` : ''}
      </div>
      ${lineaEslogan ? `<div style="margin-top:10px;font-size:21px;line-height:1.2;font-weight:400;color:${concrete};white-space:nowrap;">${lineaEslogan}</div>` : ''}
    </div>
    <div style="position:absolute;left:40px;top:128px;width:96px;height:6px;background:${safety};"></div>
    ${marcoEscritorio(escritorioHero, 'left:40px;top:150px;width:700px')}
    ${marcoEscritorio(escritorioProyectos, 'left:410px;top:384px;width:330px')}
    ${marcoMovil(movilHero, 'left:800px;top:36px')}
    ${marcoMovil(movilCotizador, 'left:950px;top:112px')}
  </body>
</html>`
}

const browser = await puppeteer.launch({ executablePath: navegador, headless: true })
try {
  console.log(`Capturando ${URL_DEMO}`)
  const escritorio = await abrir(browser, ESCRITORIO, false)
  const escritorioHero = await capturar(escritorio)
  await irA(escritorio, '#proyectos', 0)
  const escritorioProyectos = await capturar(escritorio)
  await escritorio.close()
  console.log(`  escritorio ${ESCRITORIO.ancho}×${ESCRITORIO.alto}: hero y proyectos`)

  const movil = await abrir(browser, MOVIL, true)
  const movilHero = await capturar(movil)
  await irA(movil, '#cotizador-titulo', MOVIL.cabecera)
  const movilCotizador = await capturar(movil)
  await movil.close()
  console.log(`  móvil ${MOVIL.ancho}×${MOVIL.alto} @${MOVIL.escala}x: hero y cotizador`)

  const carpetaTemporal = mkdtempSync(join(tmpdir(), 'collage-linkedin-'))
  const htmlRuta = join(carpetaTemporal, 'collage.html')
  writeFileSync(htmlRuta, componer({ escritorioHero, escritorioProyectos, movilHero, movilCotizador }))

  mkdirSync(dirname(SALIDA), { recursive: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 627, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(htmlRuta).href, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  if (!(await page.evaluate(() => document.fonts.check("900 52px 'Archivo Variable'")))) {
    throw new Error('Archivo Variable no se cargó. No se generó la imagen.')
  }
  await page.screenshot({ path: SALIDA, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 627 } })
  const { ancho, alto } = dimensionesPng(SALIDA)
  if (ancho !== 2400 || alto !== 1254) throw new Error(`Tamaño inesperado: ${ancho}×${alto}, se esperaba 2400×1254.`)
  console.log(`Collage generado (${ancho}×${alto}): ${SALIDA}`)
  console.log(`HTML temporal: ${htmlRuta}`)
} finally {
  await browser.close()
}
