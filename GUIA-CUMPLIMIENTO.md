# Guía de cumplimiento para publicar tu landing en Colombia

## Qué es esta guía

Es una **orientación general** para que sepas qué debes revisar antes de publicar la landing. **No es asesoría legal** y no reemplaza el concepto de un abogado. Los textos legales de la plantilla (aviso de privacidad y política de tratamiento de datos) son **borradores**: **hazlos revisar por un abogado colombiano** antes de publicar, y vuelve a revisarlos cada vez que cambie tu operación.

Tú, como comprador, eres quien publica el sitio y quien responde ante los clientes y ante las autoridades por lo que dice y por los datos que recoge. La licencia (`LICENSE.md`, sección 4) lo establece así. El soporte del proveedor y la garantía de la licencia están en `LICENSE.md`.

---

## 1. Protección de datos personales: Ley 1581 de 2012 y Decreto 1377 de 2013

Estas normas regulan cómo se recogen y usan los datos personales (nombre, teléfono, correo, lo que el visitante escribe en el formulario). La autoridad que vigila su cumplimiento es la **Superintendencia de Industria y Comercio (SIC)**. Verifica con tu abogado que cita y versiones vigentes (el Decreto 1377 de 2013 hoy está compilado en el Decreto 1074 de 2015).

**Responsable del tratamiento.** Es quien decide para qué y cómo se usan los datos. En esta landing, el responsable eres **tú (la empresa del comprador)**, no el proveedor de la plantilla. Por eso tu razón social, tu NIT y tu correo deben estar visibles y completos (`src/data/marca.js`).

**Autorización previa, expresa e informada.** Antes de recoger un dato, el visitante debe saber quién lo recoge, para qué lo usará y cuáles son sus derechos, y debe aceptarlo de forma clara. Por eso el formulario de la plantilla:

- tiene una **casilla de autorización que viene sin marcar por defecto**; el visitante debe marcarla él mismo;
- no deja enviar el formulario sin marcarla;
- enlaza la política de tratamiento y el aviso de privacidad junto a la casilla;
- guarda en el mensaje de WhatsApp que se dio la autorización y la versión de la política (`versionPolitica` en `marca.js`).

No quites ni precargues la casilla. Si cambias la política de forma importante, actualiza `fechaPolitica` y `versionPolitica`.

**Política de tratamiento de datos.** Es el documento donde explicas qué datos recoges, para qué, por cuánto tiempo, a quién los compartes y cómo ejerce el titular sus derechos. La plantilla trae un borrador en `src/pages/PoliticaTratamiento.jsx`. Debes completarlo con tu realidad (por ejemplo, los proveedores que usas: hosting, mensajería, correo) y publicarlo. Si ya tienes una política publicada, pon su URL en `urlPoliticaDatos` de `marca.js`.

**Derechos del titular.** La persona dueña de los datos puede:

- conocer, actualizar y rectificar sus datos;
- pedir prueba de la autorización que dio;
- ser informada del uso que se les ha dado;
- presentar quejas ante la SIC;
- revocar la autorización o pedir la supresión de sus datos (cuando no haya un deber legal o contractual de conservarlos);
- acceder de forma gratuita a sus datos.

**Plazos para responder** (días hábiles, según la ley; confírmalos con tu abogado):

| Solicitud | Plazo | Prórroga |
| --- | --- | --- |
| **Consulta** (ver qué datos tienes de la persona) | 10 días hábiles | Si no es posible, hasta 5 días hábiles adicionales, informando al titular antes del vencimiento. |
| **Reclamo** (corregir, actualizar, suprimir o revocar) | 15 días hábiles | Si no se puede responder en 15 días, hasta 8 días hábiles adicionales, informando la causa. |

Si el reclamo llega incompleto, se le pide al titular que lo complete dentro de los 5 días hábiles siguientes; si pasan 2 meses sin respuesta, se entiende que desistió. Mientras resuelves un reclamo, la ley exige marcar el dato con la leyenda "reclamo en trámite".

**Registro Nacional de Bases de Datos (RNBD).** El registro en el RNBD solo es obligatorio para personas jurídicas con activos totales superiores a 100.000 UVT. Estar exento no libera de cumplir la Ley 1581: la autorización previa, el aviso de privacidad y la política de tratamiento siguen siendo obligatorios.

**Otros puntos que debes revisar con tu abogado:** que los mensajes por WhatsApp implican que los datos pasan por un servicio de un tercero (Meta), algo que conviene mencionar en la política.

---

## 2. Consumidores y publicidad: Ley 1480 de 2011 (Estatuto del Consumidor)

- **Información veraz y suficiente.** Todo lo que muestres debe corresponder a la realidad: precios, plazos, promociones, coberturas y fotos. El cotizador de la plantilla entrega solo un **rango preliminar**; confirma que su texto lo deja claro y que tus precios (`src/data/cotizador.js`) son los que realmente manejas.
- **Imágenes.** Las fotos de proyectos de la plantilla son **ilustraciones de ejemplo**. No las presentes como obras tuyas: reemplázalas por fotos reales o deja la leyenda "Ilustración de ejemplo".
- **Promociones.** Si anuncias descuentos u ofertas, indica condiciones, vigencia y restricciones, y cúmplelas.
- **Garantía.** Las garantías que publiques (`src/data/garantias.js`) deben ser las que de verdad ofreces y puedes cumplir. Los plazos y coberturas de la plantilla son ejemplos. Recuerda que la ley también establece una garantía legal que no puedes desconocer; consulta con tu abogado cómo se combina con tus garantías comerciales.
- **Identificación del proveedor.** El sitio debe mostrar quién vende: **razón social y NIT visibles**. La plantilla los muestra en el footer cuando completas `razonSocial` y `nit` en `src/data/marca.js`. Agrega también los canales de contacto reales (teléfono, correo, dirección).

---

## 3. Lista de verificación antes de publicar

Ejecuta `npm run revisar`: encuentra automáticamente muchos de estos puntos (los errores bloquean la publicación; los avisos no). Esta lista incluye lo que el script no puede juzgar.

- [ ] `src/data/marca.js` completo: dominio, razón social, NIT, WhatsApp, teléfono, correo, dirección, horario, año de fundación, departamento y zona atendida.
- [ ] Razón social y NIT visibles en el footer.
- [ ] Política de tratamiento de datos completada con tu información y revisada por un abogado (`src/pages/PoliticaTratamiento.jsx` o URL propia en `urlPoliticaDatos`).
- [ ] Aviso de privacidad revisado por un abogado (`src/pages/AvisoPrivacidad.jsx` o URL propia en `urlAvisoPrivacidad`), con `avisoPrivacidadActualizado` al día.
- [ ] Casilla de autorización activa en el formulario y sin marcar por defecto; probada con el formulario real.
- [ ] Imágenes de ejemplo reemplazadas por fotos reales, o rotuladas como ilustraciones.
- [ ] Precios (`cotizador.js`) y garantías (`garantias.js`) confirmados, y el comentario "Valores de ejemplo" retirado de esos archivos.
- [ ] Proyectos (`proyectos.js`) reemplazados por obras reales.
- [ ] Si usas cookies o analítica, información al visitante sobre su uso (la plantilla no instala ninguna por sí sola).

---

## 4. Dónde llegan las cotizaciones y quién responde por ellas

La landing **no tiene servidor ni base de datos**. Cada cotización del cotizador y cada solicitud del formulario se envía como un mensaje de **WhatsApp al número que pusiste en `telefonoWhatsapp`**. Eso significa que:

- los datos del visitante quedan en **tu WhatsApp** (te recomendamos WhatsApp Business en un teléfono de la empresa);
- **tú eres el responsable** de esos datos desde que llegan: de custodiarlos, usarlos solo para lo que autorizó el visitante y atender sus solicitudes;
- cada mensaje trae un **folio** (`COT-AAMMDD-XXXX`) para encontrar y registrar la conversación;
- si además configuras un `formularioEndpoint`, el servicio que elijas también recibe los datos y debe aparecer en tu política de tratamiento.

Responde las cotizaciones dentro del tiempo que prometes en la web (`TIEMPO_RESPUESTA` en `src/data/contacto.js`), y confirma que el rango del cotizador no se presente como un precio final.

---

## 5. Qué hacer si recibes una solicitud de derechos o un reclamo

1. **Registra** la fecha de recibo y el canal (WhatsApp, correo). Esa fecha inicia el conteo del plazo.
2. **Verifica la identidad** de quien pide (que sea el titular de los datos o su representante).
3. **Clasifica** la solicitud: consulta, o reclamo (corrección, actualización, supresión o revocatoria).
4. **Responde dentro del plazo** (10 días hábiles para consultas, 15 para reclamos; las prórrogas se informan antes de que venza el plazo y con el motivo).
5. **Ejecuta lo pedido**: entrega la información, corrige o elimina los datos en tus chats, hojas de cálculo y cualquier otro lugar donde estén, y deja constancia por escrito de lo que hiciste.
6. **Conserva el registro** de la solicitud y de tu respuesta.
7. Si no sabes cómo responder, o la persona amenaza con acudir a la SIC, **consulta a tu abogado** antes de contestar.

El correo que publicaste en `marca.js` (`correo`) es el canal que la política indica para estas solicitudes: revísalo con frecuencia.
