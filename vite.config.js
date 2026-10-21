import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { MARCA, esPendiente } from './src/data/marca.js'

const DOMINIO_EJEMPLO = 'https://tudominio.com'
const SALIDA = (archivo) => fileURLToPath(new URL(`./dist/${archivo}`, import.meta.url))

// Dominio de marca.js, validado: sin él (o con el de ejemplo) el build falla.
function dominioDeMarca() {
  const dominio = String(MARCA.dominio ?? '').trim().replace(/\/+$/, '')
  if (esPendiente(dominio) || dominio === DOMINIO_EJEMPLO || !/^https:\/\/[^\s/]+$/.test(dominio)) {
    throw new Error(
      '\n\n[marca.js] "dominio" está pendiente o es el de ejemplo (' +
        MARCA.dominio +
        ').\nEscribe tu dominio real en src/data/marca.js, con https:// y sin barra final ' +
        '(por ejemplo, \'https://midominio.com\'), y vuelve a compilar.\n',
    )
  }
  return dominio
}

// JSON-LD de HomeAndConstructionBusiness: solo los campos que no están pendientes.
function datosEstructurados(dominio) {
  const completo = (valor) => (esPendiente(valor) ? null : String(valor).trim())
  const direccion = {
    streetAddress: completo(MARCA.direccion),
    addressLocality: completo(MARCA.ciudad),
    addressRegion: completo(MARCA.departamento),
  }
  const hayDireccion = Object.values(direccion).some(Boolean)

  const datos = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: MARCA.nombre,
    url: `${dominio}/`,
    telephone: completo(MARCA.telefono),
    address: hayDireccion
      ? { '@type': 'PostalAddress', ...Object.fromEntries(Object.entries(direccion).filter(([, v]) => v)), addressCountry: 'CO' }
      : null,
    areaServed: completo(MARCA.zonaAtendida),
  }
  const limpio = Object.fromEntries(Object.entries(datos).filter(([, valor]) => valor))
  // "<" escapado para que ningún dato de marca.js pueda cerrar el <script>.
  const json = JSON.stringify(limpio, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n    </script>`
}

// Dominio y JSON-LD salen solo de marca.js. En desarrollo no hace nada.
function dominioYDatosEstructurados() {
  let dominio = ''
  return {
    name: 'dominio-y-datos-estructurados',
    apply: 'build',
    buildStart() {
      dominio = dominioDeMarca()
    },
    transformIndexHtml(html) {
      return html
        .replaceAll(DOMINIO_EJEMPLO, dominio)
        .replace('<!-- JSON-LD generado en build -->', () => datosEstructurados(dominio))
    },
    closeBundle() {
      // Si el build falló (dominio pendiente), no hay dist que corregir.
      if (!dominio) return
      for (const archivo of ['robots.txt', 'sitemap.xml']) {
        const ruta = SALIDA(archivo)
        writeFileSync(ruta, readFileSync(ruta, 'utf8').replaceAll(DOMINIO_EJEMPLO, dominio))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), dominioYDatosEstructurados()],
})
