import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MARCA } from '../data/marca.js'
import { PROYECTOS } from '../data/proyectos.js'
import { SECCIONES } from '../data/secciones.js'
import { botonPrimario, contenedor } from '../lib/ui.js'
import Logo from './Logo.jsx'

// Sin proyectos la sección no existe, así que tampoco su enlace.
const ENLACES = SECCIONES.filter((seccion) => seccion.id !== 'proyectos' || PROYECTOS.length > 0)

// Con un nombre largo el logotipo baja de tamaño y se corta en dos líneas (el nombre completo está en
// el aria-label y en el footer).
const TAMANO_LOGO = MARCA.nombre.length > 24 ? 'text-base xl:text-lg' : 'text-lg sm:text-2xl'

const claseEnlace =
  'flex min-h-11 items-center rounded-full px-3 text-base font-medium transition-colors duration-200 hover:bg-white motion-reduce:transition-none'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const botonRef = useRef(null)
  // Fuera de la landing, los enlaces a secciones deben llevar de vuelta a ella.
  const raiz = useLocation().pathname === '/' ? '' : '/'

  useEffect(() => {
    if (!abierto) return
    const alPresionar = (evento) => {
      if (evento.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [abierto])

  const cerrar = () => setAbierto(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-concrete">
      <div className={`${contenedor} flex h-16 items-center justify-between gap-3 sm:gap-6`}>
        <a
          href={`${raiz}#inicio`}
          className="flex min-h-11 min-w-0 items-center"
          aria-label={`${MARCA.nombre}, ir al inicio`}
        >
          <Logo className={`line-clamp-2 break-words leading-tight tracking-[-0.02em] lg:max-w-[16rem] xl:max-w-sm ${TAMANO_LOGO}`} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {ENLACES.map((seccion) => (
              <li key={seccion.id}>
                <a href={`${raiz}#${seccion.id}`} className={claseEnlace}>
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <a href={`${raiz}#cotizador`} className={`${botonPrimario} min-h-11 px-5 py-2 sm:px-6`}>
            <span>
              Cotizar<span className="sr-only sm:not-sr-only">&nbsp;proyecto</span>
            </span>
          </a>
          <button
            ref={botonRef}
            type="button"
            className="-mr-2 flex size-11 items-center justify-center rounded-full transition-transform duration-200 motion-safe:active:scale-95 lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((valor) => !valor)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="menu-movil"
        aria-label="Principal"
        className={`${abierto ? 'block' : 'hidden'} max-h-[calc(100svh-4rem)] overflow-y-auto bg-concrete lg:hidden`}
      >
        <ul className={`${contenedor} pb-2`}>
          {ENLACES.map((seccion) => (
            <li key={seccion.id}>
              <a
                href={`${raiz}#${seccion.id}`}
                onClick={cerrar}
                className="flex min-h-12 items-center text-2xl font-light tracking-[-0.02em]"
              >
                {seccion.nombre}
              </a>
            </li>
          ))}
        </ul>
        <div className={`${contenedor} pb-5 sm:hidden`}>
          <a href={`${raiz}#cotizador`} onClick={cerrar} className={`${botonPrimario} w-full`}>
            Cotizar proyecto
          </a>
        </div>
      </nav>
    </header>
  )
}
