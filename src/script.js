/**
 * PORTOFOLIO TERMINAL CLI — script.js
 * Merender CLI components dan typewriter effect.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
});

async function initPortfolio() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error(`Failed to load data.json (status ${res.status})`);
    const data = await res.json();

    applyTheme(data.settings);
    renderNavbar(data.header);
    await animateHero(data.header); // Tunggu ketikan selesai
    renderMainContent(data);
    renderFooter(data.header, data.socials);
  } catch (err) {
    console.error("SYS ERR:", err);
    showError(err.message);
  }
}

function applyTheme(settings) {
  if (!settings) return;
  const root = document.documentElement.style;
  
  const map = {
    "--bg": settings.bg,
    "--text-main": settings.primary,
    "--text-muted": settings.textDark,
    "--secondary-bg": settings.secondary,
  };
  
  for (const [prop, val] of Object.entries(map)) {
    if (val) root.setProperty(prop, val);
  }
}

function renderNavbar(header) {
  if (!header) return;
  document.title = "root@" + (header.nama || "portfolio") + ":~";
}

async function animateHero(header) {
  if (!header) return;
  
  // Setup Fallback Foto CLI
  const wrapper = document.querySelector(".hero-photo-container");
  const FALLBACK_AVATAR = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(header.nama || "Dev")}&backgroundColor=0c0c0c&textColor=00ff00`;
  const fotoSrc = header.foto && header.foto.trim() !== "" ? header.foto.trim() : FALLBACK_AVATAR;

  wrapper.innerHTML = `<img id="profile-photo" src="${escHtml(fotoSrc)}" alt="usr_img" />`;
  const img = wrapper.querySelector("#profile-photo");
  img.addEventListener("error", () => { img.src = FALLBACK_AVATAR; });

  // Typewriter effect untuk text
  const nameEl = document.getElementById("hero-name");
  const descEl = document.getElementById("hero-desc");
  
  const nameText = header.namaPanjang || header.nama || "sysadmin";
  const descText = header.deskripsi || "No description provided.";

  await typeText(nameEl, nameText, 50);
  await typeText(descEl, descText, 25);

  // Munculkan sisanya
  if (header.linkResume && header.linkResume.trim() !== "") {
    const btnWrapper = document.getElementById("hero-resume-wrapper");
    const btn = document.getElementById("hero-resume-btn");
    if (btn) {
      btn.href = header.linkResume;
      btnWrapper.classList.remove("hidden");
    }
  }
}

/** Teks animasi ketik */
function typeText(element, text, speed) {
  return new Promise((resolve) => {
    element.classList.add("typewriter-active");
    element.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
      element.innerHTML += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        element.classList.remove("typewriter-active");
        resolve();
      }
    }, speed);
  });
}

function renderMainContent(data) {
  const container = document.getElementById("main-content");
  if (!container) return;
  container.innerHTML = ""; 

  const sections = [
    createStatsSection(data),
    createTechSection(data.techStack),
    createProjectsSection(data.projects),
    createExperienceSection(data.experience),
  ].filter(Boolean);

  sections.forEach((sec) => container.appendChild(sec));
}

function createStatsSection(data) {
  const projCount = data.projects?.active ? data.projects.items?.length || 0 : 0;
  const expCount = data.experience?.active ? data.experience.items?.length || 0 : 0;
  const techCount = data.techStack?.active ? data.techStack.items?.length || 0 : 0;

  const html = `
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-value">${projCount}</div>
        <div class="stat-label">BINARIES</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${expCount}</div>
        <div class="stat-label">LOGS</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${techCount}</div>
        <div class="stat-label">MODULES</div>
      </div>
    </div>
  `;
  return makeCliSection("cat ./sys_stats.json", html);
}

function createTechSection(techStack) {
  if (!techStack?.active || !techStack.items?.length) return null;

  const pills = techStack.items.map(t => {
    return `<div class="tech-tag">[ ${escHtml(t.name)} ]</div>`;
  }).join("");

  const html = `<div class="tech-container">${pills}</div>`;
  return makeCliSection("ls -la ./tech_bin/", html);
}

function createProjectsSection(projects) {
  if (!projects?.active || !projects.items?.length) return null;
  
  const listHtml = projects.items.map((p) => {
    const repoLink = (p.repo && p.repo.trim() !== "") ? 
      `[<a href="${escHtml(p.repo)}" target="_blank" class="cli-link">SRC</a>]` : "";
    const prevLink = (p.previewActive && p.previewLink) ? 
      `[<a href="${escHtml(p.previewLink)}" target="_blank" class="cli-link">EXEC</a>]` : "";

    return `
      <div class="cli-project-item">
        <div class="project-header">
          <div class="project-name">${escHtml(p.name)}</div>
          <div class="project-links">${repoLink} ${prevLink}</div>
        </div>
        <div class="project-desc">${escHtml(p.desc)}</div>
      </div>
    `;
  }).join("");

  return makeCliSection("cat ./projects.log", listHtml, "projects");
}

function createExperienceSection(experience) {
  if (!experience?.active || !experience.items?.length) return null;

  const listHtml = experience.items.map(e => `
    <div class="cli-exp-item">
      <div class="exp-header">${escHtml(e.title)} @ ${escHtml(e.institution)}</div>
      <div class="exp-meta">TIMESTAMP: ${escHtml(e.period)}</div>
      <div class="exp-desc">${escHtml(e.desc)}</div>
    </div>
  `).join("");

  return makeCliSection("history | grep exp", listHtml, "experience");
}

function renderFooter(header, socials) {
  if (!socials) return;
  const container = document.getElementById("footer-socials");
  if (!container) return;

  const socialMap = [
    { key: "github", label: "GITHUB" },
    { key: "linkedin", label: "LINKEDIN" },
    { key: "twitter", label: "TWITTER" },
    { key: "instagram", label: "INSTAGRAM" },
    { key: "tiktok", label: "TIKTOK" },
    { key: "email", label: "SMTP", isEmail: true }
  ];

  let html = "";
  for (const s of socialMap) {
    const val = socials[s.key];
    if (!val || val.trim() === "") continue;
    const href = s.isEmail ? `mailto:${val.trim()}` : val.trim();
    html += `
      <div class="cli-social-row">
        <span class="cli-social-key">${escHtml(s.label)}</span>
        <span class="cli-social-val">=&gt; <a href="${escHtml(href)}" class="cli-link" target="${s.isEmail ? "_self" : "_blank"}">${escHtml(val)}</a></span>
      </div>
    `;
  }
  container.innerHTML = html;
}

/* ── DOM Utils ── */
function makeCliSection(commandStr, innerHtml, id = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "terminal-section";
  if (id) wrapper.id = id;

  wrapper.innerHTML = `
    <div class="cli-prompt">
      <span class="host">root@server</span>:<span class="path">~</span>$ <span class="command">${escHtml(commandStr)}</span>
    </div>
    <div class="cli-output">
      ${innerHtml}
    </div>
  `;
  return wrapper;
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
      <div class="cli-prompt"><span class="command">ERR: Kernel panic</span></div>
      <div class="cli-output" style="color:red;">${escHtml(msg)}</div>
    `;
  }
}
