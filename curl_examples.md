Berikut adalah contoh perintah cURL untuk semua endpoint utama backend:

### 1. Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "P@ssw0rd!"
  }'
```

### 2. Signin
```bash
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "P@ssw0rd!"
  }' \
  -c cookies.txt
```
Catatan: Simpan cookie ke file `cookies.txt` untuk digunakan di permintaan selanjutnya

### 3. Me (dapatkan informasi user saat ini)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

### 4. List Posts (tanpa otentikasi)
```bash
curl -X GET "http://localhost:4000/api/posts?page=1&limit=10"
```

### 5. Create Post (dengan otentikasi)
```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "This is the content of my new post."
  }' \
  -b cookies.txt
```

### 6. Get Post Detail
```bash
curl -X GET http://localhost:4000/api/posts/1
```

### 7. Update Post (hanya pemilik)
```bash
curl -X PUT http://localhost:4000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "This is the updated content of the post."
  }' \
  -b cookies.txt
```

### 8. Delete Post (hanya pemilik)
```bash
curl -X DELETE http://localhost:4000/api/posts/1 \
  -b cookies.txt
```

### 9. Signout
```bash
curl -X POST http://localhost:4000/api/auth/signout \
  -b cookies.txt
```

Catatan penting:
- Cookie HttpOnly hanya bisa dikirim dan disimpan oleh browser atau tools seperti curl
- Gunakan flag `-c` untuk menyimpan cookie dari response
- Gunakan flag `-b` untuk mengirim cookie dari file ke request berikutnya
- Endpoint proteksi (create/update/delete post) memerlukan cookie token