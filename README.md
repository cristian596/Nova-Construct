# Plantilla de landing para constructora

Landing de una sola página para empresas de construcción y remodelación. Incluye: **hero** con foto, **servicios**, **cotizador preliminar** (calcula un rango en pesos), **proyectos** (carrusel de obras), **proceso** de trabajo (cinco etapas con íconos), **garantías** (tarjetas) y **contacto** con formulario y WhatsApp.

Está hecha con React, Vite y Tailwind CSS. No necesita base de datos ni servidor: al compilarla se obtiene una carpeta de archivos estáticos (`dist`) que se publica en Cloudflare Pages (ver sección 7).

Todos los textos de la plantilla son de ejemplo. La marca aparece como **AQUI VA TU MARCA** hasta que la cambies (ver sección 4). Antes de publicar, lee la **[guía de cumplimiento](GUIA-CUMPLIMIENTO.md)** y ejecuta `npm run revisar` (sección 6).

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
| `npm run build` | Compila la web para publicar. El resultado queda en la carpeta `dist`. **Falla a propósito si `dominio` de `marca.js` sigue pendiente** (ver 5.7). |
| `npm run revisar` | Revisa que no queden datos pendientes ni textos de ejemplo (ver sección 6). Termina con error si hay algo que impide publicar. |
| `npm run publicar` | Ejecuta `revisar` y, solo si no hay errores, `build`. |
| `npm run og-image` | Regenera `public/og-image.jpg` (imagen para compartir en redes) con el nombre de la marca (ver 5.7). |
| `npm run imagenes` | Genera las versiones AVIF y WebP en varios tamaños de las fotos de `public/placeholders/hero.webp` y de `public/projects/`. Ejecútalo cuando cambies una foto. |
| `npm run preview` | Muestra el contenido de `dist` tal como se vería publicado (por defecto en http://localhost:4173/). Ejecuta antes `npm run build`. |

## 3. Mapa de archivos

| Qué quieres cambiar | Dónde está |
| --- | --- |
| Nombre, eslogan, dominio, razón social, NIT, teléfono, dirección, horario, año de fundación, cifras del hero, redes, colores | `src/data/marca.js` |
| Formulario de contacto (endpoint) | `src/data/contacto.js` |
| Precios del cotizador (valores de ejemplo) | `src/data/cotizador.js` |
| Proyectos del carrusel (valores de ejemplo) | `src/data/proyectos.js` |
| Garantías (valores de ejemplo) | `src/data/garantias.js` |
| Opciones del menú de navegación | `src/data/secciones.js` |
| Textos del hero, servicios y proceso | `src/components/Hero.jsx`, `Servicios.jsx`, `Proceso.jsx` |
| Aviso de privacidad y política de tratamiento de datos | `src/pages/AvisoPrivacidad.jsx`, `src/pages/PoliticaTratamiento.jsx` |
| SEO y redes sociales | `index.html` (título y descripción), `src/data/marca.js` (dominio y datos de empresa), `public/og-image.jpg` |
| Revisión antes de publicar | `scripts/revisar.mjs` |
| Guía legal para el comprador (Ley 1581: consultas 10 días hábiles, reclamos 15) | `GUIA-CUMPLIMIENTO.md` |
| Guía de despliegue en Cloudflare Pages | `DESPLIEGUE-CLOUDFLARE.md` |
| Imágenes | `public/placeholders/` (hero) y `public/projects/` (proyectos) |

---

## 4. Cómo cambiar la marca

Todo lo que se repite en la web (nombre, teléfono, dirección…) está en **`src/data/marca.js`**. Cambia el valor entre comillas y guarda. Los textos con `TODO` en el archivo son los que debes reemplazar.

| Campo | Qué es | Dónde se ve |
| --- | --- | --- |
| `nombre` | Nombre de la empresa. | Logotipo (la primera palabra va en negrita fuerte), header, footer, mensajes de WhatsApp. |
| `eslogan` | Frase corta. | Texto bajo el titular del hero y en el footer. |
| `ciudad` | Ciudad sede. | Sección de contacto, después de la dirección. |
| `dominio` | Dirección de la web, con `https://` y sin `/` al final (por ejemplo `https://midominio.com`). | Se escribe solo, al compilar, en `index.html`, `robots.txt`, `sitemap.xml` y los datos estructurados (ver 5.7). **Mientras esté pendiente, `npm run build` falla.** |
| `departamento` | Departamento de la sede (por ejemplo Cundinamarca). | Solo en los datos estructurados para Google (5.7). |
| `zonaAtendida` | Ciudades o región donde trabajas. | Solo en los datos estructurados para Google (5.7). |
| `razonSocial` y `nit` | Razón social y NIT de tu empresa. | Footer, junto al copyright: "Razón social: … · NIT: …". Si uno está pendiente, no se muestra; si ambos lo están, no aparece la línea. Son obligatorios para publicar (ver la guía de cumplimiento). |
| `colores` | Los cinco colores de la web. | Ver 5.8. |
| `telefonoWhatsapp` | Número en formato internacional, **solo dígitos** (57 + número). | Enlace de WhatsApp (botones y formulario) y enlace de llamada. |
| `telefono` | Teléfono tal como se muestra. | Sección de contacto. |
| `direccion` | Dirección **sin la ciudad** (se agrega sola desde `ciudad`). | Sección de contacto. |
| `horario` | Horario de atención. | Sección de contacto. |
| `anio_fundacion` | Año de fundación de tu empresa, solo el número. Lo pones tú: no hay un valor por defecto. | Hero: "Desde AAAA" en la línea de cota. Mientras esté pendiente, esa línea se oculta completa. |
| `datosConfianza` | Tres cifras de la empresa (por ejemplo `25` años de experiencia). Las que digan `TODO` se ocultan; con menos de dos cifras, se oculta la fila. | Hero, bajo el eslogan. |
| `redes` | Enlaces completos a tus perfiles: `instagram`, `facebook`, `linkedin`, `youtube`, `tiktok`. | Footer. Solo aparecen los que tengan enlace; los vacíos se ocultan. |
| `correo` | Correo de contacto. | Aviso de privacidad y política de tratamiento (responsable y canal para ejercer derechos). |
| `urlAvisoPrivacidad` | `'/aviso-de-privacidad'` (página interna) o una URL externa completa. | Enlace "Aviso de privacidad" del footer (ver 5.6). |
| `urlPoliticaDatos` | `'/politica-de-tratamiento-de-datos'` (página interna) o una URL externa completa. | Enlace "Política de tratamiento de datos" del footer y del formulario. |
| `fechaPolitica` y `versionPolitica` | Fecha `AAAA-MM-DD` y versión de la política de tratamiento. | La fecha se muestra en la política; la versión viaja en el mensaje de WhatsApp con la autorización. |
| `avisoPrivacidadActualizado` | Fecha `AAAA-MM-DD` de la última revisión del aviso. | Sección "Vigencia" del aviso de privacidad. |

**Ejemplo, antes y después:**

```js
// Antes
nombre: 'AQUI VA TU MARCA',
telefonoWhatsapp: 'TODO: 57XXXXXXXXXX',
telefono: 'TODO: +57 000 000 0000',
direccion: 'TODO: dirección',
anio_fundacion: 'TODO: año de fundación',

// Después
nombre: 'CONSTRUCTORA ANDES',
telefonoWhatsapp: '573001234567',
telefono: '+57 300 123 4567',
direccion: 'Cra. 11 # 93-45, oficina 502',
anio_fundacion: 2012, // ejemplo: pon el año real de tu empresa
```

Con eso, el logotipo dirá **CONSTRUCTORA** en negrita y **ANDES** en peso medio, y el WhatsApp saludará con "Hola, CONSTRUCTORA ANDES…".

Además del nombre en `marca.js`, cambia el nombre en estos lugares, que no leen ese archivo:

- `index.html`: `<title>`, `description`, `og:site_name`, `og:title`, `og:image:alt` y `twitter:title`. El `"name"` del JSON-LD sale solo de `marca.js`.
- `package.json`: campo `name` (solo minúsculas y guiones, por ejemplo `constructora-andes`).
- `public/favicon.svg`: el ícono de la pestaña, que hoy muestra una "A". Reemplázalo por tu logo en SVG.

---

## 5. Cómo cambiar cada sección

### 5.1 Hero (portada)

- **Titular**: `src/components/Hero.jsx`, lista `TITULAR`. Cada elemento es una línea del titular, y cada línea se anima por separado.
- **Línea de cota naranja** ("Desde AAAA", donde AAAA es tu año de fundación): sale de `anio_fundacion` en `marca.js`. Si ese dato está pendiente, la línea completa (trazo, texto y extremos) no se muestra. Si prefieres otro dato (por ejemplo "+300 obras"), cambia `DATO_COTA` en `Hero.jsx`.
- **Texto bajo el titular**: es el `eslogan` de `marca.js`.
- **Cifras de la empresa**: salen de `datosConfianza` en `marca.js` y se muestran dentro del hero, bajo el eslogan. Las pendientes se omiten y, con menos de dos, se oculta la fila.
- **Botones**: sus textos ("Cotizar mi proyecto", "Ver proyectos") están directamente en `Hero.jsx`.
- **Palabra decorativa** del fondo: `palabraFondo` en `marca.js`.
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
3. Formato **WebP** (o JPG), proporción **4:5 vertical**, mínimo **800 × 1000 px** (las actuales miden 960 × 1200 px). Después ejecuta `npm run imagenes` para generar las versiones AVIF y WebP en varios tamaños. Si la proporción es otra, la web recorta la imagen para llenar el marco 4:5.
4. En `proyectos.js`, escribe `imagen: '/projects/casa-bosque.webp'`. La ruta empieza con `/` y **no** incluye `public`.
5. Escribe `alt`: una frase que **describa lo que se ve en la foto** (para personas con lector de pantalla y para Google). No pongas el nombre de la empresa.

Los proyectos se muestran en un **carrusel** que avanza solo, se desplaza con el dedo o el mouse, tiene puntos de navegación y un botón para pausarlo. Para agregar un proyecto nuevo, copia un bloque completo `{ … }` y cambia sus valores. La cantidad de proyectos ("6 proyectos") se actualiza sola.

**Leyenda "Ilustración de ejemplo":** aparece bajo cada imagen. Está en `src/components/Proyectos.jsx` (busca `Ilustración de ejemplo`). Cuando uses fotos reales de tus obras, **elimina esa línea** (`npm run revisar` te avisa mientras siga ahí) o cámbiala por otra leyenda (por ejemplo, "Foto: obra terminada, 2024").

Si una imagen no carga, el marco gris se mantiene con la leyenda debajo y la página no se rompe.

### 5.5 Proceso y garantías

**Garantías**, `src/data/garantias.js`. Cada garantía tiene:

- `concepto`: a qué aplica (Obra civil, Acabados…).
- `plazo`: el texto que se muestra ("10 años").
- `anios`: el mismo plazo **como número** (`10`). Se conserva junto al plazo en texto.
- `cobertura`: qué cubre.

Las garantías se muestran en **tarjetas** (una por concepto, con ícono, plazo y cobertura). El ícono se asigna por el nombre exacto del `concepto` (`Obra civil`, `Acabados`, `Instalaciones`) en `src/components/Garantias.jsx`; si agregas un concepto nuevo, agrega su ícono ahí o la tarjeta saldrá sin ícono. Mantén `plazo` y `anios` coherentes. **Confirma los plazos y coberturas con el responsable legal antes de publicar**: los actuales son ejemplos.

**Proceso**, `src/components/Proceso.jsx`, lista `PASOS` (`titulo`, `texto` e `Icono` de cada etapa; los íconos son de [lucide](https://lucide.dev) y se importan al inicio del archivo). El diseño está pensado para **5 etapas**: si cambias la cantidad, ajusta también `lg:grid-cols-5` en el mismo archivo y el texto "Cinco etapas, siempre en el mismo orden".

### 5.6 Contacto

- **Dirección, teléfono, horario y ciudad**: `src/data/marca.js` (ver sección 4).
- **Textos de la sección** ("Hablemos de tu obra", etiquetas del formulario): `src/components/Contacto.jsx`.
- **Formulario**: tiene dos modos, según `formularioEndpoint` en `src/data/contacto.js`:
  - **Vacío** (`''`, como viene): al enviar, abre WhatsApp con el mensaje ya escrito (nombre, teléfono, tipo de proyecto y mensaje). No necesita nada más.
  - **Con un endpoint**: la web envía los datos por `POST` en formato JSON a esa dirección y muestra "Recibimos tu mensaje". Funciona con servicios como [Formspree](https://formspree.io) o con tu propio servidor. Pasos con Formspree: crea una cuenta y un formulario, copia su URL (`https://formspree.io/f/xxxxxxxx`) y pégala: `formularioEndpoint: 'https://formspree.io/f/xxxxxxxx'`.

  Los datos que envía son `nombre`, `telefono`, `tipo` (el nombre visible del tipo de proyecto) y `mensaje`. Si el servidor responde con error, la web avisa al visitante y le sugiere WhatsApp.
- El enlace de llamada usa el mismo número que WhatsApp (`telefonoWhatsapp`).
- Cada mensaje de WhatsApp lleva un **folio** (ver "Cómo gestionar las cotizaciones", al final).
- **Aviso de privacidad**: la plantilla incluye una página en **`/aviso-de-privacidad`** (archivo `src/pages/AvisoPrivacidad.jsx`), y el enlace del footer apunta a ella. **Es un texto de ejemplo (borrador): debe revisarlo un abogado antes de publicar.** Lo que debes hacer:
  - Completa en `marca.js` `nombre`, `ciudad`, `correo` y `telefono`: la página los lee de ahí.
  - La **política de tratamiento de datos** (`src/pages/PoliticaTratamiento.jsx`, ruta `/politica-de-tratamiento-de-datos`) también es un borrador y también debe revisarla un abogado; completa en ella la lista de proveedores que tratan datos. La casilla de autorización del formulario viene **sin marcar** y es obligatoria. Más detalle en [GUIA-CUMPLIMIENTO.md](GUIA-CUMPLIMIENTO.md).
  - Actualiza `avisoPrivacidadActualizado` (formato `AAAA-MM-DD`) cada vez que se revise el texto; es la fecha de la sección "Vigencia".
  - **Para usar una política que ya tienes publicada en otro sitio**, cambia `urlAvisoPrivacidad` en `marca.js` por la URL completa (por ejemplo `'https://midominio.com/politica-de-privacidad'`). El footer la usará tal cual y abrirá en la misma pestaña. Si dejas el valor por defecto (`'/aviso-de-privacidad'`), el footer usa la página interna.
  - Para editar el texto, modifica `src/pages/AvisoPrivacidad.jsx`. El comentario del inicio del archivo recuerda que es un borrador; quítalo solo cuando un abogado lo apruebe.

### 5.7 SEO, dominio y datos estructurados

**El dominio y los datos de empresa para Google se configuran solo en `src/data/marca.js`.** No edites a mano el dominio en `index.html`, `robots.txt` ni `sitemap.xml`: esos archivos llevan `https://tudominio.com` como marcador a propósito, y `npm run build` lo reemplaza por `marca.dominio` (un plugin de Vite en `vite.config.js`).

Qué hace el build:

- En `index.html`: reemplaza el marcador en `canonical`, `og:url`, `og:image` y `twitter:image`.
- Genera el **JSON-LD** (datos estructurados `HomeAndConstructionBusiness`) en el lugar del comentario `<!-- JSON-LD generado en build -->`, con `nombre`, `dominio`, `telefono`, `direccion`, `ciudad`, `departamento` y `zonaAtendida` de `marca.js` (país fijo: CO). Cada campo que siga pendiente (`TODO…`) se omite; nunca queda un `TODO` en el JSON-LD.
- En `dist/robots.txt` y `dist/sitemap.xml`: reemplaza el marcador por tu dominio.
- **Si `dominio` sigue pendiente (o es el de ejemplo), el build falla con un mensaje claro**, para que nadie publique con el dominio de ejemplo.

Lo que sí editas a mano en `index.html`: `<title>` y `description` (lo que se ve en Google; título de hasta ~60 caracteres, descripción de hasta ~155) y los textos `og:*` y `twitter:*` (lo que se ve al compartir el enlace en WhatsApp, Facebook, LinkedIn y X).

**Imagen para compartir** (`public/og-image.jpg`, 1200 × 630 px): se genera con el nombre de la marca (`marca.nombre`), el eslogan y los colores `graphite` y `safety` de `marca.js`. Dos opciones:

1. Cambia `marca.nombre` y ejecuta `npm run og-image`. Necesita Chrome o Edge instalado y conexión a internet (para cargar la fuente Archivo); si el navegador está en otra ruta, define `CHROME_PATH`.
2. O reemplaza el archivo por tu propia imagen JPG de 1200 × 630 px con el mismo nombre.

**`public/sitemap.xml`**: si usas una URL externa para el aviso o la política (5.6), elimina el bloque `<url>` de la página interna correspondiente.

### 5.8 Colores

Los colores se definen en `colores`, dentro de `src/data/marca.js`; `tailwind.config.js` los lee de ahí. La paleta es cerrada: **solo existen estos cinco** y no se puede usar ningún otro.

| Token | Valor actual | Dónde se usa |
| --- | --- | --- |
| `white` | `#FFFFFF` | Fondo del header y de las secciones Servicios, Proceso y Contacto; texto sobre fondos oscuros; botón secundario. |
| `concrete` | `#ECECEA` | Fondo de las secciones Proyectos y Garantías; texto secundario sobre fondos oscuros (cotizador, footer). |
| `graphite` | `#2A2C2E` | Texto principal; fondo del hero, cotizador y footer; bordes y líneas de las tarjetas de garantías; texto de botones. |
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

### Revisión automática: `npm run revisar`

```bash
npm run revisar
```

Lee `marca.js` y `contacto.js` y busca en `src/`, `public/` e `index.html` los textos `TODO`, `tudominio.com`, `570000000000`, `nova` e "Ilustración de ejemplo" (los comentarios del código no cuentan). Separa el resultado en dos grupos:

- **Errores (bloquean la publicación).** Dominio, razón social, NIT, WhatsApp, correo o año de fundación pendientes, y cualquier `TODO`, `tudominio.com`, número de ejemplo o resto de otra marca visible para el visitante. Si hay errores, el comando termina con código 1.
- **Avisos (no bloquean).** Precios, garantías y proyectos de ejemplo (mientras el comentario "Valores de ejemplo" siga al inicio de `cotizador.js`, `garantias.js` y `proyectos.js`; bórralo cuando los hayas confirmado), la leyenda "Ilustración de ejemplo", los textos legales en borrador (la línea `BORRADOR` de `AvisoPrivacidad.jsx` y `PoliticaTratamiento.jsx`) y datos opcionales pendientes (teléfono, dirección, horario, departamento, zona atendida, cifras del hero). Si solo hay avisos, termina con código 0, pero léelos: son cosas que un cliente puede notar.

`npm run publicar` ejecuta `revisar` y, si no hay errores, `build`.

### Lista de verificación

Lee la **[guía de cumplimiento](GUIA-CUMPLIMIENTO.md)** (Ley 1581 de 2012, Ley 1480 de 2011) y marca cada punto:

- [ ] `npm run revisar` sin errores.
- [ ] `marca.js` completo: dominio, razón social, NIT, WhatsApp, teléfono, correo, dirección, horario, año de fundación, departamento y zona atendida.
- [ ] Dominio definitivo configurado en `marca.js` (ver [Dominio del sitio](#dominio-del-sitio)).
- [ ] Razón social y NIT visibles en el footer.
- [ ] Revisar el **cotizador con precios reales** (`cotizador.js`) y probar varios casos haciendo las cuentas a mano.
- [ ] **Confirmar las garantías** (`garantias.js`) con el responsable de la empresa.
- [ ] Reemplazar las **ilustraciones por fotos reales** de tus obras, o dejar la leyenda "Ilustración de ejemplo" mientras tanto. Cambiar también la foto del hero.
- [ ] Generar `public/og-image.jpg` con `npm run og-image` o reemplazarlo por tu imagen (1200 × 630 px).
- [ ] Reemplazar `public/favicon.svg` por tu logo.
- [ ] Probar en el **móvil real**: menú, cotizador, formulario, botón de WhatsApp y llamada.
- [ ] Probar el **formulario**: enviar un mensaje de prueba y confirmar que llega.
- [ ] **Política de tratamiento de datos** y **aviso de privacidad**: completarlos, hacer que **un abogado los revise**, actualizar `avisoPrivacidadActualizado` y `fechaPolitica`, y comprobar que `/aviso-de-privacidad` y `/politica-de-tratamiento-de-datos` abren y que los enlaces del footer funcionan.
- [ ] Casilla de autorización del formulario activa y sin marcar por defecto.
- [ ] Ejecutar `npm run publicar` y confirmar que termina sin errores.

---

## Dominio del sitio

El dominio aparece en las etiquetas de SEO (`canonical`, `og:url`), en el mapa del sitio (`sitemap.xml`), en la imagen de vista previa al compartir (`og:image`) y en los datos estructurados. Por eso debe coincidir exactamente con la dirección final donde se publicará la página.

Tienes tres caminos:

1. **Para probar:** usa la dirección gratuita del hosting, por ejemplo `nombre.pages.dev` (la que da Cloudflare Pages). Se escribe en `marca.js` y permite que el build funcione mientras terminas la configuración.
2. **Para publicar:** compra un dominio propio en un registrador, por ejemplo `.com` o `.co`, a nombre de la empresa compradora y con su correo.
3. **Conectarlo:** el hosting te indica los registros DNS exactos. Los pasos están en [Conectar tu dominio propio](#conectar-tu-dominio-propio), dentro de la sección 7; no se repiten aquí.

### Qué escribir en `marca.js`

El campo `dominio` de `src/data/marca.js` se escribe con `https://` y **sin barra final**, y debe ser exactamente la dirección que usará el visitante:

```js
dominio: 'https://constructoraandes.com', // ejemplo: pon tu dirección real
```

### Orden recomendado

1. Elegir la dirección de prueba o el dominio propio.
2. Escribir esa dirección en `dominio` de `marca.js`.
3. Ejecutar `npm run revisar` y corregir lo que bloquee.
4. Desplegar en Cloudflare Pages (sección 7).
5. Conectar el dominio propio en Cloudflare Pages, si aplica.
6. Si la dirección de prueba cambió, poner el dominio final en `dominio` de `marca.js` y volver a desplegar.

### Si el dominio está pendiente

`npm run build` (y por lo tanto `npm run publicar`) falla con un mensaje claro. Es un freno a propósito para no publicar con la dirección de ejemplo. Para trabajar sin publicar, usa `npm run dev`, que no lo exige.

### Renovación y cambios posteriores

- El dominio se renueva cada año y **la empresa compradora paga la renovación**. Conviene que el correo de recuperación de la cuenta del registrador sea el de la empresa.
- Si el dominio cambia después de publicar, agrega la nueva propiedad en Google Search Console (sección 8) y configura las redirecciones desde el dominio anterior en Cloudflare.

---

## 7. Cómo publicar

Esta web es estática. Se compila con:

```bash
npm run publicar
```

(revisa los datos pendientes y luego compila; también puedes usar solo `npm run build`, que igualmente exige que `dominio` esté completo en `marca.js`). Eso genera la carpeta **`dist`**, que es **la carpeta que se publica**.

El hosting elegido es **Cloudflare Pages** (tiene plan gratuito). Los pasos para el comprador, escritos para una persona no técnica, están en **[DESPLIEGUE-CLOUDFLARE.md](DESPLIEGUE-CLOUDFLARE.md)**: conectar el repositorio de GitHub (recomendado), subir `dist` directamente, fijar la versión de Node, conectar el dominio propio, verificar y actualizar.

La web tiene una landing y las páginas `/aviso-de-privacidad` y `/politica-de-tratamiento-de-datos`, que se resuelven en el navegador. Por eso el proyecto incluye `public/_redirects`, que envía cualquier ruta a `index.html`, y `public/_headers`, que define el caché y las cabeceras de seguridad; Cloudflare Pages lee ambos. Sin `_redirects`, abrir `/aviso-de-privacidad` directamente daría error 404.

Configuración en Cloudflare Pages:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- Si el despliegue falla por la versión de Node, agrega la variable de entorno `NODE_VERSION` con valor `22`.

### Conectar tu dominio propio

1. Compra el dominio en un registrador (GoDaddy, Namecheap, Cloudflare, etc.).
2. En el proyecto de Cloudflare Pages, abre **Custom domains** y agrega tu dominio. Si el dominio ya está en Cloudflare, los registros DNS se crean solos; si está en otro registrador, Cloudflare te indica el registro exacto (normalmente un CNAME). Detalle en [DESPLIEGUE-CLOUDFLARE.md](DESPLIEGUE-CLOUDFLARE.md).
3. Usa los valores que muestre tu panel; no copies los de otros tutoriales. Puede tardar desde unos minutos hasta 24 horas en funcionar.
4. Cloudflare activa el certificado HTTPS (el candado) de forma automática.
5. Cuando el dominio funcione, confirma que `dominio` en `marca.js` es ese mismo (sección 5.7) y vuelve a publicar: `index.html`, `robots.txt` y `sitemap.xml` se actualizan solos en el build.

---

## 8. Cómo enviar el sitio a Google

1. Entra a [Google Search Console](https://search.google.com/search-console) con tu cuenta de Google.
2. **Agregar propiedad**. Lo más simple es "Prefijo de URL" con tu dirección completa (por ejemplo `https://midominio.com/`).
3. **Verifica** que eres el dueño. Con "Prefijo de URL" puedes usar la etiqueta HTML: Google te da una línea `<meta name="google-site-verification" …>`; pégala dentro de `<head>` en `index.html`, vuelve a compilar y publicar, y pulsa **Verificar**. (La verificación por dominio usa un registro DNS de tipo TXT que Google te indica.)
4. En el menú **Sitemaps**, escribe `sitemap.xml` y pulsa **Enviar**. El estado debe cambiar a "Correcto".
5. En **Inspección de URLs**, pega tu dirección y pulsa **Solicitar indexación**.
6. Google tarda de unos días a un par de semanas en mostrar la web. Si no aparece, revisa que `robots.txt` no bloquee el sitio (debe decir `Allow: /`).

Para aparecer en Google Maps y en búsquedas locales, crea además un perfil gratuito en [Google Business Profile](https://www.google.com/business/) con los mismos datos de contacto.

---

## 9. Soporte y próximos pasos

El soporte gratuito del proveedor dura 6 meses desde la entrega, con respuesta en 48 horas hábiles; el mantenimiento posterior se contrata aparte (ver `LICENSE.md`, que fija también la conciliación en Facatativá, Cundinamarca).

**Si algo se rompe:**

1. **La web publicada se ve mal después de un cambio.** Vuelve a la versión anterior desde el panel de Cloudflare Pages (pestaña *Deployments*, opción de restaurar un despliegue anterior; verifica el nombre en el panel).
2. **`npm run build` da error.** Lee el mensaje: casi siempre indica el archivo y la línea. Los errores más comunes son una comilla o llave sin cerrar en un archivo que editaste, o una coma que falta entre elementos de una lista.
3. **Algún cambio no aparece.** Detén `npm run dev` con `Ctrl + C`, vuelve a ejecutarlo y recarga la página con `Ctrl + F5`.
4. **Un comando no funciona.** Verifica `node -v` (mínimo 20.19) y que estás dentro de la carpeta del proyecto.

**Próximos pasos sugeridos:** agregar tus fotos reales, conectar el formulario a un endpoint, hacer revisar los textos legales por un abogado, abrir el perfil de Google Business y medir visitas con una herramienta de analítica de tu preferencia.

---

## Cómo gestionar las cotizaciones

**Dónde llegan.** Cada cotización del cotizador y cada solicitud del formulario llega como un mensaje de WhatsApp al número de `telefonoWhatsapp` en `src/data/marca.js`. Instala la app gratuita **WhatsApp Business** en el teléfono del negocio y registra ese número: así recibes los mensajes con un perfil de empresa, etiquetas y respuestas rápidas.

**Responsabilidad.** Las cotizaciones llegan al WhatsApp del comprador y son bajo su responsabilidad (ver [GUIA-CUMPLIMIENTO.md](GUIA-CUMPLIMIENTO.md), sección 4).

**El folio.** Todos los mensajes incluyen una línea `Folio: COT-AAMMDD-XXXX` (fecha y 4 dígitos al azar). Úsalo para buscar la conversación: en WhatsApp Business toca la lupa y escribe el folio. El visitante conserva el mismo folio mientras no recargue la página.

**Etiquetas recomendadas.** Nueva, Visita agendada, Cotizada, Cerrada, No avanzó. Para crearlas: en WhatsApp Business ve a *Más opciones (⋮) → Herramientas de empresa → Etiquetas → Etiqueta nueva*. Para asignarlas, mantén presionado un chat y toca el ícono de etiqueta.

**Respuestas rápidas recomendadas.** Confirmar visita, pedir fotos o planos, enviar cotización formal. Para crearlas: *Más opciones (⋮) → Herramientas de empresa → Respuestas rápidas → Añadir*. Escribe el mensaje y un atajo (por ejemplo `/visita`); en cualquier chat, escribe `/` para usarlo.

**Qué no hace la landing.** La landing **no guarda cotizaciones**: cada mensaje llega directamente al WhatsApp del comprador y no pasa por ningún servidor ni base de datos.

**Si necesitas un registro.** Crea tu propia hoja de cálculo o herramienta de seguimiento y usa el folio como identificador único de cada cotización.

---

## Licencia

El uso de este proyecto/código fuente está sujeto a los términos expresados en el archivo LICENSE.md adjunto. El soporte gratuito del proveedor dura 6 meses desde la entrega y el mantenimiento posterior se contrata aparte. La jurisdicción y el centro de conciliación (Facatativá, Cundinamarca) están en LICENSE.md.
