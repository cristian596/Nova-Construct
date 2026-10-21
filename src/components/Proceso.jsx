import { Fragment, useEffect, useRef, useState } from 'react'
import { BadgeCheck, FileText, HardHat, PenTool, Ruler } from 'lucide-react'
import { botonPrimario, contenedor, tituloSeccion } from '../lib/ui.js'

const PASOS = [
  {
    titulo: 'Visita técnica',
    texto: 'Medimos, revisamos el estado de la obra y escuchamos lo que necesitas.',
    Icono: Ruler,
  },
  {
    titulo: 'Diseño y planos',
    texto: 'Definimos distribución, materiales y acabados antes de mover un ladrillo.',
    Icono: PenTool,
  },
  {
    titulo: 'Presupuesto cerrado',
    texto: 'Un valor fijo por escrito, con cronograma y forma de pago acordados.',
    resaltar: ['valor fijo'],
    Icono: FileText,
  },
  {
    titulo: 'Ejecución con avances semanales',
    texto: 'Cada semana recibes fotos, porcentaje de avance y próximos pasos.',
    resaltar: ['fotos', 'avance'],
    Icono: HardHat,
  },
  {
    titulo: 'Entrega y garantía',
    texto: 'Recorrido final, acta de entrega y garantía por escrito.',
    Icono: BadgeCheck,
  },
]

// Los tramos de línea van del centro de un círculo (28 px) al centro del siguiente.
const entre = (valor) => Math.min(1, Math.max(0, valor))

// Envuelve en <strong> cada frase de `resaltar`, la primera vez que aparece.
function conResaltados(texto, resaltar = []) {
  if (resaltar.length === 0) return texto
  const patron = new RegExp(`(${resaltar.join('|')})`)
  return texto.split(patron).map((trozo, i) =>
    resaltar.includes(trozo) ? <strong key={i}>{trozo}</strong> : <Fragment key={i}>{trozo}</Fragment>,
  )
}

export default function Proceso() {
  const [reducido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [activos, setActivos] = useState(reducido ? PASOS.length : 0)
  const listaRef = useRef(null)
  const pasosRef = useRef([])
  const rellenosRef = useRef([])

  useEffect(() => {
    if (reducido) {
      rellenosRef.current.forEach((relleno) => relleno && (relleno.style.transform = 'none'))
      return undefined
    }

    const escritorio = window.matchMedia('(min-width: 1024px)')
    let frame = 0

    const calcular = () => {
      frame = 0
      const alto = window.innerHeight
      const horizontal = escritorio.matches
      let cantidad = 0
      let avance = 0 // en escritorio: 0..4 tramos recorridos

      if (horizontal) {
        const { top } = listaRef.current.getBoundingClientRect()
        avance = entre((alto * 0.85 - top) / (alto * 0.4)) * (PASOS.length - 1)
        cantidad = avance > 0 ? Math.min(PASOS.length, Math.floor(avance) + 1) : 0
      }

      const ancla = alto * 0.6
      pasosRef.current.forEach((paso, i) => {
        if (!paso) return
        const { top, height } = paso.getBoundingClientRect()
        if (!horizontal && ancla >= top + 28) cantidad = i + 1
        const relleno = rellenosRef.current[i]
        if (!relleno) return
        const valor = horizontal ? entre(avance - i) : entre((ancla - (top + 28)) / height)
        relleno.style.transform = horizontal ? `scaleX(${valor})` : `scaleY(${valor})`
      })

      setActivos(cantidad)
    }

    const pedir = () => {
      if (!frame) frame = requestAnimationFrame(calcular)
    }

    calcular()
    window.addEventListener('scroll', pedir, { passive: true })
    window.addEventListener('resize', pedir)
    return () => {
      window.removeEventListener('scroll', pedir)
      window.removeEventListener('resize', pedir)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reducido])

  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="bg-white py-20 lg:py-28">
      <div className={contenedor}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 id="proceso-titulo" className={tituloSeccion}>
              Así trabajamos
            </h2>
            <p className="mt-5 text-lg leading-relaxed">
              Cinco etapas, siempre en el mismo orden. Sabes qué sigue y cuándo.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 border-l-2 border-graphite pl-5">
            <p className="ancho-semi text-2xl font-bold leading-tight">¿Listo para empezar?</p>
            <a href="#contacto" className={`${botonPrimario} focus-visible:outline-graphite`}>
              Agendar visita técnica
            </a>
          </div>
        </div>

        <ol ref={listaRef} className="mt-14 lg:mt-20 lg:grid lg:grid-cols-5">
          {PASOS.map((paso, indice) => (
            <li
              key={paso.titulo}
              ref={(el) => (pasosRef.current[indice] = el)}
              className="relative flex gap-4 pb-6 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0 lg:pr-4"
            >
              {/* Tramo de línea hasta el círculo siguiente: vertical en móvil, horizontal en escritorio */}
              {indice < PASOS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[27px] top-7 h-full w-0.5 bg-graphite lg:left-7 lg:top-[27px] lg:h-0.5 lg:w-full"
                >
                  <span
                    ref={(el) => (rellenosRef.current[indice] = el)}
                    className="absolute inset-0 origin-top bg-safety lg:origin-left"
                    style={{ transform: reducido ? 'none' : 'scale(0)' }}
                  />
                </span>
              )}

              <span
                aria-hidden="true"
                className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-graphite text-graphite transition-colors duration-300 motion-reduce:transition-none ${
                  indice < activos ? 'bg-safety' : 'bg-white'
                }`}
              >
                <paso.Icono className="size-6" strokeWidth={2} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1 break-words bg-concrete p-6 lg:mt-6">
                <span className="ancho-condensado block text-5xl font-extrabold leading-none tabular-nums">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <h3 className="ancho-semi mt-3 text-xl font-bold leading-tight lg:text-lg xl:text-xl">{paso.titulo}</h3>
                <p className="mt-2 leading-relaxed">{conResaltados(paso.texto, paso.resaltar)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
