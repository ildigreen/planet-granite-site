/* =========================
   STARFIELD
========================= */

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let dust = [];

const STAR_COUNT = 900;
const DUST_COUNT = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* =========================
   STARS
========================= */
function createStars() {
  stars = [];

  for (let i = 0; i < STAR_COUNT; i++) {

    const clusterX =
      Math.random() < 0.6
        ? canvas.width * (0.2 + Math.random() * 0.6)
        : Math.random() * canvas.width;

    const clusterY =
      Math.random() < 0.6
        ? canvas.height * (0.2 + Math.random() * 0.6)
        : Math.random() * canvas.height;

    const r = Math.random();

    let size;

    if (r < 0.75) {
      size = Math.random() * 0.8;
    } else if (r < 0.93) {
      size = 0.8 + Math.random() * 0.7;
    } else if (r < 0.99) {
      size = 1.5 + Math.random() * 1.0;
    } else {
      size = 2.5 + Math.random() * 1.5;
    }

    let alpha;
    if (r < 0.75) {
      alpha = 0.2 + Math.random() * 0.3;
    } else if (r < 0.93) {
      alpha = 0.4 + Math.random() * 0.3;
    } else if (r < 0.99) {
      alpha = 0.6 + Math.random() * 0.3;
    } else {
      alpha = 0.85 + Math.random() * 0.15;
    }

    stars.push({
      x: clusterX,
      y: clusterY,
      size,
      speed: 0.05 + Math.random() * 0.25,
      alpha
    });
  }
}

/* =========================
   COSMIC DUST
========================= */
function createDust() {
  dust = [];

  for (let i = 0; i < DUST_COUNT; i++) {
    dust.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 40 + Math.random() * 120,
      speed: 0.05 + Math.random() * 0.15,
      alpha: 0.03 + Math.random() * 0.08
    });
  }
}

createStars();
createDust();

/* =========================
   ANIMATION LOOP
========================= */
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  /* dust */
  for (let d of dust) {
    d.y += d.speed;

    if (d.y > canvas.height) {
      d.y = 0;
      d.x = Math.random() * canvas.width;
    }

    const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
    g.addColorStop(0, `rgba(120,150,255,${d.alpha})`);
    g.addColorStop(1, "transparent");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctx.fill();
  }

  /* stars */
  for (let s of stars) {
    s.y += s.speed * 0.25;

    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }

    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

animateStars();

/* =========================
   ROCKET
========================= */

window.addEventListener("DOMContentLoaded", () => {

  const path = document.getElementById("path");
  const rocket = document.getElementById("rocket");
  const svg = document.getElementById("svgPath");

  if (!path || !rocket || !svg) return;

  const length = path.getTotalLength();

  let current = 0;
  let target = 0;

  function getProgress() {
    const rect = svg.getBoundingClientRect();
    const vh = window.innerHeight;

    return Math.max(
      0,
      Math.min(
        1,
        (vh - rect.top) / (rect.height + vh)
      )
    );
  }

  function update() {
    target = getProgress();
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  update();

  function animateRocket() {
    current += (target - current) * 0.07;

    const point = path.getPointAtLength(current * length);

    rocket.setAttribute(
      "transform",
      `translate(${point.x},${point.y})`
    );

    requestAnimationFrame(animateRocket);
  }

  animateRocket();
});

/* =========================
   ROCKET WITH TRAIL
========================= */

window.addEventListener("DOMContentLoaded", () => {

  const path = document.getElementById("path");
  const rocket = document.getElementById("rocket");
  const svg = document.getElementById("svgPath");

  if (!path || !rocket || !svg) return;

  const length = path.getTotalLength();

  let current = 0;
  let target = 0;

  let prevX = null;
  let prevY = null;

  function getProgress() {
    const rect = svg.getBoundingClientRect();
    const vh = window.innerHeight;

    return Math.max(
      0,
      Math.min(
        1,
        (vh - rect.top) / (rect.height + vh)
      )
    );
  }

  function update() {
    target = getProgress();
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();

  function animateRocket() {

    current += (target - current) * 0.07;

    const point = path.getPointAtLength(current * length);

    const x = point.x;
    const y = point.y;

    /* =========================
       TRAIL DRAWING
    ========================= */

    if (prevX !== null && prevY !== null) {
      const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");

      trail.setAttribute("x1", prevX);
      trail.setAttribute("y1", prevY);
      trail.setAttribute("x2", x);
      trail.setAttribute("y2", y);

      trail.setAttribute("stroke", "rgba(255,255,255,0.25)");
      trail.setAttribute("stroke-width", "2");
      trail.setAttribute("stroke-linecap", "round");

      path.parentNode.appendChild(trail);

      /* fade + remove old trail */
      setTimeout(() => {
        trail.style.transition = "opacity 1.5s ease";
        trail.style.opacity = "0";

        setTimeout(() => trail.remove(), 1500);
      }, 0);
    }

    prevX = x;
    prevY = y;

    /* move rocket */
    rocket.setAttribute(
      "transform",
      `translate(${x},${y})`
    );

    requestAnimationFrame(animateRocket);
  }

  animateRocket();
});