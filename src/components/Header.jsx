import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MARCA } from '../data/marca.js'
import { SECCIONES } from '../data/secciones.js'
import { botonPrimario, contenedor } from '../lib/ui.js'
import Logo from './Logo.jsx'

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cement bg-white">
      <div className={`${contenedor} flex h-16 items-center justify-between gap-6`}>
        <a href={`${raiz}#inicio`}className="flex min-h-11 items-center" aria-label={`${MARCA.nombre}, ir al inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a
                  href={`${raiz}#${seccion.id}`}
                  className="flex min-h-11 items-center px-3 text-[0.9375rem] font-medium underline-offset-[6px] hover:underline"
                >
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`${raiz}#cotizador`} className={`${botonPrimario} hidden min-h-11 py-2 sm:inline-flex`}>
            Cotizar proyecto
          </a>
          <button
            ref={botonRef}
            type="button"
            className="-mr-2 flex size-11 items-center justify-center lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((valor) => !valor)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              {abierto ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="menu-movil"
        aria-label="Principal"
        className={`${abierto ? 'block' : 'hidden'} max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-cement bg-white lg:hidden`}
      >
        <ul className={`${contenedor} py-2`}>
          {SECCIONES.map((seccion) => (
            <li key={seccion.id} className="border-b border-concrete last:border-b-0">
              <a href={`${raiz}#${seccion.id}`} onClick={cerrar} className="flex min-h-12 items-center text-lg font-medium">
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
