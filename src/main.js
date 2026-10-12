// La Sacristía · interacciones. Sin dependencias.
document.documentElement.classList.add('js');
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Abierto ahora (hora de Madrid) ----------
   Horario publicado por el local el 30/04/2026. Minutos desde las 00:00; >1440 = madrugada del día siguiente. */
const HORARIO = { 0: [1020, 1380], 1: [1020, 1500], 2: [1020, 1500], 3: [1020, 1500], 4: [960, 1560], 5: [960, 1560], 6: [960, 1560] };
const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function ahoraMadrid() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { dia, min: (+p.hour % 24) * 60 + +p.minute };
}

function estado() {
  const { dia, min } = ahoraMadrid();
  const ayer = (dia + 6) % 7;
  const [ao, ac] = HORARIO[ayer];
  if (ac > 1440 && min < ac - 1440) return { abierto: true, dia: ayer, txt: `Abierto ahora · hasta las ${hhmm(ac)}` };
  const [o, c] = HORARIO[dia];
  if (min >= o && min < c) return { abierto: true, dia, txt: `Abierto ahora · hasta las ${hhmm(c)}` };
  if (min < o) return { abierto: false, dia, txt: `Cerrado ahora · hoy abrimos a las ${hhmm(o)}` };
  return { abierto: false, dia, txt: `Cerrado ahora · mañana abrimos a las ${hhmm(HORARIO[(dia + 1) % 7][0])}` };
}

function pintarEstado() {
  try {
    const e = estado();
    const el = $('[data-estado]');
    if (el) { el.classList.toggle('is-abierto', e.abierto); $('[data-estado-txt]', el).textContent = e.txt; }
    const corto = $('[data-estado-corto]');
    if (corto) corto.textContent = e.txt;
    $$('[data-horario] tr').forEach((tr) => tr.classList.toggle('is-hoy', +tr.dataset.dia === e.dia));
  } catch { /* navegadores sin Intl con zonas horarias: se queda el texto por defecto */ }
}
pintarEstado();
setInterval(pintarEstado, 60000);

/* ---------- Cabecera y barra móvil ---------- */
const cabecera = $('[data-cabecera]');
const barra = $('[data-barra]');
const hero = $('.hero');
const pie = $('.pie');
let pieVisible = false;
if (pie) new IntersectionObserver(([e]) => { pieVisible = e.isIntersecting; onScroll(); }).observe(pie);
function onScroll() {
  const y = scrollY;
  cabecera.classList.toggle('is-solida', y > 40);
  if (barra && hero) barra.classList.toggle('is-visible', y > 320 && !pieVisible);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Menú móvil ---------- */
const menu = $('[data-menu]');
const menuBoton = $('[data-menu-boton]');
function abrirMenu(abrir) {
  menuBoton.setAttribute('aria-expanded', String(abrir));
  $('.menu-boton__txt', menuBoton).textContent = abrir ? 'Cerrar' : 'Menú';
  document.body.classList.toggle('menu-abierto', abrir);
  if (abrir) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-abierto'));
    cabecera.classList.add('is-solida');
  } else {
    menu.classList.remove('is-abierto');
    setTimeout(() => { if (menuBoton.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 450);
    onScroll();
  }
}
menuBoton?.addEventListener('click', () => abrirMenu(menuBoton.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => { if (e.target.closest('a')) abrirMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuBoton?.getAttribute('aria-expanded') === 'true') { abrirMenu(false); menuBoton.focus(); } });

/* ---------- Apariciones ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.revela').forEach((el) => io.observe(el));

/* ---------- Inventario: flechas ---------- */
const inv = $('[data-inventario]');
$$('[data-inv]').forEach((b) => b.addEventListener('click', () => {
  const pieza = inv.querySelector('.pieza');
  const paso = pieza.getBoundingClientRect().width + parseFloat(getComputedStyle(inv).columnGap || 30);
  inv.scrollBy({ left: paso * +b.dataset.inv, behavior: quieto ? 'auto' : 'smooth' });
}));

/* ---------- Agua de Dénia: las letras se llenan al hacer scroll ---------- */
const agua = $('[data-agua]');
if (agua) {
  let visible = false, wx = 0, raf = 0;
  const OLA = 28;
  const pintar = () => {
    const r = agua.getBoundingClientRect();
    const vh = innerHeight;
    // 0 cuando el título asoma por abajo, 1 cuando su parte alta llega al tercio superior
    const p = quieto ? 1 : Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.62)));
    const fill = p * r.height;
    agua.style.setProperty('--fill', `${fill}px`);
    agua.style.setProperty('--wy', `${r.height - fill - OLA + 1}px`);
    agua.style.setProperty('--wx', `${wx}px`);
  };
  const bucle = () => { wx = (wx + 0.7) % 240; pintar(); raf = visible ? requestAnimationFrame(bucle) : 0; };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && !quieto) raf = requestAnimationFrame(bucle);
  }).observe(agua);
  pintar();
}

/* ---------- Los seis sellos ---------- */
const RESPUESTAS = [
  'Secreto de confesión.',
  'Eso no se pregunta.',
  'Lo sabe la Inmaculada. No lo cuenta.',
  'Ni con un cava de por medio.',
  'Pregunte en barra. Tampoco se lo dirán.',
  'Seis de seis. Y sigue sin saberlo.',
];
const resp = $('[data-sellos-resp]');
let rotos = 0;
$$('.sello').forEach((s) => s.addEventListener('click', () => {
  if (!s.classList.contains('is-roto')) { s.classList.add('is-roto'); rotos++; }
  resp.textContent = RESPUESTAS[Math.min(rotos, 6) - 1] || RESPUESTAS[0];
}));

/* ---------- Carta: pestañas accesibles ---------- */
const lista = $('[data-pestanas]');
if (lista) {
  const tabs = $$('[role="tab"]', lista);
  const activar = (t, foco) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on) { panel.classList.remove('is-entrando'); void panel.offsetWidth; panel.classList.add('is-entrando'); }
    });
    if (foco) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: quieto ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', (e) => {
      const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (n) { e.preventDefault(); activar(tabs[(i + n + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); activar(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); activar(tabs[tabs.length - 1], true); }
    });
  });
}

/* ---------- El confesionario ---------- */
const ABSOLUCIONES = [
  { copa: 'Agua de Dénia', desc: 'Limón, curaçao, cava y una combinación secreta. En garrafa, para compartir.', pen: 'compartir la garrafa sin rechistar.' },
  { copa: 'White Cocoorange', desc: 'Licor de coco, batida de coco y triple seco, con confitura de canela y piel de naranja.', pen: 'dejar que le roben un sorbo.' },
  { copa: 'Negroni o vermut', desc: 'Amargos de los de siempre. El vermut llega en copa tallada, con su piel de naranja.', pen: 'brindar por el santo del día.' },
  { copa: 'Champagne Alfred Gratien', desc: 'Para lo que haya que celebrar. Si prefiere cava, también lo hay: es la base de las aguas.', pen: 'contarnos qué se celebra.' },
  { copa: 'Un cóctel sin alcohol', desc: 'La barra tiene los suyos. Pregunte por los del día.', pen: 'ninguna. Viene usted con la conciencia tranquila.' },
  { copa: 'Capuccino y tarta de chocolate con naranja amarga', desc: 'Tartas caseras: también de calabaza y carrot cake.', pen: 'compartir la tarta. O no.' },
];
const abs = $('[data-absolucion]');
$$('[data-pecado]').forEach((b) => b.addEventListener('click', () => {
  const a = ABSOLUCIONES[+b.dataset.pecado];
  $$('[data-pecado]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $('[data-abs-copa]').textContent = a.copa;
  $('[data-abs-desc]').textContent = a.desc;
  $('[data-abs-pen]').textContent = a.pen.charAt(0).toUpperCase() + a.pen.slice(1);
  abs.hidden = false;
  abs.classList.remove('is-entrando'); void abs.offsetWidth; abs.classList.add('is-entrando');
  if (innerWidth < 1024) abs.scrollIntoView({ block: 'nearest', behavior: quieto ? 'auto' : 'smooth' });
}));
$$('[data-pecado]').forEach((x) => x.setAttribute('aria-pressed', 'false'));

/* ---------- Citas de los feligreses ---------- */
const citas = $$('[data-citas] .cita');
const cont = $('[data-citas-cont]');
let actual = 0, pausa = false, timer;
const ver = (n) => {
  citas[actual].classList.remove('is-activa');
  actual = (n + citas.length) % citas.length;
  citas[actual].classList.add('is-activa');
  cont.textContent = `${actual + 1} / ${citas.length}`;
};
$$('[data-cita]').forEach((b) => b.addEventListener('click', () => { ver(actual + +b.dataset.cita); reiniciar(); }));
const reiniciar = () => { clearInterval(timer); if (!quieto) timer = setInterval(() => { if (!pausa) ver(actual + 1); }, 6500); };
const zonaCitas = $('.feligreses');
zonaCitas?.addEventListener('mouseenter', () => { pausa = true; });
zonaCitas?.addEventListener('mouseleave', () => { pausa = false; });
zonaCitas?.addEventListener('focusin', () => { pausa = true; });
zonaCitas?.addEventListener('focusout', () => { pausa = false; });
if (citas.length) reiniciar();
