// STARFIELD
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const STAR_COUNT = 500;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.4
    });
  }
}
createStars();

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    s.y += s.speed * 0.5;

    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}
animateStars();


// ROCKET (STABLE)
window.addEventListener("load", () => {
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

    const start = vh;
    const end = -rect.height;

    const p = (start - rect.top) / (start - end);

    return Math.max(0, Math.min(1, p));
  }

  window.addEventListener("scroll", () => {
    target = getProgress();
  });

  target = getProgress();

  function animate() {
    current += (target - current) * 0.06;

    const point = path.getPointAtLength(current * length);

    rocket.setAttribute(
      "transform",
      `translate(${point.x}, ${point.y})`
    );

    requestAnimationFrame(animate);
  }

  animate();
});