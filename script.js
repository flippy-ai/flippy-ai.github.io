/* ============================================================
   FlippyAI site behaviour
   1. THEME  — swaps the same data-theme tokens the app uses,
               so clicking a swatch repaints the whole page.
   2. MOTION — reveal-on-scroll, disabled under reduced motion.

   All download / repo links are hardcoded in index.html, so the
   page works fully with JavaScript disabled.
   ============================================================ */

const THEMES = [
  "flippy-purple", "neon", "matrix", "ocean", "ember", "graphite",
  "emerald", "rose", "daybreak", "blush", "solar",
];
const STORE_KEY = "flippy-site-theme";
const root = document.documentElement;

/* ---------- theme ---------- */
function applyTheme(name, persist) {
  if (!THEMES.includes(name)) return;
  root.setAttribute("data-theme", name);

  // keep swatch pressed-state honest
  document.querySelectorAll(".sw").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.set === name))
  );

  // keep the browser chrome in step with light/dark
  const light = ["daybreak", "blush", "solar"].includes(name);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", light ? "#ffffff" : "#0f0d14");

  if (persist) {
    try { localStorage.setItem(STORE_KEY, name); } catch (_) { /* private mode */ }
  }
}

let current = 0;
try {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved && THEMES.includes(saved)) current = THEMES.indexOf(saved);
} catch (_) { /* no storage */ }

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(THEMES[current], false);

  // swatch grid
  document.querySelectorAll(".sw").forEach((btn) => {
    btn.addEventListener("click", () => {
      current = THEMES.indexOf(btn.dataset.set);
      applyTheme(btn.dataset.set, true);
    });
  });

  // cycle button in the nav
  const next = document.getElementById("theme-next");
  if (next) {
    next.addEventListener("click", () => {
      current = (current + 1) % THEMES.length;
      applyTheme(THEMES[current], true);
    });
  }

  setupReveal();
});

/* ---------- reveal on scroll ---------- */
function setupReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".card, .tool, .stat, .log-item, .sw, .split-col");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.remove("reveal"));
    return;
  }
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  targets.forEach((t) => io.observe(t));
}
