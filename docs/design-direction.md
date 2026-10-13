# Dirección artística — "Retablo"

## En una frase
La web se compone como un **retablo barroco** y un **catálogo de museo** a la vez: el local real aparece en marcos de cuadro rectos con doble filete dorado, cada objeto y cada bebida lleva una cartela numerada, y la voz es la del propio local —feligreses, aguas espirituosas, confesionario— con humor. Un solo color viene de fuera de las paredes: **el turquesa del Agua de Dénia**.

## Por qué
- El producto **es el espacio**: es lo más citado en las reseñas ("obra de arte", "museo", "Dalí rediseñando Versalles en Dénia").
- Lo montaron **restauradores**: el lenguaje de catálogo y cartela es honesto con su oficio.
- El tono eclesiástico **ya es suyo** ("para nuestros feligreses", "agua espirituosa"), no es una metáfora impuesta.
- El Agua de Dénia es su bebida única y es turquesa: es el único elemento que puede romper la paleta del local y convertirse en marca.

## Hero: la barra como altar
El hero sale de un objeto físico del local, no de una plantilla. Arriba, la **contrabarra real** (foto frontal entre los dos soles dorados y los pilares de ladrillo del antiguo garaje), a sangre y sin marco. Abajo, el **frontal del mostrador** dibujado en CSS, que continúa el mostrador de la foto: tablero de madera con filo de latón, el nombre grabado en pan de oro (con un barrido de luz al cargar), paneles con moldura dorada, una placa de latón atornillada («Antiguo garaje de autobuses · Sacristía desde MMXXI») y la barra de pies con sus soportes. De pie sobre el tablero, el **cartelito de «Reservado»**: es la CTA principal, «Reservar mesa», que llama al local. Al cargar, la foto pasa de penumbra a luz, como si se encendieran las lámparas, y al hacer scroll el mostrador sube por delante de la contrabarra.

Se descartaron a propósito los esquemas de las otras demos del estudio: texto a la izquierda y foto en arco a la derecha (Boreal), fotos en círculo con marcadores numerados (Niki) y rótulo centrado sobre escaparate en paneles con franja inferior de CTA (Bernie’s). En toda la web no hay fotos con arco (el arco era la firma de Boreal): las fotos van a sangre o en marco dorado recto.

## Personalidad y emoción
Teatral, generosa, cómplice. Primero asombro ("¿esto está en Dénia?"), luego guiño (el confesionario recomienda copas), luego ganas de ir esta noche.

## Paleta (sacada de las fotos reales)
| Token | Hex | Origen |
|---|---|---|
| `--noche` | #0e0b0d | penumbra de velas |
| `--petroleo` | #15313b | paredes azules |
| `--carmesi` | #7a1526 | terciopelo del baldaquino |
| `--oro` | #c9a55c | marcos y soles |
| `--cera` | #f2e9d8 | velas, mármol |
| `--agua` | #2fd0bd | Agua de Dénia (solo para ella) |

## Tipografía
- **Bodoni Moda** (variable, óptica y cursiva): alto contraste neoclásico, teatral en grande. Titulares y cartelas.
- **Jost** (variable): geometría años 20 —las reseñas hablan de "speakeasy de los 20"—, legible en móvil; versalitas espaciadas para inscripciones (`CAFÉ · LA SACRISTÍA · MMXXI`).
- Ninguna de las dos se ha usado en los otros proyectos del estudio.

## Fotografía
Real como protagonista (nivel 1–2): el salón del baldaquino, el altar de la Inmaculada, el confesionario, la barra de los soles, el espejo con velas, bustos, Agua de Dénia en garrafa, White Cocoorange, vermut. Etalonaje común: negros profundos, velo cálido de vela, menos saturación de móvil. Stock solo donde no hay material real presentable: micrófono (jueves de directo) y velas (confesionario).

## Composición y ritmo
Oscuro → oscuro petróleo → **explosión turquesa** → papel de cera (carta, la única sección clara) → confesionario en penumbra → noche de directo → reseñas → visita. Marcos rectos con doble filete dorado en todas las fotos enmarcadas; en el inventario, además, lámpara de cuadro de latón. Los números de capítulo van en una cartela recta con doble filete.

## Botones
Rectangulares con doble filete dorado (marco de cuadro), versalitas Jost. Primario relleno oro sobre noche. Nada de píldoras redondeadas.

## Interacciones (solo las que suman)
1. **Abierto hoy** en vivo (hora de Madrid, cruza medianoche).
2. **Agua de Dénia**: las letras del nombre se llenan de agua turquesa al hacer scroll; seis sellos de lacre = seis ingredientes secretos ("Secreto de confesión").
3. **El confesionario**: recomendador de copa a partir de la carta confirmada, con "penitencia".
4. Reveals suaves; luz de vela parpadeando en el hero. Todo desactivado con `prefers-reduced-motion`.

## Lo que se evita
Cards redondeadas, iconos en círculos, gradientes morados, estadísticas inventadas, testimonios inventados, cursores custom, loaders.
