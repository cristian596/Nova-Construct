import { useEffect, useRef, useState } from 'react'
import { ANCHOS_PROYECTO, PROYECTOS } from '../data/proyectos.js'
import { contenedor, entradilla, tituloSeccion } from '../lib/ui.js'
import { useRevelar } from '../lib/revelar.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// En móvil y tableta el carril sale hasta el borde de la pantalla (cancela el margen de `contenedor`)
// y alinea cada tarjeta con el margen del título. En escritorio (lg) cada tarjeta ocupa todo el carril.
const ALINEACION = '-mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 lg:mx-0 lg:px-0 lg:scroll-px-0'

const PAUSAS_INICIALES = { hover: false, foco: false, toque: false, fuera: true, pestana: false }

const esEscritorio = () => window.matchMedia('(min-width: 1024px)').matches

// Mide la posición de referencia de la pista: el centro en escritorio, el borde izquierdo con su
// scroll-padding en móvil/tableta (donde las tarjetas se alinean al inicio).
function referencia(pista) {
  const escritorio = esEscritorio()
  const padding = escritorio ? 0 : parseFloat(getComputedStyle(pista).scrollPaddingLeft) || 0
  return { escritorio, padding }
}

function indiceActivo(pista) {
  const { escritorio, padding } = referencia(pista)
  const caja = pista.getBoundingClientRect()
  const ancla = escritorio ? caja.left + caja.width / 2 : caja.left + padding
  let mejor = 0
  let distanciaMejor = Infinity
  Array.from(pista.querySelectorAll('li')).forEach((li, i) => {
    const r = li.getBoundingClientRect()
    const distancia = Math.abs((escritorio ? r.left + r.width / 2 : r.left) - ancla)
    if (distancia < distanciaMejor) {
      mejor = i
      distanciaMejor = distancia
    }
  })
  return mejor
}

// Marco que se conserva aunque la imagen falle: queda el fondo cement y los datos de la tarjeta.
function ImagenProyecto({ src, alt }) {
  const [fallo, setFallo] = useState(false)

  return (
    <div className="absolute inset-0 bg-cement" {...(fallo && { role: 'img', 'aria-label': alt })}>
      {!fallo && (
        <ImagenResponsiva
          src={src}
          anchos={ANCHOS_PROYECTO}
          sizes="(min-width: 1024px) 60vw, 82vw"
          alt={alt}
          width="960"
          height="1200"
          loading="lazy"
          onError={() => setFallo(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  )
}

// Sin proyectos no hay sección (el header, el footer y el hero también ocultan su enlace).
export default function Proyectos() {
  return PROYECTOS.length > 0 ? <Galeria /> : null
}

function Galeria() {
  const seccionRef = useRef(null)
  const cabeceraRef = useRevelar()
  const pistaRef = useRef(null)
  const objetivoRef = useRef(null)
  const temporizadorRef = useRef(0)

  const [activo, setActivo] = useState(0)
  const [ciclo, setCiclo] = useState(0)
  const [pausaManual, setPausaManual] = useState(false)
  const [pausas, setPausas] = useState(PAUSAS_INICIALES)
  const [reducido, setReducido] = useState(false)

  const marcar = (clave, valor) => setPausas((p) => (p[clave] === valor ? p : { ...p, [clave]: valor }))
  const enPausa = pausaManual || Object.values(pausas).some(Boolean)

  // Desplaza la pista hasta el proyecto `indice`. Mientras dura el desplazamiento programático se
  // ignoran los eventos de scroll para que el punto activo no recorra las tarjetas intermedias.
  const irA = (indice) => {
    const pista = pistaRef.current
    const li = pista?.querySelectorAll('li')[indice]
    if (!li) return
    const { escritorio, padding } = referencia(pista)
    const izquierda = escritorio
      ? li.offsetLeft + li.offsetWidth / 2 - pista.clientWidth / 2
      : li.offsetLeft - padding

    objetivoRef.current = indice
    clearTimeout(temporizadorRef.current)
    temporizadorRef.current = setTimeout(() => {
      objetivoRef.current = null
    }, 1200)

    setActivo(indice)
    setCiclo((c) => c + 1)
    pista.scrollTo({ left: izquierda, behavior: reducido ? 'auto' : 'smooth' })
  }

  const cancelarObjetivo = () => {
    objetivoRef.current = null
  }

  // Preferencia de movimiento reducido.
  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizar = () => setReducido(consulta.matches)
    actualizar()
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  // Sección visible y pestaña activa.
  useEffect(() => {
    const observador = new IntersectionObserver(([entrada]) => marcar('fuera', !entrada.isIntersecting), {
      threshold: 0.25,
    })
    observador.observe(seccionRef.current)

    const alCambiarVisibilidad = () => marcar('pestana', document.hidden)
    alCambiarVisibilidad()
    document.addEventListener('visibilitychange', alCambiarVisibilidad)

    return () => {
      observador.disconnect()
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    }
  }, [])

  // Fin del toque o del arrastre, aunque ocurra fuera de la galería.
  useEffect(() => {
    const soltar = () => marcar('toque', false)
    const eventos = ['pointerup', 'pointercancel', 'touchend', 'touchcancel']
    eventos.forEach((e) => window.addEventListener(e, soltar))
    return () => eventos.forEach((e) => window.removeEventListener(e, soltar))
  }, [])

  // Proyecto activo según el scroll; un desplazamiento manual reinicia la barra.
  useEffect(() => {
    const pista = pistaRef.current
    let cuadro = 0

    const actualizar = () => {
      cuadro = 0
      if (objetivoRef.current !== null) return
      setActivo(indiceActivo(pista))
      setCiclo((c) => c + 1)
    }
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(actualizar)
    }

    pista.addEventListener('scroll', alDesplazar, { passive: true })
    window.addEventListener('resize', alDesplazar)
    return () => {
      pista.removeEventListener('scroll', alDesplazar)
      window.removeEventListener('resize', alDesplazar)
      cancelAnimationFrame(cuadro)
      clearTimeout(temporizadorRef.current)
    }
  }, [])

  const alTecla = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const siguiente = activo + (e.key === 'ArrowRight' ? 1 : -1)
    irA(Math.min(PROYECTOS.length - 1, Math.max(0, siguiente)))
  }

  const alEnfocar = (e) => {
    let porTeclado = true
    try {
      porTeclado = e.target.matches(':focus-visible')
    } catch {
      /* navegadores sin :focus-visible: se trata como foco de teclado */
    }
    if (porTeclado) marcar('foco', true)
  }

  const alDesenfocar = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) marcar('foco', false)
  }

  return (
    <section ref={seccionRef} id="proyectos" aria-labelledby="proyectos-titulo" className="overflow-hidden pb-24 lg:pb-40">
      <div className={contenedor}>
        <div ref={cabeceraRef} className="mx-auto max-w-2xl text-center">
          <h2 id="proyectos-titulo" data-revelar className={tituloSeccion}>
            Obras entregadas
          </h2>
          <p data-revelar className={`${entradilla} mt-6`}>
            Área, tipo de trabajo y tiempo real de ejecución de cada proyecto.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="order-last flex flex-col gap-6 lg:order-none lg:col-span-4 lg:justify-between">
            <nav aria-label="Elegir proyecto">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1">
                {PROYECTOS.map((proyecto, i) => (
                  <li key={proyecto.nombre}>
                    <button
                      type="button"
                      onClick={() => irA(i)}
                      aria-current={i === activo ? 'true' : undefined}
                      className={`flex min-h-11 w-full flex-col items-start rounded-2xl px-4 py-2 text-left transition-[background-color,transform] duration-200 motion-safe:active:scale-[0.98] motion-reduce:transition-none lg:px-5 lg:py-3 ${
                        i === activo ? 'bg-white' : 'hover:bg-white/60'
                      }`}
                    >
                      <span className="break-words font-medium lg:text-xl lg:font-light lg:tracking-[-0.01em]">{proyecto.nombre}</span>
                      <span className="hidden text-sm lg:block">{proyecto.tipo}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {!reducido && (
              <div className="flex items-center gap-4">
                <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-graphite/15">
                  <div
                    key={`${activo}-${ciclo}`}
                    onAnimationEnd={() => irA((activo + 1) % PROYECTOS.length)}
                    style={{ animationPlayState: enPausa ? 'paused' : 'running' }}
                    className="h-full origin-left rounded-full bg-safety motion-safe:animate-progreso"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPausaManual((p) => !p)}
                  className="min-h-11 shrink-0 rounded-full bg-white px-5 text-sm font-semibold transition-[background-color,color,transform] duration-200 hover:bg-graphite hover:text-white motion-safe:active:scale-[0.97] motion-reduce:transition-none"
                >
                  {pausaManual ? 'Reanudar carrusel' : 'Pausar carrusel'}
                </button>
              </div>
            )}
          </div>

          <div
            ref={pistaRef}
            role="region"
            aria-label="Galería de proyectos, desplazable horizontalmente"
            tabIndex={0}
            onKeyDown={alTecla}
            onFocus={alEnfocar}
            onBlur={alDesenfocar}
            onPointerEnter={(e) => e.pointerType === 'mouse' && marcar('hover', true)}
            onPointerLeave={() => marcar('hover', false)}
            onPointerDown={() => {
              cancelarObjetivo()
              marcar('toque', true)
            }}
            onTouchStart={() => {
              cancelarObjetivo()
              marcar('toque', true)
            }}
            onWheel={cancelarObjetivo}
            className={`relative snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-4 lg:col-span-8 ${ALINEACION} [scrollbar-color:theme(colors.cement)_transparent] [scrollbar-width:thin]`}
          >
            <ul className="flex gap-4 lg:gap-6">
              {PROYECTOS.map((proyecto, i) => {
                const esActivo = i === activo
                return (
                  <li key={proyecto.nombre} className="w-[min(82vw,26rem)] shrink-0 snap-start lg:w-full lg:snap-center">
                    <figure
                      tabIndex={0}
                      className={`group rounded-[2rem] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safety ${esActivo ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-60'}`}
                    >
                      <div className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] p-3 sm:p-4 lg:aspect-[4/3] lg:p-6">
                        <ImagenProyecto src={proyecto.imagen} alt={proyecto.alt} />
                        <figcaption className="relative max-w-sm rounded-3xl bg-white p-5 lg:p-6">
                          <h3 className="break-words text-2xl font-light leading-tight tracking-[-0.02em]">{proyecto.nombre}</h3>
                          <dl className={`mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm ${esActivo ? 'motion-safe:animate-entrada' : ''}`}>
                            <div>
                              <dt>Tipo</dt>
                              <dd className="mt-0.5 font-semibold">{proyecto.tipo}</dd>
                            </div>
                            <div>
                              <dt>Área</dt>
                              <dd className="mt-0.5 font-semibold tabular-nums">{proyecto.m2} m²</dd>
                            </div>
                            <div>
                              <dt>Duración</dt>
                              <dd className="mt-0.5 font-semibold tabular-nums">{proyecto.semanas} semanas</dd>
                            </div>
                          </dl>
                        </figcaption>
                      </div>
                      <p className="mt-3 px-2 text-sm">Ilustración de ejemplo</p>
                    </figure>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
