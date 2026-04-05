/**
 * PORTOFOLIO MINIMALIST — script.js
 * Merender layout single-column/minimalist grid.
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
    renderMainContent(data);
    renderFooter(data.header, data.socials);
  } catch (err) {
    console.error("Error inisialisasi portofolio:", err);
    showError(err.message);
  }
}

function applyTheme(settings) {
  if (!settings) return;
  const root = document.documentElement.style;
  
  // Notice mapping mismatch handling: minimalist theme uses textLight/textDark differently.
  // We'll map settings textLight -> var(--text-main) and settings textDark -> var(--text-muted) in CSS directly,
  // we just need to pipe the values correctly to the variables that match our CSS.
  const map = {
    "--bg": settings.bg,
    "--card-bg": settings.cardBg,
    "--card-border": settings.cardBorder,
    "--text-main": settings.textLight,   // Note the re-map
    "--text-muted": settings.textDark,   // Note the re-map
    "--primary": settings.primary,
    "--secondary-bg": settings.secondary,
  };
  
  for (const [prop, val] of Object.entries(map)) {
    if (val) root.setProperty(prop, val);
  }
}

function renderNavbar(header) {
  if (!header) return;
  document.title = header.namaPanjang || header.nama || "Portfolio";
  setText("#nav-brand", header.nama || "Portfolio");

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
  setText("#hero-name", header.namaPanjang || header.nama || "Developer");
  setText("#hero-desc", header.deskripsi || "I build elegant solutions.");

  const wrapper = document.querySelector(".hero-photo-container");
  const fallbackLetters = encodeURIComponent(header.nama || "Dev");
  const FALLBACK_AVATAR = `https://api.dicebear.com/9.x/initials/svg?seed=${fallbackLetters}&backgroundColor=e5e7eb&textColor=111827`;
  
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

function renderMainContent(data) {
  const container = document.getElementById("main-content");
  if (!container) return;
  container.innerHTML = ""; 

  // Urutan section minimalist
  const sections = [
    createStatsSection(data),
    createProjectsSection(data.projects),
    createExperienceSection(data.experience),
    createTechSection(data.techStack),
  ].filter(Boolean);

  sections.forEach((sec) => container.appendChild(sec));
}

function createStatsSection(data) {
  const section = makeSection("Stats");
  const container = document.createElement("div");
  container.className = "container";
  
  const projCount = data.projects?.active ? data.projects.items?.length || 0 : 0;
  const expCount = data.experience?.active ? data.experience.items?.length || 0 : 0;
  const techCount = data.techStack?.active ? data.techStack.items?.length || 0 : 0;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-box">
        <span class="stat-value">${projCount}+</span>
        <span class="stat-label">Projects Completed</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${expCount}</span>
        <span class="stat-label">Roles & Positions</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${techCount}</span>
        <span class="stat-label">Technologies Mastered</span>
      </div>
    </div>
  `;
  section.appendChild(container);
  return section;
}

function createProjectsSection(projects) {
  if (!projects?.active || !projects.items?.length) return null;
  
  const section = makeSection("Selected Projects", "A collection of my recent work", "projects");
  const container = document.createElement("div");
  container.className = "container";

  const listHtml = projects.items.map((p) => {
    const repoLink = (p.repo && p.repo.trim() !== "") ? 
      `<a href="${escHtml(p.repo)}" target="_blank" class="link-icon" title="Source Code"><i class="fab fa-github"></i></a>` : "";
    const prevLink = (p.previewActive && p.previewLink) ? 
      `<a href="${escHtml(p.previewLink)}" target="_blank" class="link-icon" title="Live Preview"><i class="fas fa-external-link-alt"></i></a>` : "";

    return `
      <article class="minimal-card">
        <div class="project-header">
          <h3 class="project-name">${escHtml(p.name)}</h3>
          <div class="project-links">${repoLink}${prevLink}</div>
        </div>
        <p class="project-desc">${escHtml(p.desc)}</p>
      </article>
    `;
  }).join("");

  container.innerHTML = listHtml;
  section.appendChild(container);
  return section;
}

function createExperienceSection(experience) {
  if (!experience?.active || !experience.items?.length) return null;

  const section = makeSection("Experience", "Professional timeline", "experience");
  const container = document.createElement("div");
  container.className = "container minimal-card";

  const listHtml = experience.items.map(e => `
    <div class="exp-row">
      <div class="exp-meta">
        <div class="exp-period">${escHtml(e.period)}</div>
        <div class="exp-institution">${escHtml(e.institution)}</div>
      </div>
      <div class="exp-details">
        <h3 class="exp-title">${escHtml(e.title)}</h3>
        <p class="exp-desc">${escHtml(e.desc)}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = listHtml;
  section.appendChild(container);
  return section;
}

function createTechSection(techStack) {
  if (!techStack?.active || !techStack.items?.length) return null;

  const section = makeSection("Technologies", "Tools and frameworks I use");
  const container = document.createElement("div");
  container.className = "container";

  const pills = techStack.items.map(t => {
    const icon = t.iconClass || "fas fa-code";
    return `
      <div class="tech-tag">
        <i class="${escHtml(icon)}"></i> ${escHtml(t.name)}
      </div>
    `;
  }).join("");

  container.innerHTML = `<div class="tech-container minimal-card">${pills}</div>`;
  section.appendChild(container);
  return section;
}

function renderFooter(header, socials) {
  const year = new Date().getFullYear();
  setText("#footer-copy", `© ${year} ${header?.namaPanjang || ""}. All rights reserved.`);

  const container = document.getElementById("footer-socials");
  if (!container || !socials) return;

  const socialMap = [
    { key: "github", icon: "fab fa-github", label: "GitHub" },
    { key: "linkedin", icon: "fab fa-linkedin", label: "LinkedIn" },
    { key: "twitter", icon: "fab fa-x-twitter", label: "Twitter" },
    { key: "instagram", icon: "fab fa-instagram", label: "Instagram" },
    { key: "email", icon: "fas fa-envelope", label: "Email", isEmail: true }
  ];

  let html = "";
  for (const s of socialMap) {
    const val = socials[s.key];
    if (!val || val.trim() === "") continue;
    const href = s.isEmail ? `mailto:${val.trim()}` : val.trim();
    html += `
      <a href="${escHtml(href)}" class="social-link" target="${s.isEmail ? "_self" : "_blank"}" aria-label="${escHtml(s.label)}">
        <i class="${escHtml(s.icon)}"></i>
      </a>
    `;
  }
  container.innerHTML = html;
}

/* ── DOM Utils ── */
function makeSection(title, subtitle = "", id = "") {
  const sec = document.createElement("section");
  sec.className = "section";
  if (id) sec.id = id;

  const headerDiv = document.createElement("div");
  headerDiv.className = "container section-header";
  headerDiv.innerHTML = `
    <h2 class="section-title">${escHtml(title)}</h2>
    ${subtitle ? `<p class="section-subtitle">${escHtml(subtitle)}</p>` : ''}
  `;
  
  sec.appendChild(headerDiv);
  return sec;
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
  const container = document.getElementById("main-content");
  if (container) {
    container.innerHTML = `
      <div class="container minimal-card" style="text-align:center;">
        <h2 style="color:var(--primary);margin-bottom:12px;">Failed to load data</h2>
        <p style="color:var(--text-muted);">${escHtml(msg)}</p>
      </div>`;
  }
}
