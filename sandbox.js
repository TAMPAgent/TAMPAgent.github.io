// Sandbox document viewer: a file tree on the left, the selected document on the right.
// Data comes from sandbox/docs.js (window.SANDBOX), generated from the agent's real sandbox.
(() => {
  const data = window.SANDBOX;
  const root = document.querySelector("[data-sandbox]");
  if (!data || !root) return;

  const tree = root.querySelector(".sb-tree");
  const filter = root.querySelector(".sb-filter");
  const pane = root.querySelector(".sb-doc");
  const ROLE = {
    overview: ["Overview", "is-overview"],
    "read-only": ["Read-only for the agent", "is-readonly"],
    agent: ["Written by the agent", "is-agent"],
    reply: ["Saved by the agent from a reply", "is-reply"],
    record: ["Planner record of agent declarations", "is-record"],
  };
  let current = null;

  // Build the tree once; filtering only hides rows.
  data.groups.forEach((group) => {
    const section = document.createElement("div");
    section.className = "sb-group";
    const head = document.createElement("button");
    head.type = "button";
    head.className = "sb-group-head";
    head.setAttribute("aria-expanded", "true");
    head.innerHTML = `<span class="sb-caret" aria-hidden="true"></span><span class="sb-group-label"></span>` +
      (group.note ? `<span class="sb-group-note"></span>` : "");
    head.querySelector(".sb-group-label").textContent = group.label;
    if (group.note) head.querySelector(".sb-group-note").textContent = group.note;
    const list = document.createElement("ul");
    group.items.forEach((id) => {
      const file = data.files[id];
      const li = document.createElement("li");
      const link = document.createElement("button");
      link.type = "button";
      link.className = "sb-file";
      link.dataset.id = id;
      link.textContent = file.title;
      link.title = file.summary;
      li.appendChild(link);
      list.appendChild(li);
    });
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      list.hidden = open;
    });
    section.append(head, list);
    tree.appendChild(section);
  });

  const show = (id, focusPane) => {
    const file = data.files[id];
    if (!file) return;
    current = id;
    const [roleText, roleClass] = ROLE[file.role] || ["", ""];
    pane.innerHTML =
      `<div class="sb-doc-head"><p class="sb-path"></p><span class="sb-role ${roleClass}"></span></div>` +
      `<p class="sb-summary"></p><div class="sb-body sb-${file.kind}"></div>`;
    pane.querySelector(".sb-path").textContent = id.startsWith("setup/") ? file.title : id;
    pane.querySelector(".sb-role").textContent = roleText;
    pane.querySelector(".sb-summary").textContent = file.summary;
    pane.querySelector(".sb-body").innerHTML = file.html; // pre-rendered and escaped at build time
    pane.scrollTop = 0;
    tree.querySelectorAll(".sb-file").forEach((b) => b.setAttribute("aria-current", b.dataset.id === id ? "true" : "false"));
    if (focusPane) pane.focus({ preventScroll: true });
  };

  tree.addEventListener("click", (e) => {
    const b = e.target.closest(".sb-file");
    if (b) show(b.dataset.id, false);
  });
  // Cross-links inside documents stay in the viewer.
  pane.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#sb:']");
    if (!a) return;
    e.preventDefault();
    show(a.getAttribute("href").slice(4), true);
  });
  // Buttons elsewhere on the page can open a document: <button data-sb-open="path">.
  document.querySelectorAll("[data-sb-open]").forEach((b) =>
    b.addEventListener("click", () => {
      show(b.dataset.sbOpen, false);
      root.scrollIntoView({ block: "start" });
    })
  );

  filter.addEventListener("input", () => {
    const q = filter.value.trim().toLowerCase();
    tree.querySelectorAll(".sb-group").forEach((g) => {
      let any = false;
      g.querySelectorAll("li").forEach((li) => {
        const f = data.files[li.firstChild.dataset.id];
        const hit = !q || (f.id + " " + f.summary + " " + f.html).toLowerCase().includes(q);
        li.hidden = !hit;
        any = any || hit;
      });
      g.hidden = !any;
      if (q) { g.querySelector("ul").hidden = false; g.querySelector(".sb-group-head").setAttribute("aria-expanded", "true"); }
    });
  });

  // Arrow keys move through visible files while the tree has focus.
  tree.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const files = [...tree.querySelectorAll(".sb-file")].filter((b) => b.offsetParent !== null);
    const i = files.findIndex((b) => b.dataset.id === current);
    const next = files[Math.max(0, Math.min(files.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))];
    if (next) { show(next.dataset.id, false); next.focus(); e.preventDefault(); }
  });

  const fromHash = location.hash.startsWith("#sandbox:") ? decodeURIComponent(location.hash.slice(9)) : null;
  show(data.files[fromHash] ? fromHash : data.start, false);
  if (fromHash) root.scrollIntoView({ block: "start" });
})();
