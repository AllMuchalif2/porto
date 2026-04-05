/**
 * PORTOFOLIO MANGA GRID — script.js
 * Merender layout panel komik dan speech bubbles.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
});

async function initPortfolio() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error(`Gagal memuat data.json (status ${res.status})`);
    const data = await res.json();

    applyTheme(data.settings);
    renderNavbar(data.header);
    renderHero(data.header);
    renderMangaGrid(data);
    renderFooter(data.header, data.socials);
  } catch (err) {
    console.error("Error inisialisasi portofolio:", err);
    showError(err.message);
  }
}

function applyTheme(settings) {
  if (!settings) return;
  const root = document.documentElement.style;
  const map = {
    "--bg": settings.bg,
    "--card-bg": settings.cardBg,
    "--card-border": settings.cardBorder,
    "--text-light": settings.textLight,
    "--text-dark": settings.textDark,
    "--primary": settings.primary,
    "--secondary": settings.secondary,
    "--accent": settings.accent,
  };
  for (const [prop, val] of Object.entries(map)) {
    if (val) root.setProperty(prop, val);
  }
}

function renderNavbar(header) {
  if (!header) return;
  document.title = header.namaPanjang || header.nama || "Manga Portfolio";
  setText("#nav-brand", header.nama || "VOL.1");

  if (header.linkResume && header.linkResume.trim() !== "") {
    const btn = document.getElementById("nav-resume-btn");
    if (btn) {
      btn.href = header.linkResume;
      btn.classList.remove("hidden");
    }
  }
}

function renderHero(header) {
  if (!header) return;
  setText("#hero-name", header.nama || "CHARACTER!");
  setText("#hero-desc", header.deskripsi || "I'M A DEVELOPER!");

  // Fotomu
  const wrapper = document.querySelector(".hero-photo-wrapper");
  const FALLBACK_AVATAR = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(header.nama || "Dev")}&backgroundColor=ffeb3b&textColor=000000`;
  const fotoSrc = header.foto && header.foto.trim() !== "" ? header.foto.trim() : FALLBACK_AVATAR;

  wrapper.innerHTML = `<img id="profile-photo" src="${escHtml(fotoSrc)}" alt="${escHtml(header.namaPanjang || '')}" />`;
  const img = wrapper.querySelector("#profile-photo");
  img.addEventListener("error", () => {
    img.src = FALLBACK_AVATAR;
  });

  if (header.linkResume && header.linkResume.trim() !== "") {
    const btn = document.getElementById("hero-resume-btn");
    if (btn) {
      btn.href = header.linkResume;
      btn.classList.remove("hidden");
    }
  }
}

function renderMangaGrid(data) {
  const container = document.getElementById("manga-container");
  if (!container) return;
  container.innerHTML = ""; // Bersihkan skeleton

  const panels = [
    createPanelQuote(data.header),
    createPanelStats(data),
    createPanelTech(data.techStack),
    createPanelProjects(data.projects),
    createPanelExperience(data.experience),
    createPanelStatus(),
  ].filter(Boolean);

  panels.forEach((p) => container.appendChild(p));
}

function createPanelQuote(header) {
  const panel = makePanel("panel-quote");
  const desc = header?.deskripsi || "";
  const words = desc.split(" ");
  const highlight = words.slice(0, 3).join(" ");
  const rest = words.slice(3).join(" ");

  panel.innerHTML = `
    <div class="panel-title">BACKGROUND</div>
    <div class="big-quote">
      <span>${escHtml(highlight)}</span> ${escHtml(rest)}
    </div>
  `;
  return panel;
}

function createPanelStats(data) {
  const panel = makePanel("panel-stats");
  const projCount = data.projects?.active ? data.projects.items?.length || 0 : 0;
  const expCount = data.experience?.active ? data.experience.items?.length || 0 : 0;
  const techCount = data.techStack?.active ? data.techStack.items?.length || 0 : 0;

  panel.innerHTML = `
    <div class="panel-title">STATS</div>
    <div class="manga-stat-row">
      <span class="stat-label">Projects Completed</span>
      <span class="stat-value">${projCount}+</span>
    </div>
    <div class="manga-stat-row">
      <span class="stat-label">Experience</span>
      <span class="stat-value">${expCount}</span>
    </div>
    <div class="manga-stat-row">
      <span class="stat-label">Power Level (Tech)</span>
      <span class="stat-value">${techCount}</span>
    </div>
  `;
  return panel;
}

function createPanelTech(techStack) {
  if (!techStack?.active) return null;
  const panel = makePanel("panel-tech");
  const items = techStack.items || [];

  const pills = items.map((t, idx) => {
    // Generate slight random rotation for extra comic feel (-3 to +3 deg)
    const rot = (Math.random() * 6 - 3).toFixed(1);
    const icon = t.iconClass || "fas fa-code";
    return `
      <div class="tech-badge" style="--i: ${rot};">
        <i class="${escHtml(icon)}"></i> ${escHtml(t.name)}
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="panel-title">ARSENAL</div>
    <div class="tech-grid">${pills}</div>
  `;
  return panel;
}

function createPanelProjects(projects) {
  if (!projects?.active) return null;
  const panel = makePanel("panel-projects");
  const items = projects.items || [];

  const listHtml = items.map((p) => {
    const repoLink = (p.repo && p.repo.trim() !== "") ? 
      `<a href="${escHtml(p.repo)}" target="_blank" class="comic-link-btn" title="Source Code">CODE</a>` : "";
    const prevLink = (p.previewActive && p.previewLink) ? 
      `<a href="${escHtml(p.previewLink)}" target="_blank" class="comic-link-btn" title="Live Demo">DEMO</a>` : "";

    return `
      <div class="manga-project-item">
        <div class="project-header">
          <div class="project-name">${escHtml(p.name)}</div>
          <div class="project-links">${repoLink}${prevLink}</div>
        </div>
        <div class="project-desc">${escHtml(p.desc)}</div>
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="panel-title">MISSION LOGS</div>
    <div class="project-list">${listHtml}</div>
  `;
  return panel;
}

function createPanelExperience(experience) {
  if (!experience?.active) return null;
  const panel = makePanel("panel-experience");
  const items = experience.items || [];

  const listHtml = items.map(e => `
    <div class="manga-exp-item">
      <div class="exp-title">${escHtml(e.title)}</div>
      <div class="exp-institution">@ ${escHtml(e.institution)}</div>
      <div class="exp-period">${escHtml(e.period)}</div>
      <div class="exp-desc">${escHtml(e.desc)}</div>
    </div>
  `).join("");

  panel.innerHTML = `
    <div class="panel-title">ORIGIN STORY</div>
    <div class="exp-list">${listHtml}</div>
  `;
  return panel;
}

function createPanelStatus() {
  const panel = makePanel("panel-status");
  panel.innerHTML = `
    <h2>READY FOR THE NEXT CHAPTER!</h2>
  `;
  return panel;
}

function renderFooter(header, socials) {
  setText("#footer-brand", "TO BE CONTINUED...");
  const year = new Date().getFullYear();
  setText("#footer-copy", `© ${year} ${header?.namaPanjang || ""}. Comic Style Edition.`);

  const container = document.getElementById("footer-socials");
  if (!container || !socials) return;

  const socialMap = [
    { key: "github", icon: "fab fa-github", label: "GitHub" },
    { key: "linkedin", icon: "fab fa-linkedin", label: "LinkedIn" },
    { key: "instagram", icon: "fab fa-instagram", label: "Instagram" },
    { key: "twitter", icon: "fab fa-x-twitter", label: "Twitter" },
    { key: "tiktok", icon: "fab fa-tiktok", label: "TikTok" },
    { key: "email", icon: "fas fa-envelope", label: "Email", isEmail: true }
  ];

  let html = "";
  for (const s of socialMap) {
    const val = socials[s.key];
    if (!val || val.trim() === "") continue;
    const href = s.isEmail ? `mailto:${val.trim()}` : val.trim();
    html += `
      <a href="${escHtml(href)}" class="social-icon" target="${s.isEmail ? "_self" : "_blank"}" rel="noopener">
        <i class="${escHtml(s.icon)}"></i>
      </a>
    `;
  }
  container.innerHTML = html;
}

/* ── DOM Utils ── */
function makePanel(extraClass) {
  const div = document.createElement("div");
  div.className = `manga-panel ${extraClass}`;
  return div;
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function escHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showError(msg) {
  const container = document.getElementById("manga-container");
  if (container) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;border:4px solid #000;">
        <h2 style="font-family:'Bangers';font-size:3rem;">ERROR!</h2>
        <p>${escHtml(msg)}</p>
      </div>`;
  }
}
