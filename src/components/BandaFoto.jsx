import { MARCA } from '../data/marca.js'
import { ANCHOS_PROYECTO } from '../data/proyectos.js'
import { contenedor } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

const IMAGEN_BANDA = '/projects/edificio-cedritos.webp'

// La palabra de marca llena el ancho del marco sin recortarse a los lados: el tamaño baja con su largo
// (unos 0,7 em por letra en mayúsculas) y nunca pasa de 22vw ni de 20rem.
const TAMANO_PALABRA = `min(${Math.min(22, 115 / Math.max(1, MARCA.palabraFondo.length)).toFixed(2)}vw, 20rem)`

export default function BandaFoto() {
  const ref = useRevelar()

  return (
    <section ref={ref} className="py-24 lg:py-40">
      <div className={contenedor}>
        <div
          data-revelar
          className="relative isolate flex min-h-[30rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-graphite px-6 pt-6 text-white sm:px-10 sm:pt-10 lg:min-h-[40rem] lg:px-14 lg:pt-14"
        >
          {/* Decorativa: la frase es el texto que lee el lector de pantalla. */}
          <ImagenResponsiva
            src={IMAGEN_BANDA}
            anchos={ANCHOS_PROYECTO}
            sizes="100vw"
            alt=""
            width="960"
            height="1200"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 size-full object-cover object-[center_35%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite/60" />

          {/* TODO: confirmar con el cliente */}
          <p className="max-w-[22em] text-balance text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.15] tracking-[-0.02em]">
            Cada obra tiene un responsable, un presupuesto y un cronograma.
          </p>

          {/* Palabra de marca (marca.js → palabraFondo), recortada por el borde inferior del marco. */}
          <p
            aria-hidden="true"
            className="-mb-[0.22em] mt-16 select-none whitespace-nowrap font-light leading-[0.8] tracking-[-0.05em]"
            style={{ fontSize: TAMANO_PALABRA }}
          >
            {MARCA.palabraFondo}
          </p>
        </div>
      </div>
    </section>
  )
}
