# QA — 13/10/2026

Pruebas ejecutadas con Playwright (Chromium) sobre `dist/` servido en local y, después, sobre la URL pública.

## Técnico
- `npm run check`: 58 recursos locales existentes, 29 anclas válidas, todas las `img` con `alt` y `width/height`, JSON-LD válido, sin placeholders. Primera carga ≈ 314 KB (HTML + CSS + JS + 3 fuentes + foto del hero a 760 px).
- Consola: 0 errores en el recorrido completo (menú, carta, confesionario, sellos, citas).
- Sin dependencias en tiempo de ejecución. Fuentes auto-alojadas (solo latín).

## Responsive (capturas revisadas)
| Ancho | Resultado |
|---|---|
| 320 × 640 | Sin desbordes horizontales. Corregido: "Cómo llegar" partía en dos líneas en la barra inferior. |
| 390 × 844 | Sin desbordes. Corregido: la foto del hero quedaba bajo el pliegue → ahora hornacina en la primera pantalla. |
| 768 × 1024 | Sin desbordes. Corregido: foto de bustos demasiado grande. |
| 1440 × 900 | Revisadas todas las secciones. |

## Funcional
- **Bug crítico corregido**: el menú móvil (`display:flex`) anulaba el atributo `hidden` y dejaba una capa invisible que bloqueaba todos los clics en móvil. Añadido `.menu[hidden]{display:none}` y verificado con `elementFromPoint`.
- Menú: abre, navega a la sección, se cierra; Escape cierra y devuelve el foco.
- Carta: pestañas con clic y con flechas del teclado (ARIA tabs).
- Confesionario: las 6 opciones devuelven su absolución y penitencia.
- Sellos: se rompen y cambian el mensaje (región `aria-live`).
- Citas: navegación manual y automática (pausa con hover/foco; desactivada con movimiento reducido).
- "Abierto ahora": calculado en hora de Madrid; probado a las 00:xx de un martes → "Abierto ahora · hasta las 01:00" con el lunes marcado como día de servicio (correcto: el lunes cierra a la 01:00).
- Enlaces: `tel:+34865592759`, `mailto:`, Instagram, Google Maps (ficha y ruta), TripAdvisor.
- `prefers-reduced-motion`: título del Agua de Dénia lleno y estático, todos los `.revela` visibles.

## No comprobado
- Safari/iOS real y Firefox (solo Chromium).
- Lighthouse no ejecutado.
- Que los enlaces externos abran correctamente en la app nativa del móvil.

## Publicación
- https://alexsivera.github.io/la-sacristia-denia/ — rama `gh-pages`, estado `built`, HTTP 200.
- Verificado en la URL pública (390 px y 1440 px): CSS aplicado, Bodoni Moda (normal y cursiva) y Jost cargadas, 20 imágenes sin ninguna rota, JS activo, `assets/og.jpg` 200, 0 errores de consola y 0 respuestas ≥ 400.


## Rediseño del hero — 13/10/2026
Nuevo hero «la barra como altar» (ver `docs/design-direction.md`). Comprobado en local con Playwright:
- Sin scroll horizontal a 320, 390, 768, 1024 y 1440 px; ninguna imagen rota; 0 errores de consola.
- Móvil 390 × 844: la primera pantalla muestra la contrabarra, el cartel «Reservado · Reservar mesa», el nombre y el estado de apertura.
- CTA: el cartel no lo tapa nada (`elementFromPoint`), 158 × 116 px en móvil, enlaza a `tel:+34865592759`.
- Teclado: marca → menú → Reservar mesa → Ver la carta.
- `<picture>`: el móvil carga `hero-barra-m` (vertical) y el escritorio `hero-barra` (panorámica).
- Movimiento reducido: sin encendido de luces, sin barrido dorado y sin parallax.
- La foto de la contrabarra mide 1311 px de ancho: se ve algo blanda en pantallas grandes de alta densidad. Es la primera foto que conviene hacer en la sesión.
- Publicado y verificado en https://alexsivera.github.io/la-sacristia-denia/ (390 y 1440 px): el HTML público contiene el mostrador, carga `hero-barra-m` en móvil y `hero-barra` en escritorio, el cartel «Reservado» es clicable y enlaza a `tel:`, 3 fuentes cargadas, 0 imágenes rotas, 0 errores de consola, 0 respuestas ≥ 400.

## Sin arcos — 13/10/2026
Las fotos de Aguas, Confesionario y Visita pasan de arco a marco dorado recto (el del inventario) y el número de capítulo, de cartela con arco a cartela recta. Comprobado en local a 390 y 1440 px: 0 figuras con radio, sin scroll horizontal y 0 errores de consola.
- Publicado y verificado en https://alexsivera.github.io/la-sacristia-denia/ (390 y 1440 px): las tres fotos en marco recto (radio 0) cargan (`agua-vertido`, `confesionario`, `entrada`), 0 figuras redondeadas, sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400.

## Objetos en Aguas, Confesionario y Visita — 13/10/2026
Estampas con puntilla, confesionario con portezuelas de celosía y ex-voto de hojalata. Comprobado en local con Playwright:
- 390 y 1440 px revisados en captura; sin scroll horizontal a 320 px (las portezuelas abiertas no desbordan).
- Portezuelas: 104° abiertas al aparecer; al pulsar una opción se cierran (0° a los 420 ms) y se reabren con la absolución.
- Movimiento reducido: portezuelas abiertas desde el inicio y sin cierre al confesar.
- 0 errores de consola.
- Nota de QA: con `scroll-behavior: smooth`, `scrollIntoView` en las pruebas tarda en llegar a las secciones lejanas; las capturas se repitieron con scroll instantáneo. No afecta al usuario.
- Publicado y verificado en https://alexsivera.github.io/la-sacristia-denia/ (390 y 1440 px): puntilla presente en las dos estampas, portezuelas abiertas (~104°), las cuatro fotos visibles y cargadas, sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400.

## Cinco mejoras + versión inglesa — 05/11/2026
Cajones del mostrador, ficha técnica, misal con cintas, tablón parroquial (con el stock del micro), libro de visitas y `en.html`. Comprobado en local con Playwright:
- `npm run check` sobre las dos páginas: recursos, anclas, alt, JSON-LD, `<html lang>` correcto y sin marcas `data-t` publicadas. Ningún texto en español en `en.html` salvo nombres propios.
- Sin scroll horizontal a 320, 390, 768 y 1440 px en ES y EN; ningún rótulo de cinta desborda (corregido «COCKTAILS» a 320 px).
- Cintas del misal: clic y flechas del teclado; la página «pasa» al cambiar.
- Selector de idioma ES ↔ EN (ida y vuelta), `hreflang` es/en/x-default.
- JS en inglés: estado («Open now · until 02:00»), tablón («Tonight, Thursday 5 November»), ficha («Excellent. Open to the public until 02:00»), confesionario y menú («Close»).
- Libro de visitas: corregido el margen de la última firma que dejaba una franja verde entre páginas; texto ajustado al pautado.
- 0 errores de consola.
- La página en móvil mide ≈ 14.000 px (antes 12.461): el misal, el tablón y el libro ocupan más que los bloques a los que sustituyen.
- Publicado y verificado en https://alexsivera.github.io/la-sacristia-denia/ y …/en.html (390 y 1440 px): 3 cajones, 5 cintas, tablón con fecha («Hoy, jueves, 5 de noviembre» / «Tonight, Thursday 5 November»), 6 firmas, ficha en vivo, selector de idioma, 3 fuentes, 0 imágenes rotas, sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400. Las láminas de las páginas ocultas del misal no se descargan hasta tirar de su cinta (carga diferida).

## Hero con la barra recreada con IA — 05/11/2026
La contrabarra pasa a la versión de Gemini (`raw/ia/hero-barra-gemini.jpg`, 1200 × 896), recortada en el 70 % superior, donde cae el canto del mostrador. Medida de nitidez (varianza del laplaciano a 1440 px): original 1223, Gemini 225; la de Gemini tiene menos detalle fino pero mucho menos ruido, mejor luz y sin camarero. Comprobado en local a 320, 390 y 1440 px: el móvil carga `hero-barra-m`, el escritorio `hero-barra-1200`, sin scroll horizontal y sin errores. Nota del pie actualizada en ES y EN.
- Publicado y verificado en la URL pública (ES y EN, 390 y 1440 px): el móvil carga `hero-barra-m` y el escritorio `hero-barra-1200`, nota del pie actualizada, sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400.

## Hero con la versión de ChatGPT — 05/11/2026
Sustituye a la de Gemini: `raw/ia/hero-barra-chatgpt.png` (1536 × 1024), recortada en el 66 % (canto del mostrador). Nitidez a 1440 px (varianza del laplaciano): original 1240 · Gemini 231 · ChatGPT 1437. Sin camarero y sin elementos inventados en el frontal. En móvil, `sizes` pasa de 100vw a 140vw porque la foto se ajusta por altura y se ve más ancha que la pantalla: los móviles de alta densidad cargan la de 768 px. Comprobado en local a 320, 390 y 1440 px, sin scroll horizontal ni errores.
- Publicado y verificado en la URL pública (ES y EN, 390 y 1440 px): el móvil carga `hero-barra-m-768`, el escritorio `hero-barra-1536`, sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400.

## Pulido de mostrador, museo e inventario — 05/11/2026
Comprobado en local con Playwright a 1880, 1440 y 390 px (ES y EN):
- Cajonera: el cajón se abre con hover y con foco de teclado (interior visible ≈ 67 px); en táctil el interior no se muestra; con movimiento reducido se abre sin animación.
- Museo: foto y ficha con el mismo inicio y la misma altura (477 px en escritorio).
- Inventario: los seis cuadros con el centro a la misma altura (230 px en escritorio, 166 px en móvil) y todas las cartelas alineadas; la pieza VII (vitrina, sin foto) ocupa la franja de los cuadros.
- Titulares con `text-wrap: balance` y párrafos con `pretty`: la frase del mostrador queda en dos líneas equilibradas.
- Sin scroll horizontal y 0 errores de consola.
- Publicado y verificado en la URL pública (ES y EN, 390 y 1440 px): cajón abierto al pasar el ratón (≈ 67 px de interior), foto y ficha a la misma altura en escritorio (477/477 ES, 433/433 EN), centros de los cuadros alineados (230 px / 166 px), pieza I = salón del baldaquino con su imagen cargada, sin scroll horizontal y 0 respuestas ≥ 400.

## Vitrina de Natalia con foto real — 05/11/2026
Investigadas Google Maps (11 fotos y las de 5 reseñas, vista limitada sin sesión), TripAdvisor, Restaurant Guru y Sluurpy. No aparece ninguna foto de la vitrina en sí; sí una de los anillos, en la reseña que la menciona. La pieza VII pasa de cartela vacía a cuadro con lámpara y se corrige el texto: se elimina que estén a la venta y que todas sean de cubiertos, porque no está confirmado.
- Publicado y verificado en la URL pública (ES y EN, 390 y 1440 px): la foto de los anillos carga, el texto corregido aparece y ya no consta la venta; sin scroll horizontal, 0 errores de consola y 0 respuestas ≥ 400.
