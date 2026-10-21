import { Link, useLocation } from 'react-router-dom'
import { MARCA } from '../data/marca.js'
import { SECCIONES } from '../data/secciones.js'
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

// Solo se muestran las redes con enlace.
const REDES = Object.entries(MARCA.redes).filter(([, enlace]) => enlace)

const CLASE_AVISO = 'flex min-h-11 items-center underline underline-offset-4 hover:text-white'

export default function Footer() {
  // Fuera de la landing, los enlaces a secciones deben llevar de vuelta a ella.
  const raiz = useLocation().pathname === '/' ? '' : '/'

  return (
    <footer data-fondo="oscuro" className="bg-graphite py-14 text-white">
      <div className={`${contenedor} grid gap-10 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <Logo className="text-3xl" />
          <p className="mt-3 max-w-sm text-concrete">{MARCA.eslogan}</p>
        </div>

        <nav aria-label="Secciones" className="lg:col-span-8">
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:-mr-3 lg:flex lg:justify-end lg:gap-x-2">
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a href={`${raiz}#${seccion.id}`} className="flex min-h-11 items-center hover:underline lg:px-3">
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {REDES.length > 0 && (
          <ul aria-label="Redes sociales" className="flex flex-wrap gap-x-6 lg:col-span-12">
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

        <div className="flex flex-col gap-2 border-t border-cement pt-6 text-sm text-concrete sm:flex-row sm:items-center sm:justify-between lg:col-span-12">
          <p>
            © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-x-6">
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
          </div>
        </div>
      </div>
    </footer>
  )
}
