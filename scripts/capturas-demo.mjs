// Capturas de la demo para el video, en móvil y en escritorio, más secuencias de fotogramas.
// Uso: npm run capturas
// Necesita Chrome o Edge instalado. Si el navegador está en otra ruta:
//   CHROME_PATH="C:\ruta\chrome.exe" npm run capturas
// Si no existe dist-demo, la genera antes con el dominio de prueba. No modifica marca.js.
// Salida: capturas/ (excluida de git).
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { preview } from 'vite'

const RAIZ = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(RAIZ, 'dist-demo')
const SALIDA = join(RAIZ, 'capturas')
const DOMINIO_PRUEBA = 'https://constructora-demo.pages.dev'
const PUERTOS = { desde: 4173, hasta: 4199 }

const RUTAS_NAVEGADOR = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

const MOVIL = {
  nombre: 'movil',
  ancho: 390,
  alto: 844,
  escala: 2,
  agente:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  // Cabecera fija (h-16) que no debe tapar los títulos.
  cabecera: 72,
}
const ESCRITORIO = { nombre: 'escritorio', ancho: 1440, alto: 900, escala: 1, agente: null, cabecera: 88 }

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))
const registro = { fallos: [], avisos: [], horizontal: [], rangos: [] }

const navegador = RUTAS_NAVEGADOR.find((ruta) => ruta && existsSync(ruta))
if (!navegador) {
  console.error('No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta del ejecutable.')
  process.exit(1)
}

// 1. dist-demo: se genera solo si falta.
if (!existsSync(join(DIST, 'index.html'))) {
  console.log(`No existe dist-demo: ejecutando npm run demo con ${DOMINIO_PRUEBA}`)
  const resultado = spawnSync(process.execPath, [join(RAIZ, 'scripts', 'build-demo.mjs'), DOMINIO_PRUEBA], {
    cwd: RAIZ,
    stdio: 'inherit',
  })
  if (resultado.status !== 0) {
    console.error('Falló npm run demo; no se pueden tomar capturas.')
    process.exit(1)
  }
}

// 2. Servidor de vista previa en el primer puerto libre de 4173 a 4199.
async function servir() {
  for (let puerto = PUERTOS.desde; puerto <= PUERTOS.hasta; puerto++) {
    try {
      const servidor = await preview({
        root: RAIZ,
        logLevel: 'error',
        build: { outDir: 'dist-demo' },
        preview: { port: puerto, strictPort: true, host: '127.0.0.1' },
      })
      return { servidor, url: `http://127.0.0.1:${puerto}/` }
    } catch (error) {
      if (!/in use|EADDRINUSE/i.test(String(error?.message ?? error))) throw error
    }
  }
  throw new Error(`No hay puertos libres entre ${PUERTOS.desde} y ${PUERTOS.hasta}.`)
}

// Mide el scroll horizontal y comprueba que el banner de cookies no esté en pantalla.
async function revisarPagina(page, perfil, contexto) {
  const { documento, ventana, banner } = await page.evaluate(() => ({
    documento: document.documentElement.scrollWidth,
    ventana: document.documentElement.clientWidth,
    banner: Boolean(document.querySelector('section[aria-label="Cookies de análisis"]')),
  }))
  if (documento > ventana) registro.horizontal.push({ perfil: perfil.nombre, contexto, documento, ventana })
  if (banner) registro.fallos.push(`${perfil.nombre}/${contexto}: aparece el banner de cookies`)
}

async function abrir(browser, perfil, url) {
  const page = await browser.newPage()
  await page.setViewport({
    width: perfil.ancho,
    height: perfil.alto,
    deviceScaleFactor: perfil.escala,
    isMobile: perfil.nombre === 'movil',
    hasTouch: perfil.nombre === 'movil',
  })
  if (perfil.agente) await page.setUserAgent(perfil.agente)
  // Antes de cualquier script de la página: el banner no se muestra.
  await page.evaluateOnNewDocument(() => {
    try {
      window.localStorage.setItem('consentimiento-analitica', 'rechazado')
    } catch {
      /* sin localStorage */
    }
  })
  await page.goto(url, { waitUntil: 'networkidle0' })
  return page
}

// Desplaza con scrollIntoView (sin animación) y deja un margen para la cabecera fija.
async function irA(page, selector, bloque, margen = 0) {
  const existe = await page.evaluate(
    (sel, bl, mg) => {
      const el = document.querySelector(sel)
      if (!el) return false
      el.scrollIntoView({ block: bl, behavior: 'instant' })
      if (mg) window.scrollBy({ top: -mg, behavior: 'instant' })
      return true
    },
    selector,
    bloque,
    margen,
  )
  if (!existe) throw new Error(`No existe el elemento ${selector}`)
}

async function capturar(page, perfil, carpeta, archivo, opciones = {}) {
  await esperar(1000)
  await revisarPagina(page, perfil, archivo)
  await page.screenshot({ path: join(carpeta, archivo), type: 'png', ...opciones })
  console.log(`  ${perfil.nombre}/${archivo}`)
}

// Proceso: coloca la lista para que la línea quede parcialmente llena en naranja.
async function posicionarProceso(page, perfil) {
  const superior = perfil.nombre === 'movil' ? 110 : Math.round(perfil.alto * 0.5)
  await page.evaluate((arriba) => {
    const lista = document.querySelector('#proceso ol')
    lista.scrollIntoView({ block: 'start', behavior: 'instant' })
    window.scrollBy({ top: -arriba, behavior: 'instant' })
  }, superior)
  await esperar(300)
  const tramos = await page.evaluate(() =>
    [...document.querySelectorAll('#proceso ol > li > span[aria-hidden] > span')].map((el) => {
      const t = el.style.transform
      const valor = parseFloat(t.slice(t.indexOf('(') + 1))
      return Number.isFinite(valor) ? valor : 0
    }),
  )
  const parcial = tramos.some((v) => v > 0 && v < 1)
  const llenos = tramos.filter((v) => v >= 1).length
  console.log(`  proceso (${perfil.nombre}): tramos ${tramos.map((v) => v.toFixed(2)).join(', ')}`)
  if (!parcial && (llenos === 0 || llenos === tramos.length)) {
    registro.avisos.push(`${perfil.nombre}/06-proceso.png: la línea no queda parcialmente llena (${tramos.join(', ')})`)
  }
}

async function cotizador(page, perfil, carpeta) {
  await irA(page, '#cotizador-titulo', 'start', perfil.cabecera)
  await capturar(page, perfil, carpeta, '03-cotizador-vacio.png')

  // Clics reales sobre los controles visibles (las etiquetas de las opciones).
  const clicEn = async (selector) => {
    await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), selector)
    await esperar(200)
    await page.click(selector)
  }
  await clicEn('label:has(input[name="tipo"][value="remodelacion"]) > span')
  await page.evaluate(() => document.querySelector('#m2-exacto').scrollIntoView({ block: 'center', behavior: 'instant' }))
  await esperar(200)
  await page.click('#m2-exacto', { count: 3 })
  await page.keyboard.type('215')
  await clicEn('label:has(input[name="acabados"][value="medio"]) > span')
  await page.evaluate(() => document.querySelector('#ciudad').scrollIntoView({ block: 'center', behavior: 'instant' }))
  await esperar(200)
  // Un <select> nativo no se abre en headless: page.select elige la opción y dispara los eventos reales.
  await page.select('#ciudad', 'medellin')

  // Móvil: el resultado queda debajo del formulario, así que se centra. Escritorio: el panel es fijo junto al formulario.
  if (perfil.nombre === 'movil') await irA(page, 'aside[aria-labelledby="resultado-titulo"]', 'center')
  else await irA(page, '#cotizador-titulo', 'start', perfil.cabecera)

  const resultado = await page.evaluate(() => document.querySelector('aside [role="status"]').innerText.replace(/\s+/g, ' '))
  const enPesos = /\$\s?[\d.,]+.*\$\s?[\d.,]+/.test(resultado)
  registro.rangos.push({ perfil: perfil.nombre, enPesos, texto: resultado })
  if (!enPesos) registro.fallos.push(`${perfil.nombre}/04-cotizador-resultado.png: no se ve un rango en pesos ("${resultado}")`)
  await capturar(page, perfil, carpeta, '04-cotizador-resultado.png')
}

async function capturasDePerfil(browser, perfil, url) {
  console.log(`\nCapturas de ${perfil.nombre} (${perfil.ancho}×${perfil.alto}, escala ${perfil.escala})`)
  const carpeta = join(SALIDA, perfil.nombre)
  mkdirSync(carpeta, { recursive: true })
  const page = await abrir(browser, perfil, url)
  try {
    await esperar(3000) // animaciones de entrada

    await irA(page, '#inicio', 'start')
    await capturar(page, perfil, carpeta, '01-hero.png')

    await irA(page, '#servicios-titulo', 'start', perfil.cabecera)
    await capturar(page, perfil, carpeta, '02-servicios.png')

    await cotizador(page, perfil, carpeta)

    await irA(page, '#proyectos', 'start', perfil.nombre === 'movil' ? 0 : 0)
    const activo = await page.evaluate(() => Boolean(document.querySelector('#proyectos nav[aria-label="Elegir proyecto"] [aria-current="true"]')))
    if (!activo) registro.avisos.push(`${perfil.nombre}/05-proyectos.png: no se detectó un proyecto activo`)
    await capturar(page, perfil, carpeta, '05-proyectos.png')

    await posicionarProceso(page, perfil)
    await capturar(page, perfil, carpeta, '06-proceso.png')

    await irA(page, '#garantias ul', 'start', perfil.cabecera)
    await capturar(page, perfil, carpeta, '07-garantias.png')

    await irA(page, '#contacto-autorizacion', 'center')
    const marcada = await page.evaluate(() => document.querySelector('#contacto-autorizacion').checked)
    if (marcada) registro.fallos.push(`${perfil.nombre}/08-contacto.png: la casilla de autorización está marcada`)
    await capturar(page, perfil, carpeta, '08-contacto.png')

    if (perfil.nombre === 'escritorio') {
      // Todo el contenido ya se recorrió: las secciones diferidas están renderizadas.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await capturar(page, perfil, carpeta, '09-pagina-completa.png', { fullPage: true })
    }
  } finally {
    await page.close()
  }
}

// Fotogramas a intervalo fijo, medidos desde el primer fotograma.
async function secuencia(page, perfil, carpeta, intervalo, duracion, nombre) {
  mkdirSync(carpeta, { recursive: true })
  const total = Math.floor(duracion / intervalo)
  const inicio = Date.now()
  for (let i = 0; i < total; i++) {
    const espera = inicio + i * intervalo - Date.now()
    if (espera > 0) await esperar(espera)
    const archivo = `${String(i + 1).padStart(4, '0')}.png`
    await page.screenshot({ path: join(carpeta, archivo), type: 'png', optimizeForSpeed: true, captureBeyondViewport: false })
  }
  const retraso = Date.now() - inicio - (total - 1) * intervalo
  if (retraso > intervalo) registro.avisos.push(`${nombre}: los fotogramas se retrasaron (último con ${retraso} ms de desfase)`)
  await revisarPagina(page, perfil, nombre)
  console.log(`  ${nombre}: ${total} fotogramas`)
}

async function secuencias(browser, url) {
  console.log('\nSecuencias')
  for (const perfil of [MOVIL, ESCRITORIO]) {
    const page = await browser.newPage()
    try {
      await page.setViewport({
        width: perfil.ancho,
        height: perfil.alto,
        deviceScaleFactor: perfil.escala,
        isMobile: perfil.nombre === 'movil',
        hasTouch: perfil.nombre === 'movil',
      })
      if (perfil.agente) await page.setUserAgent(perfil.agente)
      await page.evaluateOnNewDocument(() => {
        try {
          window.localStorage.setItem('consentimiento-analitica', 'rechazado')
        } catch {
          /* sin localStorage */
        }
      })
      // La secuencia arranca con la carga: no se espera a que la red quede en reposo.
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await secuencia(page, perfil, join(SALIDA, 'secuencias', `hero-${perfil.nombre}`), 250, 3000, `hero-${perfil.nombre}`)
    } finally {
      await page.close()
    }
  }

  const page = await abrir(browser, ESCRITORIO, url)
  try {
    await irA(page, '#proyectos', 'start')
    await secuencia(page, ESCRITORIO, join(SALIDA, 'secuencias', 'carrusel-escritorio'), 500, 10000, 'carrusel-escritorio')
  } finally {
    await page.close()
  }
}

// 5. Verificación de dimensiones leyendo la cabecera de cada PNG.
function dimensionesPng(ruta) {
  const datos = readFileSync(ruta)
  return { ancho: datos.readUInt32BE(16), alto: datos.readUInt32BE(20) }
}

function verificarDimensiones() {
  const esperadas = {
    movil: { ancho: MOVIL.ancho * MOVIL.escala, alto: MOVIL.alto * MOVIL.escala },
    escritorio: { ancho: ESCRITORIO.ancho, alto: ESCRITORIO.alto },
  }
  const revisar = (carpeta, perfil) => {
    const ruta = join(SALIDA, ...carpeta)
    for (const archivo of readdirSync(ruta).filter((f) => f.endsWith('.png'))) {
      const { ancho, alto } = dimensionesPng(join(ruta, archivo))
      const esperada = esperadas[perfil]
      const completa = archivo === '09-pagina-completa.png'
      const bien = ancho === esperada.ancho && (completa ? alto >= esperada.alto : alto === esperada.alto)
      if (!bien) {
        registro.fallos.push(`${[...carpeta, archivo].join('/')}: ${ancho}×${alto}, se esperaba ${esperada.ancho}×${completa ? '≥' : ''}${esperada.alto}`)
      }
    }
  }
  revisar(['movil'], 'movil')
  revisar(['escritorio'], 'escritorio')
  revisar(['secuencias', 'hero-movil'], 'movil')
  revisar(['secuencias', 'hero-escritorio'], 'escritorio')
  revisar(['secuencias', 'carrusel-escritorio'], 'escritorio')
}

function contarArchivos(carpeta) {
  return readdirSync(carpeta, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).length
}

rmSync(SALIDA, { recursive: true, force: true })
mkdirSync(SALIDA, { recursive: true })

const { servidor, url } = await servir()
console.log(`Sirviendo dist-demo en ${url}`)
const browser = await puppeteer.launch({ executablePath: navegador, headless: true })
try {
  await capturasDePerfil(browser, MOVIL, url)
  await capturasDePerfil(browser, ESCRITORIO, url)
  await secuencias(browser, url)
} finally {
  await browser.close()
  await servidor.close()
}

verificarDimensiones()

console.log('\n=== Resumen ===')
for (const carpeta of ['movil', 'escritorio', 'secuencias/hero-movil', 'secuencias/hero-escritorio', 'secuencias/carrusel-escritorio']) {
  console.log(`capturas/${carpeta}: ${contarArchivos(join(SALIDA, ...carpeta.split('/')))} archivos`)
}
console.log(
  registro.horizontal.length === 0
    ? 'Scroll horizontal: ninguno.'
    : 'Scroll horizontal en:\n' +
        registro.horizontal.map((h) => `  ${h.perfil}/${h.contexto}: documento ${h.documento} px, ventana ${h.ventana} px`).join('\n'),
)
console.log(registro.fallos.some((f) => f.includes('banner')) ? 'Banner de cookies: APARECE (ver fallos).' : 'Banner de cookies: no aparece en ninguna captura.')
for (const r of registro.rangos) console.log(`Cotizador ${r.perfil}: ${r.enPesos ? 'rango en pesos' : 'SIN rango'} -> ${r.texto}`)
if (registro.avisos.length) console.log('Avisos:\n' + registro.avisos.map((a) => '  ' + a).join('\n'))
if (registro.fallos.length) {
  console.error('Fallos:\n' + registro.fallos.map((f) => '  ' + f).join('\n'))
  process.exit(1)
}
console.log('Verificación de dimensiones: correcta.')
