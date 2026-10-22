import { MARCA, esPendiente } from '../data/marca.js'

// Consentimiento de Google Analytics 4. El script de Google solo se carga si el visitante acepta;
// al rechazar no se carga nada y no se crean cookies.

const CLAVE = 'consentimiento-analitica'
const ACEPTADO = 'aceptado'
const RECHAZADO = 'rechazado'

// Analytics solo está disponible si el comprador puso un ID real de GA4.
export const analiticaDisponible = () =>
  !esPendiente(MARCA.googleAnalyticsId) && String(MARCA.googleAnalyticsId).trim().startsWith('G-')

// Si localStorage falla al guardar, la elección de esta visita se conserva en memoria.
let eleccionEnMemoria = null

// Devuelve "aceptado", "rechazado" o null (sin elección, o localStorage no disponible).
// Es la única fuente de la elección: la usan la lógica de carga, el banner y el footer.
export function leerConsentimiento() {
  if (eleccionEnMemoria) return eleccionEnMemoria
  try {
    const valor = window.localStorage.getItem(CLAVE)
    return valor === ACEPTADO || valor === RECHAZADO ? valor : null
  } catch {
    return null
  }
}

function guardarConsentimiento(valor) {
  try {
    window.localStorage.setItem(CLAVE, valor)
  } catch {
    // Sin localStorage el banner reaparece en cada visita; el sitio sigue funcionando.
  }
}

let cargada = false

export function cargarAnalitica(id = MARCA.googleAnalyticsId) {
  if (cargada || !analiticaDisponible() || leerConsentimiento() !== ACEPTADO) return
  cargada = true

  const idLimpio = String(id).trim()
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', idLimpio)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(idLimpio)}`
  document.head.appendChild(script)
}

export function aceptar() {
  eleccionEnMemoria = ACEPTADO
  guardarConsentimiento(ACEPTADO)
  cargarAnalitica()
}

export function rechazar() {
  eleccionEnMemoria = RECHAZADO
  guardarConsentimiento(RECHAZADO)
}

// El footer llama a esta función; el banner escucha el evento y se muestra de nuevo.
export const EVENTO_CONFIGURAR_COOKIES = 'abrir-configuracion-cookies'
export const abrirConfiguracionCookies = () => window.dispatchEvent(new CustomEvent(EVENTO_CONFIGURAR_COOKIES))

// Al iniciar la página: si el visitante ya aceptó antes, carga Analytics sin mostrar el banner.
export function iniciarAnalitica() {
  if (leerConsentimiento() === ACEPTADO) cargarAnalitica()
}
