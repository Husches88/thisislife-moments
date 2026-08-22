# THIS IS LIFE — Moments

## GitHub + Cloudflare Pages — ohne R2

Die Website lädt die Fotos direkt aus dem GitHub-Ordner `images/`. Es ist **kein Cloudflare R2** notwendig.

### Ordnerstruktur

```text
index.html
style.css
script.js
images.json
admin.html
images/
  hero.jpg
  ORIGINAL_IG-178....jpg
  ...
```

### Deine aktuellen Bilder

Die mitgelieferte `images.json` ist bereits mit den Dateinamen aus deinem aktuellen `images`-Ordner vorbereitet.

**Wichtig:** Die Dateinamen müssen in GitHub exakt gleich geschrieben sein.

### Neues Foto hinzufügen

1. Foto in GitHub nach `images/` hochladen.
2. `images.json` öffnen.
3. Einen neuen Eintrag ergänzen, z. B.:

```json
{
  "file": "mein-neues-bild.jpg",
  "title": "Mein neuer Moment",
  "category": "MOMENT"
}
```

4. Commit speichern.
5. Cloudflare Pages deployt die Änderung automatisch.

### Titelbild

Ein Eintrag mit `"hero": true` wird als großes Titelbild verwendet. Aktuell ist `hero.jpg` das Titelbild.

### Hinweis

Der bisherige R2-Adminbereich wird in dieser Version nicht verwendet. Der vorhandene `functions`-Ordner ist für die neue einfache Variante ebenfalls nicht erforderlich.
