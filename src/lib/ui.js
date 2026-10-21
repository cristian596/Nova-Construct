// Clases compartidas para mantener consistencia entre secciones.

export const contenedor = 'mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12'

// Chaflán de 12 px arriba a la derecha. El clip-path recorta el borde, así que el contorno se pinta
// con el fondo del botón (color del borde) y el relleno va en ::before/::after, 2 px hacia adentro
// y con un chaflán de 10,83 px (12 px menos el desplazamiento diagonal de 2 px).
// En foco el clip-path se quita para que el contorno de foco no quede recortado.
// El relleno de ::after crece de izquierda a derecha en 300 ms; con reduced-motion el cambio es instantáneo.
const botonBase = [
  'relative isolate inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-base font-semibold',
  '[clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)] focus-visible:[clip-path:none]',
  'transition-[color,transform] duration-300 motion-reduce:transition-none motion-safe:active:translate-y-px',
  'before:absolute before:inset-[2px] before:-z-20 before:[clip-path:polygon(0_0,calc(100%_-_10.83px)_0,100%_10.83px,100%_100%,0_100%)]',
  'after:absolute after:inset-[2px] after:-z-10 after:origin-left after:scale-x-0 after:[clip-path:polygon(0_0,calc(100%_-_10.83px)_0,100%_10.83px,100%_100%,0_100%)]',
  'after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none hover:after:scale-x-100',
].join(' ')

// Texto grafito sobre naranja: 4,9:1 (AA).
export const botonPrimario = `${botonBase} bg-safety text-graphite before:bg-safety after:bg-white`

export const botonSecundario = `${botonBase} bg-graphite text-graphite before:bg-white after:bg-graphite hover:text-white`

export const tituloSeccion = 'ancho-condensado text-4xl font-extrabold leading-[0.95] sm:text-5xl lg:text-6xl'
