import { MARCA, esPendiente } from '../data/marca.js'
import { contenedor } from '../lib/ui.js'

// Se muestran solo las cifras ya completadas; con menos de dos la franja pierde sentido y se oculta.
const DATOS = MARCA.datosConfianza.filter((dato) => !esPendiente(dato.valor))

export default function DatosConfianza() {
  if (DATOS.length < 2) return null

  return (
    <section aria-label="Datos de la empresa" className="bg-concrete text-graphite">
      <ul className={`${contenedor} flex flex-col sm:flex-row`}>
        {DATOS.map((dato) => (
          <li
            key={dato.etiqueta}
            className="flex-1 border-t border-cement py-6 first:border-t-0 sm:border-l sm:border-t-0 sm:px-8 sm:py-8 sm:first:border-l-0 sm:first:pl-0"
          >
            <p className="ancho-condensado text-5xl font-extrabold leading-none tabular-nums">{dato.valor}</p>
            <p className="mt-2 text-sm">{dato.etiqueta}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
