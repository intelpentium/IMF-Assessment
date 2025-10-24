# Next.js Frontend

Frontend untuk aplikasi full-stack yang dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, dan DaisyUI.

## Fitur

- Otentikasi (Sign In/Sign Up/Sign Out)
- Manajemen postingan (CRUD)
- Sistem navigasi dengan Navbar
- Form postingan dengan validasi
- Pagination untuk daftar postingan
- Responsif dengan Tailwind CSS dan DaisyUI
- API service untuk berinteraksi dengan backend

## Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Layout utama aplikasi
│   ├── page.tsx            # Halaman beranda
│   ├── auth/
│   │   ├── sign-in/        # Halaman login
│   │   └── sign-up/        # Halaman registrasi
│   ├── posts/
│   │   ├── page.tsx        # Daftar postingan
│   │   ├── [id]/           # Detail postingan
│   │   ├── new/            # Form buat postingan baru
│   │   └── [id]/edit/      # Form edit postingan
├── components/
│   ├── Navbar.tsx          # Komponen navigasi
│   ├── PostForm.tsx        # Form postingan (buat/edit)
│   ├── Pagination.tsx      # Komponen pagination
│   └── Alert.tsx           # Komponen alert
├── lib/
│   ├── api.ts              # Wrapper API service
│   ├── auth.ts             # Fungsi otentikasi
│   └── types.ts            # Definisi tipe
└── styles/
    └── globals.css         # CSS global
```

## Instalasi

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd next-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # atau
   pnpm install
   ```

3. Setup environment:
   ```bash
   cp .env .env
   # Edit .env dan tambahkan URL API backend
   ```

## Menjalankan Aplikasi

- Untuk development:
  ```bash
  npm run dev
  # atau
  pnpm run dev
  ```
  
  Aplikasi akan berjalan di `http://localhost:3000`

- Untuk production:
  ```bash
  npm run build
  npm start
  ```

## Fitur Utama

### Otentikasi
- Form Sign In dan Sign Up dengan validasi
- Middleware otentikasi di backend untuk proteksi route
- Logout dan manajemen status otentikasi

### Manajemen Postingan
- Daftar postingan dengan pagination
- Halaman detail postingan
- Form tambah dan edit postingan
- Fungsi delete postingan

### UI/UX
- Menggunakan DaisyUI untuk komponen siap pakai
- Responsif untuk berbagai ukuran layar
- Loading state dan error handling
- Alert untuk feedback pengguna

## Konfigurasi

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: URL ke API backend (contoh: `http://localhost:4000/api`)

### Dependencies
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- DaisyUI
- Axios (untuk HTTP requests)

## Arsitektur

### API Service
- Wrapper axios dengan konfigurasi otomatis untuk credentials (cookie)
- Fungsi spesifik untuk setiap operasi API
- Penanganan error konsisten

### Otentikasi
- Fungsi untuk signin, signup, signout
- Middleware pada backend melindungi route
- Status otentikasi ditampilkan di Navbar

### Styling
- Tailwind CSS untuk styling komponen
- DaisyUI untuk komponen UI siap pakai (button, card, form, dll)
- Custom CSS hanya untuk gaya spesifik

## Catatan Produksi

- Pastikan `NEXT_PUBLIC_API_BASE_URL` diatur dengan benar untuk production
- Lakukan build sebelum deploy
- Konfigurasi CORS di backend harus mengizinkan origin frontend
- Gunakan HTTPS di production untuk keamanan cookie