# THIS IS LIFE — Cloudflare Pages + R2 + Admin

Diese Version ist für **Cloudflare Pages mit GitHub-Integration** gedacht.

## Was enthalten ist

- öffentliche Homepage
- geschützter Admin-Bereich unter `/admin.html`
- Login per Passwort
- Mehrfach-Upload
- Titel und Kategorie bearbeiten
- Bilder löschen
- Titelbild markieren
- Bilder werden in Cloudflare R2 gespeichert
- Homepage lädt die Galerie direkt über Pages Functions
- kein eigener Server
- keine manuelle `content.json`

## Wichtig: nicht Direct Upload verwenden

Pages Functions werden beim Cloudflare Direct Upload nicht unterstützt. Dieses Projekt muss über GitHub/Git-Integration deployt werden.

## Cloudflare vorbereiten

1. R2 Bucket erstellen, z.B. `thisislife-media`.
2. Pages-Projekt mit GitHub verbinden.
3. In Pages: Settings → Bindings → R2 bucket.
4. Variable name: `MEDIA`
5. Bucket: `thisislife-media`
6. Redeploy.
7. Pages → Settings → Variables and Secrets → Production → Secret:
   `ADMIN_PASSWORD`
8. Als Wert ein langes, starkes Passwort setzen.
9. `/admin.html` öffnen und anmelden.

R2 bleibt privat. Die Website liefert Bilder über die Function `/media/...`; du musst den Bucket nicht öffentlich machen.

## GitHub

Repository z.B.:

`husches88/thisislife-moments`

Alle Dateien dieses Projekts ins Repository hochladen und committen.

## Cloudflare Pages Build

Framework preset: None

Build command: leer lassen

Build output directory: `/`

Production branch: `main`

## Sicherheit

Das Admin-Passwort wird nicht im Quellcode gespeichert, sondern als Cloudflare Secret `ADMIN_PASSWORD`.

Der Login setzt ein HttpOnly/Secure/SameSite-Cookie.

Uploads sind auf Bildformate und 25 MB pro Datei begrenzt.

## Admin

`https://DEINE-PAGES-DOMAIN/admin.html`

Dort kannst du Bilder hochladen, Titel/Kategorie ändern und Bilder löschen.

## Hinweis

Für eine echte öffentliche Produktionsseite sollte später zusätzlich eine eigene Domain verwendet werden. R2 kann über eine eigene Domain ausgeliefert werden; für die Admin-Funktion selbst bleibt der Bucket privat.
