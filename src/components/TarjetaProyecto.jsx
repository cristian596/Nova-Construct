import { useEffect, useState } from 'react'
import { ANCHOS_PROYECTO, PROYECTOS } from '../data/proyectos.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

const dosDigitos = (n) => String(n).padStart(2, '0')
const TOTAL = dosDigitos(PROYECTOS.length)

const foco =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-graphite focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-graphite'

// Tarjeta de vidrio del hero (solo escritorio). La rotación se pausa con el cursor encima, con foco
// de teclado dentro, con la pestaña oculta o con el botón; con movimiento reducido no rota.
export default function TarjetaProyecto() {
  const [activo, setActivo] = useState(0)
  const [pausaManual, setPausaManual] = useState(false)
  const [hover, setHover] = useState(false)
  const [focoTeclado, setFocoTeclado] = useState(false)
  const [pestanaOculta, setPestanaOculta] = useState(false)
  const [reducido, setReducido] = useState(true)
  const [fallo, setFallo] = useState(false)

  const enPausa = pausaManual || hover || focoTeclado || pestanaOculta
  const proyecto = PROYECTOS[activo]

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizar = () => setReducido(consulta.matches)
    actualizar()
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useEffect(() => {
    const actualizar = () => setPestanaOculta(document.hidden)
    actualizar()
    document.addEventListener('visibilitychange', actualizar)
    return () => document.removeEventListener('visibilitychange', actualizar)
  }, [])

  // Con movimiento reducido se queda en el primer proyecto.
  useEffect(() => {
    if (reducido) setActivo(0)
  }, [reducido])

  useEffect(() => setFallo(false), [activo])

  const alEnfocar = (e) => {
    let porTeclado = true
    try {
      porTeclado = e.target.matches(':focus-visible')
    } catch {
      /* navegadores sin :focus-visible: se trata como foco de teclado */
    }
    if (porTeclado) setFocoTeclado(true)
  }
  const alDesenfocar = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocoTeclado(false)
  }

  return (
    <div
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={alEnfocar}
      onBlur={alDesenfocar}
      className="w-72 border border-cement bg-graphite/60 p-3 text-white backdrop-blur-md rounded-xl xl:w-80"
    >
      <a href="#proyectos" aria-label={`Ver proyectos. Proyecto actual: ${proyecto.nombre}`} className={`group block rounded-lg ${foco}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-cement">
          {!fallo && (
            <ImagenResponsiva
              key={proyecto.imagen}
              src={proyecto.imagen}
              anchos={ANCHOS_PROYECTO}
              sizes="17rem"
              alt=""
              width="960"
              height="1200"
              loading="lazy"
              onError={() => setFallo(true)}
              className="size-full object-cover"
            />
          )}
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 bg-graphite/80 px-2 py-0.5 text-sm font-semibold tabular-nums"
          >
            {dosDigitos(activo + 1)}/{TOTAL}
          </span>
        </div>
        <p className="ancho-semi mt-3 text-lg font-bold leading-tight">{proyecto.nombre}</p>
      </a>

      {!reducido && (
        <div aria-hidden="true" className="mt-3 h-0.5 w-full overflow-hidden bg-white/20">
          <div
            key={activo}
            onAnimationEnd={() => setActivo((a) => (a + 1) % PROYECTOS.length)}
            style={{ animationPlayState: enPausa ? 'paused' : 'running' }}
            className="h-full origin-left animate-progreso-hero bg-safety"
          />
        </div>
      )}

      {!reducido && (
        <button
          type="button"
          onClick={() => setPausaManual((p) => !p)}
          className={`mt-2 flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline ${foco}`}
        >
          {pausaManual ? 'Reanudar' : 'Pausar'}
        </button>
      )}
    </div>
  )
}
