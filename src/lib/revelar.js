import { useLayoutEffect, useRef } from 'react'

// Entrada de una sección: sus partes marcadas con data-revelar (título, texto, imagen) suben y aparecen
// en orden, una sola vez, cuando la sección se acerca a la pantalla.
// Nada se oculta con CSS: el estado inicial solo existe mientras corre la animación (fill: backwards),
// así que si el observador o el script fallan, el contenido queda visible.
const DURACION = 280
const ESCALONADO = 75
const SUBIDA = 24
const CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)'

function animar(raiz) {
  // Con movimiento reducido se quita el desplazamiento: solo cambia la opacidad.
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const desde = reducido ? { opacity: 0 } : { opacity: 0, transform: `translate3d(0, ${SUBIDA}px, 0)` }
  const hasta = reducido ? { opacity: 1 } : { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  raiz.querySelectorAll('[data-revelar]').forEach((parte, indice) => {
    parte.animate([desde, hasta], { duration: DURACION, delay: indice * ESCALONADO, easing: CURVA, fill: 'backwards' })
  })
}

export function useRevelar() {
  const ref = useRef(null)

  // Layout effect: si la sección ya está en pantalla al montar, la animación arranca antes del primer
  // pintado y no hay parpadeo.
  useLayoutEffect(() => {
    const raiz = ref.current
    if (!raiz || !raiz.animate) return undefined

    if (raiz.getBoundingClientRect().top < window.innerHeight) {
      animar(raiz)
      return undefined
    }
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return
        observador.disconnect()
        animar(raiz)
      },
      // El margen inferior positivo dispara la entrada justo antes de que la sección sea visible.
      { rootMargin: '0px 0px 10% 0px' },
    )
    observador.observe(raiz)
    return () => observador.disconnect()
  }, [])

  return ref
}
