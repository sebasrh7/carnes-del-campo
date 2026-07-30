# AGENTS.md — Carnes del Campo

Sitio web de una página (one-page) para **Carnes del Campo**, una carnicería y
distribuidora de carne en Andalucía, Valle del Cauca (Colombia). Es un sitio
estático de marketing pensado para convertir visitas en pedidos por WhatsApp.

## Visión general del proyecto

- **Tipo:** sitio estático puro, sin build, sin framework, sin gestor de paquetes.
  **No existe** `package.json`, `pyproject.toml` ni nada equivalente.
- **Stack:** HTML + CSS + JavaScript vanilla. La única dependencia es GSAP +
  ScrollTrigger, servidos localmente desde `assets/js/` (sin CDN).
- **Idioma:** todo el contenido, comentarios y documentación del proyecto están
  en español. Mantén ese idioma en cualquier cambio visible para el usuario.
- **Público no técnico:** el dueño del negocio edita el catálogo desde un panel
  (Pages CMS) sin tocar código. El código debe seguir siendo legible y
  tolerante a fallos (ver «Catálogo editable» abajo).

## Estructura del código

| Ruta | Qué contiene |
|------|--------------|
| `index.html` | Única página: header/nav, hero, nosotros, productos (tarjetas), por qué elegirnos, restaurantes, contacto con mapa de Google, footer, botón flotante de WhatsApp y modal de cortes. Incluye SEO local: Open Graph y datos estructurados JSON-LD (`ButcherShop`). |
| `styles.css` | Todos los estilos. Diseño móvil primero. Paleta definida como variables CSS en `:root` (blanco protagonista, rojo `--accent: #922222` y negro `--ink: #242422` del logo, crema reservado). Tipografía: `--sans` para cuerpo, `--serif` para títulos. |
| `script.js` | JavaScript vanilla sin módulos, en 4 bloques numerados: (1) menú móvil, (2) año automático del footer, (3) catálogo de cortes con modal (fetch de `content/catalogo.json`), (4) animaciones GSAP (parallax del hero + apariciones al scroll con `ScrollTrigger.batch`). |
| `content/catalogo.json` | Datos del catálogo: `categorias[]` → `id`, `titulo`, `imagen`, `cortes[]` → `nombre`, `foto`, `precio` (opcional). **Archivo de datos editado por el negocio**, no código. |
| `.pages.yml` | Configuración de Pages CMS (app.pagescms.org): define el esquema del catálogo y la carpeta de medios (`assets/cortes`). |
| `assets/` | Imágenes del sitio. `assets/cortes/` fotos de los cortes (subidas por el CMS); `assets/js/` GSAP y ScrollTrigger minificados (locales, no editar); logos, favicon y `og-image.jpg`. |

### Cómo funciona el catálogo

1. `script.js` hace `fetch('content/catalogo.json')` e indexa las categorías por
   `id` (`res`, `cerdo`, `pollo`, `embutidos`, `especiales`).
2. Las tarjetas de productos en `index.html` llevan `data-cat="res"` etc.; al
   hacer clic abren el modal `#cutsModal` con los cortes de esa categoría.
   La tarjeta `data-cat="mayor"` es un caso especial: hace scroll a la sección
   `#restaurantes` en vez de abrir el modal.
3. Si el fetch falla o falta una foto, hay respaldos: mensaje invitando a
   escribir por WhatsApp y una inicial como placeholder de imagen.
4. El negocio edita el catálogo desde Pages CMS; al guardar, el CMS hace commit
   directo al repositorio y el sitio se republica solo. **No hay paso de
   build ni de despliegue manual.**

## Reglas importantes al modificar

- **No cambiar los `id` de las categorías** en `content/catalogo.json`
  (`res`, `cerdo`, `pollo`, `embutidos`, `especiales`): están acoplados a los
  `data-cat` de las tarjetas en `index.html`. Si agregas una categoría,
  agrégale también su tarjeta con el mismo `data-cat`.
- **Mantener la tolerancia a fallos**: el sitio debe verse completo aunque el
  catálogo no cargue, GSAP no cargue o el usuario tenga
  `prefers-reduced-motion: reduce`. `index.html` añade la clase `has-anim` solo
  si hay JS y movimiento permitido; `script.js` la quita si GSAP falla. No
  ocultes contenido que dependa de JS sin un respaldo equivalente.
- **Número de WhatsApp `+57 312 760 7353`**: aparece en varios enlaces
  `wa.me/...` de `index.html` y en `script.js`. Si cambia, hay que actualizar
  todas las ocurrencias.
- Accesibilidad: las tarjetas clicables usan `role="button"`, `tabindex` y
  manejo de Enter/Espacio; el modal gestiona el foco (guarda y devuelve el
  foco al cerrar). Conserva este patrón si agregas interacciones.
- Las fotos actuales son placeholders de Unsplash; el negocio las reemplaza
  poco a poco con fotos reales en `assets/cortes/`.

## Cómo probar / verificar

No hay tests, linters ni proceso de build. Verificación manual:

1. Servir localmente (mejor que abrir el archivo directo, por el fetch del
   catálogo y el mapa):
   ```sh
   python3 -m http.server 8000
   ```
   y abrir `http://localhost:8000`.
2. Revisar en el navegador: menú móvil, modal de cada categoría, parallax del
   hero, apariciones al scroll, mapa de Google y botones de WhatsApp.
3. Tras editar `content/catalogo.json`, validar el JSON (ej. `python3 -m json.tool content/catalogo.json`).

## Despliegue

Publicado en Vercel: **https://carnes-del-campo-azure.vercel.app/** (se sube
la carpeta tal cual, sin paso de compilación). `og:url` y `og:image` en el
`<head>` de `index.html` ya apuntan a esa URL; si el sitio cambia de dominio
(ej. al comprar carnesdelcampo.com) hay que actualizarlas (comentario ⚠️).

## Convenciones de estilo

- Comentarios y textos en español, estilo cercano y explicativo (el código está
  comentado pensando en lectores no expertos).
- HTML semántico con secciones comentadas (`<!-- ====== NOMBRE ====== -->`) y
  clases CSS tipo BEM-ligero (`.site-header`, `.card-body`, `.modal-panel`).
- CSS con variables del `:root`; usar la paleta existente en vez de colores
  nuevos sueltos. Diseño móvil primero.
- JS: vanilla, `const`/`let`, funciones flecha, sin dependencias nuevas. No
  agregar frameworks ni gestor de paquetes sin que el usuario lo pida.

## Consideraciones de seguridad

- Enlaces externos usan `target="_blank" rel="noopener"`.
- Sin formularios, sin backend, sin secretos: la superficie de riesgo es mínima.
- El contenido del catálogo se inserta en el DOM con `textContent` (no
  `innerHTML`), salvo el `innerHTML = ''` de limpieza; mantén esa práctica.
