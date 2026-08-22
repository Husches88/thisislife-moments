const $ = id => document.getElementById(id);
let items = [];

async function load() {
  const r = await fetch("/api/admin-images", { cache: "no-store" });
  if (r.status === 401) {
    $("login").hidden = false;
    $("app").hidden = true;
    return;
  }
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Galerie konnte nicht geladen werden");
  items = d.images || [];

  $("items").innerHTML = items.map((x, i) => `
    <div class="item">
      <img src="images/${encodeURIComponent(x.file)}" alt="">
      <div class="meta">
        <div class="tag">${x.hero ? "TITELBILD · " : ""}${esc(x.category || "MOMENT")}</div>
        <input data-i="${i}" class="t" value="${esc(x.title || "")}">
        <input data-i="${i}" class="c" value="${esc(x.category || "MOMENT")}">
      </div>
      <div class="actions">
        <button onclick="saveItem(${i})">Speichern</button>
        <button class="danger" onclick="delItem(${JSON.stringify(x.file)})">Löschen</button>
      </div>
    </div>
  `).join("") || "<p class='hint'>Noch keine Bilder.</p>";
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function toBase64(file) {
  return file.arrayBuffer().then(buffer => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  });
}

$("loginForm").onsubmit = async e => {
  e.preventDefault();
  $("loginError").textContent = "";
  const r = await fetch("/api/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password:$("password").value})
  });
  if (r.ok) {
    $("login").hidden = true;
    $("app").hidden = false;
    load().catch(err => $("uploadMsg").textContent = err.message);
  } else {
    const d = await r.json().catch(() => ({}));
    $("loginError").textContent = d.error || "Anmeldung fehlgeschlagen";
  }
};

$("upload").onclick = async () => {
  const files = [...$("files").files];
  if (!files.length) {
    $("uploadMsg").textContent = "Bitte zuerst ein Bild auswählen.";
    return;
  }

  $("upload").disabled = true;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 20 * 1024 * 1024) {
        throw new Error(`${file.name}: maximal 20 MB`);
      }

      $("uploadMsg").textContent =
        `Bild ${i + 1} von ${files.length} wird hochgeladen …`;

      const content = await toBase64(file);

      const r = await fetch("/api/upload", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          fileName: file.name,
          mime: file.type,
          content,
          title: $("title").value || "",
          category: $("category").value || "MOMENT",
          hero: $("hero").checked
        })
      });

      const d = await r.json().catch(() => ({}));

      if (!r.ok) {
        throw new Error(d.error || `Upload fehlgeschlagen (${r.status})`);
      }
    }

    $("uploadMsg").textContent =
      files.length === 1 ? "Upload erfolgreich." : `${files.length} Bilder erfolgreich hochgeladen.`;

    $("files").value = "";
    $("title").value = "";
    $("hero").checked = false;

    await load();
  } catch (err) {
    console.error(err);
    $("uploadMsg").textContent = "Fehler: " + err.message;
  } finally {
    $("upload").disabled = false;
  }
};

window.saveItem = async i => {
  const x = items[i];
  const t = document.querySelector(`.t[data-i="${i}"]`).value;
  const c = document.querySelector(`.c[data-i="${i}"]`).value;

  const r = await fetch("/api/update", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      key:x.file,
      title:t,
      category:c,
      hero:x.hero
    })
  });

  if (r.ok) load();
  else {
    const d = await r.json().catch(() => ({}));
    $("uploadMsg").textContent = "Fehler: " + (d.error || "Speichern fehlgeschlagen.");
  }
};

window.delItem = async key => {
  if (!confirm("Bild wirklich löschen?")) return;

  const r = await fetch("/api/delete", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({key})
  });

  if (r.ok) {
    load();
  } else {
    const d = await r.json().catch(() => ({}));
    $("uploadMsg").textContent = "Fehler: " + (d.error || "Löschen fehlgeschlagen.");
  }
};

$("refresh").onclick = () => load();

$("logout").onclick = () => {
  document.cookie = "tl_admin=; Max-Age=0; Path=/";
  location.reload();
};

load().catch(() => {});

$("githubTest").onclick = async () => {
  $("githubTestResult").textContent = "Teste GitHub …";
  const r = await fetch("/api/github-test",{cache:"no-store"});
  const d = await r.json();
  $("githubTestResult").textContent = JSON.stringify(d,null,2);
};
