import { MARCA } from '../data/marca.js'

// Si el cliente puso una URL externa en marca.js, el footer la usa tal cual y la página interna
// queda disponible en su ruta por defecto.
export const AVISO_EXTERNO = /^https?:/i.test(MARCA.urlAvisoPrivacidad)
export const RUTA_AVISO = AVISO_EXTERNO ? '/aviso-de-privacidad' : MARCA.urlAvisoPrivacidad

// Mismo criterio para la política de tratamiento de datos.
export const POLITICA_EXTERNA = /^https?:/i.test(MARCA.urlPoliticaDatos)
export const RUTA_POLITICA = POLITICA_EXTERNA ? '/politica-de-tratamiento-de-datos' : MARCA.urlPoliticaDatos
