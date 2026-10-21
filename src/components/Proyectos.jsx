import { useEffect, useRef, useState } from 'react'
import { ANCHOS_PROYECTO, PROYECTOS } from '../data/proyectos.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'
import Cota from './Cota.jsx'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// Mismo margen que `contenedor` (max-w-7xl centrado), aplicado al carril con scroll
// para que el primer proyecto quede alineado con el título. En escritorio (lg) el carril
// deja media pantalla menos media tarjeta a cada lado para que cualquier tarjeta pueda quedar al centro.
const ALINEACION = 'px-4 scroll-px-4 sm:px-8 sm:scroll-px-8 lg:px-[calc(50%-11rem)] lg:scroll-px-0'

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

// Marco 4:5 que se conserva aunque la imagen falle: queda el fondo cement y la leyenda de abajo.
// Etiqueta, degradado y marco son decorativos (aria-hidden): la misma información está en la leyenda.
function ImagenProyecto({ src, alt, tipo, m2, semanas, activo, pausado }) {
  const [fallo, setFallo] = useState(false)
  // En línea: el shorthand `animation` de las clases animate-* reinicia animation-play-state.
  const estiloPausa = { animationPlayState: pausado ? 'paused' : 'running' }

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden bg-cement"
      {...(fallo && { role: 'img', 'aria-label': alt })}
    >
      {!fallo && (
        <ImagenResponsiva
          src={src}
          anchos={ANCHOS_PROYECTO}
          sizes="(min-width: 1024px) 22rem, min(78vw, 20rem)"
          alt={alt}
          width="960"
          height="1200"
          loading="lazy"
          onError={() => setFallo(true)}
          style={estiloPausa}
          className={`size-full object-cover ${activo ? 'motion-safe:animate-zoom-activo' : ''}`}
        />
      )}

      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 z-10 bg-safety px-3 py-1 text-sm font-semibold text-graphite ${activo ? 'motion-safe:animate-entrada' : ''}`}
      >
        {tipo}
      </span>

      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-graphite via-graphite/70 to-transparent px-4 pb-4 pt-16 text-sm font-semibold tabular-nums text-white transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none ${activo ? 'opacity-100 motion-safe:animate-entrada' : 'opacity-0'}`}
      >
        {m2} m² · {semanas} semanas
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border border-transparent group-focus-within:border-graphite"
      />
    </div>
  )
}

export default function Proyectos() {
  const seccionRef = useRef(null)
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
    <section
      ref={seccionRef}
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="overflow-hidden bg-concrete py-20 lg:py-28"
    >
      <div className={contenedor}>
        <div className="max-w-2xl">
          <h2 id="proyectos-titulo" className={tituloSeccion}>
            Obras entregadas
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Área, tipo de trabajo y tiempo real de ejecución de cada proyecto.
          </p>
        </div>

        <Cota valor={`${PROYECTOS.length} proyectos`} className="mt-10 lg:mt-14" />
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
        className={`relative mt-8 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-6 pt-2 ${ALINEACION} [scrollbar-color:#8B8F94_transparent] [scrollbar-width:thin]`}
      >
        <ul className="flex w-max gap-6">
          {PROYECTOS.map((proyecto, i) => {
            const esActivo = i === activo
            return (
              <li key={proyecto.nombre} className="w-[min(78vw,20rem)] shrink-0 snap-start lg:w-[22rem] lg:snap-center">
                <figure
                  tabIndex={0}
                  className={`group transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safety ${esActivo ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-60'}`}
                >
                  <ImagenProyecto
                    src={proyecto.imagen}
                    alt={proyecto.alt}
                    tipo={proyecto.tipo}
                    m2={proyecto.m2}
                    semanas={proyecto.semanas}
                    activo={esActivo}
                    pausado={enPausa}
                  />
                  {/* graphite y no cement: cement sobre concrete da 2,8:1 y no cumple AA. */}
                  <p className="mt-2 text-xs text-graphite">Ilustración de ejemplo</p>
                  <figcaption className="mt-3 border-t border-graphite pt-4">
                    <h3 className="ancho-semi text-2xl font-bold leading-tight">{proyecto.nombre}</h3>
                    <dl className={`mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm ${esActivo ? 'motion-safe:animate-entrada' : ''}`}>
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
                </figure>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={`${contenedor} mt-2`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Elegir proyecto">
            <ul className="flex flex-wrap">
              {PROYECTOS.map((proyecto, i) => (
                <li key={proyecto.nombre}>
                  <button
                    type="button"
                    onClick={() => irA(i)}
                    aria-label={`Ir al proyecto ${i + 1}: ${proyecto.nombre}`}
                    aria-current={i === activo ? 'true' : undefined}
                    className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-safety"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-3 border-2 border-graphite transition-colors ${i === activo ? 'bg-graphite' : 'bg-transparent'}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {!reducido && (
            <button
              type="button"
              onClick={() => setPausaManual((p) => !p)}
              className="min-h-12 border-2 border-graphite px-5 text-base font-semibold text-graphite transition-colors hover:bg-graphite hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safety"
            >
              {pausaManual ? 'Reanudar carrusel' : 'Pausar carrusel'}
            </button>
          )}
        </div>

        {!reducido && (
          <div aria-hidden="true" className="mt-4 h-0.5 w-full overflow-hidden bg-graphite/20">
            <div
              key={`${activo}-${ciclo}`}
              onAnimationEnd={() => irA((activo + 1) % PROYECTOS.length)}
              style={{ animationPlayState: enPausa ? 'paused' : 'running' }}
              className="h-full origin-left bg-safety motion-safe:animate-progreso"
            />
          </div>
        )}
      </div>
    </section>
  )
}
