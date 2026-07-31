---
name: imagenes-cortes
description: Genera prompts de IA para fotos de cortes de carne de Carnes del Campo con una estética uniforme (crudo, mesón de mármol blanco, luz natural, sin decoración). Úsala cuando el dueño pida prompts o imágenes para productos nuevos del catálogo, o quiera regenerar las existentes.
---

# Imágenes de cortes — Carnes del Campo

Sistema de prompts para generar fotos de producto con IA, todas con la misma
estética. El objetivo: que el catálogo del POS (Alegra) y la página web se
vean uniformes, estilo vitrina de carnicería — carne CRUDA, nunca platos
preparados ni comida de restaurante.

## Base de estilo (idéntica en todos los prompts)

> Professional butcher shop product photo: [CORTE], raw and fresh, on a clean
> white marble counter, soft natural daylight, plain light background, no
> props, no garnish, no herbs, no cooked food, no people, no text, realistic
> meat texture with natural moisture, slight 45-degree angle, square format

Reglas:
- Formato **cuadrado (1:1)** — es como mejor se ve en Alegra POS.
- Solo se reemplaza `[CORTE]`; la base nunca cambia.
- Generar tandas en una misma sesión del generador y encadenar con
  *"same style, same lighting, same counter as the previous image"*.
- Si sale cocinado/dorado/decorado, regenerar añadiendo
  *"completely raw, uncooked, no browning"*.
- Verificar anatomía con el dueño (la IA inventa huesos).

## Descripciones por corte ([CORTE])

### Activos hoy (cerdo y pollo)
| Producto | [CORTE] |
|---|---|
| Lomo de cerdo | a whole boneless pork loin, pale pink with a thin white fat cap |
| Pernil de cerdo | a whole fresh raw pork leg (fresh ham), skin on |
| Costilla de cerdo | a full rack of raw pork spare ribs |
| Brazo de cerdo | a large bone-in raw pork shoulder cut |
| Tocineta | thin raw bacon strips with layered fat and meat, slightly overlapping |
| Papada | a slab of raw pork jowl, pale fat with thin streaks of meat |
| Espinazo de cerdo | raw pork backbone pieces with bone and meat |
| Tocino | a thick slab of raw pork belly with skin |
| Garra | four raw pork trotters (pig feet), clean and pale — CONFIRMADO (31 jul 2026): en esta carnicería «garra» son patas; el dueño generó y aprobó la imagen de patas |
| Pechuga de pollo | two whole raw skinless chicken breasts |
| Pernil de pollo | raw chicken leg quarters with skin |
| Alas de pollo | a pile of fresh raw chicken wings |

### Pausados (para cuando se reactiven)
| Producto | [CORTE] |
|---|---|
| Lomo fino | a whole raw beef tenderloin, deep red, trimmed |
| Lomo ancho | a thick raw ribeye steak with marbling |
| Punta de anca | a raw picanha cut with its white fat cap |
| Sobrebarriga | a raw beef flank cut, flat and fibrous |
| Carne molida | fresh raw ground beef in a neat mound |
| Costilla de res | raw beef short ribs, bone-in |
| Cadera | a thick raw beef rump steak |
| Bota | a lean raw beef round roast |
| Murillo | raw beef shank slices with center bone and marrow |
| Centro de pierna | lean raw beef leg cutlets, thin sliced |
| Lengua | a whole raw beef tongue |
| Hígado | fresh raw beef liver slices, dark red and glossy |
| Chuleta de cerdo | two raw bone-in pork chops |
| Empella | a sheet of raw pork leaf fat, white |
| Patas de cerdo | four raw pork trotters, clean and pale |
| Muslos de pollo | raw chicken drumsticks |
| Contramuslos | raw boneless chicken thighs |
| Menudencias | raw chicken giblets (gizzards, livers, hearts) |
| Chorizo | fresh raw Colombian chorizo sausage links, tied with string |
| Longaniza | a coil of fresh raw longaniza sausage |
| Morcilla (rellena) | fresh raw morcilla blood sausage links |
| Butifarra | small fresh butifarra sausages tied in a chain |
| Churrasco | a thick raw churrasco steak, butterflied |
| Baby beef | small thick raw beef medallions |
| Picaña | a whole raw picanha with scored fat cap |
| T-bone | a raw T-bone steak showing the bone |
| Picada para asado | an assortment of raw meats for barbecue on a tray |

## Qué hacer con las imágenes generadas

1. Pedirle al dueño los archivos, nombrados por corte.
2. Optimizar: JPEG, máx 900px, calidad 80 (Pillow está disponible).
3. **Web:** guardarlas en `assets/cortes/<slug>.jpg` con el nombre que usa
   `content/catalogo.json`, commit y push (Vercel republica solo).
4. **Alegra:** subir con `POST /items/{id}/attachment` campo `image`.
   ⚠️ NUNCA usar `DELETE /items/{id}/attachment/{aid}` — borra el producto
   completo (ver CLAUDE.md). Para reemplazar una foto existente en Alegra:
   hacerlo desde la web de Alegra a mano, o recrear el producto.
5. Mantener web y Alegra con las mismas imágenes (identidad 1:1).
