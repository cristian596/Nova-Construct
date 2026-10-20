// Línea de cota: marcas en los extremos y el valor en el centro.
// Las líneas van en cement (decorativas); el valor hereda el color del texto.
export default function Cota({ valor, className = '' }) {
  return (
    <div aria-hidden="true" className={`flex items-center ${className}`}>
      <span className="h-4 w-0.5 bg-cement" />
      <span className="h-0.5 flex-1 bg-cement" />
      <span className="ancho-semi whitespace-nowrap px-3 text-sm font-semibold tabular-nums">{valor}</span>
      <span className="h-0.5 flex-1 bg-cement" />
      <span className="h-4 w-0.5 bg-cement" />
    </div>
  )
}
