import { MARCA, esPendiente } from '../data/marca.js'
import { PROYECTOS } from '../data/proyectos.js'
import { botonPrimario, contenedor } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'
import TarjetaProyecto from './TarjetaProyecto.jsx'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// Cifras del hero: se omiten las pendientes y con menos de dos se oculta la fila.
const CIFRAS = MARCA.datosConfianza.filter((dato) => !esPendiente(dato.valor))

// TODO: reemplazar por una foto real de obra (mínimo 2400 px de ancho; ésta mide 1456 × 816 y se ve blanda al ampliarse).
const IMAGEN_HERO = '/placeholders/hero.webp'
// Anchos generados por `npm run imagenes` (no se amplía el original). Si cambias la foto, actualiza también el preload de index.html.
const ANCHOS_HERO = [480, 960, 1440]

// Dos líneas, cada una en su propio bloque: el titular nunca pasa de dos líneas.
const TITULAR = ['Remodelamos, terminamos', 'y entregamos en plazo.']

// Sin año de fundación no hay dato: se oculta la línea completa.
const DATO_FUNDACION = esPendiente(MARCA.anio_fundacion) ? null : `Desde ${MARCA.anio_fundacion}`

const HAY_PROYECTOS = PROYECTOS.length > 0

export default function Hero() {
  const ref = useRevelar()

  return (
    <section id="inicio" ref={ref} className="pt-16">
      <div className={`${contenedor} pt-8 sm:pt-12 lg:pt-14`}>
        <h1 className="text-[clamp(1.5rem,8vw,7.25rem)] font-light leading-[0.98] tracking-[-0.04em]">
          {TITULAR.map((linea) => (
            <span key={linea} data-revelar className="block">
              {linea}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div data-revelar className="max-w-xl">
            <p className="text-pretty text-lg leading-relaxed sm:text-xl">{MARCA.eslogan}</p>
            {DATO_FUNDACION && <p className="mt-2 font-semibold tabular-nums">{DATO_FUNDACION}</p>}
          </div>

          <div data-revelar className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            {CIFRAS.length >= 2 && (
              <ul aria-label="Datos de la empresa" className="flex flex-wrap gap-x-8 gap-y-4">
                {CIFRAS.map((dato) => (
                  <li key={dato.etiqueta} className="min-w-0">
                    <p className="break-words text-4xl font-light leading-none tracking-[-0.03em] tabular-nums">{dato.valor}</p>
                    <p className="mt-1 text-sm">{dato.etiqueta}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <a href="#cotizador" className={botonPrimario}>
                Cotizar mi proyecto
              </a>
              {HAY_PROYECTOS && (
                <a
                  href="#proyectos"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold transition-[transform,background-color,color] duration-200 hover:bg-graphite hover:text-white motion-safe:active:scale-[0.97] motion-reduce:transition-none"
                >
                  Ver proyectos
                </a>
              )}
            </div>
          </div>
        </div>

        <div
          data-revelar
          className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] bg-cement sm:aspect-[16/10] lg:mt-12 lg:aspect-auto lg:h-[min(48rem,78svh)] lg:min-h-[34rem]"
        >
          <ImagenResponsiva
            src={IMAGEN_HERO}
            anchos={ANCHOS_HERO}
            sizes="100vw"
            alt=""
            width="1456"
            height="816"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover object-[62%_center]"
          />

          {/* Tarjeta de proyectos: solo escritorio, en la esquina superior derecha de la foto. */}
          {HAY_PROYECTOS && (
            <div className="absolute right-6 top-6 hidden lg:block">
              <TarjetaProyecto />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
