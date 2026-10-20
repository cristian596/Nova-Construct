export default function Logo({ className = '' }) {
  return (
    <span className={`ancho-condensado text-2xl leading-none tracking-wide ${className}`}>
      <span className="font-black">NOVA</span> <span className="font-medium">CONSTRUCT</span>
    </span>
  )
}
