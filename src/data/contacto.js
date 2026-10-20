// TODO: reemplazar todos los valores por los datos reales de la empresa.
export const CONTACTO = {
  // TODO: número de WhatsApp en formato internacional, solo dígitos (57 + número).
  whatsapp: '570000000000',
  // TODO: teléfono visible y su versión para el enlace tel:.
  telefono: 'TODO: +57 000 000 0000',
  telefonoHref: '+570000000000',
  // TODO: dirección de la oficina.
  direccion: 'TODO: dirección, ciudad',
  // TODO: horario de atención.
  horario: 'TODO: lunes a viernes, 0:00 a 0:00',
  // TODO: endpoint del formulario (Formspree, backend propio, etc.).
  // Si queda vacío, el formulario abre WhatsApp con el mensaje.
  formularioEndpoint: '',
}

export function enlaceWhatsApp(texto) {
  const base = `https://wa.me/${CONTACTO.whatsapp}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
