import { contenedor } from '../lib/ui.js'

const IMAGEN_BANDA = '/projects/edificio-cedritos.webp'

export default function BandaFoto() {
  return (
    <section className="relative isolate flex h-[40vh] min-h-64 w-full items-center overflow-hidden bg-graphite lg:h-[60vh]">
      {/* Decorativa: la frase de abajo es el texto que lee el lector de pantalla. */}
      <img
        src={IMAGEN_BANDA}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover motion-safe:animate-zoom-lento"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite/70" />

      <div className={contenedor}>
        {/* TODO: confirmar con el cliente */}
        <p className="ancho-condensado max-w-3xl text-3xl font-extrabold leading-[1] text-white sm:text-5xl lg:text-6xl">
          Cada obra tiene un responsable, un presupuesto y un cronograma.
        </p>
      </div>
    </section>
  )
}
