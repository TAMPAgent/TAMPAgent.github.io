// Play looping videos only while they are on screen, and never when the
// visitor prefers reduced motion (posters stay visible instead).
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const videos = document.querySelectorAll("video[data-autoplay]");

if (!reduceMotion && "IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.35 }
  );
  videos.forEach((video) => videoObserver.observe(video));
}

// Highlight the chapter link for the section currently in view.
const navLinks = new Map();
document.querySelectorAll(".chapter-nav a[href^='#']").forEach((link) => {
  navLinks.set(link.getAttribute("href").slice(1), link);
});

if ("IntersectionObserver" in window && navLinks.size) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const active = navLinks.get(entry.target.id);
        if (active) active.classList.add("is-active");
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

// Copy the BibTeX entry.
const copyButton = document.querySelector(".copy-button");
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const text = document.getElementById("bibtex").innerText;
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Select and copy";
    }
    setTimeout(() => (copyButton.textContent = "Copy"), 1800);
  });
}

// Storyboard stepper: one image per step of the rolling example.
document.querySelectorAll("[data-storyboard]").forEach((board) => {
  const img = board.querySelector("img[data-frames]");
  const frames = img.dataset.frames.split(",");
  const stepButtons = [...board.querySelectorAll("[data-step]")];
  frames.forEach((src) => { const pre = new Image(); pre.src = src; });
  let current = 0;
  const show = (i) => {
    current = (i + frames.length) % frames.length;
    img.src = frames[current];
    img.alt = `Storyboard step ${current + 1} of ${frames.length}`;
    stepButtons.forEach((b, k) => b.setAttribute("aria-current", k === current ? "true" : "false"));
  };
  stepButtons.forEach((b) => b.addEventListener("click", () => show(Number(b.dataset.step))));
  board.querySelector(".sb-prev").addEventListener("click", () => show(current - 1));
  board.querySelector(".sb-next").addEventListener("click", () => show(current + 1));
  board.tabIndex = 0;
  board.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { show(current + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { show(current - 1); e.preventDefault(); }
  });
});
