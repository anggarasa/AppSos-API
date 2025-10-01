# AppSosV2 - Social Media API

AppSosV2 adalah REST API untuk aplikasi media sosial yang dibangun dengan Node.js, Express, TypeScript, dan Prisma. API ini menyediakan fitur lengkap untuk platform media sosial seperti autentikasi pengguna, posting, komentar, like, save, follow, dan notifikasi.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: JWT-based authentication dengan refresh token
- **Manajemen Pengguna**: Registrasi, login, profil pengguna dengan upload avatar
- **Posting**: Buat, edit, hapus post dengan dukungan upload gambar
- **Interaksi Sosial**: Like, comment, save post
- **Sistem Follow**: Follow/unfollow pengguna lain
- **Notifikasi**: Real-time notifications untuk aktivitas
- **Upload File**: Integrasi dengan Supabase untuk penyimpanan gambar
- **Pagination**: Dukungan pagination untuk semua endpoint list
- **Validasi**: Input validation menggunakan middleware khusus
- **Security**: Helmet, CORS, rate limiting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Supabase Storage
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- PostgreSQL database
- Supabase account (untuk file storage)

## 🔧 Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd AppSosV2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Buat file `.env` di root directory dan tambahkan variabel berikut:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/appsos_db"
   DIRECT_URL="postgresql://username:password@localhost:5432/appsos_db"

   # Server
   PORT=3000
   NODE_ENV=development

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Supabase (untuk file storage)
   SUPABASE_PROJECT_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key

   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Setup database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # (Optional) Seed database
   npm run db:seed
   ```

5. **Build aplikasi**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed

# Reset database
npm run db:reset

# Lint code
npm run lint

# Run tests
npm run test
```

## 📚 API Documentation

API berjalan di `http://localhost:3000` dengan base URL `/api/v1`.

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

API menggunakan JWT Bearer token untuk autentikasi:

```
Authorization: Bearer <your_jwt_token>
```

### Response Format

Semua response mengikuti format standar:

```json
{
  "status": 200,
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // untuk endpoint dengan pagination
}
```

### Main Endpoints

#### 🔐 Authentication

- `POST /auth/register` - Registrasi pengguna baru
- `POST /auth/login` - Login pengguna
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout pengguna

#### 👤 Users

- `GET /users` - Daftar semua pengguna (dengan pagination)
- `GET /users/search` - Cari pengguna
- `GET /users/:id` - Detail pengguna berdasarkan ID
- `GET /users/username/:username` - Detail pengguna berdasarkan username
- `GET /users/profile/:id` - Profil pengguna dengan statistik
- `PUT /users/:id` - Update profil pengguna (dengan upload avatar)
- `DELETE /users/:id` - Hapus pengguna

#### 📝 Posts

- `GET /posts` - Daftar semua post (dengan pagination)
- `GET /posts/:id` - Detail post berdasarkan ID
- `GET /posts/user/:userId` - Post dari pengguna tertentu
- `GET /posts/saved/:userId` - Post yang disimpan pengguna
- `POST /posts` - Buat post baru (dengan upload gambar)
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Hapus post

#### 💬 Comments

- `GET /comment/post/:postId` - Komentar untuk post tertentu
- `GET /comment/user/:userId` - Komentar dari pengguna tertentu
- `GET /comment/:id` - Detail komentar
- `POST /comment` - Buat komentar baru
- `PUT /comment/:id` - Update komentar
- `DELETE /comment/:id` - Hapus komentar

#### ❤️ Likes

- `POST /like` - Like post
- `DELETE /like/unlike` - Unlike post
- `GET /like/user/:userId/posts` - Post yang di-like pengguna
- `GET /like/count/:postId` - Jumlah like post
- `GET /like/check/:userId/:postId` - Cek status like

#### 🔖 Saves

- `POST /save` - Simpan post
- `DELETE /save/unsave` - Unsave post
- `GET /save/user/:userId` - Post yang disimpan pengguna
- `GET /save/count/:postId` - Jumlah save post
- `GET /save/check/:userId/:postId` - Cek status save

#### 👥 Follow

- `POST /follow` - Follow pengguna
- `DELETE /follow/unfollow` - Unfollow pengguna
- `GET /follow/followers/:userId` - Daftar followers
- `GET /follow/following/:userId` - Daftar following
- `GET /follow/stats/:userId` - Statistik follow
- `GET /follow/check/:followerId/:followingId` - Cek status follow

#### 🔔 Notifications

- `GET /notifications` - Daftar notifikasi pengguna
- `GET /notifications/unread-count` - Jumlah notifikasi belum dibaca
- `PUT /notifications/:id/read` - Tandai notifikasi sebagai dibaca
- `PUT /notifications/mark-all-read` - Tandai semua notifikasi sebagai dibaca
- `DELETE /notifications/:id` - Hapus notifikasi

#### 🏥 Health Check

- `GET /health` - Status server
- `GET /api/v1` - Status API

Untuk dokumentasi API lengkap dengan contoh request/response, lihat file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 📊 Database Schema

Aplikasi menggunakan PostgreSQL dengan Prisma ORM. Schema database meliputi:

- **User**: Data pengguna (id, email, username, name, bio, avatarUrl, password)
- **Post**: Data posting (id, authorId, content, imageUrl, timestamps)
- **Comment**: Data komentar (id, postId, authorId, content, timestamps)
- **Like**: Data like post (id, postId, userId, timestamp)
- **Save**: Data save post (id, postId, userId, timestamp)
- **Follow**: Data follow antar pengguna (id, followerId, followingId, timestamp)
- **Notification**: Data notifikasi (id, type, message, isRead, receiverId, senderId, relatedIds)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt untuk hashing password
- **CORS**: Konfigurasi CORS untuk cross-origin requests
- **Helmet**: Security headers untuk Express
- **Input Validation**: Validasi input pada semua endpoint
- **Rate Limiting**: (dapat ditambahkan sesuai kebutuhan)
- **SQL Injection Protection**: Prisma ORM mencegah SQL injection

## 📁 Project Structure

```
AppSosV2/
├── src/
│   ├── config/          # Konfigurasi database dan services
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server startup
├── prisma/
│   ├── migrations/      # Database migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Database seeding
├── dist/                # Compiled JavaScript files
├── generated/           # Generated Prisma client
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

Untuk menjalankan tests:

```bash
npm test
```

## 📦 Postman Collection

Import file `AppSosV2_Postman_Collection.json` dan `AppSosV2_Postman_Environment.json` ke Postman untuk testing API endpoints.

## 🚀 Deployment

### Environment Variables untuk Production

Pastikan semua environment variables telah diset dengan benar untuk production:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_strong_jwt_secret
# ... other production variables
```

### Build untuk Production

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the ISC License. See `LICENSE` file for more information.

## 📞 Contact

Project Link: [https://github.com/yourusername/AppSosV2](https://github.com/yourusername/AppSosV2)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/)

---

**Happy Coding! 🚀**
