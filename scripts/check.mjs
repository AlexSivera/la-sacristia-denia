// Comprobaciones del build (español e inglés): recursos locales existentes, anclas internas, alt en imágenes,
// placeholders sin sustituir, marcas de traducción sin limpiar y peso de lo que carga la primera pantalla.
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'dist';
const errores = [];
const existe = async (p) => fs.access(path.join(OUT, p)).then(() => true, () => false);
const css = (await fs.readFile(`${OUT}/styles.css`, 'utf8')).replace(/url\((["'])data:.*?\1\)/g, '');
let resumen = '';

for (const [pagina, lang] of [['index.html', 'es'], ['en.html', 'en']]) {
  const html = await fs.readFile(`${OUT}/${pagina}`, 'utf8');
  const err = (m) => errores.push(`${pagina}: ${m}`);

  const locales = new Set();
  for (const [, v] of html.matchAll(/\s(?:src|href)="([^"#][^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(v) || v.startsWith('{{')) continue;
    locales.add(v.split('?')[0]);
  }
  for (const [, v] of html.matchAll(/srcset="([^"]+)"/g)) v.split(',').forEach((s) => locales.add(s.trim().split(' ')[0]));
  for (const [, v] of css.matchAll(/url\((?!["']?data:)([^)]+)\)/g)) locales.add(v.replace(/['"]/g, ''));
  for (const p of locales) if (p !== './' && !(await existe(p))) err(`No existe: ${p}`);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, a] of html.matchAll(/href="#([^"]*)"/g)) if (a && !ids.has(a)) err(`Ancla rota: #${a}`);
  for (const [, a] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) a.split(' ').forEach((id) => { if (!ids.has(id)) err(`aria apunta a id inexistente: ${id}`); });

  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) err(`img sin alt: ${tag.slice(0, 80)}`);
    if (/data-img=/.test(tag)) err(`img sin expandir: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag)) err(`img sin width/height: ${tag.slice(0, 80)}`);
  }
  for (const [tag] of html.matchAll(/<source\b[^>]*>/g)) {
    if (/data-img=/.test(tag) || !/srcset=/.test(tag)) err(`source sin expandir: ${tag.slice(0, 80)}`);
  }
  if (html.includes('{{')) err('Placeholder {{…}} sin sustituir');
  if (/\sdata-t(a)?="/.test(html)) err('Quedan marcas data-t/data-ta');
  if (!new RegExp(`<html lang="${lang}"`).test(html)) err(`<html lang> no es ${lang}`);
  const idsDup = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) !== i);
  if (idsDup.length) err(`ids duplicados: ${idsDup.join(', ')}`);
  try { JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); } catch { err('JSON-LD inválido'); }
  resumen += `${pagina}: ${locales.size} recursos, ${ids.size} anclas · `;
}

// Peso aproximado inicial (móvil): HTML + CSS + JS + fuentes + foto del hero
let kb = 0;
for (const f of ['index.html', 'styles.css', 'main.js', 'assets/fonts/bodoni-moda.woff2', 'assets/fonts/bodoni-moda-italic.woff2', 'assets/fonts/jost.woff2', 'assets/img/hero-barra-m-768.webp']) {
  kb += (await fs.stat(path.join(OUT, f))).size / 1024;
}
console.log(`${resumen}primera carga ≈ ${Math.round(kb)} KB`);
if (errores.length) { console.error(errores.join('\n')); process.exit(1); }
console.log('OK');
