import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MARCA } from '../data/marca.js'
import {
  EVENTO_CONFIGURAR_COOKIES,
  aceptar,
  analiticaDisponible,
  leerConsentimiento,
  rechazar,
} from '../lib/analitica.js'
import { POLITICA_EXTERNA } from '../lib/aviso.js'
import { botonPrimario, botonSecundario } from '../lib/ui.js'

const CLASE_ENLACE = 'underline underline-offset-4 hover:text-concrete'

// Propiedad que Google Analytics lee para dejar de medir en la página actual.
const claveDesactivar = () => `ga-disable-${String(MARCA.googleAnalyticsId).trim()}`

export default function BannerCookies() {
  const [visible, setVisible] = useState(() => analiticaDisponible() && leerConsentimiento() === null)
  // Solo se muestra cuando el visitante pasa de "aceptado" a "rechazado" sin recargar.
  const [pedirRecarga, setPedirRecarga] = useState(false)

  useEffect(() => {
    if (!analiticaDisponible()) return undefined
    const abrir = () => {
      setPedirRecarga(false)
      setVisible(true)
    }
    window.addEventListener(EVENTO_CONFIGURAR_COOKIES, abrir)
    return () => window.removeEventListener(EVENTO_CONFIGURAR_COOKIES, abrir)
  }, [])

  if (!visible) return null

  const elegirAceptar = () => {
    window[claveDesactivar()] = false
    aceptar() // guarda la elección y carga Analytics si aún no estaba cargado
    setPedirRecarga(false)
    setVisible(false)
  }

  const elegirRechazar = () => {
    const veniaAceptado = leerConsentimiento() === 'aceptado'
    rechazar()
    if (veniaAceptado) {
      window[claveDesactivar()] = true
      setPedirRecarga(true)
      return
    }
    setVisible(false)
  }

  return (
    <section
      aria-label="Cookies de análisis"
      data-fondo="oscuro"
      className="fixed inset-x-0 bottom-0 z-[55] bg-graphite p-4 text-white"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl">
          Usamos cookies de análisis de Google para entender cómo se usa este sitio. Puedes aceptar o rechazarlas. Más
          información en la{' '}
          {POLITICA_EXTERNA ? (
            <a href={MARCA.urlPoliticaDatos} className={CLASE_ENLACE}>
              Política de tratamiento de datos
            </a>
          ) : (
            <Link to={MARCA.urlPoliticaDatos} className={CLASE_ENLACE}>
              Política de tratamiento de datos
            </Link>
          )}
          .
        </p>
        <div className="flex flex-col gap-3 md:shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={elegirRechazar} className={botonSecundario}>
              Rechazar
            </button>
            <button type="button" onClick={elegirAceptar} className={botonPrimario}>
              Aceptar
            </button>
          </div>
          {pedirRecarga && (
            <p role="status" className="text-sm text-concrete">
              Para dejar de medir por completo, recarga la página.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
