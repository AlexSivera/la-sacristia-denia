// Build estático: src/ → dist/
// - Expande <img data-img="nombre" sizes="…"> a src/srcset/width/height usando src/assets/img/sizes.json
//   (así cambiar una foto es sustituir el archivo en raw/ y relanzar `npm run images`).
// - Genera dos páginas del mismo HTML: index.html (español) y en.html (inglés).
//   El texto traducible lleva data-t="clave" (contenido) o data-ta="atributo:clave,…" (atributos);
//   las traducciones están en src/i18n/en.json. Una clave sin traducir detiene el build.
// - Sustituye {{SITE_URL}} y añade versión a CSS/JS para evitar cachés viejas.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { parse } from 'node-html-parser';

const SITE_URL = process.env.SITE_URL || 'https://alexsivera.github.io/la-sacristia-denia/';
const SRC = 'src';
const OUT = 'dist';

await fs.rm(OUT, { recursive: true, force: true });
await fs.cp(SRC, OUT, { recursive: true, filter: (p) => !p.endsWith('sizes.json') && !/[\\/]i18n([\\/]|$)/.test(p) });

const tallas = JSON.parse(await fs.readFile(`${SRC}/assets/img/sizes.json`, 'utf8'));
const en = JSON.parse(await fs.readFile(`${SRC}/i18n/en.json`, 'utf8'));
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
// <source data-img="nombre" media="…" sizes="…"> → srcset (encuadres distintos por ancho dentro de <picture>)
html = html.replace(/<source\b([^>]*?)\sdata-img="([^"]+)"([^>]*)>/g, (m, a, nombre, c) => {
  const t = tallas[nombre];
  if (!t) { faltan.add(nombre); return m; }
  const srcset = t.widths.map((w) => `assets/img/${nombre}-${w}.webp ${w}w`).join(', ');
  const alto = Math.round(t.widths[t.widths.length - 1] / t.ratio);
  return `<source srcset="${srcset}" width="${t.widths[t.widths.length - 1]}" height="${alto}"${a}${c}>`;
});
if (faltan.size) throw new Error(`Imágenes sin procesar: ${[...faltan].join(', ')} (ejecuta npm run images)`);

// --- Inglés: mismo HTML con los textos de en.json ---
const sinTraducir = new Set();
const doc = parse(html, { comment: true });
for (const el of doc.querySelectorAll('[data-t]')) {
  const k = el.getAttribute('data-t');
  if (k in en) el.set_content(en[k]); else sinTraducir.add(k);
}
for (const el of doc.querySelectorAll('[data-ta]')) {
  for (const par of el.getAttribute('data-ta').split(',')) {
    const [attr, k] = par.split(':');
    if (k in en) el.setAttribute(attr, en[k]); else sinTraducir.add(k);
  }
}
doc.querySelector('html').setAttribute('lang', 'en');
if (sinTraducir.size) throw new Error(`Claves sin traducir en src/i18n/en.json: ${[...sinTraducir].join(', ')}`);
let htmlEn = doc.toString();

// Las marcas de traducción no se publican
const limpiar = (h) => h.replace(/\sdata-t(?:a)?="[^"]*"/g, '');
const finalizar = async (h) => limpiar(h).replaceAll('{{SITE_URL}}', SITE_URL)
  .replace('href="styles.css"', `href="styles.css?v=${await hash('styles.css')}"`)
  .replace('src="main.js"', `src="main.js?v=${await hash('main.js')}"`);

await fs.writeFile(`${OUT}/index.html`, await finalizar(html));
await fs.writeFile(`${OUT}/en.html`, await finalizar(htmlEn));
await fs.writeFile(`${OUT}/.nojekyll`, '');
await fs.writeFile(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
await fs.writeFile(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}</loc></url><url><loc>${SITE_URL}en.html</loc></url></urlset>\n`);
console.log(`dist/ listo · ${SITE_URL} (es) · ${SITE_URL}en.html (en)`);
