# Imágenes — fuentes y brief de sustitución

Todas las fotos pasan por `scripts/images.mjs`: recorte fijo, etalonaje común "luz de vela" (menos saturación de móvil, negros más profundos, velo cálido) y salida WebP en varias anchuras. Para sustituir una foto: dejar el archivo nuevo en `raw/`, cambiar `src` en `FOTOS` y ejecutar `npm run images` (los recortes y `sizes` del HTML no cambian).

## Reales del local (nivel 1–2)
Uso para la demo comercial. **Antes de publicar como web definitiva, confirmar con el propietario el permiso de uso** (las de Google Maps y TripAdvisor pueden ser de clientes).

| Archivo | Sección | Origen | Notas |
|---|---|---|---|
| `hero-barra` / `hero-barra-m` | Hero (contrabarra; escritorio panorámica, móvil vertical) | TripAdvisor, foto "Bello" (`ta-12`), recortada por encima del mostrador | 1311 px de ancho: algo blanda en pantallas grandes. **Prioridad nº 1 de la sesión**: barra frontal y simétrica entre los dos soles, de noche, lámparas encendidas, sin gente, cámara a la altura del tablero. |
| (`raw/real/maps-6.jpg`, salón del baldaquino) | Imagen para compartir (OG) | Google Maps (ficha del local) | La mejor foto del local. |
| `altar-inmaculada` | Inventario II | Google Maps | |
| `barra-querubin` | Inventario V | Google Maps | |
| `champagne` | Carta · Para picar | Google Maps | Provisional para esa pestaña: falta foto de tapas. |
| `cafe` | Carta · Café y dulce | Google Maps | Nivel 2: mejorable. |
| (`raw/real/maps-7.jpg`, flores en penumbra) | Sin usar | Google Maps | Reserva. |
| `entrada` | Visita | Google Maps (foto con rótulo MMXXI) | Aparecen clientes a lo lejos: sustituir por una sin personas reconocibles. |
| `barra-soles` | Inventario I | TripAdvisor, foto "Bello" (la misma del hero, encuadre completo) | |
| `confesionario` | Inventario III, Confesionario | TripAdvisor | |
| `espejo-velas` | Inventario IV | TripAdvisor | |
| `rincon-azul` | Inventario VI | TripAdvisor | |
| `bustos` | El museo | TripAdvisor, foto "Detalles" (subida por el propietario) | |
| `vermut` | Carta · Vermut | TripAdvisor, foto "Ven y disfruta de nuestro…" (propietario) | |
| (`raw/ta/ta-10`, salón del terciopelo) | Sin usar | TripAdvisor | Reserva. |
| `agua-vertido` | Aguas | Instagram @lasacristiacafedenia, 15/12/2025 | Producto real, muy buena. |
| `agua-copas` | Aguas, Carta | Instagram, 15/12/2025 | |
| `white-cocoorange` | Carta · Cócteles | Instagram, 17/12/2025 | |

Descartadas: fotos con clientes en primer plano, flyers de eventos, imágenes de otros locales que TripAdvisor mezcla en la galería, ensaladilla con botella de marca.

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
