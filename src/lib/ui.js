// Clases compartidas para mantener consistencia entre secciones.

// Un solo par de márgenes iguales para toda la página.
export const contenedor = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10'

// Botones planos, totalmente redondos y de un solo relleno. Al presionarlos se encogen un poco
// (solo transform); el cambio de color en hover solo existe con puntero fino (future.hoverOnlyWhenSupported).
const botonBase = [
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold',
  'transition-[transform,background-color,color] duration-200 ease-out motion-reduce:transition-none',
  'motion-safe:active:scale-[0.97] disabled:cursor-wait disabled:opacity-70',
].join(' ')

// Texto grafito sobre naranja: 4,9:1 (AA).
export const botonPrimario = `${botonBase} bg-safety text-graphite hover:bg-graphite hover:text-white`

export const botonSecundario = `${botonBase} bg-graphite text-white hover:bg-safety hover:text-graphite`

// Titular de sección: peso ligero, interletrado cerrado. Dos líneas como máximo en todos los anchos.
export const tituloSeccion =
  'text-balance text-[clamp(1.625rem,1rem+2.8vw,3.75rem)] font-light leading-[1] tracking-[-0.035em]'

// Texto de apoyo bajo un titular.
export const entradilla = 'text-pretty text-lg leading-relaxed'
