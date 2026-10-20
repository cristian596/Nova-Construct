// Clases compartidas para mantener consistencia entre secciones.

export const contenedor = 'mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12'

const botonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 border-2 px-6 py-3 text-base font-semibold transition-colors'

// Texto grafito sobre naranja: 4,9:1 (AA).
export const botonPrimario = `${botonBase} border-safety bg-safety text-graphite hover:bg-white`

export const botonSecundario = `${botonBase} border-graphite bg-white text-graphite hover:bg-graphite hover:text-white`

export const tituloSeccion = 'ancho-condensado text-4xl font-extrabold leading-[0.95] sm:text-5xl lg:text-6xl'
