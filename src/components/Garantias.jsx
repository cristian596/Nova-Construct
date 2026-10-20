import { GARANTIAS } from '../data/garantias.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'
import Cota from './Cota.jsx'

const maximo = Math.max(...GARANTIAS.map((garantia) => garantia.anios))

export default function Garantias() {
  return (
    <section id="garantias" aria-labelledby="garantias-titulo" className="bg-concrete py-20 lg:py-28">
      <div className={`${contenedor} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-4">
          <h2 id="garantias-titulo" className={tituloSeccion}>
            Garantía por escrito
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Cada entrega incluye un acta con estos plazos. Si algo falla dentro de la cobertura, lo corregimos sin costo.
          </p>
        </div>

        <div className="lg:col-span-8">
          <Cota valor={`hasta ${maximo} años`} className="mb-8" />
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Plazos y coberturas de garantía</caption>
            <thead>
              <tr className="border-b-2 border-graphite text-sm">
                <th scope="col" className="w-[30%] py-3 pr-4 font-semibold">
                  Concepto
                </th>
                <th scope="col" className="w-[20%] py-3 pr-4 font-semibold">
                  Plazo
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Cobertura
                </th>
              </tr>
            </thead>
            <tbody>
              {GARANTIAS.map((garantia) => (
                <tr key={garantia.concepto} className="border-b border-graphite align-baseline">
                  <th scope="row" className="ancho-semi py-5 pr-4 text-lg font-bold sm:text-xl">
                    {garantia.concepto}
                  </th>
                  <td className="ancho-condensado whitespace-nowrap py-5 pr-4 text-2xl font-extrabold tabular-nums sm:text-3xl">
                    {garantia.plazo}
                  </td>
                  <td className="py-5 text-sm leading-relaxed sm:text-base">{garantia.cobertura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
