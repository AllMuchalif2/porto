/**
 * PORTOFOLIO BENTO GRID — script.js
 * Arsitektur data-driven: semua konten dari data.json
 */

"use strict";

/* ============================================================
   MAIN INIT — Entry point setelah DOM siap
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
  initMouseGlow();
});

/* ============================================================
   FETCH DATA & ORCHESTRATE
   ============================================================ */
async function initPortfolio() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok)
      throw new Error(`Gagal memuat data.json (status ${res.status})`);
    const data = await res.json();

    applyTheme(data.settings);
    renderNavbar(data.header);
    renderHero(data.header);
    renderBentoGrid(data);
    renderFooter(data.header, data.socials);
  } catch (err) {
    console.error("Error inisialisasi portofolio:", err);
    showError(err.message);
  }
}

/* ============================================================
   1. APPLY THEME dari data.json → CSS Variables
   ============================================================ */
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

/* ============================================================
   2. NAVBAR
   ============================================================ */
function renderNavbar(header) {
  if (!header) return;

  // Title dokumen
  document.title = header.namaPanjang || header.nama || "Portofolio";

  // Brand
  setText("#nav-brand", header.nama || "");

  // Tombol resume
  if (header.linkResume && header.linkResume.trim() !== "") {
    const btn = document.getElementById("nav-resume-btn");
    if (btn) {
      btn.href = header.linkResume;
      btn.classList.remove("hidden");
    }
  }
}

/* ============================================================
   3. HERO SECTION
   ============================================================ */
function renderHero(header) {
  if (!header) return;
  setText("#hero-name", header.namaPanjang || header.nama || "");
  setText("#hero-desc", header.deskripsi || "");

  if (header.linkResume && header.linkResume.trim() !== "") {
    const btn = document.getElementById("hero-resume-btn");
    if (btn) {
      btn.href = header.linkResume;
      btn.classList.remove("hidden");
    }
  }
}

/* ============================================================
   4. BENTO GRID — Orkestrasi semua kartu
   ============================================================ */
function renderBentoGrid(data) {
  const container = document.getElementById("bento-container");
  if (!container) return;
  container.innerHTML = ""; // Hapus skeleton

  const cards = [
    createCardPhoto(data.header),
    createCardQuote(data.header),
    createCardStats(data),
    createCardTech(data.techStack),
    createCardStatus(),
    createCardDecor(data),
    createCardProjects(data.projects),
    createCardExperience(data.experience),
  ].filter(Boolean); // Filter null jika section non-aktif

  cards.forEach((card) => container.appendChild(card));
}

/* ── KARTU FOTO PROFIL ── */
function createCardPhoto(header) {
  if (!header) return null;
  const card = makeCard("card-photo");

  // Prioritas foto:
  // 1. Path lokal  → "images/foto.jpg"  (file ada di folder images/)
  // 2. URL eksternal → "https://..."
  // 3. Fallback otomatis → avatar berbasis inisial nama
  const FALLBACK_AVATAR = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(header.nama || "Dev")}&backgroundColor=111118&textColor=c8f135`;

  const fotoSrc =
    header.foto && header.foto.trim() !== ""
      ? header.foto.trim()
      : FALLBACK_AVATAR;

  card.innerHTML = `
    <img
      id="profile-photo"
      src="${escHtml(fotoSrc)}"
      alt="Foto profil ${escHtml(header.namaPanjang || "")}"
      loading="lazy"
    />
    <div class="photo-name">${escHtml(header.namaPanjang || header.nama || "")}</div>
    <div class="photo-role">Full-Stack Developer</div>
    <div class="photo-badge">
      <span class="dot-pulse"></span> Terbuka untuk Peluang
    </div>`;

  // Jika foto lokal gagal dimuat (file tidak ada), otomatis gunakan fallback avatar
  const img = card.querySelector("#profile-photo");
  img.addEventListener("error", () => {
    img.src = FALLBACK_AVATAR;
    img.removeEventListener("error", () => {});
  });

  return card;
}

/* ── KARTU QUOTE / TAGLINE ── */
function createCardQuote(header) {
  const card = makeCard("card-quote");
  const desc = header?.deskripsi || "";
  // Ambil 2 kata pertama untuk di-highlight
  const words = desc.split(" ");
  const highlight = words.slice(0, 3).join(" ");
  const rest = words.slice(3).join(" ");

  card.innerHTML = `
    <div class="card-label"><i class="fas fa-quote-left"></i> Tentang Saya</div>
    <div class="big-quote">
      <span>${escHtml(highlight)}</span> ${escHtml(rest)}
    </div>`;
  return card;
}

/* ── KARTU STATISTIK ── */
function createCardStats(data) {
  const card = makeCard("card-stats");
  const projCount = data.projects?.active
    ? data.projects.items?.length || 0
    : 0;
  const expCount = data.experience?.active
    ? data.experience.items?.length || 0
    : 0;
  const techCount = data.techStack?.active
    ? data.techStack.items?.length || 0
    : 0;

  card.innerHTML = `
    <div class="card-label"><i class="fas fa-chart-bar"></i> Pencapaian</div>
    ${makeStatRow("Proyek Selesai", projCount + "+")}
    ${makeStatRow("Pengalaman", expCount + " pos")}
    ${makeStatRow("Teknologi", techCount + " tools")}
    ${makeStatRow("Tahun Aktif", "3+")}`;
  return card;
}

function makeStatRow(label, value) {
  return `
    <div class="stat-row">
      <span class="stat-label">${escHtml(label)}</span>
      <span class="stat-value">${escHtml(value)}</span>
    </div>`;
}

/* ── KARTU TECH STACK ── */
function createCardTech(techStack) {
  if (!techStack?.active) return null;
  const card = makeCard("card-tech");
  const items = techStack.items || [];

  const pills = items
    .map((t) => {
      const icon =
        t.iconClass && t.iconClass.trim() !== "" ? t.iconClass : "fas fa-code";
      return `
      <span class="tech-pill">
        <i class="${escHtml(icon)}" aria-hidden="true"></i>
        ${escHtml(t.name || "")}
      </span>`;
    })
    .join("");

  card.innerHTML = `
    <div class="card-label"><i class="fas fa-layer-group"></i> Tech Stack</div>
    <div class="tech-grid">${pills}</div>`;
  return card;
}

/* ── KARTU STATUS SINGKAT ── */
function createCardStatus() {
  const card = makeCard("card-status");
  card.innerHTML = `
    <div class="status-icon"><i class="fas fa-rocket" aria-hidden="true"></i></div>
    <div class="status-text">Siap Berkolaborasi</div>
    <div class="status-sub">Terbuka untuk proyek freelance,<br>full-time, & open source.</div>`;
  return card;
}

/* ── KARTU DEKORASI ── */
function createCardDecor(data) {
  const card = makeCard("card-decor");
  const projCount = data.projects?.active
    ? data.projects.items?.length || 0
    : 0;
  card.innerHTML = `
    <div class="decor-number">${projCount}+</div>
    <div class="decor-text">Proyek<br>Nyata</div>
    <div class="decor-sub">Dibangun dengan sepenuh hati</div>`;
  return card;
}

/* ── KARTU PROYEK ── */
function createCardProjects(projects) {
  if (!projects?.active) return null;
  const card = makeCard("card-projects");
  const items = projects.items || [];

  const listHtml = items
    .map((p) => {
      const repoLink =
        p.repo && p.repo.trim() !== ""
          ? `<a href="${escHtml(p.repo)}" target="_blank" rel="noopener" class="project-link" title="Lihat kode sumber">
           <i class="fab fa-github" aria-hidden="true"></i> Repo
         </a>`
          : "";
      const previewLink =
        p.previewActive && p.previewLink && p.previewLink.trim() !== ""
          ? `<a href="${escHtml(p.previewLink)}" target="_blank" rel="noopener" class="project-link preview-link" title="Lihat demo langsung">
           <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Demo
         </a>`
          : "";

      return `
      <div class="project-item">
        <div class="project-header">
          <div class="project-name">${escHtml(p.name || "")}</div>
          <div class="project-links">${repoLink}${previewLink}</div>
        </div>
        <div class="project-desc">${escHtml(p.desc || "")}</div>
      </div>`;
    })
    .join("");

  card.innerHTML = `
    <div class="card-label"><i class="fas fa-folder-open"></i> Proyek Unggulan</div>
    <div class="project-list">${listHtml}</div>`;
  return card;
}

/* ── KARTU PENGALAMAN & PENDIDIKAN ── */
function createCardExperience(experience) {
  if (!experience?.active) return null;
  const card = makeCard("card-experience");
  const items = experience.items || [];

  const listHtml = items
    .map(
      (e) => `
    <div class="exp-item">
      <div class="exp-dot-col">
        <div class="exp-dot" aria-hidden="true"></div>
        <div class="exp-line" aria-hidden="true"></div>
      </div>
      <div class="exp-content">
        <div class="exp-title">${escHtml(e.title || "")}</div>
        <div class="exp-institution">${escHtml(e.institution || "")}</div>
        <div class="exp-period"><i class="far fa-calendar-alt" aria-hidden="true"></i> ${escHtml(e.period || "")}</div>
        <div class="exp-desc">${escHtml(e.desc || "")}</div>
      </div>
    </div>`,
    )
    .join("");

  card.innerHTML = `
    <div class="card-label"><i class="fas fa-timeline"></i> Pendidikan & Pengalaman</div>
    <div class="experience-list">${listHtml}</div>`;
  return card;
}

/* ============================================================
   5. FOOTER — Sosial media kondisional
   ============================================================ */
function renderFooter(header, socials) {
  // Brand
  setText("#footer-brand", header?.namaPanjang || header?.nama || "");

  // Copyright
  const year = new Date().getFullYear();
  setText(
    "#footer-copy",
    `© ${year} ${header?.namaPanjang || ""}. Dibuat dengan ❤️ menggunakan HTML, CSS & JS.`,
  );

  // Sosial media — hanya tampil jika ada nilai
  const container = document.getElementById("footer-socials");
  if (!container || !socials) return;

  const socialMap = [
    { key: "github", icon: "fab fa-github", label: "GitHub", isEmail: false },
    {
      key: "linkedin",
      icon: "fab fa-linkedin",
      label: "LinkedIn",
      isEmail: false,
    },
    {
      key: "instagram",
      icon: "fab fa-instagram",
      label: "Instagram",
      isEmail: false,
    },
    {
      key: "twitter",
      icon: "fab fa-x-twitter",
      label: "Twitter/X",
      isEmail: false,
    },
    { key: "tiktok", icon: "fab fa-tiktok", label: "TikTok", isEmail: false },
    {
      key: "facebook",
      icon: "fab fa-facebook",
      label: "Facebook",
      isEmail: false,
    },
    { key: "email", icon: "fas fa-envelope", label: "Email", isEmail: true },
  ];

  let html = "";
  for (const s of socialMap) {
    const val = socials[s.key];
    if (!val || val.trim() === "") continue;
    const href = s.isEmail ? `mailto:${val.trim()}` : val.trim();
    html += `
      <a href="${escHtml(href)}" class="social-link" target="${s.isEmail ? "_self" : "_blank"}"
         rel="noopener" aria-label="${escHtml(s.label)}" title="${escHtml(s.label)}">
        <i class="${escHtml(s.icon)}" aria-hidden="true"></i>
      </a>`;
  }
  container.innerHTML = html;
}

/* ============================================================
   UTILITAS
   ============================================================ */

/** Buat elemen kartu bento dengan class */
function makeCard(extraClass) {
  const div = document.createElement("div");
  div.className = `bento-card${extraClass ? " " + extraClass : ""}`;
  return div;
}

/** Set teks pada selector */
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

/** Escape HTML untuk mencegah XSS */
function escHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Tampilkan pesan error di halaman */
function showError(msg) {
  const container = document.getElementById("bento-container");
  if (container) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:80px 24px;color:var(--text-dark);">
        <i class="fas fa-triangle-exclamation" style="font-size:2rem;color:var(--accent);margin-bottom:16px;display:block;"></i>
        <p style="font-size:1rem;">Gagal memuat data portofolio.</p>
        <p style="font-size:0.85rem;margin-top:8px;">${escHtml(msg)}</p>
        <p style="font-size:0.8rem;margin-top:16px;">Pastikan file <code>data.json</code> ada dan server lokal berjalan.</p>
      </div>`;
  }
}

/* ============================================================
   MOUSE GLOW EFFECT pada kartu bento
   ============================================================ */
function initMouseGlow() {
  const cards = document.getElementById("bento-container");
  if (!cards) return;

  // Delegasi event ke parent
  cards.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".bento-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", x + "%");
    card.style.setProperty("--mouse-y", y + "%");
  });
}
