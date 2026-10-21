import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CONTACTO, enlaceWhatsApp } from '../data/contacto.js'
import { MARCA, esPendiente } from '../data/marca.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'

// BORRADOR: Texto de ejemplo. Debe revisarlo un abogado antes de publicar.
// Todo el contenido de esta página (secciones 1 a 6) es una plantilla base, no un texto legal definitivo.
// Los datos de la marca (nombre, ciudad, correo, teléfono, fecha) salen de src/data/marca.js.

const fechaActualizacion = new Date(`${MARCA.avisoPrivacidadActualizado}T00:00:00Z`)
const fechaLegible = fechaActualizacion.toLocaleDateString('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const enlaceTexto = 'inline-block py-3 -my-3 font-semibold underline underline-offset-4'
const listaTexto = 'mt-4 list-disc space-y-2 pl-6'

function Seccion({ numero, titulo, children }) {
  const id = `aviso-${numero}`
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="ancho-semi text-2xl font-bold leading-tight sm:text-3xl">
        {numero}. {titulo}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export default function AvisoPrivacidad() {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = `Aviso de privacidad | ${MARCA.nombre}`
    window.scrollTo(0, 0)
    return () => {
      document.title = tituloAnterior
    }
  }, [])

  return (
    <main id="contenido" className="bg-white pt-16">
      <div className={`${contenedor} py-14 lg:py-20`}>
        <article className="max-w-3xl text-lg leading-relaxed">
          <Link
            to="/"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 font-semibold underline underline-offset-4"
          >
            <span aria-hidden="true">←</span>
            Volver al inicio
          </Link>

          <h1 className={`${tituloSeccion} mt-6`}>Aviso de privacidad</h1>
          <p className="mt-6">
            En {MARCA.nombre} tratamos sus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
            Este aviso le explica qué datos recolectamos, para qué los usamos y cómo puede ejercer sus derechos.
          </p>

          <Seccion numero={1} titulo="Responsable del tratamiento">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold">Nombre</dt>
              <dd>{MARCA.nombre}</dd>
              <dt className="font-semibold">Ciudad</dt>
              <dd>{MARCA.ciudad}</dd>
              {!esPendiente(MARCA.correo) && (
                <>
                  <dt className="font-semibold">Correo</dt>
                  <dd className="break-words">
                    <a href={`mailto:${MARCA.correo}`} className={enlaceTexto}>
                      {MARCA.correo}
                    </a>
                  </dd>
                </>
              )}
              {!esPendiente(MARCA.telefono) && (
                <>
                  <dt className="font-semibold">Teléfono</dt>
                  <dd>
                    <a href={`tel:${CONTACTO.telefonoHref}`} className={enlaceTexto}>
                      {MARCA.telefono}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </Seccion>

          <Seccion numero={2} titulo="Datos que se recolectan">
            <p>Recolectamos únicamente los datos que usted nos envía de forma voluntaria:</p>
            <ul className={listaTexto}>
              <li>
                <strong>Formulario de contacto:</strong> nombre, teléfono, tipo de proyecto y mensaje.
              </li>
              <li>
                <strong>Cotizador:</strong> tipo de proyecto, metros cuadrados, nivel de acabados y ciudad, que se
                incluyen en el mensaje que usted decide enviarnos por WhatsApp. Al escribirnos, su número de
                teléfono queda visible para nosotros.
              </li>
            </ul>
            <p>
              Los datos viajan por el canal que usted elija (formulario web o WhatsApp) y pueden ser procesados por
              proveedores tecnológicos que actúan por cuenta de {MARCA.nombre}.
            </p>
          </Seccion>

          <Seccion numero={3} titulo="Finalidades">
            <p>Usamos sus datos solo para:</p>
            <ul className={listaTexto}>
              <li>Responder sus solicitudes de cotización.</li>
              <li>Responder sus mensajes y contactarlo por teléfono o WhatsApp.</li>
            </ul>
          </Seccion>

          <Seccion numero={4} titulo="Derechos del titular">
            <p>
              De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, usted tiene derecho a:
            </p>
            <ul className={listaTexto}>
              <li>Conocer los datos personales que tenemos sobre usted.</li>
              <li>Actualizarlos y rectificarlos cuando sean inexactos o estén incompletos.</li>
              <li>Solicitar que los suprimamos de nuestras bases de datos.</li>
              <li>Revocar la autorización que nos dio para tratar sus datos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
            </ul>
          </Seccion>

          <Seccion numero={5} titulo="Canales para ejercer sus derechos">
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
          </Seccion>

          <Seccion numero={6} titulo="Vigencia">
            <p>
              Este aviso fue actualizado por última vez el{' '}
              <time dateTime={MARCA.avisoPrivacidadActualizado}>{fechaLegible}</time>. Si lo modificamos,
              publicaremos la nueva versión en esta página.
            </p>
          </Seccion>
        </article>
      </div>
    </main>
  )
}
