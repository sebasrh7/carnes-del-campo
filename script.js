// Carnes del Campo — interacciones mínimas

// 1) Menú móvil (abrir/cerrar)
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  // Cerrar el menú al hacer clic en un enlace (en móvil)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
}

// 2) Año automático en el footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 3) Catálogo de cortes por categoría (modal con fotos)
//    ✏️ El contenido vive en content/catalogo.json — se edita desde el panel
//    de administración (Pages CMS en app.pagescms.org) o editando ese archivo.
let CATALOGO = null; // se llena con fetch; null = aún no cargado o falló

fetch('content/catalogo.json')
  .then((r) => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then((data) => {
    // Indexa por id para acceso directo: CATALOGO.res, CATALOGO.cerdo...
    CATALOGO = {};
    (data.categorias || []).forEach((c) => { CATALOGO[c.id] = c; });
  })
  .catch(() => { CATALOGO = null; });

(function () {
  const modal = document.getElementById('cutsModal');
  if (!modal) return;
  const titleEl = document.getElementById('modalTitle');
  const listEl = document.getElementById('modalCuts');
  const waEl = document.getElementById('modalWa');
  const closeBtn = modal.querySelector('.modal-close');
  let lastFocus = null;

  const heroImg = document.getElementById('modalHeroImg');

  const openModal = (cat) => {
    const data = CATALOGO && CATALOGO[cat];
    listEl.innerHTML = '';

    // Respaldo: si el catálogo no cargó, se invita a preguntar por WhatsApp
    if (!data) {
      titleEl.textContent = 'Nuestros cortes';
      if (heroImg) { heroImg.removeAttribute('src'); heroImg.alt = ''; }
      const li = document.createElement('li');
      li.style.gridColumn = '1 / -1';
      li.textContent =
        'No pudimos cargar el catálogo en este momento. ' +
        'Escríbenos por WhatsApp y te contamos todos los cortes disponibles.';
      listEl.appendChild(li);
      waEl.href =
        'https://wa.me/573127607353?text=' +
        encodeURIComponent('Hola, quiero conocer los cortes disponibles en Carnes del Campo');
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      return;
    }

    titleEl.textContent = data.titulo;
    if (heroImg) { heroImg.src = data.imagen; heroImg.alt = data.titulo; }
    (data.cortes || []).forEach((c) => {
      const li = document.createElement('li');
      li.className = 'cut';

      const fig = document.createElement('div');
      fig.className = 'cut-img';

      // La ruta de la foto viene del catálogo (el panel CMS la escribe al subirla)
      const img = document.createElement('img');
      img.src = c.foto || '';
      img.alt = c.nombre;
      img.loading = 'lazy';
      // Si la foto no existe, se muestra la inicial del corte
      img.addEventListener('error', () => li.classList.add('no-img'));
      if (!c.foto) li.classList.add('no-img');

      const fallback = document.createElement('span');
      fallback.className = 'cut-fallback';
      fallback.textContent = (c.nombre || '?').charAt(0).toUpperCase();
      fallback.setAttribute('aria-hidden', 'true');

      fig.appendChild(img);
      fig.appendChild(fallback);

      const name = document.createElement('span');
      name.className = 'cut-name';
      name.textContent = c.nombre;

      li.appendChild(fig);
      li.appendChild(name);

      // Precio opcional: solo se muestra si está definido en el catálogo
      if (c.precio) {
        const price = document.createElement('span');
        price.className = 'cut-price';
        price.textContent = c.precio;
        li.appendChild(price);
      }

      listEl.appendChild(li);
    });
    waEl.href =
      'https://wa.me/573127607353?text=' +
      encodeURIComponent('Hola, quiero pedir ' + data.titulo.toLowerCase() + ' en Carnes del Campo');
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden'; // bloquea el scroll de fondo
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll('.card-click').forEach((card) => {
    const go = () => {
      const cat = card.dataset.cat;
      if (cat === 'mayor') {
        // "Al por mayor" lleva a la sección de restaurantes
        document.getElementById('restaurantes').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      openModal(cat);
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });

  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// 4) Animaciones con GSAP (parallax del hero + apariciones al scroll)
(function () {
  const html = document.documentElement;

  // Sombra del encabezado al hacer scroll (siempre activa)
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si el usuario pidió menos movimiento, o GSAP no cargó: mostrar todo y salir.
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    html.classList.remove('has-anim'); // evita que quede contenido oculto
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Entrada del hero al cargar (texto sube y aparece, escalonado)
  gsap.to('.hero-content > *', {
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.14,
    ease: 'power3.out',
    delay: 0.15,
  });

  // PARALLAX del fondo del hero: el fondo se mueve más lento que el contenido.
  // Escala 1.18: justo lo necesario para el desplazamiento de ±8% sin dejar
  // bordes, conservando la nitidez de la foto.
  gsap.fromTo(
    '.hero-media',
    { yPercent: -8, scale: 1.18 },
    {
      yPercent: 8,
      scale: 1.18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    }
  );

  // Apariciones al hacer scroll (secciones, tarjetas, etc.), en lotes escalonados
  const sel =
    '.section-head, .card, .feat, .col-media, .col-text, .center-note, .contact-info, .contact-map';
  ScrollTrigger.batch(sel, {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power2.out',
        overwrite: true,
      }),
  });

  // Recalcular posiciones cuando terminen de cargar las imágenes
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
