import { M2 } from '../data/cotizador.js'

// Mitad del ancho del cursor (w-6 = 24 px). El dibujo de la cota se inserta
// esa distancia a cada lado para que las marcas coincidan con el centro del cursor.
const MITAD_CURSOR = 12
const ETIQUETAS = [20, 50, 100, 150, 200, 250, 300]
const MARCAS = Array.from({ length: (M2.max - M2.min) / M2.marca + 1 }, (_, i) => M2.min + i * M2.marca)

const posicion = (valor) => (valor - M2.min) / (M2.max - M2.min)

const estilosRango = [
  'relative block h-11 w-full cursor-pointer appearance-none bg-transparent',
  '[&::-webkit-slider-runnable-track]:h-11 [&::-webkit-slider-runnable-track]:bg-transparent',
  '[&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-graphite [&::-webkit-slider-thumb]:bg-safety',
  '[&::-moz-range-track]:h-11 [&::-moz-range-track]:bg-transparent',
  '[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-none',
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-graphite [&::-moz-range-thumb]:bg-safety',
].join(' ')

const izquierda = (fraccion) =>
  `calc(${MITAD_CURSOR}px + (100% - ${MITAD_CURSOR * 2}px) * ${fraccion})`

export default function CotaControl({ id, valor, onChange, describedBy }) {
  const fraccion = posicion(valor)

  const alPresionar = (evento) => {
    // Re Pág / Av Pág saltan de 10 en 10 m².
    const salto = { PageUp: M2.marca, PageDown: -M2.marca }[evento.key]
    if (!salto) return
    evento.preventDefault()
    onChange(Math.min(M2.max, Math.max(M2.min, valor + salto)))
  }

  return (
    <div className="relative pb-7 pt-12">
      {/* Valor encima del cursor. El texto se ancla en proporción para no salirse en los extremos. */}
      <span
        aria-hidden="true"
        className="ancho-condensado pointer-events-none absolute top-0 whitespace-nowrap text-3xl font-extrabold leading-none tabular-nums"
        style={{ left: izquierda(fraccion), transform: `translateX(-${fraccion * 100}%)` }}
      >
        {valor} m²
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-8 h-3 w-0.5 -translate-x-1/2 bg-safety"
        style={{ left: izquierda(fraccion) }}
      />

      {/* Dibujo de la cota */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 h-11"
        style={{ left: MITAD_CURSOR, right: MITAD_CURSOR }}
      >
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-cement" />
        <span className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-white" style={{ width: `${fraccion * 100}%` }} />
        {MARCAS.map((marca) => {
          const extremo = marca === M2.min || marca === M2.max
          const mayor = marca % 50 === 0
          return (
            <span
              key={marca}
              className={`absolute top-1/2 w-0.5 -translate-x-1/2 -translate-y-1/2 ${
                extremo ? 'h-9 bg-white' : mayor ? 'h-5 bg-cement' : 'h-2.5 bg-cement'
              }`}
              style={{ left: `${posicion(marca) * 100}%` }}
            />
          )
        })}
      </div>

      <input
        id={id}
        type="range"
        min={M2.min}
        max={M2.max}
        step="1"
        value={valor}
        onChange={(evento) => onChange(Number(evento.target.value))}
        onKeyDown={alPresionar}
        aria-valuetext={`${valor} metros cuadrados`}
        aria-describedby={describedBy}
        className={estilosRango}
      />

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 h-5" style={{ left: MITAD_CURSOR, right: MITAD_CURSOR }}>
        {ETIQUETAS.map((etiqueta) => (
          <span
            key={etiqueta}
            className="absolute -translate-x-1/2 text-xs tabular-nums text-concrete"
            style={{ left: `${posicion(etiqueta) * 100}%` }}
          >
            {etiqueta}
          </span>
        ))}
      </div>
    </div>
  )
}
