// CONFIRMAR PRECIOS: todos los valores de este archivo son de ejemplo.
// Fórmula: m² × precio base por tipo × multiplicador de acabados × factor de ciudad.

// Precio base en COP por m².
export const TIPOS = [
  { id: 'remodelacion', nombre: 'Remodelación', precioBase: 1_300_000 },
  { id: 'acabados', nombre: 'Acabados', precioBase: 650_000 },
  { id: 'arquitectura', nombre: 'Arquitectura', precioBase: 90_000 },
  { id: 'obra-nueva', nombre: 'Obra nueva', precioBase: 2_800_000 },
]

export const ACABADOS = [
  { id: 'basico', nombre: 'Básico', multiplicador: 1, detalle: 'Materiales nacionales de línea estándar' },
  { id: 'medio', nombre: 'Medio', multiplicador: 1.3, detalle: 'Porcelanato, carpintería a medida' },
  { id: 'premium', nombre: 'Premium', multiplicador: 1.7, detalle: 'Piedra, madera natural, grifería importada' },
]

// Lista cerrada de ciudades atendidas.
export const CIUDADES = [
  { id: 'bogota', nombre: 'Bogotá', factor: 1 },
  { id: 'medellin', nombre: 'Medellín', factor: 0.97 },
  { id: 'cali', nombre: 'Cali', factor: 0.94 },
  { id: 'barranquilla', nombre: 'Barranquilla', factor: 0.95 },
  { id: 'cartagena', nombre: 'Cartagena', factor: 1.03 },
  { id: 'bucaramanga', nombre: 'Bucaramanga', factor: 0.92 },
]

export const M2 = { min: 20, max: 300, marca: 10, inicial: 80 }

// El resultado se muestra como rango alrededor del valor calculado.
export const RANGO = { inferior: 0.9, superior: 1.15 }

// Redondeo del rango en COP, para no aparentar una precisión que no existe.
export const REDONDEO = 100_000
