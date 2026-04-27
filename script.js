/* =========================
   STARFIELD (GALAXY - TUNED DOWN)
========================= */

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let dust = [];
let nebula = [];

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

    const size =
      r < 0.75 ? Math.random() * 0.8 :
      r < 0.93 ? 0.8 + Math.random() * 0.7 :
      r < 0.99 ? 1.5 + Math.random() * 1.0 :
      2.5 + Math.random() * 1.5;

    const alpha =
      r < 0.75 ? 0.2 + Math.random() * 0.3 :
      r < 0.93 ? 0.4 + Math.random() * 0.3 :
      r < 0.99 ? 0.6 + Math.random() * 0.3 :
      0.85 + Math.random() * 0.15;

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
   DUST
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

/* =========================
   NEBULA (SUBTLE GALAXY CLOUDS)
========================= */
function createNebula() {
  nebula = [];

  for (let i = 0; i < 18; i++) {

    nebula.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 180 + Math.random() * 260,

      // toned down colours (less blue, more muted galaxy)
      hue: Math.random() < 0.5 ? 220 : 255,

      // much weaker intensity
      alpha: 0.02 + Math.random() * 0.035,

      drift: Math.random() * 1000
    });
  }
}

createStars();
createDust();
createNebula();

/* =========================
   ANIMATION LOOP
========================= */
function animateStars() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* background gradient (kept dark, slightly blue core) */
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );

  gradient.addColorStop(0, "#0b1230");
  gradient.addColorStop(0.5, "#050816");
  gradient.addColorStop(1, "#000000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* =========================
     NEBULA (SOFT + DIMMED)
  ========================= */
  ctx.globalCompositeOperation = "lighter";

  for (let n of nebula) {

    const t = Date.now() * 0.00003;

    const x = n.x + Math.sin(t + n.drift) * 12;
    const y = n.y + Math.cos(t + n.drift) * 12;

    const g = ctx.createRadialGradient(x, y, 0, x, y, n.r);

    g.addColorStop(0, `hsla(${n.hue}, 40%, 60%, ${n.alpha})`);
    g.addColorStop(1, "transparent");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";

  /* =========================
     DUST
  ========================= */
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

  /* =========================
     STARS
  ========================= */
  for (let s of stars) {

    s.y += s.speed * 0.25;

    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }

    const tint = s.x / canvas.width;

    const r = 255;
    const g = 255 - tint * 35;
    const b = 255;

    ctx.fillStyle = `rgba(${r},${g},${b},${s.alpha})`;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

animateStars();

/* =========================
   ROCKET (UNCHANGED + SAFE)
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

    return Math.max(0, Math.min(1,
      (vh - rect.top) / (rect.height + vh)
    ));
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
    const next = path.getPointAtLength(current * length + 2);

    const angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI;

    const x = point.x;
    const y = point.y;

    if (prevX !== null) {
      const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");

      trail.setAttribute("x1", prevX);
      trail.setAttribute("y1", prevY);
      trail.setAttribute("x2", x);
      trail.setAttribute("y2", y);

      trail.setAttribute("stroke", "rgba(255,255,255,0.2)");
      trail.setAttribute("stroke-width", "2");

      path.parentNode.appendChild(trail);

      setTimeout(() => {
        trail.style.opacity = "0";
        setTimeout(() => trail.remove(), 1200);
      }, 0);
    }

    prevX = x;
    prevY = y;

    rocket.setAttribute(
      "transform",
      `translate(${x},${y}) rotate(${angle})`
    );

    requestAnimationFrame(animateRocket);
  }

  animateRocket();
});

/* =========================
   TOOLTIP
========================= */

window.addEventListener("DOMContentLoaded", () => {

  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;

  document.querySelectorAll(".planet").forEach(planet => {

    planet.addEventListener("mouseenter", () => {
      const info = planet.getAttribute("data-info");
      if (!info) return;

      const rect = planet.getBoundingClientRect();

      tooltip.textContent = info;
      tooltip.style.left = rect.left + rect.width / 2 + "px";
      tooltip.style.top = rect.bottom + 10 + "px";
      tooltip.style.opacity = "1";
    });

    planet.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });

  });
});