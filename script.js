let items = [];
let current = 0;

const gallery = document.getElementById("gallery");
const statusEl = document.getElementById("gallery-status");
const hero = document.getElementById("hero-photo");
const box = document.getElementById("lightbox");
const boxImg = document.getElementById("lightbox-image");

document.getElementById("year").textContent = new Date().getFullYear();

const instagramUrl = "https://www.instagram.com/";
const instagramLink = document.getElementById("instagram-link");

if (instagramLink) {
    instagramLink.href = instagramUrl;
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[c]));
}

function imageUrl(file) {
    return "images/" + String(file)
        .split("/")
        .map(encodeURIComponent)
        .join("/");
}

async function load() {

    const response = await fetch("images.json", {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("images.json konnte nicht geladen werden");
    }

    const data = await response.json();

    items = Array.isArray(data)
        ? data
        : (data.images || []);

    const heroItem = items.find(x => x.hero);

    if (heroItem) {
        hero.style.backgroundImage =
            `url("${imageUrl(heroItem.file)}")`;
    }

    const galleryItems = items.filter(x => !x.hero);

    statusEl.textContent =
        `${galleryItems.length} Moments`;

    if (!galleryItems.length) {

        gallery.innerHTML = `
            <div class="empty">
                <strong>Noch keine Fotos.</strong><br>
                Lege Bilder in den Ordner
                <code>images</code>
                und trage sie in
                <code>images.json</code>
                ein.
            </div>
        `;

        return;
    }

    gallery.innerHTML = galleryItems.map((x, i) => `
        <article class="gallery-card">

            <div class="image-wrap" data-i="${i}">

                <img
                    src="${imageUrl(x.file)}"
                    alt="${esc(x.title || "")}"
                    loading="lazy"
                >

            </div>

            <div class="caption">

                <span>
                    ${esc(x.category || "MOMENT")}
                </span>

                <h3>
                    ${esc(x.title || "")}
                </h3>

            </div>

        </article>
    `).join("");

    gallery
        .querySelectorAll(".image-wrap")
        .forEach(el => {

            el.onclick = () =>
                openLightbox(
                    Number(el.dataset.i)
                );

        });
}

function openLightbox(i) {

    const galleryItems =
        items.filter(x => !x.hero);

    if (!galleryItems[i]) return;

    current = i;

    boxImg.src =
        imageUrl(galleryItems[i].file);

    boxImg.alt =
        galleryItems[i].title || "";

    box.classList.add("open");

    box.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );
}

function closeLightbox() {

    box.classList.remove("open");

    box.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}

function move(delta) {

    const galleryItems =
        items.filter(x => !x.hero);

    if (!galleryItems.length) return;

    current =
        (current + delta + galleryItems.length)
        % galleryItems.length;

    boxImg.src =
        imageUrl(galleryItems[current].file);

    boxImg.alt =
        galleryItems[current].title || "";
}

document.getElementById(
    "close-lightbox"
).onclick = closeLightbox;

document.getElementById(
    "prev-image"
).onclick = () => move(-1);

document.getElementById(
    "next-image"
).onclick = () => move(1);

box.onclick = e => {

    if (e.target === box) {
        closeLightbox();
    }

};

document.onkeydown = e => {

    if (!box.classList.contains("open")) {
        return;
    }

    if (e.key === "Escape") {
        closeLightbox();
    }

    if (e.key === "ArrowLeft") {
        move(-1);
    }

    if (e.key === "ArrowRight") {
        move(1);
    }

};

load().catch(error => {

    console.error(error);

    statusEl.textContent =
        "Galerie nicht verfügbar";

    gallery.innerHTML = `
        <div class="empty">

            <strong>
                Galerie konnte nicht geladen werden.
            </strong>

            <br>

            Bitte prüfe,
            ob <code>images.json</code>
            vorhanden ist.

        </div>
    `;
});
