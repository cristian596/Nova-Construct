import { MARCA } from './marca.js'

// Solo lo específico del contacto. Teléfono, dirección y horario viven en marca.js.
export const CONTACTO = {
  // TODO: endpoint del formulario (Formspree, backend propio, etc.).
  // Si queda vacío, el formulario abre WhatsApp con el mensaje.
  formularioEndpoint: '',
  // Valor del enlace tel:, derivado del número de WhatsApp.
  telefonoHref: `+${MARCA.telefonoWhatsapp}`,
}

export function enlaceWhatsApp(texto) {
  const base = `https://wa.me/${MARCA.telefonoWhatsapp}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
