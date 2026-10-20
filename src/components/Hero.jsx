import { Fragment } from 'react'
import { botonPrimario, botonSecundario, contenedor } from '../lib/ui.js'

// TODO: reemplazar por una foto real de obra (16:9, mínimo 1920×1080 px).
const IMAGEN_HERO = '/placeholders/hero.svg'

// Cada fragmento entra con 60 ms de diferencia: 3 × 60 + 400 = 580 ms en total.
const TITULAR = ['Remodelamos,', 'terminamos', 'y entregamos', 'en plazo.']

export default function Hero() {
  return (
    <section id="inicio" className="bg-graphite pt-16">
      <div className="relative isolate flex aspect-[3/4] min-h-[32rem] w-full items-end overflow-hidden sm:aspect-[16/10] sm:min-h-0 lg:aspect-[16/8] lg:max-h-[52rem]">
        <img
          src={IMAGEN_HERO}
          alt=""
          width="1600"
          height="900"
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite/50" />

        <div className={`${contenedor} pb-12 pt-16 text-white sm:pb-16 lg:pb-20`}>
          <h1 className="ancho-condensado max-w-[14ch] text-[3.25rem] font-extrabold leading-[0.9] sm:text-7xl lg:max-w-[21ch] lg:text-[6.5rem]">
            {TITULAR.map((fragmento, indice) => (
              <Fragment key={fragmento}>
                {indice > 0 && ' '}
                <span
                  className="inline-block animate-revelar motion-reduce:animate-none"
                  style={{ animationDelay: `${indice * 60}ms` }}
                >
                  {fragmento}
                </span>
              </Fragment>
            ))}
          </h1>
          {/* Fondo grafito sólido: garantiza AA aunque la foto sea clara en esta zona. */}
          <p className="-mx-4 mt-6 max-w-xl bg-graphite px-4 py-3 text-lg leading-snug sm:text-xl">
            Remodelaciones, acabados, arquitectura y obra nueva con presupuesto cerrado y avances cada semana.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#cotizador" className={botonPrimario}>
              Cotizar mi proyecto
            </a>
            <a href="#proyectos" className={botonSecundario}>
              Ver proyectos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
