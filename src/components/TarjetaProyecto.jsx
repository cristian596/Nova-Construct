import { useEffect, useState } from 'react'
import { ANCHOS_PROYECTO, PROYECTOS } from '../data/proyectos.js'
import ImagenResponsiva from './ImagenResponsiva.jsx'

// Tarjeta del hero (solo escritorio). La rotación se pausa con el cursor encima, con foco
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

  // Sin proyectos no hay nada que mostrar.
  if (!proyecto) return null

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
      className="w-72 rounded-3xl bg-white p-3 text-graphite xl:w-80"
    >
      <a
        href="#proyectos"
        aria-label={`Ver proyectos. Proyecto actual: ${proyecto.nombre}`}
        className="group block rounded-2xl"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cement">
          {!fallo && (
            <ImagenResponsiva
              key={proyecto.imagen}
              src={proyecto.imagen}
              anchos={ANCHOS_PROYECTO}
              sizes="20rem"
              alt=""
              width="960"
              height="1200"
              loading="lazy"
              onError={() => setFallo(true)}
              className="size-full animate-entrada object-cover motion-reduce:animate-none"
            />
          )}
        </div>
        <div className="flex items-baseline justify-between gap-3 px-1 pt-3">
          <p className="min-w-0 break-words text-lg font-medium leading-tight tracking-[-0.01em]">{proyecto.nombre}</p>
          <p aria-hidden="true" className="shrink-0 text-sm tabular-nums">
            {activo + 1} de {PROYECTOS.length}
          </p>
        </div>
      </a>

      <div className="mt-2 flex items-center gap-3 px-1">
        {!reducido && (
          <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-concrete">
            <div
              key={activo}
              onAnimationEnd={() => setActivo((a) => (a + 1) % PROYECTOS.length)}
              style={{ animationPlayState: enPausa ? 'paused' : 'running' }}
              className="h-full origin-left animate-progreso-hero rounded-full bg-safety"
            />
          </div>
        )}
        {!reducido && (
          <button
            type="button"
            onClick={() => setPausaManual((p) => !p)}
            className="flex min-h-11 items-center rounded-full px-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            {pausaManual ? 'Reanudar' : 'Pausar'}
          </button>
        )}
      </div>
    </div>
  )
}
