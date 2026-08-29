# web/ — la landing de OpenCall.md

Contexto específico de este directorio. Para qué es el proyecto, quién lo usa y las preferencias
del usuario, ver el `CLAUDE.md` de la raíz — esto no lo repite.

**Repositorio git independiente** del de `app/`: https://github.com/ruben-salas20/web-OpenCall.
Producción en https://opencall.rubensalas.dev, en Vercel. Cada push a `main` redespliega solo. DNS
en name.com: `CNAME opencall → cname.vercel-dns.com`.

---

## Comandos

```bash
cd web
npm run dev          # servidor de desarrollo, Vite
npm run build        # tsc --noEmit && vite build  ->  dist/
npm run preview      # sirve dist/ en local
npm run typecheck    # tsc --noEmit suelto
npm run lint
```

**`build` corre `tsc --noEmit` antes de empaquetar.** Un error de tipos rompe el despliegue de
Vercel aunque `npm run dev` funcione perfectamente en local — `dev` no comprueba tipos. Node
fijado en `.nvmrc` y en `engines` de `package.json`: **22.x**.

---

## Arquitectura real: un componente, un CSS

No hay carpeta `components/`, no hay router. Toda la página es:

- `src/App.tsx` — **427 líneas**, un único componente que renderiza toda la landing de arriba a
  abajo.
- `src/styles.css` — **1773 líneas**, todo el CSS del sitio en un solo archivo.

Cuatro componentes locales, todos dentro de `App.tsx`:

| Componente | Qué hace |
|---|---|
| `Reveal` | Envuelve una sección y la anima al entrar en el viewport vía `IntersectionObserver`. Empieza en `opacity: 0`. |
| `ScreenshotImage` | Resuelve `srcSet` (webp por ancho) y `sizes` para una captura del dashboard o de una clase. |
| `Marker` | Punto/etiqueta numerado sobre una captura, para señalar una zona de la UI. |
| `Logo` | El isotipo inline en SVG. |

### Secciones de la landing, en orden

| `id` | Sección |
|---|---|
| (nav) | Marca y menú (hamburguesa bajo 860px) |
| `hero` | Titular, CTA de descarga, visual del dashboard |
| — | `signal-strip` (no usa `Reveal`) |
| `features` | Grid de características |
| `live` | Copiloto en vivo |
| `contenido` | Ancla del `.skip-link` |
| (footer) | Enlaces, repo, licencia |

---

## Publicar una versión nueva de la app

Todo el cableado está en `App.tsx:23-26`: `releaseVersion`, `downloadUrl`, `repositoryUrl`. El
propio comentario del archivo dice que solo hay que tocar esas líneas.

**El nombre del `.exe` en `downloadUrl` es un contrato implícito con
`app/electron-builder.config.js`.** Si el `artifactName` cambia allí (recordar el bug histórico de
los espacios convertidos en puntos por GitHub), el botón de descarga apunta a un asset que no
existe: **404 sin ningún aviso**, ni en build ni en runtime. Verificar el nombre real del asset en
el release de GitHub antes de tocar la landing.

---

## Qué afirma la landing (revisar en cada publicación)

Grabación de hasta 4 horas, modelo de ~1 GB, Windows 11 probado, macOS/Linux sin verificar,
licencia MIT, integración con Ollama.

**Lo que NO menciona, a propósito o por omisión:** transcripción por GPU/Speaches (guía fuera del
repo por decisión del usuario), actualizaciones automáticas, exportación a MP4, importación de
audio, la carpeta `~/.opencall_md`. Añadirlo es decisión de producto del usuario, no un desliz de
la landing — no meterlo por iniciativa propia.

---

## Trampas que ya costaron caro (o van a costarlas)

- **Cache inmutable de un año sobre `/assets/*`**, y los assets de `public/` no llevan hash en el
  nombre (`vercel.json`: `/assets/(.*)` con `Cache-Control: public, max-age=31536000, immutable`).
  Sustituir una captura o `og-cover.jpg` manteniendo el mismo nombre de archivo deja la versión
  vieja servida durante un año a quien ya la tenga cacheada, navegador o CDN. **Para cambiar una
  imagen hay que cambiarle el nombre.** Es el fallo de producción más caro del repo y `npm run dev`
  no lo enseña porque en dev no hay cache.
- **`LazyMotion` en modo `strict`** (`App.tsx:116`): usar `<motion.div>` en vez del componente `m`
  compila limpio y pasa el lint, y **revienta en runtime**. Solo valen los componentes `m` de `motion/react-m`.
- **Tailwind está importado y no se usa ni una utilidad** — solo aporta su preflight. Las reglas
  propias del CSS están *fuera* de toda `@layer`, y lo no capado gana siempre a lo capado: una
  utilidad tipo `mt-8` añadida algún día en el JSX **no se aplicará**, sin error ni warning.
  Verificado en el CSS compilado.
- **`.site-shell { overflow: clip }`** (`styles.css:89`): cualquier desbordamiento se recorta en
  silencio, sin scroll horizontal que delate el fallo. Auditar el móvil exige mirar la pantalla, no
  medir con devtools. Varios elementos se salen del contenedor a propósito y dependen de ese
  `clip` para no romper el layout: `.visual-wash`, `.visual-grid`, `.screenshot--front`,
  `.feature-visual--panel`, `.live-section::before`, `.visual-caption--bottom`.
- **El hero entre 861 y 1080px va justo**: `.hero { min-height: calc(100dvh - 77px) }` con
  `.hero-visual { min-height: 500px }` fijo y un H1 en `clamp(3.3rem, calc(2.5rem + 2.5vw), 5.2rem)`.
  En un portátil 1366×768 no cabe todo sin recortar.
- **Solo dos breakpoints, ambos `max-width`: 1080px y 860px.** No hay ninguno por debajo de 860: un
  iPhone SE (375px) y una tablet de 859px comparten el mismo bloque de estilos. En 860px el nav pasa
  a hamburguesa y los grids pasan a `display: block`.
- **Regenerar una captura es una edición coordinada de tres puntos**: el ancho nativo va en el
  *nombre* del archivo y se interpola en el `srcSet` (`App.tsx:70`); las dimensiones están
  hardcodeadas aparte en `App.tsx:63-64` (dashboard 1468×903, class-detail 1470×911); y el
  `imagesrcset` del preload está en `index.html`. El string `sizes`/`imagesizes` está además
  duplicado entre `index.html` y `App.tsx:71`, y menciona un `1320px` que no existe en el CSS — no
  "arreglarlo" a que coincida sin revisar por qué se puso así.
- **`Reveal` deja el contenido en `opacity: 0`** hasta que dispara el `IntersectionObserver`; el
  sitio es 100% CSR sin fallback. Si el JS falla, solo se ven el hero y la `signal-strip`, que no
  usan `Reveal`.
- **`.live-content { display: contents }`**: envolverlo o darle estilo propio rompe el grid entero.
- **No hay rewrite SPA en `vercel.json`** — no hace falta hoy sin router, pero añadir navegación
  cliente lo va a exigir.
- **`og:image` y `canonical` apuntan al dominio propio**, así que las previews sociales no
  funcionan probando desde una URL `*.vercel.app`. No es un fallo, es comportamiento esperado.
- **El `README.md` está desactualizado**: dice que la imagen social es `og-image.jpg`, pero el
  archivo real y el que referencia `index.html` es `og-cover.jpg` (`og-image.jpg` no existe).
  Pendiente de corregir.

---

## Stack y configuración (versiones instaladas)

| Paquete | Versión |
|---|---|
| vite | 7.3.6 |
| react / react-dom | 19.2.8 |
| tailwindcss / @tailwindcss/vite | 4.3.3 |
| motion | 12.43.0 |
| lucide-react | 0.510.0 |
| @vercel/analytics | 2.0.1 |
| typescript | 5.9.3 |
| @fontsource-variable/geist, -geist-mono, -newsreader | 5.3.0 |

**Vercel Web Analytics** está montado: `<Analytics />` de `@vercel/analytics/react` dentro de
`<StrictMode>` en `src/main.tsx`, y activado en el dashboard del proyecto. Es cookieless, no pinta
nada y sirve su script desde `/_vercel/insights/`, ruta de primera parte — por eso no choca con
nada aunque el sitio no tenga CSP. **Depende de que siga activado en el dashboard**: si se
desactiva, el script da 404 en silencio y se dejan de recoger datos sin ningún aviso en el build.
El lockfile se regenera con npm 11: una regeneración con npm 10 borra los campos `libc` de los
binarios opcionales de rollup y ensucia el diff sin romper nada.

`package.json`: `name: opencall-web`, `version 0.1.0`, `type: module`, `engines.node: 22.x`.
`vite.config.ts` (9 líneas): plugins `react()` + `tailwindcss()`, `build.sourcemap: false`, sin
`base` ni alias. `tsconfig.json` único, sin split: `target ES2022`, `strict: true`,
`moduleResolution: "Bundler"`, `jsx: react-jsx`. `eslint.config.js`: flat config, ignora `dist/**`,
`tseslint.configs.recommended` **sin type-checking**, `react-refresh/only-export-components`
desactivada a propósito, `eslint-plugin-react` no está instalado.

`vercel.json`: **solo `headers`**, sin rewrites, redirects ni `buildCommand`. `/(.*)`:
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. No
hay CSP.

### Tokens y tipografía

`:root` (`styles.css:6-22`): `color-scheme: dark` fijo, `--ink: #0b0b0d`, `--ink-soft: #111113`,
`--ink-lift: #18181b` (**token muerto, sin uso**), `--ink-line: rgba(255,255,255,0.12)`,
`--paper: #f2efe9`, `--paper-muted: #bcb8b0`, `--paper-dim: #8a8781`, `--orange: #ff4b10`,
`--orange-soft: #ff9a67`, `--orange-dark: #c53a0b`, `--blue: #5b8fd6`.

**Dark-only por diseño, no un pendiente**: `color-scheme: dark` fijo y cero
`@media (prefers-color-scheme)` en las 1773 líneas. Un visitante en modo claro del sistema ve
igualmente la página oscura.

Las tres fuentes se importan como paquetes npm en `styles.css:1-3`, sin `<link>` a Google Fonts.
Los nombres reales de familia llevan sufijo — **`Geist Variable`**, **`Geist Mono Variable`**,
**`Newsreader Variable`** — y los tokens ya los referencian bien. El bug histórico (un `<link
rel="preload">` a `/node_modules` que daba 404 al desplegar, y un `--mono` pidiendo "Geist Mono"
sin el sufijo) **ya está corregido**: no volver a "arreglarlo". Reparto: `--serif` (Newsreader) en
H1/H2 y destacados, `--mono` (Geist Mono) en eyebrows/numeración/labels/pies, el resto `--sans`.

### Assets e index.html

`public/assets/` (12 archivos, ~975 KB): `dashboard.png` 1468×903 y `class-detail.png` 1470×911,
cada uno con webp en 640/768/1024/su-ancho-nativo (el PNG de `class-detail`, 320 KB, es el más
pesado del repo y casi nunca se descarga); `og-cover.jpg` 1200×630 (93 KB);
`opencall-icon-dark.png` 128×128; `robots.txt`; `sitemap.xml` (una URL).

`index.html`: `<html lang="es">`, `canonical`/`og:url` absolutos al dominio, `og:image` absoluto
con `width/height` 1200/630 coincidentes con el archivo real, `twitter:card
summary_large_image`, preload de `dashboard-768.webp` con `fetchpriority="high"`. Todos los
assets referenciados existen. No hay `manifest.json`, favicon.ico ni JSON-LD.

### Accesibilidad

Hecho: `.skip-link` a `#contenido`; `:focus-visible` con outline naranja en 9 selectores y ningún
`outline: none`; `aria-label`/`aria-hidden`/`aria-expanded` donde corresponde; `rel="noreferrer"`
en enlaces externos; botones con `min-height: 48px`; doble cobertura de `prefers-reduced-motion`
(CSS + `useReducedMotion()` en `Reveal`).

Huecos reales: el menú móvil **no atrapa el foco ni se cierra con `Escape`**, sin scroll-lock al
abrirlo; `--paper-dim` sobre `--ink` en textos de 10-11px es el contraste más justo del diseño.

---

## Pendientes de este directorio

- Repaso visual en móvil real (ver la trampa del hero 861-1080px arriba).
- `--ink-lift` es un token muerto — quitarlo o usarlo.
- `README.md` dice `og-image.jpg`, el archivo real es `og-cover.jpg`.
