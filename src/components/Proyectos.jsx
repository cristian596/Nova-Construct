import { useRef, useState } from 'react'
import { PROYECTOS } from '../data/proyectos.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'
import Cota from './Cota.jsx'

// Mismo margen que `contenedor` (max-w-7xl centrado), aplicado al carril con scroll
// para que el primer proyecto quede alineado con el título.
const ALINEACION = [
  'px-4 scroll-px-4 sm:px-8 sm:scroll-px-8',
  'lg:px-[max(3rem,calc((100%-80rem)/2+3rem))] lg:scroll-px-[max(3rem,calc((100%-80rem)/2+3rem))]',
].join(' ')

function BotonDesplazar({ direccion, onClick }) {
  const anterior = direccion < 0
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={anterior ? 'Ver proyectos anteriores' : 'Ver más proyectos'}
      className="flex size-12 items-center justify-center border-2 border-graphite text-graphite transition-colors hover:bg-graphite hover:text-white"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={anterior ? 'M17 10H4M9 5l-5 5 5 5' : 'M3 10h13M11 5l5 5-5 5'} />
      </svg>
    </button>
  )
}

// Marco 4:5 que se conserva aunque la imagen falle: queda el fondo cement y la leyenda de abajo.
// Etiqueta, degradado y marco son decorativos (aria-hidden): la misma información está en la leyenda.
function ImagenProyecto({ src, alt, tipo, m2, semanas }) {
  const [fallo, setFallo] = useState(false)

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden bg-cement"
      {...(fallo && { role: 'img', 'aria-label': alt })}
    >
      {!fallo && (
        <img
          src={src}
          alt={alt}
          width="960"
          height="1200"
          loading="lazy"
          onError={() => setFallo(true)}
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-within:scale-[1.04]"
        />
      )}

      <span
        aria-hidden="true"
        className="absolute left-0 top-0 z-10 bg-safety px-3 py-1 text-sm font-semibold text-graphite"
      >
        {tipo}
      </span>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-graphite via-graphite/70 to-transparent px-4 pb-4 pt-16 text-sm font-semibold tabular-nums text-white opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
      >
        {m2} m² · {semanas} semanas
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border border-transparent group-focus-within:border-graphite"
      />
    </div>
  )
}

export default function Proyectos() {
  const pistaRef = useRef(null)

  const desplazar = (direccion) => {
    const pista = pistaRef.current
    const item = pista?.querySelector('li')
    if (!item) return
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    pista.scrollBy({ left: direccion * (item.offsetWidth + 24), behavior: reducido ? 'auto' : 'smooth' })
  }

  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="overflow-hidden bg-concrete py-20 lg:py-28">
      <div className={contenedor}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 id="proyectos-titulo" className={tituloSeccion}>
              Obras entregadas
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Área, tipo de trabajo y tiempo real de ejecución de cada proyecto.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <BotonDesplazar direccion={-1} onClick={() => desplazar(-1)} />
            <BotonDesplazar direccion={1} onClick={() => desplazar(1)} />
          </div>
        </div>

        <Cota valor={`${PROYECTOS.length} proyectos`} className="mt-10 lg:mt-14" />
      </div>

      <div
        ref={pistaRef}
        role="region"
        aria-label="Galería de proyectos, desplazable horizontalmente"
        tabIndex={0}
        className={`mt-8 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-6 pt-2 ${ALINEACION} [scrollbar-color:#8B8F94_transparent] [scrollbar-width:thin]`}
      >
        <ul className="flex w-max gap-6">
          {PROYECTOS.map((proyecto) => (
            <li key={proyecto.nombre} className="w-[min(78vw,20rem)] shrink-0 snap-start lg:w-[19.5rem]">
              <figure
                tabIndex={0}
                className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safety"
              >
                <ImagenProyecto
                  src={proyecto.imagen}
                  alt={proyecto.alt}
                  tipo={proyecto.tipo}
                  m2={proyecto.m2}
                  semanas={proyecto.semanas}
                />
                {/* graphite y no cement: cement sobre concrete da 2,8:1 y no cumple AA. */}
                <p className="mt-2 text-xs text-graphite">Ilustración de ejemplo</p>
                <figcaption className="mt-3 border-t border-graphite pt-4">
                  <h3 className="ancho-semi text-2xl font-bold leading-tight">{proyecto.nombre}</h3>
                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                    <div>
                      <dt>Tipo</dt>
                      <dd className="mt-0.5 font-semibold">{proyecto.tipo}</dd>
                    </div>
                    <div>
                      <dt>Área</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">{proyecto.m2} m²</dd>
                    </div>
                    <div>
                      <dt>Duración</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">{proyecto.semanas} semanas</dd>
                    </div>
                  </dl>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
