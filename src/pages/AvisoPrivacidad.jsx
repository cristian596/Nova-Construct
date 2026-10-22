import { CONTACTO, enlaceWhatsApp } from '../data/contacto.js'
import { MARCA, esPendiente } from '../data/marca.js'
import PaginaLegal, { DatosResponsable, enlaceTexto, listaTexto } from '../components/PaginaLegal.jsx'

// BORRADOR: Texto de ejemplo. Debe revisarlo un abogado antes de publicar.
// Todo el contenido de esta página (secciones 1 a 6) es una plantilla base, no un texto legal definitivo.
// Los datos de la marca (nombre, ciudad, correo, teléfono, fecha) salen de src/data/marca.js.

const secciones = [
  {
    titulo: 'Responsable del tratamiento',
    contenido: <DatosResponsable />,
  },
  {
    titulo: 'Datos que se recolectan',
    contenido: (
      <>
        <p>Recolectamos únicamente los datos que usted nos envía de forma voluntaria:</p>
        <ul className={listaTexto}>
          <li>
            <strong>Formulario de contacto:</strong> nombre, teléfono y mensaje.
          </li>
        </ul>
        <p>
          Los datos viajan por el canal que usted elija (formulario web o WhatsApp) y pueden ser procesados por
          proveedores tecnológicos que actúan por cuenta de {MARCA.nombre}.
        </p>
      </>
    ),
  },
  {
    titulo: 'Finalidades',
    contenido: (
      <>
        <p>Usamos sus datos solo para:</p>
        <ul className={listaTexto}>
          <li>Responder sus solicitudes de cotización.</li>
          <li>Responder sus mensajes y contactarlo por teléfono o WhatsApp.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Derechos del titular',
    contenido: (
      <>
        <p>De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, usted tiene derecho a:</p>
        <ul className={listaTexto}>
          <li>Conocer los datos personales que tenemos sobre usted.</li>
          <li>Actualizarlos y rectificarlos cuando sean inexactos o estén incompletos.</li>
          <li>Solicitar que los suprimamos de nuestras bases de datos.</li>
          <li>Revocar la autorización que nos dio para tratar sus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
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

export default function AvisoPrivacidad() {
  return (
    <PaginaLegal
      titulo="Aviso de privacidad"
      tituloPestana="Aviso de privacidad"
      prefijo="aviso"
      introduccion={`En ${MARCA.nombre} tratamos sus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013. Este aviso le explica qué datos recolectamos, para qué los usamos y cómo puede ejercer sus derechos.`}
      secciones={secciones}
      fecha={MARCA.avisoPrivacidadActualizado}
      vigencia="Este aviso fue actualizado por última vez el"
      pronombre="lo"
    />
  )
}
