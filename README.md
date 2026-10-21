# Plantilla de landing para constructora

Landing de una sola página para empresas de construcción y remodelación. Incluye: **hero** con foto, **servicios**, **cotizador preliminar** (calcula un rango en pesos), **proyectos** (galería), **proceso** de trabajo, **garantías** y **contacto** con formulario y WhatsApp.

Está hecha con React, Vite y Tailwind CSS. No necesita base de datos ni servidor: al compilarla se obtiene una carpeta de archivos estáticos (`dist`) que se sube a cualquier hosting.

Todos los textos de la plantilla son de ejemplo. La marca aparece como **AQUI VA TU MARCA** hasta que la cambies (ver sección 4).

---

## 1. Requisitos

- **Node.js 20.19 o superior** (o 22.12 o superior). Es el mínimo que pide Vite 8, que usa este proyecto. Verifica tu versión con `node -v`.
- **npm** (viene con Node.js).

## 2. Instalación y prueba local

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

La web queda disponible en **http://localhost:5173/** (si ese puerto está ocupado, Vite mostrará otro en la terminal). Los cambios que guardes se ven al instante. Para detenerlo: `Ctrl + C`.

Otros comandos disponibles:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo. |
| `npm run build` | Compila la web para publicar. El resultado queda en la carpeta `dist`. |
| `npm run og-image` | Regenera `public/og-image.jpg` (imagen para compartir en redes) con el nombre de la marca. |
| `npm run preview` | Muestra el contenido de `dist` tal como se vería publicado (por defecto en http://localhost:4173/). Ejecuta antes `npm run build`. |

## 3. Mapa de archivos

| Qué quieres cambiar | Dónde está |
| --- | --- |
| Nombre, eslogan, teléfono, dirección, horario, redes, colores | `src/data/marca.js` |
| Formulario de contacto (endpoint) | `src/data/contacto.js` |
| Precios del cotizador | `src/data/cotizador.js` |
| Proyectos de la galería | `src/data/proyectos.js` |
| Garantías | `src/data/garantias.js` |
| Opciones del menú de navegación | `src/data/secciones.js` |
| Textos del hero, servicios y proceso | `src/components/Hero.jsx`, `Servicios.jsx`, `Proceso.jsx` |
| Texto del aviso de privacidad | `src/pages/AvisoPrivacidad.jsx` |
| SEO y redes sociales | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/og-image.jpg` |
| Imágenes | `public/placeholders/` (hero) y `public/projects/` (proyectos) |

---

## 4. Cómo cambiar la marca

Todo lo que se repite en la web (nombre, teléfono, dirección…) está en **`src/data/marca.js`**. Cambia el valor entre comillas y guarda. Los textos con `TODO` en el archivo son los que debes reemplazar.

| Campo | Qué es | Dónde se ve |
| --- | --- | --- |
| `nombre` | Nombre de la empresa. | Logotipo (la primera palabra va en negrita fuerte), header, footer, mensajes de WhatsApp. |
| `eslogan` | Frase corta. | Texto bajo el titular del hero y en el footer. |
| `ciudad` | Ciudad sede. | Sección de contacto, después de la dirección. |
| `dominio` | Dirección de la web, con `https://` y sin `/` al final. | Referencia para ti; las copias que usa Google están en `index.html`, `robots.txt` y `sitemap.xml` (ver 5.7). |
| `colores` | Los cinco colores de la web. | Ver 5.8. |
| `telefonoWhatsapp` | Número en formato internacional, **solo dígitos** (57 + número). | Enlace de WhatsApp (botones y formulario) y enlace de llamada. |
| `telefono` | Teléfono tal como se muestra. | Sección de contacto. |
| `direccion` | Dirección **sin la ciudad** (se agrega sola desde `ciudad`). | Sección de contacto. |
| `horario` | Horario de atención. | Sección de contacto. |
| `anio_fundacion` | Año de fundación, solo el número. | Hero: "Desde AAAA". |
| `redes` | Enlaces completos a tus perfiles: `instagram`, `facebook`, `linkedin`, `youtube`, `tiktok`. | Footer. Solo aparecen los que tengan enlace; los vacíos se ocultan. |
| `correo` | Correo de contacto. | Aviso de privacidad (responsable y canales para ejercer derechos). |
| `urlAvisoPrivacidad` | `'/aviso-de-privacidad'` (página interna) o una URL externa completa. | Enlace "Aviso de privacidad" del footer (ver 5.6). |
| `avisoPrivacidadActualizado` | Fecha `AAAA-MM-DD` de la última revisión del aviso. | Sección "Vigencia" del aviso de privacidad. |

**Ejemplo, antes y después:**

```js
// Antes
nombre: 'AQUI VA TU MARCA',
telefonoWhatsapp: '570000000000',
telefono: 'TODO: +57 000 000 0000',
direccion: 'TODO: dirección',
anio_fundacion: 1976,

// Después
nombre: 'CONSTRUCTORA ANDES',
telefonoWhatsapp: '573001234567',
telefono: '+57 300 123 4567',
direccion: 'Cra. 11 # 93-45, oficina 502',
anio_fundacion: 2012,
```

Con eso, el logotipo dirá **CONSTRUCTORA** en negrita y **ANDES** en peso medio, y el WhatsApp saludará con "Hola, CONSTRUCTORA ANDES…".

Además del nombre en `marca.js`, cambia el nombre en estos lugares, que no leen ese archivo:

- `index.html`: `<title>`, `description`, `og:site_name`, `og:title`, `og:image:alt`, `twitter:title` y `"name"` del JSON-LD.
- `package.json`: campo `name` (solo minúsculas y guiones, por ejemplo `constructora-andes`).
- `public/favicon.svg`: el ícono de la pestaña, que hoy muestra una "A". Reemplázalo por tu logo en SVG.

---

## 5. Cómo cambiar cada sección

### 5.1 Hero (portada)

- **Titular**: `src/components/Hero.jsx`, lista `TITULAR`. Cada elemento es una línea del titular, y cada línea se anima por separado.
- **Dato sobre la línea naranja** ("Desde 1976"): sale de `anio_fundacion` en `marca.js`. Si prefieres otro dato (por ejemplo "+300 obras"), cambia `DATO_COTA` en `Hero.jsx`.
- **Texto bajo el titular**: es el `eslogan` de `marca.js`.
- **Botones**: sus textos ("Cotizar mi proyecto", "Ver proyectos") están directamente en `Hero.jsx`.
- **Foto**: archivo `public/placeholders/hero.webp`. La ruta se define en `Hero.jsx`, constante `IMAGEN_HERO`. La foto ocupa todo el ancho de la pantalla y se recorta para llenar el espacio, así que:
  - Usa una foto **horizontal (apaisada), de al menos 2400 px de ancho**. La actual mide 1456 × 816 px y se ve blanda en pantallas grandes.
  - Pon el sujeto principal en el **lado derecho**: el texto va a la izquierda sobre un degradado oscuro.
  - Si cambias el tamaño, actualiza los atributos `width` y `height` de la etiqueta `<img>` en `Hero.jsx`.
  - Formato recomendado: WebP, idealmente por debajo de 300 KB.

### 5.2 Servicios

Archivo `src/components/Servicios.jsx`, lista `SERVICIOS`. Cada servicio tiene:

- `tipo`: identificador. **Debe coincidir con un `id` de `TIPOS` en `src/data/cotizador.js`** (por ejemplo `remodelacion`); así el botón "Cotizar" deja ese tipo preseleccionado en el cotizador.
- `titulo` y `descripcion`: los textos visibles.

El titular de la sección y su párrafo están en el mismo archivo, dentro del código de la función `Servicios`.

> `src/data/secciones.js` **no** contiene los servicios: define las opciones del menú (id de la sección y su nombre) en el header y el footer.

### 5.3 Cotizador

Archivo `src/data/cotizador.js`. **Todos los valores actuales son de ejemplo: reemplázalos con tus precios reales.**

**Fórmula real del cálculo** (`src/lib/cotizar.js`):

```
base   = m² × precio base del tipo × multiplicador de acabados × factor de ciudad
mínimo = base × 0,90, redondeado hacia abajo al múltiplo de 100.000
máximo = base × 1,15, redondeado hacia arriba al múltiplo de 100.000
```

La web muestra el rango "mínimo a máximo", nunca un valor único.

**Ejemplo:** Remodelación, 80 m², acabados Medio, Bogotá → 80 × 1.300.000 × 1,3 × 1 = 135.200.000. Rango mostrado: **$121.600.000 a $155.500.000**.

| Constante | Qué significa |
| --- | --- |
| `TIPOS` | Tipos de proyecto. `precioBase` es el precio en pesos (COP) **por m²** de ese tipo. Cada tipo tiene `id` (interno, sin espacios) y `nombre` (visible). |
| `ACABADOS` | Niveles de acabado. `multiplicador` multiplica el precio: `1` deja el precio base, `1.3` lo sube 30 %, `1.7` lo sube 70 %. `detalle` es la descripción que ve el cliente. |
| `CIUDADES` | Ciudades que atiendes. `factor` ajusta el precio por ciudad: `1` es la ciudad de referencia, `0.94` es 6 % más barato, `1.03` es 3 % más caro. Si una ciudad no está en la lista, el cliente no puede cotizar allí. |
| `M2` | Límites del control de metros cuadrados: `min` (20) y `max` (300), `marca` (10, el salto de las marcas y de las teclas Re Pág / Av Pág) e `inicial` (80, el valor con el que arranca). |
| `RANGO` | Margen del resultado: `inferior: 0.9` (10 % por debajo del cálculo) y `superior: 1.15` (15 % por encima). |
| `REDONDEO` | Múltiplo en pesos al que se redondea el rango (100.000), para no aparentar una precisión que no existe. |

Cosas a tener en cuenta:

- Para **agregar un tipo de proyecto**, añade un elemento a `TIPOS` y, si quieres que aparezca en la sección de servicios, un servicio con el mismo `tipo` en `Servicios.jsx`. El formulario de contacto toma sus opciones de `TIPOS`.
- Si cambias `M2.min` o `M2.max`, actualiza también la lista `ETIQUETAS` (los números bajo la regla) en `src/components/CotaControl.jsx`.
- El mensaje de WhatsApp que se arma con la cotización está en `mensajeWhatsApp`, en `src/lib/cotizar.js`.
- Los textos del cotizador ("Calcula un rango para tu obra", etc.) están en `src/components/Cotizador.jsx`.

### 5.4 Proyectos

Archivo `src/data/proyectos.js`. Cada proyecto tiene `nombre`, `tipo`, `m2`, `semanas`, `imagen` y `alt`.

**Para agregar o cambiar una imagen:**

1. Guarda la foto en **`public/projects/`**.
2. Nombre **sin espacios, tildes ni mayúsculas**, con guiones: `casa-bosque.webp` (no `Casa Bosque.webp`).
3. Formato **WebP** (o JPG), proporción **4:5 vertical**, mínimo **800 × 1000 px** (las actuales miden 960 × 1200 px). Si la proporción es otra, la web recorta la imagen para llenar el marco 4:5.
4. En `proyectos.js`, escribe `imagen: '/projects/casa-bosque.webp'`. La ruta empieza con `/` y **no** incluye `public`.
5. Escribe `alt`: una frase que **describa lo que se ve en la foto** (para personas con lector de pantalla y para Google). No pongas el nombre de la empresa.

Para agregar un proyecto nuevo, copia un bloque completo `{ … }` y cambia sus valores. La cantidad de proyectos ("6 proyectos") se actualiza sola.

**Leyenda "Ilustración de ejemplo":** aparece bajo cada imagen. Está en `src/components/Proyectos.jsx` (busca `Ilustración de ejemplo`). Cuando uses fotos reales de tus obras, **elimina esa línea** o cámbiala por otra leyenda (por ejemplo, "Foto: obra terminada, 2024").

Si una imagen no carga, el marco gris se mantiene con la leyenda debajo y la página no se rompe.

### 5.5 Proceso y garantías

**Garantías**, `src/data/garantias.js`. Cada garantía tiene:

- `concepto`: a qué aplica (Obra civil, Acabados…).
- `plazo`: el texto que se muestra ("10 años").
- `anios`: el mismo plazo **como número** (`10`). Sirve para calcular el "hasta N años" de la línea sobre la tabla (toma el mayor).
- `cobertura`: qué cubre.

Mantén `plazo` y `anios` coherentes. **Confirma los plazos y coberturas con el responsable legal antes de publicar**: los actuales son ejemplos.

**Proceso**, `src/components/Proceso.jsx`, lista `PASOS` (`titulo` y `texto` de cada etapa). El diseño está pensado para **5 etapas**: si cambias la cantidad, ajusta también `lg:grid-cols-5` en el mismo archivo y el texto "Cinco etapas, siempre en el mismo orden".

### 5.6 Contacto

- **Dirección, teléfono, horario y ciudad**: `src/data/marca.js` (ver sección 4).
- **Textos de la sección** ("Hablemos de tu obra", etiquetas del formulario): `src/components/Contacto.jsx`.
- **Formulario**: tiene dos modos, según `formularioEndpoint` en `src/data/contacto.js`:
  - **Vacío** (`''`, como viene): al enviar, abre WhatsApp con el mensaje ya escrito (nombre, teléfono, tipo de proyecto y mensaje). No necesita nada más.
  - **Con un endpoint**: la web envía los datos por `POST` en formato JSON a esa dirección y muestra "Recibimos tu mensaje". Funciona con servicios como [Formspree](https://formspree.io) o con tu propio servidor. Pasos con Formspree: crea una cuenta y un formulario, copia su URL (`https://formspree.io/f/xxxxxxxx`) y pégala: `formularioEndpoint: 'https://formspree.io/f/xxxxxxxx'`.

  Los datos que envía son `nombre`, `telefono`, `tipo` (el nombre visible del tipo de proyecto) y `mensaje`. Si el servidor responde con error, la web avisa al visitante y le sugiere WhatsApp.
- El enlace de llamada usa el mismo número que WhatsApp (`telefonoWhatsapp`).
- **Aviso de privacidad**: la plantilla incluye una página en **`/aviso-de-privacidad`** (archivo `src/pages/AvisoPrivacidad.jsx`), y el enlace del footer apunta a ella. **Es un texto de ejemplo (borrador): debe revisarlo un abogado antes de publicar.** Lo que debes hacer:
  - Completa en `marca.js` `nombre`, `ciudad`, `correo` y `telefono`: la página los lee de ahí.
  - Actualiza `avisoPrivacidadActualizado` (formato `AAAA-MM-DD`) cada vez que se revise el texto; es la fecha de la sección "Vigencia".
  - **Para usar una política que ya tienes publicada en otro sitio**, cambia `urlAvisoPrivacidad` en `marca.js` por la URL completa (por ejemplo `'https://tudominio.com/politica-de-privacidad'`). El footer la usará tal cual y abrirá en la misma pestaña. Si dejas el valor por defecto (`'/aviso-de-privacidad'`), el footer usa la página interna.
  - Para editar el texto, modifica `src/pages/AvisoPrivacidad.jsx`. El comentario del inicio del archivo recuerda que es un borrador; quítalo solo cuando un abogado lo apruebe.

### 5.7 SEO

Estos archivos **no leen `marca.js`**; edítalos a mano.

**`index.html`**

- `<title>` y `description`: lo que se ve en Google. Título de hasta ~60 caracteres, descripción de hasta ~155.
- `canonical`, `og:url`, `og:image` y `twitter:image`: reemplaza `https://tudominio.com` por tu dominio real.
- `og:*` y `twitter:*`: lo que se ve al compartir el enlace en WhatsApp, Facebook, LinkedIn y X.
- **Imagen para compartir**: `public/og-image.jpg` (1200 × 630 px) es una imagen genérica con el nombre de la marca. Se regenera con `npm run og-image` (lee el nombre y el eslogan de `marca.js`; necesita Chrome o Edge instalado e internet). Cuando tengas una foto o diseño de marca, reemplaza el archivo por otro JPG del mismo tamaño y nombre.
- **JSON-LD** (el bloque `<script type="application/ld+json">`): son los datos de empresa para Google. Completa `name`, `url`, `telephone`, `address` (`streetAddress`, `addressLocality`, `addressRegion`) y `areaServed`. No publiques valores que digan `TODO`.

**`public/robots.txt`**: en la línea `Sitemap:`, pon tu dominio real.

**`public/sitemap.xml`**: en cada `<loc>` (la landing y `/aviso-de-privacidad`), pon tu dominio real. Si usas una URL externa para el aviso (5.6), elimina el bloque `<url>` de `/aviso-de-privacidad`.

Haz la búsqueda de `tudominio.com` en todo el proyecto para no dejar ninguna copia.

### 5.8 Colores

Los colores se definen en `colores`, dentro de `src/data/marca.js`; `tailwind.config.js` los lee de ahí. La paleta es cerrada: **solo existen estos cinco** y no se puede usar ningún otro.

| Token | Valor actual | Dónde se usa |
| --- | --- | --- |
| `white` | `#FFFFFF` | Fondo del header y de las secciones Servicios, Proceso y Contacto; texto sobre fondos oscuros; botón secundario. |
| `concrete` | `#ECECEA` | Fondo de las secciones Proyectos y Garantías; texto secundario sobre fondos oscuros (cotizador, footer). |
| `graphite` | `#2A2C2E` | Texto principal; fondo del hero, cotizador y footer; bordes y líneas de la tabla de garantías; texto de botones. |
| `cement` | `#8B8F94` | Bordes de campos, líneas decorativas y fondo del marco de las imágenes. **No lo uses para texto sobre fondo claro** (no cumple el contraste mínimo de accesibilidad). |
| `safety` | `#FF6A13` | Color de acento: botón principal, anillo de foco del teclado, avisos de error, línea de cota del hero. |

Hay tres lugares donde el color está escrito a mano y **debes cambiar tú** si modificas la paleta:

- `index.html`: `<meta name="theme-color" content="#2A2C2E" />` (el color de la barra del navegador en el móvil).
- `public/favicon.svg`: los colores del ícono.
- `src/components/Proyectos.jsx`: el color de la barra de desplazamiento de la galería (`#8B8F94`).

Después de cambiar colores, revisa que el texto siga siendo legible: el texto `graphite` sobre `safety` y el `concrete` sobre `graphite` son las combinaciones clave.

### 5.9 Tipografía

La web usa **Archivo** de Google Fonts, una fuente con eje de ancho variable. Se carga en `index.html` con:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" />
```

y se asigna en `tailwind.config.js` (`fontFamily.sans`).

**Para cambiarla:**

1. Elige una fuente en [fonts.google.com](https://fonts.google.com) y copia su enlace `<link>`; reemplaza el de Archivo en `index.html`.
2. En `tailwind.config.js`, cambia `Archivo` por el nombre de tu fuente en `fontFamily.sans`.
3. Los titulares usan las clases `ancho-condensado`, `ancho-semi` y `ancho-normal` (definidas al final de `tailwind.config.js`), que modifican el **ancho** de la letra. Eso solo funciona con fuentes que tengan eje de ancho (`wdth`), como Archivo. Con otra fuente esas clases no tendrán efecto y los titulares se verán más anchos de lo diseñado; revisa el resultado.

---

## 6. Antes de publicar

Marca cada punto:

- [ ] Reemplazar **todos los `TODO`**. Búscalos en todo el proyecto (en VS Code: `Ctrl + Shift + F` y escribe `TODO`). Revisa en especial: `marca.js`, `index.html` (JSON-LD), `contacto.js`, `Footer.jsx`.
- [ ] Reemplazar `tudominio.com` por el dominio real en `index.html`, `robots.txt` y `sitemap.xml`.
- [ ] Revisar el **cotizador con precios reales** (`cotizador.js`) y probar varios casos haciendo las cuentas a mano.
- [ ] **Confirmar las garantías** (`garantias.js`) con el responsable de la empresa.
- [ ] Reemplazar las **ilustraciones por fotos reales** de tus obras, o dejar la leyenda "Ilustración de ejemplo" mientras tanto. Cambiar también la foto del hero.
- [ ] Reemplazar `public/og-image.jpg` por la imagen de tu marca (1200 × 630 px), o regenerarla con `npm run og-image` después de cambiar el nombre.
- [ ] Reemplazar `public/favicon.svg` por tu logo.
- [ ] Probar en el **móvil real**: menú, cotizador, formulario, botón de WhatsApp y llamada.
- [ ] Probar el **formulario**: enviar un mensaje de prueba y confirmar que llega.
- [ ] **Aviso de privacidad**: hacer que **un abogado revise el texto** de `src/pages/AvisoPrivacidad.jsx` (es un borrador), completar `correo` en `marca.js`, actualizar `avisoPrivacidadActualizado`, y comprobar que `/aviso-de-privacidad` abre y que el enlace del footer funciona. Si usas una política externa, pon su URL en `urlAvisoPrivacidad`.
- [ ] Ejecutar `npm run build` y confirmar que termina sin errores.

---

## 7. Cómo publicar

Esta web es estática. Se compila con:

```bash
npm run build
```

Eso genera la carpeta **`dist`**, que es **la carpeta que se publica**. Hosting recomendado (ambos tienen plan gratuito): Netlify o Vercel. El proyecto no incluye configuración previa de ninguno, así que se indica en el panel de cada servicio. La web tiene una landing y la página `/aviso-de-privacidad`, que se resuelven en el navegador; por eso el proyecto incluye `public/_redirects` (Netlify) y `vercel.json` (Vercel), que envían cualquier ruta a `index.html`. Sin ellos, abrir `/aviso-de-privacidad` directamente daría error 404. Si usas otro hosting, configura la misma regla.

### Opción A: Netlify

1. Sube el proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2. En [netlify.com](https://www.netlify.com): **Add new site → Import an existing project** y elige el repositorio.
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Si el despliegue falla por la versión de Node, agrega la variable de entorno `NODE_VERSION` con valor `22`.
5. Pulsa **Deploy**. En unos minutos tendrás una dirección temporal tipo `algo.netlify.app`.

*Alternativa sin repositorio:* ejecuta `npm run build` y arrastra la carpeta `dist` a la página [app.netlify.com/drop](https://app.netlify.com/drop).

### Opción B: Vercel

1. Sube el proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2. En [vercel.com](https://vercel.com): **Add New → Project** e importa el repositorio.
3. Vercel detecta Vite solo. Confirma:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Pulsa **Deploy**.

### Conectar tu dominio propio

1. Compra el dominio en un registrador (GoDaddy, Namecheap, Hostinger, Cloudflare, etc.).
2. En el panel del hosting: **Domain settings → Add custom domain** (Netlify) o **Settings → Domains** (Vercel). Escribe tu dominio.
3. El hosting te mostrará **los registros DNS exactos** que debes crear. No copies valores de otros tutoriales: usa los que te indique tu panel. Normalmente son:
   - un registro **A** (o ALIAS/ANAME) para el dominio raíz (`tudominio.com`);
   - un registro **CNAME** para `www`.
4. Entra al panel DNS de tu registrador y crea esos registros. Puede tardar desde unos minutos hasta 24 horas en funcionar.
5. El hosting activa el certificado HTTPS (el candado) de forma automática cuando el dominio queda conectado.
6. Cuando el dominio funcione, confirma que `index.html`, `robots.txt` y `sitemap.xml` usan ese mismo dominio (sección 5.7) y vuelve a publicar.

---

## 8. Cómo enviar el sitio a Google

1. Entra a [Google Search Console](https://search.google.com/search-console) con tu cuenta de Google.
2. **Agregar propiedad**. Lo más simple es "Prefijo de URL" con tu dirección completa (`https://tudominio.com/`).
3. **Verifica** que eres el dueño. Con "Prefijo de URL" puedes usar la etiqueta HTML: Google te da una línea `<meta name="google-site-verification" …>`; pégala dentro de `<head>` en `index.html`, vuelve a publicar y pulsa **Verificar**. (La verificación por dominio usa un registro DNS de tipo TXT que Google te indica.)
4. En el menú **Sitemaps**, escribe `sitemap.xml` y pulsa **Enviar**. El estado debe cambiar a "Correcto".
5. En **Inspección de URLs**, pega tu dirección y pulsa **Solicitar indexación**.
6. Google tarda de unos días a un par de semanas en mostrar la web. Si no aparece, revisa que `robots.txt` no bloquee el sitio (debe decir `Allow: /`).

Para aparecer en Google Maps y en búsquedas locales, crea además un perfil gratuito en [Google Business Profile](https://www.google.com/business/) con los mismos datos de contacto.

---

## 9. Soporte y próximos pasos

**Si algo se rompe:**

1. **La web publicada se ve mal después de un cambio.** Vuelve a la versión anterior desde el panel de Netlify o Vercel (sección *Deploys*, opción de restaurar el despliegue anterior).
2. **`npm run build` da error.** Lee el mensaje: casi siempre indica el archivo y la línea. Los errores más comunes son una comilla o llave sin cerrar en un archivo que editaste, o una coma que falta entre elementos de una lista.
3. **Algún cambio no aparece.** Detén `npm run dev` con `Ctrl + C`, vuelve a ejecutarlo y recarga la página con `Ctrl + F5`.
4. **Un comando no funciona.** Verifica `node -v` (mínimo 20.19) y que estás dentro de la carpeta del proyecto.

**Próximos pasos sugeridos:** agregar tus fotos reales, conectar el formulario a un endpoint, hacer revisar el aviso de privacidad por un abogado, abrir el perfil de Google Business y medir visitas con una herramienta de analítica de tu preferencia.

---

## Licencia

El uso de este proyecto/código fuente está sujeto a los términos expresados en el archivo LICENSE.md adjunto.
