# 📖 Panduan Lengkap Portofolio Bento Grid

Dokumen ini berisi panduan **mengedit konten**, **menggunakan foto lokal**, **menjalankan** secara lokal, dan **deploy ke GitHub Pages**.

---

## 📂 Struktur File

```
portofolio/
├── index.html          → Kerangka HTML halaman (jangan ubah struktur ID-nya)
├── data.json           → ⭐ FILE UTAMA — Semua konten & pengaturan ada di sini
├── panduan.md          → Dokumen ini
├── images/             → 📁 Folder untuk foto/gambar lokal
│   └── foto.jpg        → Foto profil kamu (nama bebas, sesuaikan di data.json)
└── src/
    ├── style.css       → Semua gaya visual (warna, layout, animasi)
    └── script.js       → Logika JavaScript, fetch data, render kartu
```

> **Aturan utama:** Hampir semua perubahan konten cukup dilakukan di **`data.json`** saja.

---

## 🖼️ Menggunakan Foto Lokal

Ini adalah cara yang **disarankan** agar foto tetap tampil meski sedang offline.

### Langkah-langkah:

**1. Siapkan foto kamu**
- Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Ukuran ideal: minimal **400×400 piksel** (foto square/persegi)
- Ukuran file: usahakan di bawah **500 KB** agar loading cepat

**2. Letakkan foto di folder `images/`**
```
portofolio/
└── images/
    └── foto.jpg   ← taruh di sini
```
> Nama file bebas, misalnya `profil.png`, `andi.webp`, dll.

**3. Update `data.json`**

```json
"header": {
  "foto": "images/foto.jpg"
}
```

Sesuaikan nama file dengan yang kamu letakkan di folder `images/`. Contoh lain:
```json
"foto": "images/profil.png"
"foto": "images/andi-prasetyo.webp"
```

### Sistem Fallback Otomatis

Script sudah dilengkapi **sistem fallback bertingkat** — jika foto tidak ditemukan, website tetap tampil normal:

```
images/foto.jpg ada?
  ✅ YA  → Tampilkan foto lokal
  ❌ TIDAK → Cek apakah foto adalah URL eksternal?
               ✅ YA  → Tampilkan dari URL
               ❌ TIDAK → Tampilkan avatar otomatis berbasis inisial nama
```

Jadi meskipun kamu lupa taruh fotonya, website **tidak akan rusak**.

### Menggunakan URL Eksternal (Alternatif)

Jika tidak ingin menyimpan foto secara lokal, kamu juga bisa mengisi field `foto` dengan URL:

```json
"foto": "https://avatars.githubusercontent.com/u/12345678"
```

Atau biarkan kosong untuk avatar otomatis:
```json
"foto": ""
```

---

## ✏️ Cara Mengedit Konten (`data.json`)

Buka file `data.json` dengan editor teks (VS Code, Notepad++, dll).

### 1. `settings` — Warna Tema

```json
"settings": {
  "bg":          "#0a0a0f",   ← Warna latar belakang utama
  "cardBg":      "#111118",   ← Warna kartu bento
  "cardBorder":  "#1e1e2e",   ← Warna garis tepi kartu
  "textLight":   "#f0f0ff",   ← Warna teks utama (terang)
  "textDark":    "#6b6b8a",   ← Warna teks sekunder (redup)
  "primary":     "#c8f135",   ← Warna aksen utama (neon lime)
  "secondary":   "#7c3aed",   ← Warna aksen sekunder (ungu)
  "accent":      "#f135a0"    ← Warna aksen ketiga (pink)
}
```

**Tips:** Gunakan tools seperti [coolors.co](https://coolors.co) untuk membuat palet warna.

---

### 2. `header` — Informasi Profil

```json
"header": {
  "nama":        "Nama Singkat",           ← Muncul di Navbar & footer
  "namaPanjang": "Nama Lengkap Anda",      ← Muncul di hero section
  "foto":        "images/foto.jpg",        ← Path lokal ATAU URL eksternal
  "deskripsi":   "Deskripsi singkat...",   ← Kalimat pengenalan diri
  "linkResume":  "https://link-resume.pdf" ← Kosongkan ("") untuk menyembunyikan tombol
}
```

---

### 3. `techStack` — Keahlian Teknologi

```json
"techStack": {
  "active": true,   ← false = sembunyikan section ini
  "items": [
    { "name": "JavaScript", "iconClass": "fab fa-js" },
    { "name": "Python",     "iconClass": "fab fa-python" }
  ]
}
```

**Cara mencari ikon Font Awesome:**
1. Buka [fontawesome.com/icons](https://fontawesome.com/icons)
2. Cari nama teknologi
3. Salin class ikon (contoh: `fab fa-react`, `fas fa-database`)

> Jika `iconClass` dikosongkan (`""`), akan tampil ikon default `fas fa-code`.

---

### 4. `projects` — Proyek Unggulan

```json
"projects": {
  "active": true,
  "items": [
    {
      "name":          "Nama Proyek",
      "desc":          "Deskripsi singkat proyek...",
      "repo":          "https://github.com/username/repo",
      "previewActive": true,
      "previewLink":   "https://demo-url.vercel.app"
    }
  ]
}
```

- Jika `repo` dikosongkan (`""`), tombol GitHub tidak muncul.
- Jika `previewActive: false` atau `previewLink` kosong, tombol Demo tidak muncul.

---

### 5. `experience` — Pendidikan & Pengalaman

```json
"experience": {
  "active": true,
  "items": [
    {
      "title":       "Nama Posisi / Program",
      "institution": "Nama Instansi / Perusahaan",
      "period":      "2020 – 2024",
      "desc":        "Deskripsi singkat pencapaian..."
    }
  ]
}
```

> Section ini mendukung lebih dari 6 item dengan scroll otomatis.
> Urutkan dari yang **terbaru** ke yang **terlama** untuk tampilan terbaik.

---

### 6. `socials` — Media Sosial

```json
"socials": {
  "instagram": "https://instagram.com/username",
  "email":     "nama@email.com",
  "github":    "https://github.com/username",
  "tiktok":    "",           ← Kosong = ikon tidak ditampilkan
  "linkedin":  "https://linkedin.com/in/username",
  "facebook":  "",
  "twitter":   "https://twitter.com/username"
}
```

> Ikon hanya muncul jika nilainya **tidak kosong**.

---

## 🚀 Menjalankan Secara Lokal

> ⚠️ **Penting:** Karena menggunakan `fetch()` untuk membaca `data.json`, file **tidak bisa** dibuka langsung dengan double-click di browser (akan error CORS). Harus menggunakan server lokal.

### Opsi A: VS Code + Live Server (Termudah & Direkomendasikan)

1. Install **Visual Studio Code** → [code.visualstudio.com](https://code.visualstudio.com)
2. Buka folder `portofolio/` di VS Code
3. Install ekstensi **Live Server** (cari di tab Extensions, `Ctrl+Shift+X`)
4. Klik kanan `index.html` di Explorer → **"Open with Live Server"**
5. Browser otomatis terbuka di `http://127.0.0.1:5500`
6. Setiap kali kamu simpan file, browser langsung **auto-refresh** ✨

### Opsi B: Node.js (`npx serve`)

Jika sudah install Node.js ([nodejs.org](https://nodejs.org)):

```bash
# Buka terminal di folder portofolio/, lalu jalankan:
npx serve .

# Buka browser: http://localhost:3000
```

---

## 🌐 Deploy ke GitHub Pages

### Langkah 1: Persiapkan Repository

```bash
# Buka terminal di folder portofolio/
git init
git add .
git commit -m "feat: inisialisasi portofolio"
```

### Langkah 2: Buat Repository di GitHub

1. Buka [github.com](https://github.com) → Login
2. Klik **"+"** → **"New repository"**
3. Nama repository: `portofolio`
4. Pilih **Public** → Klik **"Create repository"**

### Langkah 3: Push ke GitHub

```bash
# Ganti 'username' dengan username GitHub kamu
git remote add origin https://github.com/username/portofolio.git
git branch -M main
git push -u origin main
```

### Langkah 4: Aktifkan GitHub Pages

1. Di halaman repository → klik tab **"Settings"**
2. Klik **"Pages"** di sidebar kiri
3. Di bagian **"Source"**, pilih:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
4. Klik **"Save"**
5. Tunggu 1–3 menit, portofolio bisa diakses di:
   ```
   https://username.github.io/portofolio/
   ```

> **Catatan tentang foto lokal di GitHub Pages:** Pastikan folder `images/` dan isinya ikut ter-push ke GitHub. Cek dengan `git status` — pastikan file foto muncul dalam daftar yang akan di-commit.

### Langkah 5: Update Konten di Kemudian Hari

```bash
# Setelah edit data.json atau file lainnya:
git add .
git commit -m "update: perbarui konten portofolio"
git push
```

GitHub Pages akan otomatis rebuild dalam 1–2 menit.

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---|---|
| Halaman kosong saat dibuka langsung | Gunakan Live Server atau `npx serve` |
| Foto tidak muncul | Cek nama file di `data.json` sama persis dengan nama file di `images/` (case-sensitive!) |
| Foto lokal tidak muncul di GitHub Pages | Pastikan file foto sudah di-push (`git add images/foto.jpg`) |
| Ikon tidak muncul | Cek class Font Awesome di [fontawesome.com/icons](https://fontawesome.com/icons) |
| Warna tidak berubah | Pastikan format hex benar (contoh: `#ff0000`) |
| GitHub Pages tidak update | Tunggu 2–5 menit, lalu `Ctrl+Shift+R` (hard refresh) |
| Error CORS di console | Jangan buka `index.html` langsung, gunakan server lokal |

---

## 🎨 Kustomisasi Lanjutan

### Mengubah Font

Buka `index.html`, ganti nama font di link Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=NamaFont:wght@700;800&family=FontBody:wght@300;400&display=swap" rel="stylesheet" />
```

Lalu update `src/style.css`:
```css
--font-display: 'NamaFont', sans-serif;
--font-body:    'FontBody', sans-serif;
```

### Menambah Jenis Kartu Baru

1. Buat fungsi `createCardBaru()` di `src/script.js`
2. Tambahkan ke array `cards` di fungsi `renderBentoGrid()`
3. Tambahkan CSS class dan grid span di `src/style.css`

---

*Dibuat dengan ❤️ — Semoga portofoliomu memukau para rekruter!*