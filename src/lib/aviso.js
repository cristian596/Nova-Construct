import { MARCA } from '../data/marca.js'

// Si el cliente puso una URL externa en marca.js, el footer la usa tal cual y la página interna
// queda disponible en su ruta por defecto.
export const AVISO_EXTERNO = /^https?:/i.test(MARCA.urlAvisoPrivacidad)
export const RUTA_AVISO = AVISO_EXTERNO ? '/aviso-de-privacidad' : MARCA.urlAvisoPrivacidad
