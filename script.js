const FLAVORS = {
  slazeny: {
    title: "Slazený nápoj",
    claim: "Sladká energie, která tě nabije.",
    img: "pictures/Neonový plakát GEMON se slazeným nápojem.png",
    alt: "Plakát GENON slazený nápoj",
    color: "#ffc928"
  },
  slany: {
    title: "Slaný nápoj",
    claim: "Slanost, která tě nakopne!",
    img: "pictures/Genon_ Slaný nápoj plný energie.png",
    alt: "Plakát GENON slaný nápoj",
    color: "#38c8ff"
  },
  kysely: {
    title: "Kyselý nápoj",
    claim: "Kyselost, která tě probere!",
    img: "pictures/Neonový kyselý nápoj GENON.png",
    alt: "Plakát GENON kyselý nápoj",
    color: "#c6ff1a"
  }
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const poster = $("#poster");
let boltColor = FLAVORS.slazeny.color;

function setFlavor(key) {
  const f = FLAVORS[key];
  if (!f) return;
  document.body.dataset.flavor = key;
  boltColor = f.color;
  $("#title").textContent = f.title;
  $("#claim").textContent = f.claim;

  poster.classList.add("swap");
  setTimeout(() => {
    poster.src = f.img;
    poster.alt = f.alt;
    poster.classList.remove("swap");
  }, 250);

  $$(".switch .chip").forEach(b => {
    const on = b.dataset.flavor === key;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  flash();
}

$$(".switch .chip").forEach(b => b.addEventListener("click", () => setFlavor(b.dataset.flavor)));
$$("[data-pick]").forEach(b => b.addEventListener("click", () => {
  setFlavor(b.dataset.pick);
  $("#uvod").scrollIntoView({ behavior: "smooth" });
}));

/* ---- Blesky na pozadí ---- */
const canvas = $("#bolts");
const ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let bolts = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

function makeBolt() {
  let x = Math.random() * canvas.width, y = 0;
  const pts = [[x, y]];
  while (y < canvas.height * (0.4 + Math.random() * 0.6)) {
    x += (Math.random() - 0.5) * 70;
    y += 20 + Math.random() * 40;
    pts.push([x, y]);
  }
  return { pts, life: 1 };
}

function flash() {
  if (reduce) return;
  for (let i = 0; i < 3; i++) bolts.push(makeBolt());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bolts = bolts.filter(b => b.life > 0);
  for (const b of bolts) {
    ctx.beginPath();
    b.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = boltColor;
    ctx.globalAlpha = b.life * 0.7;
    ctx.lineWidth = 2;
    ctx.shadowColor = boltColor;
    ctx.shadowBlur = 18;
    ctx.stroke();
    b.life -= 0.04;
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

if (!reduce) {
  draw();
  setInterval(() => { if (Math.random() < 0.6) bolts.push(makeBolt()); }, 2500);
}
