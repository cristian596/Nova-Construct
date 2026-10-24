import { useEffect, useRef, useState } from 'react'
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
import { botonSecundario } from '../lib/ui.js'

const CLASE_ENLACE = 'underline underline-offset-4 hover:text-concrete'

// Propiedad que Google Analytics lee para dejar de medir en la página actual.
const claveDesactivar = () => `ga-disable-${String(MARCA.googleAnalyticsId).trim()}`

export default function BannerCookies() {
  const disponible = analiticaDisponible()
  const [visible, setVisible] = useState(() => disponible && leerConsentimiento() === null)
  // Decisión vigente: se muestra en el banner cuando el visitante lo abre para cambiarla.
  const [decision, setDecision] = useState(() => (disponible ? leerConsentimiento() : null))
  // Solo se muestra cuando el visitante pasa de "aceptado" a "rechazado" sin recargar.
  const [pedirRecarga, setPedirRecarga] = useState(false)
  const primerBoton = useRef(null)
  const origen = useRef(null)
  const abiertoPorUsuario = useRef(false)

  // Con el ID pendiente el banner se puede abrir desde el footer, pero no guarda ni carga nada.
  useEffect(() => {
    const abrir = () => {
      origen.current = document.activeElement
      abiertoPorUsuario.current = true
      setDecision(disponible ? leerConsentimiento() : null)
      setPedirRecarga(false)
      setVisible(true)
    }
    window.addEventListener(EVENTO_CONFIGURAR_COOKIES, abrir)
    return () => window.removeEventListener(EVENTO_CONFIGURAR_COOKIES, abrir)
  }, [disponible])

  // Al abrirlo desde el footer, el foco va al primer botón del banner.
  useEffect(() => {
    if (visible && abiertoPorUsuario.current) primerBoton.current?.focus()
  }, [visible])

  const cerrar = () => {
    setVisible(false)
    setPedirRecarga(false)
    if (abiertoPorUsuario.current) origen.current?.focus?.()
    abiertoPorUsuario.current = false
  }

  // Escape cierra solo si ya hay una decisión guardada (o si no hay Analytics que decidir).
  const puedeCerrar = !disponible || decision !== null
  useEffect(() => {
    if (!visible || !puedeCerrar) return undefined
    const alTeclear = (evento) => {
      if (evento.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [visible, puedeCerrar])

  if (!visible) return null

  const elegirAceptar = () => {
    if (!disponible) return cerrar()
    window[claveDesactivar()] = false
    aceptar() // guarda la elección y carga Analytics si aún no estaba cargado
    setDecision('aceptado')
    return cerrar()
  }

  const elegirRechazar = () => {
    if (!disponible) return cerrar()
    const veniaAceptado = leerConsentimiento() === 'aceptado'
    rechazar()
    setDecision('rechazado')
    if (veniaAceptado) {
      window[claveDesactivar()] = true
      setPedirRecarga(true)
      return undefined
    }
    return cerrar()
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
          {decision && (
            <span className="mt-2 block text-sm text-concrete">
              Tu decisión actual: {decision === 'aceptado' ? 'cookies aceptadas' : 'cookies rechazadas'}.
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3 md:shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button ref={primerBoton} type="button" onClick={elegirRechazar} className={botonSecundario}>
              Rechazar
            </button>
            <button type="button" onClick={elegirAceptar} className={botonSecundario}>
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
