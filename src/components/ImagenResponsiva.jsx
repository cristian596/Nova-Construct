// <picture> con AVIF y WebP generados por `npm run imagenes` (ruta-ANCHO.avif / ruta-ANCHO.webp).
// `anchos` debe coincidir con los que existen en disco; el original queda como respaldo en <img>.
export default function ImagenResponsiva({ src, anchos, sizes, ...resto }) {
  const base = src.replace(/\.webp$/, '')
  const srcSet = (ext) => anchos.map((ancho) => `${base}-${ancho}.${ext} ${ancho}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img src={src} {...resto} />
    </picture>
  )
}
