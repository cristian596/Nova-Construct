// Fuente única de los datos de la marca. Los componentes leen de aquí.
// TODO: reemplazar todos los valores marcados antes de publicar.
export const MARCA = {
  // Aparece en logotipo, header, footer, mensajes de WhatsApp y textos de accesibilidad.
  // La primera palabra se muestra en negrita fuerte en el logotipo.
  nombre: 'AQUI VA TU MARCA',

  // TODO: frase corta bajo el titular del hero y en el footer.
  eslogan: 'Construimos tus sueños con calidad, confianza y diseño arquitectónico.',

  // TODO: ciudad sede. Se muestra junto a la dirección en la sección de contacto.
  ciudad: 'Bogotá',

  // TODO: dominio real, con https:// y sin barra final. Index.html, robots.txt y sitemap.xml
  // tienen su propia copia: ver README.
  dominio: 'https://tudominio.com',

  // Valores de los tokens de color. tailwind.config.js los lee de aquí.
  colores: {
    white: '#FFFFFF', // fondos claros y texto sobre fondos oscuros
    concrete: '#ECECEA', // fondo gris claro de secciones y texto secundario sobre oscuro
    graphite: '#2A2C2E', // texto principal y fondos oscuros
    cement: '#8B8F94', // bordes y líneas decorativas (no usar como texto sobre claro)
    safety: '#FF6A13', // acento: botones, foco, marcas
  },

  // TODO: número de WhatsApp en formato internacional, solo dígitos (57 + número).
  // El enlace de llamada (tel:) usa este mismo número.
  telefonoWhatsapp: '570000000000',

  // TODO: teléfono tal como se muestra en la web.
  telefono: 'TODO: +57 000 000 0000',

  // TODO: correo de contacto. Se muestra en el aviso de privacidad como canal para ejercer derechos.
  correo: 'TODO: correo@tudominio.com',

  // Dirección del aviso de privacidad que enlaza el footer. Por defecto es la página interna de la
  // plantilla. Si el cliente ya tiene su política publicada, poner aquí la URL completa (https://...)
  // y el footer la usará tal cual, en la misma pestaña.
  urlAvisoPrivacidad: '/aviso-de-privacidad',

  // Fecha de la última actualización del aviso, formato AAAA-MM-DD. Se muestra en "Vigencia".
  // TODO: actualizarla cada vez que se revise el texto del aviso.
  avisoPrivacidadActualizado: '2026-10-20',

  // TODO: dirección de la oficina, sin la ciudad (se agrega desde "ciudad").
  direccion: 'TODO: dirección',

  // TODO: horario de atención.
  horario: 'TODO: lunes a viernes, 0:00 a 0:00',

  // TODO: año de fundación. Se muestra como "Desde AAAA" en el hero.
  anio_fundacion: 1976,

  // TODO: enlaces a perfiles. Solo se muestran en el footer los que no estén vacíos.
  redes: {
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },
}
