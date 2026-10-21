// Revisión antes de publicar. Uso: npm run revisar
// Termina con código 1 si hay errores que bloquean la publicación; con 0 si solo hay avisos.
// Los comentarios del código no cuentan: solo se revisa lo que puede llegar al visitante.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = fileURLToPath(new URL('..', import.meta.url))
const { MARCA, esPendiente } = await import('../src/data/marca.js')
const { whatsappValido } = await import('../src/data/contacto.js')

const errores = []
const avisos = []

// --- Datos del comprador ---------------------------------------------------------------------

const REQUERIDOS = [
  ['dominio', 'Dominio de la web', (v) => esPendiente(v) || /tudominio\.com/i.test(v)],
  ['razonSocial', 'Razón social (footer, Ley 1480 de 2011)'],
  ['nit', 'NIT (footer, Ley 1480 de 2011)'],
  ['telefonoWhatsapp', 'Número de WhatsApp (solo dígitos, formato internacional)', (v) => esPendiente(v) || !whatsappValido],
  ['correo', 'Correo de contacto (canal para derechos de los titulares de datos)'],
  ['anio_fundacion', 'Año de fundación (cota del hero)'],
]
for (const [campo, descripcion, pendiente = esPendiente] of REQUERIDOS) {
  if (pendiente(MARCA[campo])) errores.push(`src/data/marca.js: "${campo}" pendiente. ${descripcion}.`)
}

const OPCIONALES = [
  ['telefono', 'se oculta en contacto y en el JSON-LD'],
  ['direccion', 'se oculta en contacto y en el JSON-LD'],
  ['horario', 'se oculta en contacto'],
  ['departamento', 'se omite del JSON-LD'],
  ['zonaAtendida', 'se omite del JSON-LD'],
]
for (const [campo, efecto] of OPCIONALES) {
  if (esPendiente(MARCA[campo])) avisos.push(`src/data/marca.js: "${campo}" pendiente (${efecto}).`)
}
const cifrasPendientes = MARCA.datosConfianza.filter((dato) => esPendiente(dato.valor)).length
if (cifrasPendientes > 0) {
  avisos.push(`src/data/marca.js: ${cifrasPendientes} de ${MARCA.datosConfianza.length} cifras de "datosConfianza" pendientes (se ocultan; con menos de dos se oculta la fila).`)
}

// --- Búsqueda de textos en el código fuente ---------------------------------------------------

const EXTENSIONES = new Set(['.js', '.jsx', '.mjs', '.html', '.css', '.svg', '.xml', '.txt', '.json', ''])

// Reemplaza los comentarios por espacios (conserva los saltos de línea para dar el número de línea correcto).
function sinComentarios(texto, extension) {
  const blanquear = (coincidencia) => coincidencia.replace(/[^\n]/g, ' ')
  if (extension === '.txt') return texto.replace(/^\s*#.*$/gm, blanquear)
  let limpio = texto.replace(/\/\*[\s\S]*?\*\//g, blanquear).replace(/<!--[\s\S]*?-->/g, blanquear)
  if (['.js', '.jsx', '.mjs'].includes(extension)) limpio = limpio.replace(/(?<![:\w"'`\\])\/\/.*$/gm, blanquear)
  return limpio
}

function* archivos(directorio) {
  if (!existsSync(directorio)) return
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name)
    if (entrada.isDirectory()) yield* archivos(ruta)
    else if (EXTENSIONES.has(extname(entrada.name))) yield ruta
  }
}

// `nova` como inicio de palabra, sin contar "novalidate" (atributo HTML).
// En marca.js, "TODO" y "tudominio.com" ya se revisan campo por campo. index.html, robots.txt y
// sitemap.xml llevan tudominio.com a propósito: el build lo reemplaza por marca.dominio.
const BUSQUEDAS = [
  { patron: /\bTODO\b/, nombre: 'TODO', grupo: errores, omitir: ['src/data/marca.js'] },
  {
    patron: /tudominio\.com/i,
    nombre: 'tudominio.com',
    grupo: errores,
    omitir: ['src/data/marca.js', 'index.html', 'public/robots.txt', 'public/sitemap.xml'],
  },
  { patron: /570000000000/, nombre: '570000000000', grupo: errores, omitir: [] },
  { patron: /\bnova(?!lidate)/i, nombre: 'nova', grupo: errores, omitir: [] },
  { patron: /Ilustración de ejemplo/, nombre: 'Ilustración de ejemplo', grupo: avisos, omitir: [] },
]

const rutas = [join(RAIZ, 'index.html'), ...archivos(join(RAIZ, 'src')), ...archivos(join(RAIZ, 'public'))]
for (const ruta of rutas) {
  const relativa = relative(RAIZ, ruta).split(sep).join('/')
  const extension = extname(ruta)
  const lineas = sinComentarios(readFileSync(ruta, 'utf8'), extension).split('\n')
  for (const { patron, nombre, grupo, omitir } of BUSQUEDAS) {
    if (omitir.includes(relativa)) continue
    lineas.forEach((linea, indice) => {
      if (patron.test(linea)) grupo.push(`${relativa}:${indice + 1}: contiene "${nombre}" → ${linea.trim().slice(0, 90)}`)
    })
  }
}

// --- Contenido de ejemplo y textos legales en borrador ---------------------------------------

const MARCA_EJEMPLO = 'Valores de ejemplo: el comprador debe reemplazarlos antes de publicar'
for (const archivo of ['cotizador', 'garantias', 'proyectos']) {
  const ruta = `src/data/${archivo}.js`
  if (readFileSync(join(RAIZ, ruta), 'utf8').includes(MARCA_EJEMPLO)) {
    avisos.push(`${ruta}: valores de ejemplo. Confírmalos y borra el comentario "${MARCA_EJEMPLO}" del inicio.`)
  }
}
for (const ruta of ['src/pages/AvisoPrivacidad.jsx', 'src/pages/PoliticaTratamiento.jsx']) {
  if (/BORRADOR/.test(readFileSync(join(RAIZ, ruta), 'utf8'))) {
    avisos.push(`${ruta}: texto legal en borrador. Que lo revise un abogado y borra la línea "BORRADOR" del inicio.`)
  }
}

// --- Resultado -------------------------------------------------------------------------------

const imprimir = (titulo, lista) => {
  console.log(`\n${titulo} (${lista.length})`)
  if (lista.length === 0) console.log('  Ninguno.')
  for (const item of lista) console.log(`  - ${item}`)
}

console.log('Revisión antes de publicar')
imprimir('ERRORES que bloquean la publicación', errores)
imprimir('AVISOS que no bloquean', avisos)

if (errores.length > 0) {
  console.log(`\nNo se puede publicar: corrige los ${errores.length} errores.`)
  process.exit(1)
}
console.log('\nSin errores. Revisa los avisos antes de publicar.')
