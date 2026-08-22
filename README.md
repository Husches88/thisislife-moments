# THIS IS LIFE — statische GitHub + Cloudflare Pages Version

Diese Version verwendet **kein Cloudflare R2**, keine Pages Functions und keine `images.json`.

Die Galerie ist direkt in `index.html` eingetragen. Die Bilder werden direkt aus `images/` geladen.

## Struktur

```text
index.html
style.css
script.js
images/
  hero.jpg
  ORIGINAL_IG-....jpg
  ...
```

## Deployment

Cloudflare Pages:
- Framework: None
- Build command: leer
- Build output directory: `/`
- Production branch: `main`

Nach einem Commit auf `main` wird die Seite über die GitHub-Integration neu deployed.

## Neue Bilder

Neue Bilder müssen in `index.html` ergänzt werden, weil diese Version bewusst komplett statisch ist.
