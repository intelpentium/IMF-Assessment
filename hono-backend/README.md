# Hono.js Backend

Backend untuk aplikasi full-stack yang dibangun dengan Hono.js, PostgreSQL, dan Prisma ORM.

## Fitur

- Otentikasi JWT (login, registrasi, logout)
- Manajemen postingan (CRUD)
- Middleware untuk otentikasi dan error handling
- Validasi input menggunakan Zod
- Password hashing dengan argon2
- Pagination untuk daftar postingan
- Repository pattern untuk Prisma

## Struktur Proyek

```
src/
├── app.ts              # Konfigurasi aplikasi Hono utama
├── server.ts           # Konfigurasi server
├── routes/
│   ├── auth.ts         # Route untuk otentikasi
│   ├── posts.ts        # Route untuk postingan
│   └── index.ts        # Registrasi semua route
├── controllers/
│   ├── auth.ts         # Logika kontroler otentikasi
│   └── posts.ts        # Logika kontroler postingan
├── services/           # Layanan bisnis (jika diperlukan)
├── repositories/
│   ├── user.ts         # Operasi database untuk user
│   └── post.ts         # Operasi database untuk postingan
├── middlewares/
│   ├── auth.ts         # Middleware otentikasi
│   ├── error.ts        # Middleware error handling
│   └── cors.ts         # Konfigurasi CORS
├── utils/
│   ├── jwt.ts          # Fungsi JWT (sign/verify token)
│   ├── hash.ts         # Fungsi hashing password
│   └── validator.ts    # Utilitas validasi (jika diperlukan)
├── db/
│   └── client.ts       # Klien Prisma
└── types/
    └── index.ts        # Definisi tipe tambahan
```

## Instalasi

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd hono-backend
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
   # Edit .env dan tambahkan konfigurasi database dan JWT secret
   ```

4. Setup database (pastikan PostgreSQL sudah berjalan):
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

## Menjalankan Aplikasi

- Untuk development:
  ```bash
  npm run dev
  # atau
  pnpm run dev
  ```
  
  Server akan berjalan di `http://localhost:4000`

- Untuk production:
  ```bash
  npm run build
  npm start
  ```

## Arsitektur

### Otentikasi
- JWT disimpan dalam HttpOnly cookie
- Middleware `authGuard` melindungi route yang memerlukan otentikasi
- Token disimpan dengan pengaturan `SameSite=Lax` dan `Secure` hanya untuk production

### Error Handling
- Format error konsisten: `{ "error": { "code": "STRING_CODE", "message": "Readable message" } }`
- Middleware error menangani berbagai jenis error

### Validasi
- Validasi input menggunakan Zod melalui `@hono/zod-validator`
- Validasi dilakukan sebelum masuk ke handler

### Database
- Prisma ORM untuk operasi database
- Repository pattern untuk abstraksi operasi database
- Skema Prisma mendefinisikan model User dan Post

## Kontrak API

### Otentikasi
- `POST /api/auth/signup` - Registrasi user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `GET /api/auth/me` - Dapatkan informasi user saat ini

### Postingan
- `GET /api/posts?page=1&limit=10` - Dapatkan daftar postingan dengan pagination
- `GET /api/posts/:id` - Dapatkan detail postingan
- `POST /api/posts` - Buat postingan baru (harus login)
- `PUT /api/posts/:id` - Update postingan (hanya pemilik)
- `DELETE /api/posts/:id` - Hapus postingan (hanya pemilik)

## Catatan Produksi

- Pastikan `JWT_SECRET` di-set dengan nilai yang kuat
- Gunakan `Secure` cookie dalam environment production (dengan HTTPS)
- Sesuaikan konfigurasi CORS untuk production
- Gunakan environment variables untuk konfigurasi penting
- Lakukan migrasi database dengan benar saat deploy versi baru

## Database Seeder

Seeder menyediakan 1 user demo (`user@example.com` dengan password `P@ssw0rd!`) dan 3 postingan milik user tersebut untuk keperluan pengujian.