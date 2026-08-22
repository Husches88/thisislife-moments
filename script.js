let items = [];
let current = 0;

const gallery = document.getElementById("gallery");
const statusEl = document.getElementById("gallery-status");
const hero = document.getElementById("hero-photo");
const box = document.getElementById("lightbox");
const boxImg = document.getElementById("lightbox-image");

document.getElementById("year").textContent = new Date().getFullYear();

const instagramLink = document.getElementById("instagram-link");
if (instagramLink) instagramLink.href = "https://www.instagram.com/";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function imageUrl(file) {
  return "images/" + String(file).split("/").map(encodeURIComponent).join("/");
}

async function load() {
  const r = await fetch("/api/images", { cache: "no-store" });
  if (!r.ok) throw new Error("Galerie konnte nicht geladen werden");
  const d = await r.json();
  items = d.images || [];

  const h = items.find(x => x.hero);
  if (h) hero.style.backgroundImage = `url("${imageUrl(h.file)}")`;

  const g = items.filter(x => !x.hero);
  statusEl.textContent = `${g.length} Moments`;

  gallery.innerHTML = g.map((x,i) => `
    <article class="gallery-card">
      <div class="image-wrap" data-i="${i}">
        <img src="${imageUrl(x.file)}" alt="${esc(x.title || "")}" loading="lazy">
      </div>
      <div class="caption">
        <span>${esc(x.category || "MOMENT")}</span>
        <h3>${esc(x.title || "")}</h3>
      </div>
    </article>
  `).join("");

  gallery.querySelectorAll(".image-wrap").forEach(el => {
    el.onclick = () => openLightbox(Number(el.dataset.i));
  });
}

function openLightbox(i) {
  const g = items.filter(x => !x.hero);
  if (!g[i]) return;
  current = i;
  boxImg.src = imageUrl(g[i].file);
  boxImg.alt = g[i].title || "";
  box.classList.add("open");
  box.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}
function closeLightbox() {
  box.classList.remove("open");
  box.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}
function move(d) {
  const g = items.filter(x => !x.hero);
  if (!g.length) return;
  current = (current + d + g.length) % g.length;
  boxImg.src = imageUrl(g[current].file);
  boxImg.alt = g[current].title || "";
}
document.getElementById("close-lightbox").onclick = closeLightbox;
document.getElementById("prev-image").onclick = () => move(-1);
document.getElementById("next-image").onclick = () => move(1);
box.onclick = e => { if (e.target === box) closeLightbox(); };
document.onkeydown = e => {
  if (!box.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") move(-1);
  if (e.key === "ArrowRight") move(1);
};

load().catch(err => {
  console.error(err);
  statusEl.textContent = "Galerie nicht verfügbar";
  gallery.innerHTML = '<div class="empty"><strong>Galerie konnte nicht geladen werden.</strong><br>Bitte prüfe die Cloudflare-GitHub-Verbindung.</div>';
});
