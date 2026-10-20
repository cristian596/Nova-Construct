import { contenedor, tituloSeccion } from '../lib/ui.js'

const SERVICIOS = [
  {
    tipo: 'remodelacion',
    titulo: 'Remodelación',
    descripcion:
      'Renovamos casas, apartamentos y locales: demolición, redistribución y obra limpia. Trabajamos con cronograma firmado desde el primer día.',
  },
  {
    tipo: 'acabados',
    titulo: 'Acabados',
    descripcion:
      'Pisos, enchapes, pintura, carpintería y cielos rasos. Los materiales quedan definidos en el presupuesto, sin cambios de último minuto.',
  },
  {
    tipo: 'arquitectura',
    titulo: 'Arquitectura',
    descripcion:
      'Diseño, planos y trámite de licencias. Pasas de la idea a un proyecto listo para presupuestar y construir.',
  },
  {
    tipo: 'obra-nueva',
    titulo: 'Obra nueva',
    descripcion:
      'Vivienda, local u oficina desde la cimentación hasta la entrega. Control de calidad y registro en cada etapa de la obra.',
  },
]

export default function Servicios({ onCotizar }) {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="bg-white py-20 lg:py-28">
      <div className={contenedor}>
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="servicios-titulo" className={`${tituloSeccion} lg:col-span-6`}>
            Un solo equipo, de los planos a la entrega
          </h2>
          <p className="max-w-xl text-lg leading-relaxed lg:col-span-5 lg:col-start-8 lg:self-end">
            Diseñamos, construimos y terminamos con el mismo equipo. Un responsable, un presupuesto y un cronograma.
          </p>
        </div>

        <ul className="mt-14 border-b border-graphite lg:mt-20">
          {SERVICIOS.map((servicio) => (
            <li
              key={servicio.tipo}
              className="grid gap-3 border-t border-graphite py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6 lg:py-9"
            >
              <h3 className="ancho-semi text-3xl font-bold leading-none sm:col-span-4 lg:text-4xl">
                {servicio.titulo}
              </h3>
              <p className="max-w-[60ch] leading-relaxed sm:col-span-8 lg:col-span-6">{servicio.descripcion}</p>
              <a
                href="#cotizador"
                onClick={() => onCotizar(servicio.tipo)}
                className="group inline-flex min-h-11 items-center gap-2 justify-self-start font-semibold underline decoration-safety decoration-2 underline-offset-[6px] sm:col-span-8 sm:col-start-5 lg:col-span-2 lg:justify-self-end"
              >
                Cotizar<span className="sr-only"> {servicio.titulo.toLowerCase()}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 10h13M11 5l5 5-5 5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
