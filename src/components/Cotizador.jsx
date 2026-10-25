import { useRef, useState } from 'react'
import { ACABADOS, CIUDADES, M2, TIPOS } from '../data/cotizador.js'
import { enlaceWhatsApp, whatsappValido } from '../data/contacto.js'
import { calcularRango, formatearCOP, m2Valido, mensajeWhatsApp, PASOS, validarCotizacion } from '../lib/cotizar.js'
import { botonPrimario, contenedor, entradilla, tituloSeccion } from '../lib/ui.js'
import { generarFolio } from '../lib/folio.js'
import CotaControl from './CotaControl.jsx'

const lista = new Intl.ListFormat('es', { type: 'conjunction' })

const leerM2 = (texto) => (/^\d+$/.test(texto.trim()) ? Number(texto) : NaN)

function MensajeError({ id, children }) {
  return (
    <p id={id} className="mt-3 flex items-start gap-2 text-sm font-semibold text-safety">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
        <path d="M10 1l9.5 17H.5L10 1zm-1 6v5h2V7H9zm0 6.5V15h2v-1.5H9z" />
      </svg>
      {children}
    </p>
  )
}

function Opciones({ nombre, legend, opciones, valor, onChange, error, grupoRef, columnas }) {
  const errorId = `${nombre}-error`
  return (
    <fieldset ref={grupoRef} aria-describedby={error ? errorId : undefined}>
      <legend className="text-xl font-medium tracking-[-0.01em]">{legend}</legend>
      <div className={`mt-4 grid gap-2 ${columnas}`}>
        {opciones.map((opcion) => (
          <label key={opcion.id} className="relative">
            <input
              type="radio"
              name={nombre}
              value={opcion.id}
              checked={valor === opcion.id}
              onChange={() => onChange(opcion.id)}
              className="peer sr-only"
            />
            <span className="flex h-full min-h-12 cursor-pointer flex-col justify-center rounded-2xl bg-white/10 px-4 py-3 transition-[background-color,color,transform] duration-200 hover:bg-white/20 motion-safe:active:scale-[0.98] motion-reduce:transition-none peer-checked:bg-white peer-checked:text-graphite peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-safety">
              <span className="font-semibold">{opcion.nombre}</span>
              {opcion.detalle && <span className="mt-1 text-sm leading-snug">{opcion.detalle}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <MensajeError id={errorId}>{error}</MensajeError>}
    </fieldset>
  )
}

export default function Cotizador({ tipo, onTipoChange }) {
  const [m2Texto, setM2Texto] = useState(String(M2.inicial))
  const [acabados, setAcabados] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [intentado, setIntentado] = useState(false)
  const [folio] = useState(() => generarFolio())

  const refs = {
    tipo: useRef(null),
    m2: useRef(null),
    acabados: useRef(null),
    ciudad: useRef(null),
  }

  const m2 = leerM2(m2Texto)
  const valorCota = m2Valido(m2) ? m2 : Math.min(M2.max, Math.max(M2.min, Number.isFinite(m2) ? m2 : M2.min))
  const datos = { tipo, m2, acabados, ciudad }
  const errores = validarCotizacion(datos)
  const rango = calcularRango(datos)
  const faltantes = PASOS.filter((paso) => errores[paso.campo]).map((paso) => paso.nombre)

  // El error de m² se muestra en vivo; los demás, al intentar enviar.
  const errorDe = (campo) => (intentado || campo === 'm2' ? errores[campo] : undefined)

  const mostrarErrores = () => {
    setIntentado(true)
    const primero = PASOS.find((paso) => errores[paso.campo])
    const destino = refs[primero.campo].current
    const enfocable = destino?.matches('fieldset') ? destino.querySelector('input:checked, input') : destino
    enfocable?.focus()
  }

  return (
    <section id="cotizador" aria-labelledby="cotizador-titulo" className="scroll-mt-4 pb-24 lg:pb-40">
      <div className={contenedor}>
        <div data-fondo="oscuro" className="rounded-[2rem] bg-graphite px-5 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-20">
          <div className="max-w-3xl">
            <h2 id="cotizador-titulo" className={tituloSeccion}>
              Calcula un rango para tu obra
            </h2>
            <p className={`${entradilla} mt-6 text-concrete`}>
              Cuatro datos y tienes un rango preliminar en pesos. Sin registro y sin compromiso.
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-12 lg:col-span-7">
              <div>
                <Opciones
                  nombre="tipo"
                  legend="Tipo de proyecto"
                  opciones={TIPOS}
                  valor={tipo}
                  onChange={onTipoChange}
                  error={errorDe('tipo')}
                  grupoRef={refs.tipo}
                  columnas="grid-cols-2 sm:grid-cols-4"
                />
              </div>

              <div>
                <fieldset aria-describedby={`m2-ayuda${errorDe('m2') ? ' m2-error' : ''}`}>
                  <legend className="text-xl font-medium tracking-[-0.01em]">Metros cuadrados</legend>
                  <p id="m2-ayuda" className="mt-1 text-sm text-concrete">
                    Entre {M2.min} y {M2.max} m². Usa las flechas para ajustar de a 1 m² y Re Pág o Av Pág para saltar de a 10.
                  </p>
                  <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="m2-cota" className="sr-only">
                        Metros cuadrados, control deslizante
                      </label>
                      <CotaControl
                        id="m2-cota"
                        valor={valorCota}
                        onChange={(valor) => setM2Texto(String(valor))}
                        describedBy="m2-ayuda"
                      />
                    </div>
                    <div className="shrink-0">
                      <label htmlFor="m2-exacto" className="block text-sm font-medium">
                        Valor exacto
                      </label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <input
                          ref={refs.m2}
                          id="m2-exacto"
                          type="number"
                          inputMode="numeric"
                          min={M2.min}
                          max={M2.max}
                          step="1"
                          value={m2Texto}
                          onChange={(evento) => setM2Texto(evento.target.value)}
                          aria-invalid={Boolean(errorDe('m2'))}
                          aria-describedby={`m2-ayuda${errorDe('m2') ? ' m2-error' : ''}`}
                          className="min-h-12 w-24 rounded-xl border border-cement bg-graphite px-3 text-lg tabular-nums text-white aria-[invalid=true]:border-2 aria-[invalid=true]:border-safety"
                        />
                        <span aria-hidden="true" className="text-lg">
                          m²
                        </span>
                      </div>
                    </div>
                  </div>
                  {errorDe('m2') && <MensajeError id="m2-error">{errorDe('m2')}</MensajeError>}
                </fieldset>
              </div>

              <div>
                <Opciones
                  nombre="acabados"
                  legend="Nivel de acabados"
                  opciones={ACABADOS}
                  valor={acabados}
                  onChange={setAcabados}
                  error={errorDe('acabados')}
                  grupoRef={refs.acabados}
                  columnas="sm:grid-cols-3"
                />
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-xl font-medium tracking-[-0.01em]">
                  Ciudad
                </label>
                <div className="relative mt-4 sm:max-w-xs">
                  <select
                    ref={refs.ciudad}
                    id="ciudad"
                    value={ciudad}
                    onChange={(evento) => setCiudad(evento.target.value)}
                    aria-invalid={Boolean(errorDe('ciudad'))}
                    aria-describedby={errorDe('ciudad') ? 'ciudad-error' : undefined}
                    className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-cement bg-graphite py-2 pl-4 pr-12 text-base text-white aria-[invalid=true]:border-2 aria-[invalid=true]:border-safety"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {CIUDADES.map((opcion) => (
                      <option key={opcion.id} value={opcion.id}>
                        {opcion.nombre}
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
                {errorDe('ciudad') && <MensajeError id="ciudad-error">{errorDe('ciudad')}</MensajeError>}
              </div>
            </div>

            <aside
              aria-labelledby="resultado-titulo"
              data-fondo="claro"
              className="self-start rounded-3xl bg-white p-6 text-graphite sm:p-8 lg:sticky lg:top-24 lg:col-span-5"
            >
              <h3 id="resultado-titulo" className="text-2xl font-medium tracking-[-0.01em]">
                Tu rango preliminar
              </h3>

              <div role="status" className="mt-6">
                {rango ? (
                  <>
                    <p className="break-words text-4xl font-light leading-none tracking-[-0.03em] tabular-nums sm:text-5xl">
                      {formatearCOP(rango.minimo)}{' '}
                      <span className="my-2 block text-xl font-normal tracking-normal">a</span>{' '}
                      {formatearCOP(rango.maximo)}
                    </p>
                    <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-concrete p-4 text-sm">
                      {[
                        ['Proyecto', rango.tipo.nombre],
                        ['Área', `${rango.m2} m²`],
                        ['Acabados', rango.acabados.nombre],
                        ['Ciudad', rango.ciudad.nombre],
                      ].map(([termino, definicion]) => (
                        <div key={termino}>
                          <dt>{termino}</dt>
                          <dd className="mt-0.5 text-base font-semibold">{definicion}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <p className="leading-relaxed">
                    Para ver el rango, completa: {lista.format(faltantes)}.
                  </p>
                )}
              </div>

              <p className="mt-6 rounded-xl bg-safety/15 px-4 py-3 text-sm leading-relaxed">
                Rango preliminar. La cotización final requiere visita técnica.
              </p>

              {!whatsappValido ? null : rango ? (
                <a
                  href={enlaceWhatsApp(mensajeWhatsApp(rango, folio))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${botonPrimario} mt-6 w-full`}
                >
                  Enviar a WhatsApp
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              ) : (
                <button type="button" onClick={mostrarErrores} className={`${botonPrimario} mt-6 w-full`}>
                  Enviar a WhatsApp
                </button>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
