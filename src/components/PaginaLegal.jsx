import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CONTACTO } from '../data/contacto.js'
import { MARCA, esPendiente } from '../data/marca.js'
import { contenedor, tituloSeccion } from '../lib/ui.js'

export const enlaceTexto = 'inline-block py-3 -my-3 font-semibold underline underline-offset-4'
export const listaTexto = 'mt-4 list-disc space-y-2 pl-6'

const formatoFecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function Seccion({ prefijo, numero, titulo, children }) {
  const id = `${prefijo}-${numero}`
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="ancho-semi text-2xl font-bold leading-tight sm:text-3xl">
        {numero}. {titulo}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

// Datos del responsable del tratamiento, leídos de marca.js. Se omiten los que están pendientes.
export function DatosResponsable() {
  return (
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
  )
}

// Layout compartido de las páginas legales. El header y el footer los pone App.jsx.
// secciones: [{ titulo, contenido }]. La sección "Vigencia" se agrega al final con la fecha (AAAA-MM-DD).
export default function PaginaLegal({ titulo, tituloPestana, prefijo, introduccion, secciones, fecha, vigencia, pronombre }) {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = `${tituloPestana} | ${MARCA.nombre}`
    window.scrollTo(0, 0)
    return () => {
      document.title = tituloAnterior
    }
  }, [tituloPestana])

  const fechaLegible = formatoFecha.format(new Date(`${fecha}T00:00:00Z`))

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

          <h1 className={`${tituloSeccion} mt-6`}>{titulo}</h1>
          <p className="mt-6">{introduccion}</p>

          {secciones.map((seccion, indice) => (
            <Seccion key={seccion.titulo} prefijo={prefijo} numero={indice + 1} titulo={seccion.titulo}>
              {seccion.contenido}
            </Seccion>
          ))}

          <Seccion prefijo={prefijo} numero={secciones.length + 1} titulo="Vigencia">
            <p>
              {vigencia} <time dateTime={fecha}>{fechaLegible}</time>. Si {pronombre} modificamos, publicaremos la
              nueva versión en esta página.
            </p>
          </Seccion>
        </article>
      </div>
    </main>
  )
}
