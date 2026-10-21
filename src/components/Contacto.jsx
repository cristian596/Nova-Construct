import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACTO, PRESUPUESTOS, mensajeConfirmacion, mensajeError, TIEMPO_RESPUESTA, enlaceWhatsApp, whatsappValido } from '../data/contacto.js'
import { CIUDADES, TIPOS } from '../data/cotizador.js'
import { MARCA, esPendiente } from '../data/marca.js'
import { AVISO_EXTERNO, POLITICA_EXTERNA } from '../lib/aviso.js'
import { generarFolio } from '../lib/folio.js'
import { botonPrimario, botonSecundario, contenedor, tituloSeccion } from '../lib/ui.js'

const CAMPOS = ['nombre', 'telefono', 'tipo', 'autorizacion']
const VACIO = { nombre: '', telefono: '', tipo: '', ciudad: '', presupuesto: '', mensaje: '', autorizacion: false }

// Dirección, teléfono y horario pendientes ("TODO...") no se muestran al visitante.
const hayDatos = [MARCA.direccion, MARCA.telefono, MARCA.horario].some((valor) => !esPendiente(valor))
const hayWhatsapp = whatsappValido
const hayLateral = hayWhatsapp || hayDatos

function validar(valores) {
  const errores = {}
  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.'
  const digitos = valores.telefono.replace(/[\s()+-]/g, '').replace(/^57(?=\d{10}$)/, '')
  if (!/^\d{7,10}$/.test(digitos)) errores.telefono = 'Escribe un teléfono de 7 a 10 dígitos, por ejemplo 300 123 4567.'
  if (!TIPOS.some((tipo) => tipo.id === valores.tipo)) errores.tipo = 'Elige el tipo de proyecto.'
  if (!valores.autorizacion) errores.autorizacion = 'Necesitamos tu autorización para responder tu solicitud.'
  return errores
}

const LIMITE_MENSAJE = 1000

// Mensaje de WhatsApp con formato fijo; los campos opcionales vacíos llevan su valor por defecto.
function textoWhatsApp(valores, folio) {
  const tipo = TIPOS.find((opcion) => opcion.id === valores.tipo)
  const ciudad = CIUDADES.find((opcion) => opcion.id === valores.ciudad)
  let mensaje = valores.mensaje.trim()
  if (mensaje.length > LIMITE_MENSAJE) mensaje = `${mensaje.slice(0, LIMITE_MENSAJE)} (continúa en el chat)`

  return [
    `Hola, quiero solicitar una visita técnica con ${MARCA.nombre}.`,
    `Folio: ${folio}`,
    `Nombre: ${valores.nombre.trim() || 'No indicado'}`,
    `Teléfono: ${valores.telefono.trim() || 'No indicado'}`,
    `Tipo de proyecto: ${tipo?.nombre ?? 'No indicado'}`,
    `Ciudad: ${ciudad?.nombre ?? 'No indicada'}`,
    `Presupuesto estimado: ${valores.presupuesto || 'No indicado'}`,
    `Mensaje: ${mensaje || 'Sin mensaje'}`,
    `Autorización de datos: ${valores.autorizacion ? `sí (política v${MARCA.versionPolitica})` : 'no'}`,
  ].join('\n')
}

// Borde de 1 px; en foco o error pasa a 2 px y el relleno baja 1 px para que el campo no cambie de tamaño.
// El anillo de foco (2 px en safety, separado 2 px) viene de :focus-visible en index.css.
const estiloCampo = [
  'mt-2 block min-h-12 w-full rounded-none border border-graphite bg-white px-3 py-3.5 text-base text-graphite shadow-none',
  'focus:border-2 focus:px-[11px] focus:py-[13px] aria-[invalid=true]:border-2 aria-[invalid=true]:px-[11px] aria-[invalid=true]:py-[13px]',
].join(' ')

const estiloSelect = `${estiloCampo} cursor-pointer appearance-none pr-12 focus:pr-[47px] aria-[invalid=true]:pr-[47px]`

function MensajeError({ id, children }) {
  return (
    <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-semibold text-safety">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
        <path d="M10 1l9.5 17H.5L10 1zm-1 6v5h2V7H9zm0 6.5V15h2v-1.5H9z" />
      </svg>
      {children}
    </p>
  )
}

function Campo({ id, etiqueta, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {etiqueta}
      </label>
      {children}
      {error && <MensajeError id={id}>{error}</MensajeError>}
    </div>
  )
}

function IconoWhatsApp() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function Contacto() {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [intentado, setIntentado] = useState(false)
  const [folio] = useState(() => generarFolio())
  const [estado, setEstado] = useState('inicial')
  const formRef = useRef(null)
  const mensajeRef = useRef(null)
  const avisoRef = useRef(null)

  // El textarea parte en 3 filas y crece con el texto.
  useLayoutEffect(() => {
    const area = mensajeRef.current
    if (!area) return
    area.style.height = 'auto'
    area.style.height = `${area.scrollHeight}px`
  }, [valores.mensaje])

  const cambiar = (evento) => {
    const { name, type, checked, value } = evento.target
    const siguientes = { ...valores, [name]: type === 'checkbox' ? checked : value }
    setValores(siguientes)
    if (hayAviso) setEstado('inicial')
    if (intentado) setErrores(validar(siguientes))
  }

  const atributos = (campo, obligatorio = false) => ({
    id: `contacto-${campo}`,
    name: campo,
    value: valores[campo],
    onChange: cambiar,
    required: obligatorio,
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
    const ciudad = CIUDADES.find((opcion) => opcion.id === valores.ciudad)?.nombre ?? ''

    // Cuando exista backend, la autorización debe guardarse con: valor true, fecha y hora en formato ISO,
    // versión de la política (MARCA.versionPolitica) y, si es posible, la dirección IP.
    // Sin ese registro, la autorización no tiene prueba.
    if (!CONTACTO.formularioEndpoint) {
      window.open(enlaceWhatsApp(textoWhatsApp(valores, folio)), '_blank', 'noopener,noreferrer')
      setEstado('whatsapp')
      return
    }

    setEstado('enviando')
    try {
      const respuesta = await fetch(CONTACTO.formularioEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...valores, tipo, ciudad, versionPolitica: MARCA.versionPolitica }),
      })
      if (!respuesta.ok) throw new Error(String(respuesta.status))
      setEstado('enviado')
    } catch {
      setEstado('error')
    }
  }

  const hayAviso = estado === 'whatsapp' || estado === 'enviado' || estado === 'error'

  // El foco pasa al aviso cuando aparece, para que lo lea un lector de pantalla.
  useEffect(() => {
    if (hayAviso) avisoRef.current?.focus()
  }, [hayAviso, estado])

  const claveAviso = 'inline-flex min-h-11 items-center text-sm underline underline-offset-4'

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-white py-20 lg:py-28">
      <div className={contenedor}>
        <div className="max-w-2xl">
          <h2 id="contacto-titulo" className={tituloSeccion}>
            Hablemos de tu obra
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Déjanos tus datos y te llamamos para agendar la visita técnica.
          </p>
        </div>

        <div className={`mt-12 border border-graphite bg-concrete p-5 lg:p-8 ${hayLateral ? 'lg:grid lg:grid-cols-12' : ''}`}>
          <form ref={formRef} noValidate onSubmit={enviar} className={hayLateral ? 'pb-12 lg:col-span-7 lg:pb-0 lg:pr-12' : 'mx-auto w-full max-w-3xl'}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Campo id="contacto-nombre" etiqueta="Nombre" error={errores.nombre}>
                <input type="text" autoComplete="name" {...atributos('nombre', true)} />
              </Campo>
              <Campo id="contacto-telefono" etiqueta="Teléfono" error={errores.telefono}>
                <input type="tel" autoComplete="tel" inputMode="tel" {...atributos('telefono', true)} />
              </Campo>
              <Campo id="contacto-tipo" etiqueta="Tipo de proyecto" error={errores.tipo} className="sm:col-span-2">
                <div className="relative">
                  <select {...atributos('tipo', true)} className={estiloSelect}>
                    <option value="">Selecciona una opción</option>
                    {TIPOS.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </Campo>
              <Campo id="contacto-ciudad" etiqueta="Ciudad" className="sm:col-span-2">
                <div className="relative">
                  <select autoComplete="address-level2" {...atributos('ciudad')} className={estiloSelect}>
                    <option value="">Selecciona una opción</option>
                    {CIUDADES.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </Campo>
              <div className="sm:col-span-2">
                <Campo id="contacto-presupuesto" etiqueta="Presupuesto estimado">
                  <div className="relative">
                    <select autoComplete="off" {...atributos('presupuesto')} className={estiloSelect}>
                      <option value="">Selecciona una opción</option>
                      {PRESUPUESTOS.map((rango) => (
                        <option key={rango} value={rango}>
                          {rango}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                </Campo>
              </div>
              <div className="sm:col-span-2">
                <Campo id="contacto-mensaje" etiqueta="Cuéntanos brevemente (opcional)">
                  <textarea
                    ref={mensajeRef}
                    rows="3"
                    {...atributos('mensaje')}
                    className={`${estiloCampo} resize-none overflow-hidden`}
                  />
                </Campo>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="contacto-autorizacion" className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  id="contacto-autorizacion"
                  name="autorizacion"
                  type="checkbox"
                  checked={valores.autorizacion}
                  onChange={cambiar}
                  required
                  aria-invalid={Boolean(errores.autorizacion)}
                  aria-describedby={errores.autorizacion ? 'contacto-autorizacion-error' : undefined}
                  className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-none border border-graphite accent-graphite aria-[invalid=true]:outline aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-graphite"
                />
                <span>
                  Autorizo a {MARCA.nombre} a tratar mis datos personales para responder mi solicitud, conforme a la
                  Política de tratamiento de datos.
                </span>
              </label>
              {errores.autorizacion && <MensajeError id="contacto-autorizacion">{errores.autorizacion}</MensajeError>}
              {POLITICA_EXTERNA ? (
                <a href={MARCA.urlPoliticaDatos} className={`${claveAviso} mt-1`}>
                  Ver política de tratamiento
                </a>
              ) : (
                <Link to={MARCA.urlPoliticaDatos} className={`${claveAviso} mt-1`}>
                  Ver política de tratamiento
                </Link>
              )}
            </div>

            <div className="mt-6">
              {hayAviso && (
                <div
                  ref={avisoRef}
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                  className={`mb-6 flex items-start gap-3 border-2 bg-white p-5 text-sm font-medium ${
                    estado === 'error' ? 'border-safety' : 'border-graphite'
                  }`}
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  <p>
                    {estado === 'whatsapp' && (
                      <>
                        Revisa WhatsApp y pulsa enviar para completar tu solicitud. Si no se abrió,{' '}
                        <a
                          href={enlaceWhatsApp(textoWhatsApp(valores, folio))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4"
                        >
                          abrir WhatsApp de nuevo
                          <span className="sr-only"> (se abre en una pestaña nueva)</span>
                        </a>
                        .
                      </>
                    )}
                    {estado === 'enviado' && mensajeConfirmacion}
                    {estado === 'error' && mensajeError}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={estado === 'enviando'}
                className={`${botonPrimario} w-full lg:w-auto lg:px-4`}
              >
                {estado === 'enviando' ? 'Enviando…' : 'Solicitar cotización'}
              </button>
              <p className="mt-3 text-sm">{TIEMPO_RESPUESTA}</p>
              <p className="mt-6 text-sm">Usamos tus datos solo para responder tu solicitud.</p>
              {AVISO_EXTERNO ? (
                <a href={MARCA.urlAvisoPrivacidad} className={`${claveAviso} -mb-3`}>
                  Ver aviso de privacidad
                </a>
              ) : (
                <Link to={MARCA.urlAvisoPrivacidad} className={`${claveAviso} -mb-3`}>
                  Ver aviso de privacidad
                </Link>
              )}
            </div>
          </form>

          {hayLateral && (
            <div className="border-t border-cement pt-12 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {hayWhatsapp && (
                <div>
                  <p className="font-semibold">¿Prefieres respuesta inmediata?</p>
                  <a
                    href={enlaceWhatsApp(textoWhatsApp(valores.autorizacion ? valores : VACIO, folio))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botonSecundario} mt-4 w-full`}
                  >
                    <IconoWhatsApp />
                    Chatear por WhatsApp
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </div>
              )}
              {hayDatos && (
                <dl className={`grid gap-6 ${hayWhatsapp ? 'mt-8' : ''}`}>
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Chevron() {
  return (
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
  )
}
