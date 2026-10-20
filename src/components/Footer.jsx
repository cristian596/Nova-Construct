import { SECCIONES } from '../data/secciones.js'
import { contenedor } from '../lib/ui.js'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="bg-graphite py-14 text-white">
      <div className={`${contenedor} grid gap-10 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <Logo className="text-3xl" />
          <p className="mt-3 max-w-xs text-concrete">Remodelaciones, acabados, arquitectura y obra nueva.</p>
        </div>

        <nav aria-label="Secciones" className="lg:col-span-8">
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:-mr-3 lg:flex lg:justify-end lg:gap-x-2">
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a href={`#${seccion.id}`} className="flex min-h-11 items-center hover:underline lg:px-3">
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2 border-t border-cement pt-6 text-sm text-concrete sm:flex-row sm:items-center sm:justify-between lg:col-span-12">
          <p>© {new Date().getFullYear()} NOVA CONSTRUCT. Todos los derechos reservados.</p>
          {/* TODO: enlazar a la página real del aviso de privacidad. */}
          <a href="#aviso-de-privacidad" className="flex min-h-11 items-center underline underline-offset-4 hover:text-white">
            Aviso de privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}
