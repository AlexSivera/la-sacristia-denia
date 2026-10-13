# La Sacristía · Dénia — demo web

Propuesta de web para La Sacristía, café de arte y coctelería en C/ Pare Pere 4, Dénia.
Concepto: **Retablo** — el local real en marcos de cuadro dorados, cartelas de museo para cada pieza y cada copa, la voz del propio local (feligreses, aguas espirituosas, confesionario) y un único color ajeno a sus paredes: el turquesa del Agua de Dénia. Ver `docs/`.

## Uso

```bash
npm install        # solo hace falta sharp para regenerar imágenes
npm run images     # raw/ → src/assets/img (necesita raw/, que no está en el repo)
npm run dev        # build + servidor en http://localhost:4321
npm run check      # build + comprobaciones (recursos, anclas, alt, JSON-LD)
npm run deploy     # build + check + publica dist/ en la rama gh-pages
```

HTML, CSS y JS sin dependencias en `src/`. El build expande `<img data-img="nombre">` a `srcset` con las tallas generadas y escribe `dist/`.

## Pendiente de confirmar con el cliente
- **Horario**: se usa el publicado en su Instagram (30/04/2026); Google Maps muestra otro (martes cerrado).
- Recetas/descripciones del resto de aguas (Sacristía, Edén) y precios.
- Permiso para usar las fotos de Google Maps, TripAdvisor e Instagram y las reseñas citadas.
- Si quieren WhatsApp o reservas online (hoy solo teléfono).
- Versión en inglés: buena parte de las reseñas son de residentes y turistas extranjeros.
