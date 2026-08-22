# THIS IS LIFE — Moments

## Einfache Variante ohne Cloudflare R2

Die Website läuft über GitHub + Cloudflare Pages.
Die Fotos liegen direkt im GitHub-Ordner `images/`.

### Struktur

```text
index.html
style.css
script.js
images.json
images/
  bild01.jpg
  bild02.jpg
  bild03.jpg
  ...
```

### Neues Foto hinzufügen

1. Foto in `images/` hochladen.
2. Den Dateinamen in `images.json` ergänzen.
3. Commit nach GitHub.
4. Cloudflare Pages deployt die Änderung automatisch.

### Wichtig

- Dateiname in `images.json` muss exakt zum Bild passen.
- Groß-/Kleinschreibung beachten.
- Keine R2-Bindung nötig.
- Die vorhandenen `functions/` sind für diese Variante nicht erforderlich.
- Der alte R2-Adminbereich wird in dieser einfachen Variante nicht verwendet.
