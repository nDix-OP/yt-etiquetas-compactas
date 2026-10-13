# YouTube: Etiquetas de fecha compactas

Extensión para Chromium (Brave, Chrome, Edge, Vivaldi, etc.) que reescribe las
etiquetas de "hace cuánto se subió el vídeo" en YouTube, quitando el prefijo
"hace" y respetando singular/plural:

| Antes          | Después   |
|----------------|-----------|
| hace 1 a       | 1 año     |
| hace 2 a       | 2 años    |
| hace 5 m       | 5 meses   |
| hace 2 sem.    | 2 sem.    |
| hace 3 d       | 3 días    |
| hace 8 h       | 8 horas   |
| hace 34 min    | 34 min    |

No usa permisos especiales ni envía datos a ningún sitio: solo lee y modifica
el texto ya visible en la página de YouTube, en tu propio navegador.

## Instalar en Brave (o cualquier Chromium) sin la Web Store

1. Descomprime `yt-etiquetas-compactas.zip` en una carpeta que no vayas a
   borrar (Brave carga la extensión desde ahí, no copia los archivos).
2. Abre `brave://extensions` (en Chrome sería `chrome://extensions`).
3. Activa el interruptor **"Modo de desarrollador"** (arriba a la derecha).
4. Pulsa **"Cargar descomprimida"** y selecciona la carpeta
   `yt-etiquetas-compactas` (la que contiene `manifest.json`).
5. Entra en youtube.com o recarga la pestaña: las etiquetas ya deberían verse
   compactas.

Si luego editas `content.js` o `manifest.json`, vuelve a `brave://extensions`
y pulsa el icono de recarga (↻) de la tarjeta de la extensión.

## Publicarla en la Chrome Web Store

1. Crea una cuenta de desarrollador en el
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   (pago único de registro, aprox. 5 USD).
2. Sube el mismo `yt-etiquetas-compactas.zip` tal cual (contiene ya
   `manifest.json` en la raíz, que es lo que exige la Web Store).
3. Añade capturas de pantalla (antes/después de una tarjeta de vídeo),
   una descripción y elige la categoría "Productividad" o "Herramientas para
   redes sociales".
4. Como la extensión no pide permisos sensibles (no hay `permissions` ni
   `host_permissions` de lectura de datos personales, solo un content script
   sobre youtube.com), la revisión suele ser rápida.
5. Envíala a revisión. Una vez aprobada, obtienes un enlace público que
   puedes instalar desde cualquier navegador Chromium, incluido Brave.

## Notas técnicas

- Manifest V3, un único content script (`content.js`), sin librerías
  externas ni `background` ni `service_worker`: footprint mínimo.
- Usa un `MutationObserver` para detectar tarjetas nuevas al hacer scroll
  infinito, y un `TreeWalker` para localizar solo los nodos de texto que
  coinciden con el patrón "hace X unidad", sin tocar el resto del DOM.
- Si YouTube cambia el formato exacto de la etiqueta (por ejemplo, añade
  nuevas abreviaturas), basta con añadir la unidad al objeto `UNIT_FORMS`
  en `content.js`.
