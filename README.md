# web-OpenCall

Landing de [OpenCall.md](https://github.com/ruben-salas20/OpenCall.md) — un fork de call.md que
graba, transcribe y resume clases **en local**, sin servicios de pago.

Publicada en **https://opencall.rubensalas.dev**

## Stack

Vite 7 · React 19 · TypeScript · Tailwind v4 · `motion` · `lucide-react`

Es una página estática de una sola ruta. No usa variables de entorno ni backend.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # sirve dist/ en local
npm run typecheck
npm run lint
```

Requiere Node 22 (ver `.nvmrc`).

## Despliegue

Vercel, preset Vite. Build `npm run build`, output `dist/`. Cada push a `main` redespliega.

## Assets

Las capturas viven en `public/assets/` con variantes `.webp` en 640/768/1024/nativo, servidas
mediante `<picture>` + `srcSet`. `og-image.jpg` (1200×630) es la imagen de las previews sociales.

## Licencia

MIT, igual que el proyecto principal.
