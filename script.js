const cards = [...document.querySelectorAll(".gallery-card")];
const box = document.getElementById("lightbox");
const boxImg = document.getElementById("lightbox-image");
const year = document.getElementById("year");
let current = 0;

year.textContent = new Date().getFullYear();

function openLightbox(i) {
  if (!cards[i]) return;
  current = i;
  const img = cards[i].querySelector("img");
  boxImg.src = img.src;
  boxImg.alt = img.alt || "";
  box.classList.add("open");
  box.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  box.classList.remove("open");
  box.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function move(delta) {
  if (!cards.length) return;
  current = (current + delta + cards.length) % cards.length;
  const img = cards[current].querySelector("img");
  boxImg.src = img.src;
  boxImg.alt = img.alt || "";
}

cards.forEach((card, i) => {
  card.querySelector(".image-wrap").addEventListener("click", () => openLightbox(i));
});

document.getElementById("close-lightbox").onclick = closeLightbox;
document.getElementById("prev-image").onclick = () => move(-1);
document.getElementById("next-image").onclick = () => move(1);

box.addEventListener("click", e => {
  if (e.target === box) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (!box.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") move(-1);
  if (e.key === "ArrowRight") move(1);
});
