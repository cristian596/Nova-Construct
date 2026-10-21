import { MARCA, esPendiente } from './marca.js'

// Solo lo específico del contacto. Teléfono, dirección y horario viven en marca.js.
export const CONTACTO = {
  // TODO: endpoint del formulario (Formspree, backend propio, etc.).
  // Si queda vacío, el formulario abre WhatsApp con el mensaje.
  formularioEndpoint: '',
  // Valor del enlace tel:, derivado del número de WhatsApp.
  telefonoHref: `+${MARCA.telefonoWhatsapp}`,
}

// TODO: confirmar rangos con el cliente
export const PRESUPUESTOS = ['Menos de $20 M', '$20 M a $60 M', '$60 M a $150 M', 'Más de $150 M', 'Aún no lo sé']

// TODO: confirmar con el cliente
export const mensajeConfirmacion = 'Recibimos tu solicitud. Te contactaremos pronto.'

// TODO: confirmar con el cliente
export const mensajeError = 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.'

// TODO: confirmar tiempo de respuesta
export const TIEMPO_RESPUESTA = 'Te respondemos en menos de 24 horas hábiles.'

// Número internacional, solo dígitos, y no pendiente.
export const whatsappValido = !esPendiente(MARCA.telefonoWhatsapp) && /^\d{8,15}$/.test(MARCA.telefonoWhatsapp)

export function enlaceWhatsApp(texto) {
  const base = `https://wa.me/${MARCA.telefonoWhatsapp}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
