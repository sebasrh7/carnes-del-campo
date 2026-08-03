# CLAUDE.md — Carnes del Campo

Contexto del negocio y del proyecto. Léelo siempre antes de trabajar aquí.

## El negocio

**Carnes del Campo** es una carnicería y distribuidora de carne en Andalucía,
Valle del Cauca (Colombia). El dueño (el usuario) **está empezando en este
negocio y está aprendiendo**: explícale las cosas en español, con lenguaje
sencillo y sin asumir conocimientos técnicos ni de administración de negocios.

- **Qué vende:** carne de res, cerdo, pollo, embutidos y cortes especiales,
  al detal en el local y al por mayor a restaurantes.
- **Canal principal de venta al público:** WhatsApp (+57 312 760 7353).
- **Correo del negocio:** carnesdelcampo.a@gmail.com
- **Dirección:** Cra 7 # 12-11, Andalucía, Valle del Cauca.
- **Horario:** L–S 7:00–12:00 y 2:00–6:00 · D 7:00–12:00.

## Los dos frentes del proyecto

### 1. Sitio web (este repositorio)

Sitio estático de una página (HTML/CSS/JS vanilla + GSAP) para atraer clientes
y convertir visitas en pedidos por WhatsApp. El catálogo se edita sin código
desde Pages CMS (`content/catalogo.json`).

- **Publicado en:** https://carnes-del-campo-azure.vercel.app/ (Vercel;
  pendiente comprar el dominio carnesdelcampo.com).

➡️ **Todos los detalles técnicos del sitio están en `AGENTS.md`** (estructura,
reglas al modificar, cómo probar, convenciones). No dupliques esa información
aquí; consúltala allá.

### 2. Alegra POS (software de punto de venta)

El negocio decidió usar **Alegra POS** (alegra.com, plan Colombia) como
software para el flujo de venta: facturación, inventario de productos,
caja, etc. Estado actual (julio 2026):

- Catálogo completo cargado (30 jul 2026): **5 categorías** (Res, Cerdo,
  Pollo, Embutidos, Especiales — mismos nombres que el sitio web) con **40
  productos** por libra. Cerdo y parte de pollo tienen precio; el resto quedó
  en $0 esperando los precios reales del dueño.
- «Venta simple» (id 2) es un servicio que crea Alegra POS automáticamente:
  no tocarlo. «Lomo de Cerdo (prueba antigua - no usar)» (id 1) es un residuo
  de pruebas: quedó inactivo y no se puede borrar porque tiene documentos
  asociados.
- Vendedor único: **Carlos Alberto Rengifo** (id 1) — es el único en caja,
  no crear más vendedores por ahora. Existe un contacto **«Proveedor general
  (editar con datos reales)»** (id 2, NIT placeholder 900000000) para
  registrar compras mientras el dueño consigue los datos reales.
- Truco de la API (Colombia): `POST /contacts` falla con error 905 si no se
  envían `kindOfPerson`, `regime` e `identificationObject`; con esos campos
  funciona (usar `LEGAL_ENTITY` — con `PERSON_ENTITY` sigue fallando por
  exigir nombres separados).
- Cliente **«Consumidor final»** (id 3, NIT 222222222222, convención DIAN)
  creado el 30 jul 2026 para ventas de mostrador sin pedir cliente. En la
  app del POS debe elegirse como cliente predeterminado de la terminal.
- ⚠️ **PELIGRO — endpoint traicionero:** `DELETE /items/{id}/attachment/{aid}`
  **BORRA EL PRODUCTO COMPLETO**, no la foto (su mensaje «El ítem fue
  eliminado» es literal). El 30 jul 2026 esto borró 38 productos que hubo
  que recrear (por eso los ids cambiaron). NUNCA usar esa ruta. Para cambiar
  una foto: recrear el producto o hacerlo desde la web de Alegra.
- Fotos: se suben con `POST /items/{id}/attachment`, campo multipart
  **`image`** (el nombre «attachment» NO funciona). El campo `images` de
  cada ítem solo aparece en el listado `GET /items`, no en `GET /items/{id}`.
- Todos los productos (30 jul 2026) tienen foto curada estilo carnicería
  (crudas, licencia libre de Openverse/Wikimedia, revisadas visualmente una
  a una; copias en el scratchpad de la sesión). 9 productos conservan las
  fotos que el dueño subió en sus pruebas (pernil/brazo/costilla/lomo de
  cerdo, tocino, tocineta, alas, garra, papada). Cuando el dueño tome fotos
  reales de la vitrina, reemplazarlas en Alegra y en la web.
- Ids actuales tras la reconstrucción: Garra 3, Papada 13, res 14–25,
  cerdo 26–35, pollo 36–42, embutidos 43–46, especiales 47–51
  (ver nombres exactos con `GET /items`).
- Estado del POS (30 jul 2026, decisión del dueño): **activos solo los 12
  cortes que venden hoy** (9 de cerdo incl. garra y papada + pechuga, pernil
  y alas de pollo), todos con precio por libra confirmado por Carlos vía
  WhatsApp y con foto. Los inactivos (res, embutidos, especiales, resto de
  pollo/cerdo) conservan su foto: reactivarlos con
  `PUT /items/{id} {"status":"active"}` + precio cuando los empiecen a
  vender. «Pollo entero» se eliminó dos veces a pedido del dueño: no
  recrearlo salvo que lo pida.
- Fotos IA (31 jul 2026): el dueño generó las 12 fotos con la skill
  `imagenes-cortes` (estética uniforme, mármol blanco). Ya están en la web
  (`assets/cortes/`) y subidas a Alegra como **segunda imagen** de cada
  producto activo — la API no permite borrar ni reordenar imágenes (el
  DELETE de attachment borra el producto; el PUT ignora `images`), así que
  **queda pendiente que el dueño borre la foto vieja de cada producto desde
  la web de Alegra** para que la nueva quede como principal.
- NIT del negocio: **1116070244** (persona natural: Carlos Alberto Rengifo
  Hidalgo; DV calculado: 1). Nombre legal cargado en `nameObject` (el segundo
  apellido solo lo aceptó dentro de `lastName`: «Rengifo Hidalgo»). OJO: al
  cargar `nameObject`, Alegra deriva el `name` de la empresa del nombre legal
  y **ya no acepta cambiarlo por API**: el nombre visible pasó de «Carnes del
  Campo» a «Carlos Alberto Rengifo Hidalgo». El nombre comercial («Carnes del
  Campo») debe ponerse desde la web de Alegra (Configuración → Empresa,
  campo nombre comercial) — verificar que el tiquete POS lo muestre.
- Cuenta **Nequi** creada (banco id 6) para recibir transferencias.
- **Pendiente:** poner precios a los productos en $0, poner costos por libra
  (el dueño aún no los tiene), editar el proveedor genérico con datos reales,
  registrar los restaurantes como clientes, renombrar «Banco 1» con el banco
  real del negocio, completar el nombre legal de la persona natural en la
  empresa (necesario para facturación electrónica), decidir impuestos con un
  contador (carne fresca normalmente sin IVA; embutidos/procesados
  normalmente 19%; hoy ningún producto tiene impuesto), y más adelante
  evaluar inventario y facturación electrónica.

#### API de Alegra — cómo conectarse

- Base: `https://api.alegra.com/api/v1/`
- Autenticación: **HTTP Basic** con `correo:token` en Base64
  (header `Authorization: Basic <base64>`). El token se genera en
  Alegra → Configuración → API.
- Las credenciales viven en **`.env`** en la raíz del repo (archivo
  **ignorado por git, nunca se sube**):

  ```
  ALEGRA_EMAIL=correo-de-la-cuenta
  ALEGRA_TOKEN=token-generado-en-alegra
  ```

- Ejemplo de uso con curl:

  ```sh
  source .env
  curl -s -u "$ALEGRA_EMAIL:$ALEGRA_TOKEN" https://api.alegra.com/api/v1/items
  ```

- Endpoints útiles: `items` (productos), `categories`, `taxes` (impuestos),
  `warehouses` (bodegas), `price-lists`, `contacts` (clientes/proveedores),
  `invoices` (facturas).

#### Reglas al trabajar con Alegra

- **Nunca** escribas el token en archivos versionados, commits ni salidas
  visibles; solo en `.env`.
- Antes de crear o modificar datos en Alegra (POST/PUT/DELETE), **muestra al
  usuario qué se va a cambiar y confirma primero**: es la contabilidad real
  del negocio, no un entorno de pruebas.
- Ten en cuenta que puede haber **datos de prueba** de los primeros
  experimentos; verificar antes de asumir que un producto es real.
- Los precios en Colombia se manejan en **pesos colombianos (COP)** y la carne
  suele venderse **por libra (lb)**.

## Cómo tratar al usuario

- Responder **siempre en español**.
- Explicar el «porqué» de las cosas: el usuario quiere aprender, no solo que
  se haga la tarea.
- Para acciones sobre datos reales (Alegra, publicar el sitio), confirmar
  antes de ejecutar.
