import { MARCA } from '../data/marca.js'

// La primera palabra va en negrita y el resto en peso ligero.
const [primera, ...resto] = MARCA.nombre.split(' ')

export default function Logo({ className = '' }) {
  return (
    <span className={className}>
      <span className="font-bold">{primera}</span>
      {resto.length > 0 && <span className="font-light"> {resto.join(' ')}</span>}
    </span>
  )
}
