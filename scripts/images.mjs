// Prepara las imágenes de la web a partir de raw/ (no se publica).
// Cada foto recibe un recorte, un etalonaje común y varias anchuras webp.
// Salida: src/assets/img/<nombre>-<ancho>.webp + sizes.json  ·  Uso: npm run images
//
// Para sustituir una foto provisional: deja el archivo nuevo en raw/, cambia `src` aquí y relanza.
import sharp from 'sharp';
import fs from 'node:fs/promises';

const OUT = 'src/assets/img';

// ratio: recorte final (ancho/alto) · foco: punto 0–1 hacia el que se desplaza el recorte
// grade: vela (fotos reales del local, unificadas) · bn (blanco y negro) · stock (provisionales)
const FOTOS = {
  // — Fotos reales de La Sacristía (Google Maps, TripAdvisor, Instagram) —
  'salon-baldaquino': { src: 'real/maps-6.jpg', ratio: 3 / 4, foco: [0.56, 0.5], grade: 'vela', sizes: [480, 760, 1100, 1500] },
  'altar-inmaculada': { src: 'real/maps-5.jpg', ratio: 3 / 4, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200] },
  'barra-querubin':   { src: 'real/maps-4.jpg', ratio: 4 / 3, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200, 1600] },
  'barra-soles':      { src: 'ta/ta-12-bello.jpg', ratio: 4 / 3, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200] },
  'confesionario':    { src: 'ta/ta-17-caption.jpg', ratio: 3 / 5, foco: [0.5, 0.42], grade: 'vela', sizes: [480, 800, 1100] },
  'espejo-velas':     { src: 'ta/ta-13-just-some-of-the-amazing.jpg', ratio: 3 / 4, foco: [0.5, 0.55], grade: 'vela', sizes: [480, 800, 1200] },
  'bustos':           { src: 'ta/ta-02-detalles.jpg', ratio: 1, foco: [0.5, 0.5], grade: 'bn', sizes: [480, 800, 1200] },
  'rincon-azul':      { src: 'ta/ta-11-caption.jpg', ratio: 3 / 4, foco: [0.5, 0.55], grade: 'vela', sizes: [480, 800, 1200] },
  'entrada':          { src: 'real/maps-1.jpg', ratio: 3 / 4, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200] },
  'agua-vertido':     { src: 'ighi/hi-agua-denia-1.jpg', ratio: 4 / 5, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200] },
  'agua-copas':       { src: 'ighi/hi-agua-denia-2.jpg', ratio: 4 / 5, foco: [0.5, 0.5], grade: 'vela', sizes: [480, 800, 1200] },
  'white-cocoorange': { src: 'ighi/hi-white-cocoorange-1.jpg', ratio: 4 / 5, foco: [0.5, 0.55], grade: 'vela', sizes: [480, 800] },
  'vermut':           { src: 'ta/ta-05-ven-y-disfruta-de-nuestro.jpg', ratio: 4 / 5, foco: [0.42, 0.45], grade: 'vela', sizes: [480, 800, 1200] },
  'champagne':        { src: 'real/maps-3.jpg', ratio: 4 / 5, foco: [0.5, 0.6], grade: 'vela', sizes: [480, 800] },
  'cafe':             { src: 'real/maps-10.jpg', ratio: 4 / 5, foco: [0.5, 0.55], grade: 'vela', sizes: [480, 800, 1200] },

  // — Stock provisional (Unsplash) —
  'microfono':        { src: 'stock/microfono.jpg', ratio: 4 / 3, foco: [0.58, 0.5], grade: 'stock', sizes: [600, 1000, 1500, 2000] },
  'velas':            { src: 'stock/velas.jpg', ratio: 16 / 9, foco: [0.5, 0.5], grade: 'stock', sizes: [800, 1400, 2000] },
};

// Velo cálido en "soft-light": acerca la temperatura de fuentes distintas a la luz de vela del local
const VELO = { vela: [255, 196, 128, 0.16], stock: [255, 190, 120, 0.2], bn: [0, 0, 0, 0] };

async function preparar({ src, ratio, foco: [fx, fy], grade }) {
  const base = sharp(`raw/${src}`).rotate();
  const { width: w, height: h } = await base.metadata();
  let cw = w, ch = Math.round(w / ratio);
  if (ch > h) { ch = h; cw = Math.round(h * ratio); }
  const left = Math.round(Math.max(0, Math.min(w - cw, fx * w - cw / 2)));
  const top = Math.round(Math.max(0, Math.min(h - ch, fy * h - ch / 2)));
  let img = sharp(`raw/${src}`).rotate().extract({ left, top, width: cw, height: ch }).removeAlpha();

  if (grade === 'bn') return { buf: await img.grayscale().linear(1.08, -6).toBuffer(), cw };
  // Fotos de móvil: menos saturación y negros más profundos, como en penumbra
  img = img.modulate({ saturation: grade === 'vela' ? 0.9 : 0.86 }).linear(1.06, -9);
  const [r, g, b, a] = VELO[grade];
  const velo = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r, g, b, alpha: a } } }).png().toBuffer();
  return { buf: await img.composite([{ input: velo, blend: 'soft-light' }]).toBuffer(), cw };
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const informe = [];
for (const [nombre, def] of Object.entries(FOTOS)) {
  const { buf, cw } = await preparar(def);
  const hechos = [];
  for (const w of def.sizes) {
    if (w > cw * 1.05) continue; // nunca ampliar
    await sharp(buf).resize({ width: w }).sharpen({ sigma: 0.5 }).webp({ quality: def.grade === 'stock' ? 70 : 74, effort: 6 }).toFile(`${OUT}/${nombre}-${w}.webp`);
    hechos.push(w);
  }
  if (!hechos.length) {
    await sharp(buf).webp({ quality: 78, effort: 6 }).toFile(`${OUT}/${nombre}-${cw}.webp`);
    hechos.push(cw);
  }
  informe.push(`${nombre}: ${hechos.join(', ')}  (ratio ${def.ratio.toFixed(3)})`);
}

// Imagen para compartir (Open Graph): el salón, apaisado
const og = await preparar({ ...FOTOS['salon-baldaquino'], ratio: 1200 / 630, foco: [0.5, 0.42] });
await sharp(og.buf).resize(1200, 630).jpeg({ quality: 80, mozjpeg: true }).toFile('src/assets/og.jpg');

await fs.writeFile(`${OUT}/sizes.json`, JSON.stringify(Object.fromEntries(
  await Promise.all(Object.keys(FOTOS).map(async (n) => {
    const files = (await fs.readdir(OUT)).filter((f) => f.startsWith(n + '-') && /^\d+\.webp$/.test(f.slice(n.length + 1)));
    return [n, { ratio: FOTOS[n].ratio, widths: files.map((f) => +f.slice(n.length + 1, -5)).sort((a, b) => a - b) }];
  }))
), null, 2));
console.log(informe.join('\n'));
