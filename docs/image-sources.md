# Imágenes — fuentes y brief de sustitución

Todas las fotos pasan por `scripts/images.mjs`: recorte fijo, etalonaje común "luz de vela" (menos saturación de móvil, negros más profundos, velo cálido) y salida WebP en varias anchuras. Para sustituir una foto: dejar el archivo nuevo en `raw/`, cambiar `src` en `FOTOS` y ejecutar `npm run images` (los recortes y `sizes` del HTML no cambian).

## Reales del local (nivel 1–2)
Uso para la demo comercial. **Antes de publicar como web definitiva, confirmar con el propietario el permiso de uso** (las de Google Maps y TripAdvisor pueden ser de clientes).

| Archivo | Sección | Origen | Notas |
|---|---|---|---|
| `hero-barra` / `hero-barra-m` | Hero (contrabarra; escritorio panorámica, móvil vertical) | **Recreada con IA (ChatGPT)** a partir de la foto real de TripAdvisor "Bello" (`ta-12`): `raw/ia/hero-barra-chatgpt.png`, 1536 × 1024. Recortada en el 66 % superior, por encima del mostrador | Provisional. Sin camarero, más nítida que la original (varianza del laplaciano a 1440 px: 1437 frente a 1240) y con mejor luz; el frontal del mostrador queda oscuro, sin elementos inventados. Se descartó una versión de Gemini (`raw/ia/hero-barra-gemini.jpg`): más limpia pero mucho más blanda (231) y con frontal tallado, mesas y cartas inventadas. **Prioridad nº 1 de la sesión**: barra frontal y simétrica entre los dos soles, de noche, lámparas encendidas, sin gente, cámara a la altura del tablero. |
| `salon-baldaquino` (`raw/real/maps-6.jpg`) | Inventario I, imagen para compartir (OG) | Google Maps (ficha del local) | La mejor foto del local. |
| `altar-inmaculada` | Inventario II | Google Maps | |
| `barra-querubin` | Inventario VI | Google Maps | |
| `champagne` | Carta · Para picar | Google Maps | Provisional para esa pestaña: falta foto de tapas. |
| `cafe` | Carta · Café y dulce | Google Maps | Nivel 2: mejorable. |
| (`raw/real/maps-7.jpg`, flores en penumbra) | Sin usar | Google Maps | Reserva. |
| `entrada` | Visita | Google Maps (foto con rótulo MMXXI) | Aparecen clientes a lo lejos: sustituir por una sin personas reconocibles. |
| `confesionario` | Sección Confesionario (primer plano) | TripAdvisor | |
| `confesionario-entero` | Inventario III | Google Maps, foto de la reseña de Dolores M. (`raw/resenas/dolores-2.jpg`) | Foto de clienta: pedir permiso o repetirla. |
| `techo-plumas` | Inventario IV | Google Maps, foto de la reseña de JMM Jamarola (`raw/resenas/jmm-4.jpg`) | Foto de cliente: pedir permiso o repetirla. Buena candidata para la sesión: toma desde abajo, con la lámpara encendida. |
| `espejo-velas` | Inventario V | TripAdvisor | |
| `rincon-azul` | Inventario VII | TripAdvisor | |
| `bustos` | El museo | TripAdvisor, foto "Detalles" (subida por el propietario) | |
| `vermut` | Carta · Vermut | TripAdvisor, foto "Ven y disfruta de nuestro…" (propietario) | |
| (`raw/ta/ta-10`, salón del terciopelo) | Sin usar | TripAdvisor | Reserva. |
| `joyas-natalia` | Inventario VIII | Google Maps, foto de la reseña de Miriam M. (`raw/resenas/miriam-1.jpg`), la que menciona la vitrina | Foto de una clienta: pedir permiso o repetirla. Sus anillos se atribuyen a Natalia por la respuesta del propietario a esa reseña; confirmarlo. |
| `agua-vertido` | Aguas | Instagram @lasacristiacafedenia, 15/12/2025 | Producto real, muy buena. |
| `agua-copas` | Aguas, Carta | Instagram, 15/12/2025 | |
| `white-cocoorange` | Carta · Cócteles | Instagram, 17/12/2025 | |

Descartadas: fotos con clientes en primer plano, flyers de eventos, imágenes de otros locales que TripAdvisor mezcla en la galería, ensaladilla con botella de marca.

## Material real localizado y sin usar (05/11/2026)
- Otras tomas del techo de plumas: `raw/resenas/cynthia-3.jpg`, `dolores-4.jpg`.
- Sala del sofá dorado con cuadros: `raw/resenas/jmm-2.jpg`.
- Cartel propio «Agua de Dénia» (mujer, Montgó y limones) y fachada con la pizarra: solo en mosaicos de baja resolución (`raw/dir/d-10.jpg`, `d-11.jpg`). Pedir el original al local.
- Las fotos de comida de Restaurant Guru (`raw/dir/d-18` a `d-46`) son genéricas, no del local: no usar.

## Stock provisional
| Archivo | Sección | Fuente | Licencia | Sustituir por |
|---|---|---|---|---|
| `microfono` | Jueves de directo | Unsplash — https://unsplash.com/es/fotos/fotografia-bokeh-del-microfono-de-condensador-Y20JJ_ddy9M | Licencia Unsplash (gratuita) | Foto horizontal de un jueves real: cantante a contraluz frente al baldaquino, público desenfocado, luz de velas. Con permiso de la artista. |
| `velas` | Fondo del confesionario (22 % opacidad) | Unsplash — https://unsplash.com/es/fotos/foto-de-angulo-bajo-de-velas-encendidas-fvl4b1gjpbk | Licencia Unsplash (gratuita) | Detalle de las velas del altar de la Inmaculada. |

## Brief para la sesión fotográfica (si compra la web)
1. **Agua de Dénia**: el vertido desde la garrafa en vertical y en horizontal, luz de barra; un macro de las burbujas.
2. **Carta**: 6–8 bodegones en las mesas de mármol, mismo encuadre cenital-45°: White Cocoorange, vermut, Negroni, tartas caseras, patatas artesanas, queso.
3. **Estancias sin gente**, antes de abrir, con velas encendidas e incienso visible en el aire: barra de los soles, altar, confesionario, rincón azul, espejo de las velas, salón.
4. **Detalles para cartelas**: la vitrina de joyas de Natalia (no hay ninguna foto buena), manos restaurando, el rótulo MMXXI.
5. **Un jueves de directo** (con permisos).
6. **Fachada** de día y de noche desde Pare Pere.
