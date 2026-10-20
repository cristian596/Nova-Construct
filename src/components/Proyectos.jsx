import { useRef } from 'react'
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
        className={`mt-8 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-6 ${ALINEACION} [scrollbar-color:#8B8F94_transparent] [scrollbar-width:thin]`}
      >
        <ul className="flex w-max gap-6">
          {PROYECTOS.map((proyecto) => (
            <li key={proyecto.nombre} className="w-[min(78vw,20rem)] shrink-0 snap-start lg:w-[19.5rem]">
              <figure>
                <img
                  src={proyecto.imagen}
                  alt={proyecto.alt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  className="aspect-[4/5] w-full bg-cement object-cover"
                />
                <figcaption className="mt-4 border-t border-graphite pt-4">
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
