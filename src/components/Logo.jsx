import { MARCA } from '../data/marca.js'

// La primera palabra va en negrita fuerte y el resto en peso medio.
const [primera, ...resto] = MARCA.nombre.split(' ')

export default function Logo({ className = '' }) {
  return (
    <span className={`ancho-condensado text-2xl leading-none tracking-wide ${className}`}>
      <span className="font-black">{primera}</span>
      {resto.length > 0 && <span className="font-medium"> {resto.join(' ')}</span>}
    </span>
  )
}
