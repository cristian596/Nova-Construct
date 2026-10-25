import { ANCHOS_PROYECTO } from '../data/proyectos.js'
import { contenedor, entradilla, tituloSeccion } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// imagen: foto de public/projects/ que acompaña al servicio cuando su celda lleva foto.
const SERVICIOS = [
  {
    tipo: 'remodelacion',
    titulo: 'Remodelación',
    descripcion:
      'Renovamos casas, apartamentos y locales: demolición, redistribución y obra limpia. Trabajamos con cronograma firmado desde el primer día.',
    imagen: '/projects/apartamento-chico.webp',
  },
  {
    tipo: 'acabados',
    titulo: 'Acabados',
    descripcion:
      'Pisos, enchapes, pintura, carpintería y cielos rasos. Los materiales quedan definidos en el presupuesto, sin cambios de último minuto.',
    imagen: '/projects/oficina-cra-11.webp',
  },
  {
    tipo: 'arquitectura',
    titulo: 'Arquitectura',
    descripcion:
      'Diseño, planos y trámite de licencias. Pasas de la idea a un proyecto listo para presupuestar y construir.',
    imagen: '/projects/local-laureles.webp',
  },
  {
    tipo: 'obra-nueva',
    titulo: 'Obra nueva',
    descripcion:
      'Vivienda, local u oficina desde la cimentación hasta la entrega. Control de calidad y registro en cada etapa de la obra.',
    imagen: '/projects/casa-llanogrande.webp',
  },
]

// Los dos primeros servicios van en celdas de texto junto a la presentación; el resto, en celdas con foto.
const DE_TEXTO = SERVICIOS.slice(0, 2)
const CON_FOTO = SERVICIOS.slice(2)

// Anchos de columna en escritorio según cuántas celdas hay, para que la rejilla siempre se cierre.
const anchoTexto = DE_TEXTO.length === 1 ? 'lg:col-span-12 xl:col-span-6' : 'lg:col-span-6 xl:col-span-3'
const anchosFoto = { 1: ['lg:col-span-12'], 2: ['lg:col-span-8', 'lg:col-span-4'] }
const anchoFoto = (indice) => anchosFoto[CON_FOTO.length]?.[indice] ?? 'lg:col-span-4'

function EnlaceCotizar({ servicio, onCotizar, claro = false }) {
  return (
    <a
      href="#cotizador"
      onClick={() => onCotizar(servicio.tipo)}
      className={`group/enlace inline-flex min-h-11 items-center gap-2 self-start rounded-full font-semibold transition-transform duration-200 motion-safe:active:scale-[0.97] motion-reduce:transition-none ${
        claro ? 'text-white' : ''
      }`}
    >
      Cotizar<span className="sr-only"> {servicio.titulo.toLowerCase()}</span>
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-safety text-graphite transition-transform duration-200 group-hover/enlace:translate-x-1 motion-reduce:transition-none"
      >
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 10h11M11 6l4 4-4 4" />
        </svg>
      </span>
    </a>
  )
}

export default function Servicios({ onCotizar }) {
  const ref = useRevelar()

  return (
    <section id="servicios" ref={ref} aria-labelledby="servicios-titulo" className="relative z-10 pt-3 lg:-mt-48">
      <div className={contenedor}>
        <ul className="grid gap-3 lg:grid-cols-12 lg:px-6">
          <li data-revelar className="flex flex-col justify-between gap-10 rounded-3xl bg-white p-5 sm:p-8 lg:col-span-12 lg:min-h-[22rem] lg:p-10 xl:col-span-6">
            <h2 id="servicios-titulo" className={tituloSeccion}>
              Un solo equipo, de los planos a la entrega
            </h2>
            <p className={`${entradilla} max-w-md`}>
              Diseñamos, construimos y terminamos con el mismo equipo. Un responsable, un presupuesto y un cronograma.
            </p>
          </li>

          {DE_TEXTO.map((servicio) => (
            <li
              key={servicio.tipo}
              data-revelar
              className={`flex flex-col justify-between gap-8 rounded-3xl bg-white p-6 sm:p-8 ${anchoTexto}`}
            >
              <h3 className="text-2xl font-light leading-tight tracking-[-0.02em]">{servicio.titulo}</h3>
              <div className="flex flex-col gap-5">
                <p className="leading-relaxed">{servicio.descripcion}</p>
                <EnlaceCotizar servicio={servicio} onCotizar={onCotizar} />
              </div>
            </li>
          ))}

          {CON_FOTO.map((servicio, indice) => (
            <li
              key={servicio.tipo}
              data-revelar
              data-fondo="oscuro"
              className={`relative isolate flex min-h-[24rem] flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-graphite p-6 text-white sm:p-8 lg:min-h-[26rem] ${anchoFoto(indice)}`}
            >
              <ImagenResponsiva
                src={servicio.imagen}
                anchos={ANCHOS_PROYECTO}
                sizes="(min-width: 1024px) 60vw, 100vw"
                alt=""
                width="960"
                height="1200"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 size-full object-cover"
              />
              {/* Velo plano para que el texto blanco se lea sobre cualquier foto. */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite/55" />
              <h3 className="text-2xl font-light leading-tight tracking-[-0.02em]">{servicio.titulo}</h3>
              <div className="flex max-w-md flex-col gap-5">
                <p className="leading-relaxed">{servicio.descripcion}</p>
                <EnlaceCotizar servicio={servicio} onCotizar={onCotizar} claro />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
