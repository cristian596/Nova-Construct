// Fuente única de los datos de la marca. Los componentes leen de aquí.
// TODO: reemplazar todos los valores marcados antes de publicar.
// Los campos cuyo valor empieza con "TODO" se ocultan automáticamente en la web (contacto, aviso
// de privacidad y cifras del hero) hasta que el cliente los complete con su información real.

// Un campo está pendiente si está vacío o su valor empieza con "TODO".
export const esPendiente = (valor) => !valor || String(valor).trim().startsWith('TODO')

export const MARCA = {
  // Aparece en logotipo, header, footer, mensajes de WhatsApp y textos de accesibilidad.
  // La primera palabra se muestra en negrita fuerte en el logotipo.
  nombre: 'AQUI VA TU MARCA',

  // Frase corta bajo el titular del hero y en el footer.
  // TODO: confirmar con el cliente
  eslogan: 'Presupuesto cerrado y cronograma firmado desde el primer día.',

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

  // Dirección de la política de tratamiento de datos que enlazan el footer y el formulario. Por defecto es
  // la página interna de la plantilla. Si el cliente tiene su política publicada en otra URL, reemplazar
  // este valor por la URL completa (https://...).
  urlPoliticaDatos: '/politica-de-tratamiento-de-datos',

  // TODO: actualizar cada vez que se revise el texto
  fechaPolitica: '2026-10-21',

  // Se guarda con cada autorización cuando exista backend
  versionPolitica: '1.0',

  // Fecha de la última actualización del aviso, formato AAAA-MM-DD. Se muestra en "Vigencia".
  // TODO: actualizarla cada vez que se revise el texto del aviso.
  avisoPrivacidadActualizado: '2026-10-20',

  // TODO: dirección de la oficina, sin la ciudad (se agrega desde "ciudad").
  direccion: 'TODO: dirección',

  // TODO: horario de atención.
  horario: 'TODO: lunes a viernes, 0:00 a 0:00',

  // TODO: año de fundación. Se muestra como "Desde AAAA" en el hero.
  anio_fundacion: 1976,

  // TODO: palabra decorativa del hero; el cliente puede cambiarla
  palabraFondo: 'OBRA',

  // TODO: tres datos para el pie del hero. Reemplazar "TODO" por la cifra real (por ejemplo
  // "25", "300+", "10 años"). Las columnas con "TODO" se ocultan; si quedan menos de dos, se oculta la fila.
  datosConfianza: [
    { valor: 'TODO', etiqueta: 'años de experiencia' },
    { valor: 'TODO', etiqueta: 'proyectos entregados' },
    { valor: 'TODO', etiqueta: 'de garantía por escrito' },
  ],

  // TODO: enlaces a perfiles. Solo se muestran en el footer los que no estén vacíos.
  redes: {
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },
}
