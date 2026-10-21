import { ACABADOS, CIUDADES, M2, RANGO, REDONDEO, TIPOS } from '../data/cotizador.js'
import { MARCA } from '../data/marca.js'

const buscar = (lista, id) => lista.find((item) => item.id === id)

export const PASOS = [
  { campo: 'tipo', nombre: 'tipo de proyecto' },
  { campo: 'm2', nombre: 'metros cuadrados' },
  { campo: 'acabados', nombre: 'nivel de acabados' },
  { campo: 'ciudad', nombre: 'ciudad' },
]

export function m2Valido(valor) {
  return Number.isInteger(valor) && valor >= M2.min && valor <= M2.max
}

export function validarCotizacion({ tipo, m2, acabados, ciudad }) {
  const errores = {}
  if (!buscar(TIPOS, tipo)) errores.tipo = 'Elige un tipo de proyecto.'
  if (!m2Valido(m2)) errores.m2 = `Escribe un número entero entre ${M2.min} y ${M2.max} m².`
  if (!buscar(ACABADOS, acabados)) errores.acabados = 'Elige un nivel de acabados.'
  if (!buscar(CIUDADES, ciudad)) errores.ciudad = 'Elige una ciudad de la lista.'
  return errores
}

// Devuelve null si falta cualquier paso: nunca hay resultado parcial.
export function calcularRango(datos) {
  if (Object.keys(validarCotizacion(datos)).length > 0) return null

  const tipo = buscar(TIPOS, datos.tipo)
  const acabados = buscar(ACABADOS, datos.acabados)
  const ciudad = buscar(CIUDADES, datos.ciudad)
  const base = datos.m2 * tipo.precioBase * acabados.multiplicador * ciudad.factor

  return {
    minimo: Math.floor((base * RANGO.inferior) / REDONDEO) * REDONDEO,
    maximo: Math.ceil((base * RANGO.superior) / REDONDEO) * REDONDEO,
    tipo,
    acabados,
    ciudad,
    m2: datos.m2,
  }
}

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export const formatearCOP = (valor) => cop.format(valor)

export function mensajeWhatsApp(rango, folio) {
  return [
    `Hola, quiero cotizar un proyecto con ${MARCA.nombre}.`,
    `Folio: ${folio}`,
    `Tipo: ${rango.tipo.nombre}`,
    `Área: ${rango.m2} m²`,
    `Acabados: ${rango.acabados.nombre}`,
    `Ciudad: ${rango.ciudad.nombre}`,
    `Rango preliminar: ${formatearCOP(rango.minimo)} a ${formatearCOP(rango.maximo)}`,
    'Nota: rango preliminar, sujeto a visita técnica.',
  ].join('\n')
}
