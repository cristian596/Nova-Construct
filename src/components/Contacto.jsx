import { useRef, useState } from 'react'
import { CONTACTO, enlaceWhatsApp } from '../data/contacto.js'
import { TIPOS } from '../data/cotizador.js'
import { MARCA, esPendiente } from '../data/marca.js'
import { botonPrimario, contenedor, tituloSeccion } from '../lib/ui.js'

const CAMPOS = ['nombre', 'telefono', 'tipo', 'mensaje']
const VACIO = { nombre: '', telefono: '', tipo: '', mensaje: '' }

// Dirección, teléfono y horario pendientes ("TODO...") no se muestran al visitante.
const hayDatos = [MARCA.direccion, MARCA.telefono, MARCA.horario].some((valor) => !esPendiente(valor))

function validar(valores) {
  const errores = {}
  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.'
  const digitos = valores.telefono.replace(/[\s()+-]/g, '').replace(/^57(?=\d{10}$)/, '')
  if (!/^\d{7,10}$/.test(digitos)) errores.telefono = 'Escribe un teléfono de 7 a 10 dígitos, por ejemplo 300 123 4567.'
  if (!TIPOS.some((tipo) => tipo.id === valores.tipo)) errores.tipo = 'Elige el tipo de proyecto.'
  if (valores.mensaje.trim().length < 10) errores.mensaje = 'Cuéntanos qué necesitas en al menos 10 caracteres.'
  return errores
}

const estiloCampo =
  'mt-2 block min-h-12 w-full border border-cement bg-white px-4 py-3 text-base text-graphite aria-[invalid=true]:border-2 aria-[invalid=true]:border-graphite'

function Campo({ id, etiqueta, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {etiqueta}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-semibold">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-safety" fill="currentColor">
            <path d="M10 1l9.5 17H.5L10 1zm-1 6v5h2V7H9zm0 6.5V15h2v-1.5H9z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contacto() {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [intentado, setIntentado] = useState(false)
  const [estado, setEstado] = useState('inicial')
  const formRef = useRef(null)

  const cambiar = (evento) => {
    const siguientes = { ...valores, [evento.target.name]: evento.target.value }
    setValores(siguientes)
    if (intentado) setErrores(validar(siguientes))
  }

  const atributos = (campo) => ({
    id: `contacto-${campo}`,
    name: campo,
    value: valores[campo],
    onChange: cambiar,
    required: true,
    'aria-invalid': Boolean(errores[campo]),
    'aria-describedby': errores[campo] ? `contacto-${campo}-error` : undefined,
    className: estiloCampo,
  })

  const enviar = async (evento) => {
    evento.preventDefault()
    setIntentado(true)
    const nuevos = validar(valores)
    setErrores(nuevos)

    const primero = CAMPOS.find((campo) => nuevos[campo])
    if (primero) {
      formRef.current.elements[primero].focus()
      return
    }

    const tipo = TIPOS.find((opcion) => opcion.id === valores.tipo).nombre

    if (!CONTACTO.formularioEndpoint) {
      const texto = `Hola, ${MARCA.nombre}. Soy ${valores.nombre.trim()} (${valores.telefono.trim()}).\nProyecto: ${tipo}\n\n${valores.mensaje.trim()}`
      window.open(enlaceWhatsApp(texto), '_blank', 'noopener,noreferrer')
      setEstado('whatsapp')
      return
    }

    setEstado('enviando')
    try {
      const respuesta = await fetch(CONTACTO.formularioEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...valores, tipo }),
      })
      if (!respuesta.ok) throw new Error(String(respuesta.status))
      setEstado('enviado')
      setValores(VACIO)
      setIntentado(false)
    } catch {
      setEstado('error')
    }
  }

  const mensajesEstado = {
    whatsapp: 'Abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos con el enlace de abajo.',
    enviado: 'Recibimos tu mensaje. Te llamaremos para agendar la visita técnica.',
    error: 'No pudimos enviar el mensaje. Intenta de nuevo o escríbenos por WhatsApp.',
  }

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-white py-20 lg:py-28">
      <div className={`${contenedor} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-4">
          <h2 id="contacto-titulo" className={tituloSeccion}>
            Hablemos de tu obra
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Déjanos tus datos y te llamamos para agendar la visita técnica.
          </p>
        </div>

        <div className="lg:col-span-8">
          <form ref={formRef} noValidate onSubmit={enviar} className="grid gap-6 sm:grid-cols-2">
            <Campo id="contacto-nombre" etiqueta="Nombre" error={errores.nombre}>
              <input type="text" autoComplete="name" {...atributos('nombre')} />
            </Campo>
            <Campo id="contacto-telefono" etiqueta="Teléfono" error={errores.telefono}>
              <input type="tel" autoComplete="tel" inputMode="tel" {...atributos('telefono')} />
            </Campo>
            <div className="sm:col-span-2">
              <Campo id="contacto-tipo" etiqueta="Tipo de proyecto" error={errores.tipo}>
                <div className="relative">
                  <select {...atributos('tipo')} className={`${estiloCampo} cursor-pointer appearance-none pr-12`}>
                    <option value="">Selecciona una opción</option>
                    {TIPOS.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 7l6 6 6-6" />
                  </svg>
                </div>
              </Campo>
            </div>
            <div className="sm:col-span-2">
              <Campo id="contacto-mensaje" etiqueta="Mensaje" error={errores.mensaje}>
                <textarea rows="5" {...atributos('mensaje')} className={`${estiloCampo} resize-y`} />
              </Campo>
            </div>
            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
              <button type="submit" disabled={estado === 'enviando'} className={botonPrimario}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
              </button>
              <p role="status" className="text-sm font-medium">
                {mensajesEstado[estado]}
              </p>
            </div>
          </form>

          <div className="mt-14 border-t-2 border-graphite pt-8">
            {hayDatos && (
              <dl className="mb-6 grid gap-6 sm:grid-cols-3">
                {!esPendiente(MARCA.direccion) && (
                  <div>
                    <dt className="text-sm">Dirección</dt>
                    <dd className="mt-1 font-semibold">{MARCA.direccion}, {MARCA.ciudad}</dd>
                  </div>
                )}
                {!esPendiente(MARCA.telefono) && (
                  <div>
                    <dt className="text-sm">Teléfono</dt>
                    <dd className="mt-1 font-semibold">
                      <a href={`tel:${CONTACTO.telefonoHref}`} className="-my-3 inline-block py-3 underline underline-offset-4">
                        {MARCA.telefono}
                      </a>
                    </dd>
                  </div>
                )}
                {!esPendiente(MARCA.horario) && (
                  <div>
                    <dt className="text-sm">Horario</dt>
                    <dd className="mt-1 font-semibold">{MARCA.horario}</dd>
                  </div>
                )}
              </dl>
            )}
            <a
              href={enlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-safety decoration-2 underline-offset-[6px]"
            >
              Escríbenos por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
