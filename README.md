# Web personal

Web personal publicada en https://cenybar.github.io y construida con [Astro](https://astro.build): blog, seguimiento visual de lecturas y proyectos.

Se despliega automáticamente con cada push a main.

## Comandos

```bash
npm install      # instalar dependencias (solo la primera vez)
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # generar la versión de producción en dist/
```

## Cómo añadir contenido

**Un post del blog**: crea un archivo `.md` en `src/content/blog/` con cabecera `title`, `description`, `date` y `tags`. Aparece automáticamente.

**Un libro**: añade una entrada en `src/data/books.json` con `isbn`, `titulo`, `autor`, `estado` (`leyendo`, `leido` o `quiero-leer`), `nota` (1–5 o `null`) y `comentario`. La portada se obtiene automáticamente de Open Library a partir del ISBN. Si un ISBN no tiene portada, se muestra el título como respaldo — prueba con el ISBN de otra edición.

**Un proyecto**: añade una entrada en `src/data/projects.json` con `nombre`, `descripcion`, `url` y `tags`.

**Sobre mí**: edita `src/pages/sobre-mi.astro`.

## Desplegar gratis

- **Vercel / Netlify**: sube el repo a GitHub, conéctalo y detectan Astro automáticamente.
- **GitHub Pages**: usa la [guía oficial de Astro](https://docs.astro.build/en/guides/deploy/github/).

Recuerda cambiar `site` en `astro.config.mjs` por tu dominio real.
