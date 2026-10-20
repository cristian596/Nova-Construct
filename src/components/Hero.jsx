import { useEffect, useRef } from 'react'
import { MARCA } from '../data/marca.js'
import { botonPrimario, botonSecundario, contenedor } from '../lib/ui.js'

// TODO: reemplazar por una foto real de obra (mínimo 2400 px de ancho; ésta mide 1456 × 816 y se ve blanda al ampliarse).
const IMAGEN_HERO = '/placeholders/hero.webp'

// Una línea por fila: cada una sube desde su propia máscara.
const TITULAR = ['Remodelamos,', 'terminamos', 'y entregamos', 'en plazo.']
const RETRASO_INICIAL = 150
const RETRASO_ENTRE_LINEAS = 120

const DATO_COTA = `Desde ${MARCA.anio_fundacion}`

// La capa de la imagen sobresale 5 % arriba y abajo; el parallax la baja como máximo ese 5 % de la altura.
const DESPLAZAMIENTO_PARALLAX = 0.05

// Anillo de foco: borde graphite por fuera y naranja por dentro, legible sobre foto clara u oscura.
const foco =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-graphite focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-graphite'

// Solo escribe transform: el layout no se toca al hacer scroll.
function activarParallax(raiz, capa) {
  let altura = raiz.offsetHeight
  let cuadro = 0

  const pintar = () => {
    cuadro = 0
    const avance = Math.min(Math.max(window.scrollY / altura, 0), 1)
    capa.style.transform = `translate3d(0, ${(avance * altura * DESPLAZAMIENTO_PARALLAX).toFixed(1)}px, 0)`
  }
  const programar = () => {
    if (!cuadro) cuadro = requestAnimationFrame(pintar)
  }

  const observador = new ResizeObserver(() => {
    altura = raiz.offsetHeight
    programar()
  })
  observador.observe(raiz)
  window.addEventListener('scroll', programar, { passive: true })
  pintar()

  return () => {
    observador.disconnect()
    window.removeEventListener('scroll', programar)
    cancelAnimationFrame(cuadro)
    capa.style.transform = ''
  }
}

// El destello persigue al cursor con retraso (suavizado exponencial) y solo escribe transform y opacity.
function activarDestello(raiz, destello) {
  const mitad = destello.offsetWidth / 2
  const objetivo = { x: 0, y: 0 }
  const actual = { x: 0, y: 0 }
  let visible = false
  let cuadro = 0
  let anterior = 0

  const pintar = () => {
    destello.style.transform = `translate3d(${(actual.x - mitad).toFixed(1)}px, ${(actual.y - mitad).toFixed(1)}px, 0)`
  }
  const paso = (ahora) => {
    const factor = 1 - Math.exp(-Math.min(ahora - anterior, 64) / 450)
    anterior = ahora
    actual.x += (objetivo.x - actual.x) * factor
    actual.y += (objetivo.y - actual.y) * factor
    pintar()
    const cerca = Math.abs(objetivo.x - actual.x) < 0.5 && Math.abs(objetivo.y - actual.y) < 0.5
    cuadro = cerca ? 0 : requestAnimationFrame(paso)
  }

  const alMover = (evento) => {
    const caja = raiz.getBoundingClientRect()
    objetivo.x = evento.clientX - caja.left
    objetivo.y = evento.clientY - caja.top
    if (!visible) {
      visible = true
      actual.x = objetivo.x
      actual.y = objetivo.y
      pintar()
      destello.style.opacity = '1'
    }
    if (!cuadro) {
      anterior = performance.now()
      cuadro = requestAnimationFrame(paso)
    }
  }
  const alSalir = () => {
    visible = false
    destello.style.opacity = '0'
  }

  raiz.addEventListener('pointermove', alMover)
  raiz.addEventListener('pointerleave', alSalir)

  return () => {
    raiz.removeEventListener('pointermove', alMover)
    raiz.removeEventListener('pointerleave', alSalir)
    cancelAnimationFrame(cuadro)
    destello.style.opacity = '0'
  }
}

export default function Hero() {
  const raizRef = useRef(null)
  const capaRef = useRef(null)
  const destelloRef = useRef(null)

  useEffect(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')
    const escritorio = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    let desactivar = []

    const configurar = () => {
      desactivar.forEach((fn) => fn())
      desactivar = []
      if (sinMovimiento.matches) return
      desactivar.push(activarParallax(raizRef.current, capaRef.current))
      if (escritorio.matches) desactivar.push(activarDestello(raizRef.current, destelloRef.current))
    }

    configurar()
    sinMovimiento.addEventListener('change', configurar)
    escritorio.addEventListener('change', configurar)
    return () => {
      sinMovimiento.removeEventListener('change', configurar)
      escritorio.removeEventListener('change', configurar)
      desactivar.forEach((fn) => fn())
    }
  }, [])

  return (
    <section id="inicio" className="bg-graphite pt-16">
      <div
        ref={raizRef}
        className="relative isolate flex min-h-[max(36rem,min(calc(100svh-4rem),56rem))] w-full items-end overflow-hidden"
      >
        <div ref={capaRef} className="absolute inset-x-0 -top-[5%] z-0 h-[110%] will-change-transform">
          <img
            src={IMAGEN_HERO}
            alt=""
            width="1456"
            height="816"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="size-full animate-zoom-lento object-[68%_center] object-cover lg:object-[75%_center] motion-reduce:animate-none"
          />
        </div>

        {/* Dos degradados de graphite: izquierda → derecha y abajo → arriba. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-r from-graphite/90 via-graphite/60 to-graphite/35 lg:via-graphite/55 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-graphite/80 via-graphite/15 to-transparent"
        />

        {/* Destello: solo escritorio con puntero fino y movimiento permitido. */}
        <div
          ref={destelloRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden size-[56rem] bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)] opacity-0 transition-opacity duration-700 will-change-transform lg:block lg:motion-reduce:hidden"
        />

        <div className={`${contenedor} relative z-30 pb-24 pt-12 text-white`}>
          <h1 className="ancho-condensado flex flex-col items-start text-[3.25rem] font-extrabold leading-[0.9] sm:text-7xl lg:text-[6.5rem] xl:text-[7rem]">
            {TITULAR.map((linea, indice) => (
              // La máscara se extiende 0.14em hacia abajo (y se resta con margen) para no cortar las descendentes.
              <span key={linea} className="-mb-[0.14em] -mt-[0.06em] block overflow-hidden pb-[0.14em] pt-[0.06em]">
                <span
                  className="block animate-revelar motion-reduce:animate-none"
                  style={{ animationDelay: `${RETRASO_INICIAL + indice * RETRASO_ENTRE_LINEAS}ms` }}
                >
                  {linea}
                </span>
              </span>
            ))}
          </h1>

          {/* Línea de cota: se traza de izquierda a derecha y el valor aparece al centro. */}
          <div className="mt-8 flex max-w-[34rem] items-center">
            <span
              aria-hidden="true"
              className="h-4 w-0.5 shrink-0 animate-aparecer bg-safety motion-reduce:animate-none"
              style={{ animationDelay: '700ms' }}
            />
            <span
              aria-hidden="true"
              className="h-0.5 flex-1 origin-left animate-trazar bg-safety motion-reduce:animate-none"
              style={{ animationDelay: '700ms' }}
            />
            <span
              className="ancho-semi animate-aparecer whitespace-nowrap px-4 text-base font-bold tabular-nums tracking-wide motion-reduce:animate-none"
              style={{ animationDelay: '1000ms' }}
            >
              {DATO_COTA}
            </span>
            <span
              aria-hidden="true"
              className="h-0.5 flex-1 origin-left animate-trazar bg-safety motion-reduce:animate-none"
              style={{ animationDelay: '1050ms' }}
            />
            <span
              aria-hidden="true"
              className="h-4 w-0.5 shrink-0 animate-aparecer bg-safety motion-reduce:animate-none"
              style={{ animationDelay: '1450ms' }}
            />
          </div>

          <p className="mt-6 max-w-xl text-lg leading-snug sm:text-xl">
            {MARCA.eslogan}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#cotizador" className={`${botonPrimario} ${foco}`}>
              Cotizar mi proyecto
            </a>
            <a href="#proyectos" className={`${botonSecundario} ${foco}`}>
              Ver proyectos
            </a>
          </div>
        </div>

        {/* Indicador de scroll: decorativo, sin foco. */}
        <div aria-hidden="true" className={`${contenedor} pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-end`}>
          <span className="relative block h-16 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-0 animate-indicador bg-safety motion-reduce:animate-none" />
          </span>
        </div>
      </div>
    </section>
  )
}
