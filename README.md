# THIS IS LIFE — GitHub Upload Admin

Diese Version nutzt:
- GitHub als Bildspeicher
- Cloudflare Pages
- Pages Functions
- GitHub Fine-grained Token als Cloudflare Secret
- kein R2

## Cloudflare Variablen / Secrets (Production)

Secret:
- `GITHUB_TOKEN`
- `ADMIN_PASSWORD`

Variablen:
- `GITHUB_OWNER` = dein GitHub Benutzername
- `GITHUB_REPO` = `thisislife-moments`
- `GITHUB_BRANCH` = `main`

## GitHub Token

Fine-grained token:
- Repository access: nur `thisislife-moments`
- Contents: Read and write

## Pages

- Framework: None
- Build command: leer
- Build output directory: `/`
- Production branch: `main`

## Nutzung

Öffne:
`https://thisislife.pages.dev/admin.html`

Melde dich mit `ADMIN_PASSWORD` an.
Bilder werden nach `images/` geschrieben und die Metadaten in `images.json` aktualisiert.
Die öffentliche Galerie liest `/api/images`.

Wichtig: Der Upload verwendet JSON statt multipart/form-data, damit Safari/Cloudflare keine Boundary-Fehler erzeugen. Die `functions/` müssen im Repository vorhanden sein. Cloudflare Pages muss über die Git-Integration deployen; Direct Upload unterstützt Pages Functions nicht.
