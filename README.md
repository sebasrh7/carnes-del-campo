# Carnes del Campo — Sitio web

Sitio web de una página para **Carnes del Campo** (carnicería y distribuidor de carne en Andalucía, Valle del Cauca). Diseño móvil primero, animaciones GSAP con parallax, botón flotante de WhatsApp, catálogo de productos y sección para restaurantes.

## Cómo verlo en tu computador

1. Abre la carpeta `carnes-del-campo`.
2. Haz doble clic en `index.html` — se abre en tu navegador.

> Nota: el **mapa de Google** y las **fotos** funcionan mejor servidos por un servidor local. Con Python instalado, abre la terminal en esta carpeta y ejecuta `python3 -m http.server 8000`, luego entra a `http://localhost:8000`.

## Archivos

| Archivo                       | Qué contiene                                    |
|-------------------------------|-------------------------------------------------|
| `index.html`                  | Contenido, estructura, SEO y datos para Google  |
| `styles.css`                  | Diseño (colores del logo, tipografía, responsive)|
| `script.js`                   | Menú móvil, animaciones GSAP y parallax         |
| `assets/logo-small.png`       | Logo optimizado que usa la página (52 KB)       |
| `assets/favicon.png`          | Ícono de la pestaña (64px)                      |
| `assets/og-image.jpg`         | Imagen de vista previa al compartir el enlace   |
| `assets/js/`                  | GSAP y ScrollTrigger (animaciones, locales)     |

## ✅ Datos ya configurados

- **WhatsApp/Teléfono:** 312 760 7353 (en todos los botones)
- **Correo:** carnesdelcampo.a@gmail.com
- **Dirección:** Cra 7 # 12-11, Andalucía, Valle del Cauca (y el mapa)
- **Horario:** L–S 7:00–12:00 y 2:00–6:00 · D 7:00–12:00
- **SEO local:** datos estructurados para Google (nombre, dirección, horario)
- **Colores e identidad:** paleta exacta del logo, iconos SVG

## ⚠️ Pendientes

### 1. Fotos reales (las actuales son gratuitas de Unsplash)
Guarda tus fotos en `assets/` y reemplaza cada `https://images.unsplash.com/...`:

| Sección              | Qué debería mostrar        | Dónde está                          |
|----------------------|----------------------------|--------------------------------------|
| Portada (fondo)      | Carne fresca / vitrina     | `styles.css` (`.hero-media`) y el `preload` del `<head>` |
| Nosotros             | El local / cortes          | `index.html`                        |
| Producto: Res        | Carne de res               | `index.html`                        |
| Producto: Cerdo      | Carne de cerdo             | `index.html`                        |
| Producto: Pollo      | Pollo fresco               | `index.html`                        |
| Producto: Embutidos  | Chorizo / embutidos        | `index.html`                        |
| Producto: Especiales | Cortes finos               | `index.html`                        |
| Producto: Por mayor  | Cantidad / distribución    | `index.html`                        |
| Restaurantes         | Entrega / cocina           | `index.html`                        |

### 1b. Catálogo de cortes, fotos y precios — ¡desde el panel de administración!
El catálogo (categorías, cortes, fotos y precios) vive en `content/catalogo.json`
y **se edita sin tocar código desde Pages CMS**:

1. Entra a **app.pagescms.org** e inicia sesión con la cuenta de GitHub del negocio.
2. Abre el proyecto **carnes-del-campo** → "Catálogo de cortes".
3. Agrega/edita cortes, sube fotos (van a `assets/cortes/`) y pon precios
   (opcional, ej: `$14.000 /lb` — si lo dejas vacío no se muestra).
4. Dale **Guardar**: la web se republica sola en ~1 minuto. Nunca hay que "desplegar".

> Las fotos actuales son de ejemplo (Unsplash, genéricas y algunas repetidas).
> Reemplázalas con fotos reales de la vitrina desde el mismo panel.
> El campo "Identificador" de cada categoría (res, cerdo, pollo, embutidos,
> especiales) **no se debe cambiar**: conecta con las tarjetas de la página.

### 2. Redes sociales (ocultas por ahora)
Cuando crees Instagram y Facebook, busca en `index.html` el bloque comentado
`REDES SOCIALES`, quita el comentario y pon tus enlaces reales.

### 3. Al publicar con dominio propio
En el `<head>` de `index.html`, actualiza las dos URL marcadas con ⚠️
(`og:url` y `og:image`) con tu dominio definitivo — así WhatsApp mostrará
la vista previa con foto al compartir el enlace.

## Cómo publicarlo en internet (gratis)

1. **Compra el dominio** `carnesdelcampo.com` (~$50.000/año) en Namecheap, GoDaddy o similar.
2. **Sube la carpeta** a un hosting gratis como **Netlify** o **Vercel** (arrastras la carpeta y listo).
3. **Conecta el dominio** al hosting (ellos te guían).
4. Actualiza `og:url` y `og:image` con el dominio (punto 3 de Pendientes).

---

*Construido según el PRD de Carnes del Campo · Julio 2026*
