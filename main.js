// La Sacristía · interacciones. Sin dependencias. Textos dinámicos en español e inglés (según <html lang>).
document.documentElement.classList.add('js');
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const LANG = document.documentElement.lang === 'en' ? 'en' : 'es';

const T = {
  es: {
    abiertoHasta: (h) => `Abierto ahora · hasta las ${h}`,
    hoyAbre: (h) => `Cerrado ahora · hoy abrimos a las ${h}`,
    mananaAbre: (h) => `Cerrado ahora · mañana abrimos a las ${h}`,
    fichaAbierta: (h) => `Excelente. Abierta al público hasta las ${h}`,
    fichaHoy: (h) => `Excelente. Abre hoy a las ${h}`,
    fichaManana: (h) => `Excelente. Abre mañana a las ${h}`,
    hoyJueves: (f) => `Hoy, ${f}`,
    proximoJueves: (f) => `Próximo: ${f}`,
    menu: 'Menú', cerrar: 'Cerrar',
    sellos: ['Secreto de confesión.', 'Eso no se pregunta.', 'Lo sabe la Inmaculada. No lo cuenta.', 'Ni con un cava de por medio.', 'Pregunte en barra. Tampoco se lo dirán.', 'Seis de seis. Y sigue sin saberlo.'],
    absoluciones: [
      { copa: 'Agua de Dénia', desc: 'Limón, curaçao, cava y una combinación secreta. En garrafa, para compartir.', pen: 'Compartir la garrafa sin rechistar.' },
      { copa: 'White Cocoorange', desc: 'Licor de coco, batida de coco y triple seco, con confitura de canela y piel de naranja.', pen: 'Dejar que le roben un sorbo.' },
      { copa: 'Negroni o vermut', desc: 'Amargos de los de siempre. El vermut llega en copa tallada, con su piel de naranja.', pen: 'Brindar por el santo del día.' },
      { copa: 'Champagne Alfred Gratien', desc: 'Para lo que haya que celebrar. Si prefiere cava, también lo hay: es la base de las aguas.', pen: 'Contarnos qué se celebra.' },
      { copa: 'Un cóctel sin alcohol', desc: 'La barra tiene los suyos. Pregunte por los del día.', pen: 'Ninguna. Viene usted con la conciencia tranquila.' },
      { copa: 'Capuccino y tarta de chocolate con naranja amarga', desc: 'Tartas caseras: también de calabaza y carrot cake.', pen: 'Compartir la tarta. O no.' },
    ],
  },
  en: {
    abiertoHasta: (h) => `Open now · until ${h}`,
    hoyAbre: (h) => `Closed now · we open today at ${h}`,
    mananaAbre: (h) => `Closed now · we open tomorrow at ${h}`,
    fichaAbierta: (h) => `Excellent. Open to the public until ${h}`,
    fichaHoy: (h) => `Excellent. Opens today at ${h}`,
    fichaManana: (h) => `Excellent. Opens tomorrow at ${h}`,
    hoyJueves: (f) => `Tonight, ${f}`,
    proximoJueves: (f) => `Next: ${f}`,
    menu: 'Menu', cerrar: 'Close',
    sellos: ['Seal of confession.', 'One does not ask.', 'The Virgin knows. She isn’t telling.', 'Not even over a glass of cava.', 'Ask at the bar. They won’t tell you either.', 'Six out of six. Still none the wiser.'],
    absoluciones: [
      { copa: 'Agua de Dénia', desc: 'Lemon, curaçao, cava and a secret blend. In a carafe, for sharing.', pen: 'Share the carafe without complaint.' },
      { copa: 'White Cocoorange', desc: 'Coconut liqueur, coconut batida and triple sec, with cinnamon preserve and orange peel.', pen: 'Let someone steal a sip.' },
      { copa: 'Negroni or vermouth', desc: 'Old-school bitters. The vermouth comes in a cut-crystal glass, with its orange peel.', pen: 'Raise a toast to the saint of the day.' },
      { copa: 'Champagne Alfred Gratien', desc: 'For whatever needs celebrating. Cava too, if you prefer: it’s the base of the aguas.', pen: 'Tell us what you’re celebrating.' },
      { copa: 'An alcohol-free cocktail', desc: 'The bar has its own. Ask for today’s.', pen: 'None. You come with a clear conscience.' },
      { copa: 'Cappuccino and chocolate & bitter orange cake', desc: 'Homemade cakes: pumpkin and carrot cake too.', pen: 'Share the cake. Or don’t.' },
    ],
  },
}[LANG];

/* ---------- Horario (hora de Madrid) ----------
   Publicado por el local el 30/04/2026. Minutos desde las 00:00; >1440 = madrugada del día siguiente. */
const HORARIO = { 0: [1020, 1380], 1: [1020, 1500], 2: [1020, 1500], 3: [1020, 1500], 4: [960, 1560], 5: [960, 1560], 6: [960, 1560] };
const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function ahoraMadrid() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { dia, min: (+p.hour % 24) * 60 + +p.minute, y: +p.year, m: +p.month, d: +p.day };
}

// abierto · día de servicio (el de ayer si es madrugada) · cuándo cierra o abre
function estado() {
  const a = ahoraMadrid();
  const ayer = (a.dia + 6) % 7;
  const cierreAyer = HORARIO[ayer][1];
  if (cierreAyer > 1440 && a.min < cierreAyer - 1440) return { a, abierto: true, dia: ayer, hasta: hhmm(cierreAyer) };
  const [o, c] = HORARIO[a.dia];
  if (a.min >= o && a.min < c) return { a, abierto: true, dia: a.dia, hasta: hhmm(c) };
  if (a.min < o) return { a, abierto: false, dia: a.dia, abre: hhmm(o), cuando: 'hoy' };
  return { a, abierto: false, dia: a.dia, abre: hhmm(HORARIO[(a.dia + 1) % 7][0]), cuando: 'manana' };
}

// Tablón: fecha del jueves de música (hoy si es jueves y la noche sigue, o el siguiente)
function proximoJueves({ a }) {
  // jueves de calendario, o madrugada del viernes antes del cierre (02:00): la noche del jueves sigue
  const esNocheDeJueves = a.dia === 4 || (a.dia === 5 && a.min < 120);
  const dias = a.dia === 4 ? 0 : a.dia === 5 && a.min < 120 ? -1 : (4 - a.dia + 7) % 7;
  const fecha = new Date(Date.UTC(a.y, a.m - 1, a.d + dias, 12));
  const txt = new Intl.DateTimeFormat(LANG === 'en' ? 'en-GB' : 'es-ES', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(fecha);
  return esNocheDeJueves ? T.hoyJueves(txt) : T.proximoJueves(txt);
}

function pintarEstado() {
  try {
    const e = estado();
    const txt = e.abierto ? T.abiertoHasta(e.hasta) : (e.cuando === 'hoy' ? T.hoyAbre(e.abre) : T.mananaAbre(e.abre));
    const el = $('[data-estado]');
    if (el) { el.classList.toggle('is-abierto', e.abierto); $('[data-estado-txt]', el).textContent = txt; }
    const corto = $('[data-estado-corto]');
    if (corto) corto.textContent = txt;
    const ficha = $('[data-ficha-estado]');
    if (ficha) ficha.textContent = e.abierto ? T.fichaAbierta(e.hasta) : (e.cuando === 'hoy' ? T.fichaHoy(e.abre) : T.fichaManana(e.abre));
    const jueves = $('[data-proximo-jueves]');
    if (jueves) jueves.textContent = proximoJueves(e);
    $$('[data-horario] tr').forEach((tr) => tr.classList.toggle('is-hoy', +tr.dataset.dia === e.dia));
  } catch { /* navegadores sin Intl con zonas horarias: se quedan los textos por defecto */ }
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
const fotoBarra = $('.contrabarra img');
function onScroll() {
  const y = scrollY;
  // la contrabarra se queda atrás: el mostrador sube por delante
  if (fotoBarra && !quieto && y < innerHeight * 1.2) fotoBarra.style.setProperty('--py', `${Math.round(y * 0.3)}px`);
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
  $('.menu-boton__txt', menuBoton).textContent = abrir ? T.cerrar : T.menu;
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
const resp = $('[data-sellos-resp]');
let rotos = 0;
$$('.sello').forEach((s) => s.addEventListener('click', () => {
  if (!s.classList.contains('is-roto')) { s.classList.add('is-roto'); rotos++; }
  resp.textContent = T.sellos[Math.min(rotos, 6) - 1] || T.sellos[0];
}));

/* ---------- Carta: las cintas del misal (pestañas accesibles) ---------- */
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
      if (on && !quieto) { panel.classList.remove('is-entrando'); void panel.offsetWidth; panel.classList.add('is-entrando'); }
    });
    if (foco) t.focus();
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
const abs = $('[data-absolucion]');
$$('[data-pecado]').forEach((b) => b.addEventListener('click', () => {
  const a = T.absoluciones[+b.dataset.pecado];
  const mueble = $('[data-mueble]');
  if (mueble && !quieto) { mueble.classList.add('is-cerrado'); setTimeout(() => mueble.classList.remove('is-cerrado'), 650); }
  $$('[data-pecado]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $('[data-abs-copa]').textContent = a.copa;
  $('[data-abs-desc]').textContent = a.desc;
  $('[data-abs-pen]').textContent = a.pen;
  abs.hidden = false;
  abs.classList.remove('is-entrando'); void abs.offsetWidth; abs.classList.add('is-entrando');
  if (innerWidth < 1024) abs.scrollIntoView({ block: 'nearest', behavior: quieto ? 'auto' : 'smooth' });
}));
$$('[data-pecado]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
