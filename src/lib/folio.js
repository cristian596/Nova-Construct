// Folio de cotización: COT-AAMMDD-XXXX. Solo usa la fecha y un número aleatorio, nunca datos personales.
export function generarFolio() {
  const hoy = new Date()
  const aammdd = [hoy.getFullYear() % 100, hoy.getMonth() + 1, hoy.getDate()]
    .map((parte) => String(parte).padStart(2, '0'))
    .join('')
  const [azar] = crypto.getRandomValues(new Uint32Array(1))
  return `COT-${aammdd}-${String(azar % 10000).padStart(4, '0')}`
}
