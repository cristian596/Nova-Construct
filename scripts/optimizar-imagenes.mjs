// Genera versiones AVIF y WebP por ancho junto a cada original (hero-960.avif, hero-960.webp, ...).
// Uso: npm run imagenes. Los originales no se tocan. No amplía: omite los anchos mayores al original.
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
const ANCHOS = [480, 960, 1440, 2400]
const ORIGENES = ['placeholders/hero.webp']

for (const archivo of await readdir(path.join(RAIZ, 'projects'))) {
  if (archivo.endsWith('.webp') && !/-(480|960|1440|2400)\.webp$/.test(archivo)) ORIGENES.push(`projects/${archivo}`)
}

for (const origen of ORIGENES) {
  const ruta = path.join(RAIZ, origen)
  const { dir, name } = path.parse(ruta)
  const { width } = await sharp(ruta).metadata()
  const generados = []

  for (const ancho of ANCHOS.filter((a) => a <= width)) {
    const base = sharp(ruta).resize({ width: ancho })
    const avif = path.join(dir, `${name}-${ancho}.avif`)
    const webp = path.join(dir, `${name}-${ancho}.webp`)
    await base.clone().avif({ quality: 55, effort: 6 }).toFile(avif)
    await base.clone().webp({ quality: 78 }).toFile(webp)
    generados.push(`${ancho}px (avif ${((await stat(avif)).size / 1024).toFixed(0)} kB, webp ${((await stat(webp)).size / 1024).toFixed(0)} kB)`)
  }
  console.log(`${origen} [${width}px]: ${generados.join(', ')}`)
}
