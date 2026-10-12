// Build estático: src/ → dist/
// - Expande <img data-img="nombre" sizes="…"> a src/srcset/width/height usando src/assets/img/sizes.json
//   (así cambiar una foto es sustituir el archivo en raw/ y relanzar `npm run images`).
// - Sustituye {{SITE_URL}} y añade versión a CSS/JS para evitar cachés viejas.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const SITE_URL = process.env.SITE_URL || 'https://alexsivera.github.io/la-sacristia-denia/';
const SRC = 'src';
const OUT = 'dist';

await fs.rm(OUT, { recursive: true, force: true });
await fs.cp(SRC, OUT, { recursive: true, filter: (p) => !p.endsWith('sizes.json') });

const tallas = JSON.parse(await fs.readFile(`${SRC}/assets/img/sizes.json`, 'utf8'));
const hash = async (f) => crypto.createHash('sha1').update(await fs.readFile(`${SRC}/${f}`)).digest('hex').slice(0, 8);

let html = await fs.readFile(`${SRC}/index.html`, 'utf8');
const faltan = new Set();
html = html.replace(/<img\b([^>]*?)\sdata-img="([^"]+)"([^>]*)>/g, (m, a, nombre, b) => {
  const t = tallas[nombre];
  if (!t) { faltan.add(nombre); return m; }
  const ws = t.widths;
  const mayor = ws[ws.length - 1];
  const def = ws.find((w) => w >= 800) || mayor;
  const alto = Math.round(mayor / t.ratio);
  const srcset = ws.map((w) => `assets/img/${nombre}-${w}.webp ${w}w`).join(', ');
  const resto = `${a}${b}`.replace(/\s+$/, '');
  const lazy = /loading=/.test(resto) ? '' : ' loading="lazy"';
  const dec = /decoding=/.test(resto) ? '' : ' decoding="async"';
  return `<img src="assets/img/${nombre}-${def}.webp" srcset="${srcset}" width="${mayor}" height="${alto}"${resto}${lazy}${dec}>`;
});
if (faltan.size) throw new Error(`Imágenes sin procesar: ${[...faltan].join(', ')} (ejecuta npm run images)`);

html = html.replaceAll('{{SITE_URL}}', SITE_URL)
  .replace('href="styles.css"', `href="styles.css?v=${await hash('styles.css')}"`)
  .replace('src="main.js"', `src="main.js?v=${await hash('main.js')}"`);
await fs.writeFile(`${OUT}/index.html`, html);
await fs.writeFile(`${OUT}/.nojekyll`, '');
await fs.writeFile(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
await fs.writeFile(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}</loc></url></urlset>\n`);
console.log(`dist/ listo · ${SITE_URL}`);
