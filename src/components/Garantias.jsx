import { GARANTIAS } from '../data/garantias.js'
import { ANCHOS_PROYECTO } from '../data/proyectos.js'
import { contenedor, entradilla, tituloSeccion } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// Fotos apiladas junto a la lista (decorativas: la información está en el texto).
const FOTOS = [
  { src: '/projects/casa-el-penon.webp', alto: 'lg:h-44', encuadre: 'object-[center_30%]' },
  { src: '/projects/edificio-cedritos.webp', alto: 'lg:h-72', encuadre: 'object-[center_40%]' },
  { src: '/projects/apartamento-chico.webp', alto: 'lg:h-44', encuadre: 'object-center' },
]

export default function Garantias() {
  const ref = useRevelar()

  return (
    <section id="garantias" ref={ref} aria-labelledby="garantias-titulo" className="pb-24 lg:pb-40">
      <div className={contenedor}>
        <div className="grid gap-10 rounded-[2rem] bg-safety/15 p-5 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
          <div className="lg:col-span-7">
            <h2 id="garantias-titulo" data-revelar className={tituloSeccion}>
              Garantía por escrito
            </h2>
            <p data-revelar className={`${entradilla} mt-6 max-w-xl`}>
              Cobertura por concepto, desde la entrega. Cada entrega incluye un acta con estos plazos. Si algo falla
              dentro de la cobertura, lo corregimos sin costo.
            </p>

            <ul data-revelar className="mt-10 flex flex-col gap-3">
              {GARANTIAS.map((garantia) => (
                <li
                  key={garantia.concepto}
                  className="grid gap-x-8 gap-y-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6"
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-2xl font-light leading-tight tracking-[-0.02em]">{garantia.concepto}</h3>
                    <p className="mt-2 leading-relaxed">{garantia.cobertura}</p>
                  </div>
                  <p className="text-4xl font-light leading-none tracking-[-0.03em] tabular-nums sm:text-right sm:text-5xl">
                    {garantia.plazo}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-semibold">Garantía por escrito en el acta de entrega</p>
          </div>

          <div data-revelar className="grid grid-cols-3 gap-3 lg:col-span-5 lg:flex lg:flex-col lg:justify-center">
            {FOTOS.map((foto) => (
              <div key={foto.src} className={`aspect-square overflow-hidden rounded-3xl bg-cement lg:aspect-auto ${foto.alto}`}>
                <ImagenResponsiva
                  src={foto.src}
                  anchos={ANCHOS_PROYECTO}
                  sizes="(min-width: 1024px) 30vw, 33vw"
                  alt=""
                  width="960"
                  height="1200"
                  loading="lazy"
                  decoding="async"
                  className={`size-full object-cover ${foto.encuadre}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
