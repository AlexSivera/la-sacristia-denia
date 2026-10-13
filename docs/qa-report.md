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
