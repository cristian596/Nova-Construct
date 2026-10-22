// Build de demo para publicar en Cloudflare, sin indexación en buscadores.
// Uso: npm run demo -- https://constructora-demo.pages.dev
import { resolve } from 'node:path'
import { build } from 'vite'

const dominio = process.argv[2] ?? ''

if (!/^https:\/\/[^\s/]+$/.test(dominio)) {
  console.error(
    '\nDominio de la demo no válido: "' + dominio + '".\n' +
      'Debe empezar con https:// y no terminar en barra.\n' +
      'Uso: npm run demo -- https://constructora-demo.pages.dev\n',
  )
  process.exit(1)
}

// Deben definirse antes del build: vite.config.js los lee al cargarse.
process.env.DEMO = 'true'
process.env.DEMO_DOMINIO = dominio

await build({
  build: { outDir: 'dist-demo', emptyOutDir: true },
})

console.log('\nDemo generada en: ' + resolve('dist-demo'))
