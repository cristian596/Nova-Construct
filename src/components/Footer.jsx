import { Link, useLocation } from 'react-router-dom'
import { MARCA, esPendiente } from '../data/marca.js'
import { PROYECTOS } from '../data/proyectos.js'
import { SECCIONES } from '../data/secciones.js'
import { abrirConfiguracionCookies } from '../lib/analitica.js'
import { AVISO_EXTERNO, POLITICA_EXTERNA } from '../lib/aviso.js'
import { contenedor } from '../lib/ui.js'
import Logo from './Logo.jsx'

const NOMBRES_REDES = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

// Sin proyectos la sección no existe, así que tampoco su enlace.
const ENLACES = SECCIONES.filter((seccion) => seccion.id !== 'proyectos' || PROYECTOS.length > 0)

// Solo se muestran las redes con enlace.
const REDES = Object.entries(MARCA.redes).filter(([, enlace]) => enlace)

// Identificación del proveedor: se omite el dato pendiente y, si ambos lo están, la línea completa.
const DATOS_LEGALES = [
  !esPendiente(MARCA.razonSocial) && `Razón social: ${MARCA.razonSocial}`,
  !esPendiente(MARCA.nit) && `NIT: ${MARCA.nit}`,
]
  .filter(Boolean)
  .join(' · ')

// El nombre de cierre se reduce cuando es largo, para que no ocupe media pantalla en el móvil.
const TAMANO_NOMBRE =
  MARCA.nombre.length > 30 ? 'text-[clamp(2rem,5.5vw,6rem)]' : 'text-[clamp(2.75rem,9.5vw,9.5rem)]'

const CLASE_AVISO = 'flex min-h-11 items-center underline underline-offset-4 transition-colors duration-200 hover:text-white'

export default function Footer() {
  // Fuera de la landing, los enlaces a secciones deben llevar de vuelta a ella.
  const raiz = useLocation().pathname === '/' ? '' : '/'

  return (
    <footer data-fondo="oscuro">
      <div className={contenedor}>
        <div className="rounded-t-[2rem] bg-graphite px-6 pb-6 pt-12 text-white sm:px-10 lg:px-14 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <p className="max-w-sm text-lg leading-relaxed text-concrete lg:col-span-4">{MARCA.eslogan}</p>

            <nav aria-label="Secciones" className="lg:col-span-8">
              <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:-mr-3 lg:flex lg:justify-end lg:gap-x-1">
                {ENLACES.map((seccion) => (
                  <li key={seccion.id}>
                    <a
                      href={`${raiz}#${seccion.id}`}
                      className="flex min-h-11 items-center rounded-full transition-colors duration-200 hover:bg-white hover:text-graphite lg:px-3"
                    >
                      {seccion.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* El nombre vuelve a todo el ancho como cierre de la página. */}
          <p className="mt-16 lg:mt-24">
            <Logo className={`block break-words leading-[0.9] tracking-[-0.04em] ${TAMANO_NOMBRE}`} />
          </p>

          {REDES.length > 0 && (
            <ul aria-label="Redes sociales" className="mt-10 flex flex-wrap gap-x-6">
              {REDES.map(([red, enlace]) => (
                <li key={red}>
                  <a
                    href={enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center underline underline-offset-4"
                  >
                    {NOMBRES_REDES[red] ?? red}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-white/10 px-5 py-4 text-sm text-concrete sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 break-words">
              <p>
                © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
              </p>
              {DATOS_LEGALES && <p className="mt-1">{DATOS_LEGALES}</p>}
            </div>
            <div className="flex shrink-0 flex-col sm:flex-row sm:gap-x-6">
              {AVISO_EXTERNO ? (
                <a href={MARCA.urlAvisoPrivacidad} className={CLASE_AVISO}>
                  Aviso de privacidad
                </a>
              ) : (
                <Link to={MARCA.urlAvisoPrivacidad} className={CLASE_AVISO}>
                  Aviso de privacidad
                </Link>
              )}
              {POLITICA_EXTERNA ? (
                <a href={MARCA.urlPoliticaDatos} className={CLASE_AVISO}>
                  Política de tratamiento de datos
                </a>
              ) : (
                <Link to={MARCA.urlPoliticaDatos} className={CLASE_AVISO}>
                  Política de tratamiento de datos
                </Link>
              )}
              <button type="button" onClick={abrirConfiguracionCookies} className={`${CLASE_AVISO} text-left`}>
                Configurar cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
