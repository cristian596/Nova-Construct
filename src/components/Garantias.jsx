import { Building2, PaintRoller, Plug, ShieldCheck } from 'lucide-react'
import { GARANTIAS } from '../data/garantias.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'

const ICONOS = {
  'Obra civil': Building2,
  Acabados: PaintRoller,
  Instalaciones: Plug,
}

export default function Garantias() {
  return (
    <section id="garantias" aria-labelledby="garantias-titulo" className="bg-concrete py-20 lg:py-28">
      <div className={contenedor}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <ShieldCheck className="size-10 shrink-0 text-graphite" strokeWidth={2} aria-hidden="true" />
            <h2 id="garantias-titulo" className={tituloSeccion}>
              Garantía por escrito
            </h2>
          </div>
          <p className="mt-3 text-sm">Cobertura por concepto, desde la entrega</p>
          <p className="mt-5 text-lg leading-relaxed">
            Cada entrega incluye un acta con estos plazos. Si algo falla dentro de la cobertura, lo corregimos sin costo.
          </p>
          <p className="mt-6 border-t-2 border-graphite pt-3 text-sm font-semibold">
            Garantía por escrito en el acta de entrega
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {GARANTIAS.map((garantia) => {
            const Icono = ICONOS[garantia.concepto]
            const [cantidad, unidad] = garantia.plazo.split(' ')
            return (
              <li
                key={garantia.concepto}
                className="flex flex-col border border-graphite bg-white p-6 sm:last:col-span-2 lg:last:col-span-1"
              >
                <div className="flex items-center gap-3">
                  {Icono && <Icono className="size-8 shrink-0 text-graphite" strokeWidth={2} aria-hidden="true" />}
                  <h3 className="ancho-semi text-xl font-bold leading-tight">{garantia.concepto}</h3>
                </div>

                <div className="mt-6">
                  <p className="text-sm">Plazo</p>
                  <p className="ancho-condensado mt-1 inline-block bg-safety px-3 py-1 text-4xl font-extrabold leading-none tabular-nums text-graphite">
                    {cantidad} <span className="text-lg">{unidad}</span>
                  </p>
                </div>

                <p className="mt-6 text-base leading-relaxed">{garantia.cobertura}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
