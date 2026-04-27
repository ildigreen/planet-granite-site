const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const dust = [];

const STAR_COUNT = 900;
const DUST_COUNT = 120;


/* =========================
   STARS (CLUSTERED LIKE LANDING PAGE)
========================= */

function createStars() {

  for (let i = 0; i < STAR_COUNT; i++) {

    const cluster = Math.random() < 0.65;

    const x = cluster
      ? canvas.width * (0.2 + Math.random() * 0.6)
      : Math.random() * canvas.width;

    const y = cluster
      ? canvas.height * (0.2 + Math.random() * 0.6)
      : Math.random() * canvas.height;

    const r = Math.random();

    let size;
    let alpha;

    if (r < 0.75) {
      size = Math.random() * 0.8;
      alpha = 0.25 + Math.random() * 0.3;
    } else if (r < 0.93) {
      size = 0.8 + Math.random() * 0.7;
      alpha = 0.4 + Math.random() * 0.3;
    } else if (r < 0.99) {
      size = 1.5 + Math.random() * 1.2;
      alpha = 0.6 + Math.random() * 0.3;
    } else {
      size = 2.5 + Math.random() * 1.5;
      alpha = 0.85;
    }

    stars.push({ x, y, size, alpha });

  }

}


/* =========================
   COSMIC DUST (NEBULA LIKE LANDING PAGE)
========================= */

function createDust() {

  for (let i = 0; i < DUST_COUNT; i++) {

    dust.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 40 + Math.random() * 120,
      alpha: 0.03 + Math.random() * 0.08
    });

  }

}


/* =========================
   DRAW
========================= */

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* SAME DARK UNIVERSE GRADIENT AS LANDING PAGE */

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );

  gradient.addColorStop(0, "#050816");
  gradient.addColorStop(0.5, "#02030a");
  gradient.addColorStop(1, "#000000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  /* DUST */

  dust.forEach(d => {

    const g = ctx.createRadialGradient(
      d.x, d.y, 0,
      d.x, d.y, d.size
    );

    g.addColorStop(0, `rgba(120,150,255,${d.alpha})`);
    g.addColorStop(1, "transparent");

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctx.fill();

  });


  /* STARS */

  stars.forEach(s => {

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();

  });

}


/* INIT */

createStars();
createDust();
draw();


/* RESIZE */

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars.length = 0;
  dust.length = 0;
  createStars();
  createDust();
  draw();
});