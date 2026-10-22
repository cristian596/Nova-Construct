import { enlaceWhatsApp } from '../data/contacto.js'
import { MARCA, esPendiente } from '../data/marca.js'
import PaginaLegal, { DatosResponsable, enlaceTexto, listaTexto } from '../components/PaginaLegal.jsx'

// BORRADOR: Texto de ejemplo. Debe revisarlo un abogado antes de publicar.
// Todo el contenido de esta página es una plantilla base, no un texto legal definitivo.
// Los datos de la marca (nombre, ciudad, correo, teléfono, fecha) salen de src/data/marca.js.
// TODO: listar proveedores (hosting, base de datos, mensajería) en la sección "Tratamiento y almacenamiento".

const secciones = [
  {
    titulo: 'Responsable del tratamiento',
    contenido: <DatosResponsable />,
  },
  {
    titulo: 'Datos que se tratan',
    contenido: (
      <>
        <p>Tratamos los datos que usted escribe de forma voluntaria en el formulario de contacto:</p>
        <ul className={listaTexto}>
          <li>Nombre.</li>
          <li>Teléfono.</li>
          <li>Tipo de proyecto.</li>
          <li>Ciudad.</li>
          <li>Presupuesto estimado.</li>
          <li>El mensaje que usted escriba.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Finalidades',
    contenido: (
      <>
        <p>Usamos sus datos solo para:</p>
        <ul className={listaTexto}>
          <li>Responder su solicitud de contacto o de cotización.</li>
          <li>Agendar una visita técnica.</li>
        </ul>
        <p>
          No usaremos sus datos para enviarle publicidad sin una autorización adicional de su parte.
        </p>
      </>
    ),
  },
  {
    titulo: 'Tratamiento y almacenamiento',
    contenido: (
      <p>
        {MARCA.nombre} usa sus datos solo para las finalidades indicadas en esta política. Para recibir y
        conservar la información podemos apoyarnos en proveedores de servicios tecnológicos, como alojamiento web,
        base de datos o mensajería, que actúan por nuestra cuenta.
      </p>
    ),
  },
  {
    titulo: 'Derechos del titular',
    contenido: (
      <>
        <p>De acuerdo con el artículo 8 de la Ley 1581 de 2012, usted tiene derecho a:</p>
        <ul className={listaTexto}>
          <li>Conocer los datos personales que tenemos sobre usted.</li>
          <li>Actualizarlos y rectificarlos cuando sean inexactos o estén incompletos.</li>
          <li>Solicitar que los suprimamos de nuestras bases de datos.</li>
          <li>Revocar la autorización que nos dio para tratar sus datos.</li>
          <li>Acceder a sus datos de forma gratuita.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Procedimiento para consultas y reclamos',
    contenido: (
      <ul className={listaTexto}>
        <li>
          Las consultas se responden en un plazo de 10 días hábiles. Si no es posible, se pueden prorrogar hasta 5
          días hábiles adicionales, informando al titular antes del vencimiento.
        </li>
        <li>
          Los reclamos se responden en un plazo de 15 días hábiles. Si el reclamo está incompleto, se pide al titular
          que lo complete dentro de los 5 días hábiles siguientes. Si no se puede responder en 15 días, se amplía
          hasta 8 días hábiles adicionales, informando la causa.
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Canales para ejercer sus derechos',
    contenido: (
      <>
        <p>Para hacer una consulta, reclamo o solicitud, escríbanos por cualquiera de estos canales:</p>
        <ul className={listaTexto}>
          {!esPendiente(MARCA.correo) && (
            <li>
              Correo:{' '}
              <a href={`mailto:${MARCA.correo}`} className={`${enlaceTexto} break-words`}>
                {MARCA.correo}
              </a>
            </li>
          )}
          <li>
            WhatsApp:{' '}
            <a href={enlaceWhatsApp()} target="_blank" rel="noopener noreferrer" className={enlaceTexto}>
              {esPendiente(MARCA.telefono) ? 'Escríbanos por WhatsApp' : MARCA.telefono}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        </ul>
      </>
    ),
  },
]

export default function PoliticaTratamiento() {
  return (
    <PaginaLegal
      titulo="Política de tratamiento de datos personales"
      tituloPestana="Política de tratamiento de datos"
      prefijo="politica"
      introduccion={`En ${MARCA.nombre} tratamos sus datos personales conforme a la Ley 1581 de 2012. Esta política le explica qué datos tratamos, para qué los usamos y cómo puede ejercer sus derechos.`}
      secciones={secciones}
      fecha={MARCA.fechaPolitica}
      vigencia="Esta política fue actualizada por última vez el"
      pronombre="la"
    />
  )
}
