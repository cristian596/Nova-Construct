import { contenedor, tituloSeccion } from '../lib/ui.js'

const PASOS = [
  {
    titulo: 'Visita técnica',
    texto: 'Medimos, revisamos el estado de la obra y escuchamos lo que necesitas.',
  },
  {
    titulo: 'Diseño y planos',
    texto: 'Definimos distribución, materiales y acabados antes de mover un ladrillo.',
  },
  {
    titulo: 'Presupuesto cerrado',
    texto: 'Un valor fijo por escrito, con cronograma y forma de pago acordados.',
  },
  {
    titulo: 'Ejecución con avances semanales',
    texto: 'Cada semana recibes fotos, porcentaje de avance y próximos pasos.',
  },
  {
    titulo: 'Entrega y garantía',
    texto: 'Recorrido final, acta de entrega y garantía por escrito.',
  },
]

export default function Proceso() {
  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="bg-white py-20 lg:py-28">
      <div className={contenedor}>
        <div className="max-w-2xl">
          <h2 id="proceso-titulo" className={tituloSeccion}>
            Así trabajamos
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Cinco etapas, siempre en el mismo orden. Sabes qué sigue y cuándo.
          </p>
        </div>

        <ol className="mt-14 lg:mt-20 lg:grid lg:grid-cols-5">
          {PASOS.map((paso, indice) => (
            <li key={paso.titulo} className="group relative pb-10 pl-12 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-12">
              {/* Línea conectora: vertical en móvil, horizontal en escritorio */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-[11px] top-3 w-0.5 bg-graphite group-last:hidden lg:hidden"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-graphite group-last:right-auto group-last:w-6 lg:block"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 size-6 border-2 border-graphite bg-white group-last:bg-safety"
              />

              <span className="ancho-condensado block text-5xl font-extrabold leading-none tabular-nums">
                {String(indice + 1).padStart(2, '0')}
              </span>
              <h3 className="ancho-semi mt-3 text-xl font-bold leading-tight">{paso.titulo}</h3>
              <p className="mt-2 max-w-[38ch] leading-relaxed">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
