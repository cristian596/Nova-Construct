import { Fragment, useEffect, useRef, useState } from 'react'
import { botonPrimario, contenedor, entradilla, tituloSeccion } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'

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
    resaltar: ['valor fijo'],
  },
  {
    titulo: 'Ejecución con avances semanales',
    texto: 'Cada semana recibes fotos, porcentaje de avance y próximos pasos.',
    resaltar: ['fotos', 'avance'],
  },
  {
    titulo: 'Entrega y garantía',
    texto: 'Recorrido final, acta de entrega y garantía por escrito.',
  },
]

// Los tramos de línea van del centro de un marcador (12 px) al centro del siguiente.
const CENTRO = 12
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
  const cabeceraRef = useRevelar()

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
        if (!horizontal && ancla >= top + CENTRO) cantidad = i + 1
        const relleno = rellenosRef.current[i]
        if (!relleno) return
        const valor = horizontal ? entre(avance - i) : entre((ancla - (top + CENTRO)) / height)
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
    <section id="proceso" aria-labelledby="proceso-titulo" className="pb-24 lg:pb-40">
      <div className={contenedor}>
        <div className="rounded-[2rem] bg-white px-5 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
          <div ref={cabeceraRef} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 id="proceso-titulo" data-revelar className={tituloSeccion}>
                Así trabajamos
              </h2>
              <p data-revelar className={`${entradilla} mt-6`}>
                Cinco etapas, siempre en el mismo orden. Sabes qué sigue y cuándo.
              </p>
            </div>

            <div data-revelar className="flex flex-col items-start gap-4 rounded-3xl bg-concrete p-6 sm:flex-row sm:items-center sm:gap-6">
              <p className="text-2xl font-light tracking-[-0.02em]">¿Listo para empezar?</p>
              <a href="#contacto" className={botonPrimario}>
                Agendar visita técnica
              </a>
            </div>
          </div>

          <ol ref={listaRef} className="mt-14 lg:mt-20 lg:grid lg:grid-cols-5">
            {PASOS.map((paso, indice) => (
              <li
                key={paso.titulo}
                ref={(el) => (pasosRef.current[indice] = el)}
                className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0 lg:pr-8"
              >
                {/* Tramo de línea hasta el marcador siguiente: vertical en móvil, horizontal en escritorio */}
                {indice < PASOS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[10px] top-3 h-full w-1 overflow-hidden rounded-full bg-concrete lg:left-3 lg:top-[10px] lg:h-1 lg:w-full"
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
                  className={`relative z-10 size-6 shrink-0 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                    indice < activos ? 'bg-safety' : 'bg-cement'
                  }`}
                />

                <div className="min-w-0 flex-1 break-words lg:mt-8">
                  <h3 className="text-2xl font-light leading-tight tracking-[-0.02em] lg:text-xl xl:text-2xl">{paso.titulo}</h3>
                  <p className="mt-3 leading-relaxed">{conResaltados(paso.texto, paso.resaltar)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
