# 🚀 DevBlog API

A complete RESTful Blog API built using **Node.js**, **Express.js**, and **MongoDB**. This project provides secure user authentication, blog management, comments, likes, bookmarks, image uploads, search, and pagination.

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Refresh Access Token
- Change Password
- Get Current User
- Update Profile
- Update Avatar
- Update Cover Image

### 📝 Posts
- Create Post
- Get All Posts
- Get Single Post
- Update Post
- Delete Post
- Post Thumbnail Upload
- Images Inside Posts
- Search Posts
- Pagination
- View Counter

### 💬 Comments
- Add Comment
- Update Comment
- Delete Comment
- Get All Comments of a Post

### ❤️ Likes
- Like Post
- Unlike Post
- Get All Liked Posts

### 🔖 Bookmarks
- Bookmark Post
- Remove Bookmark
- Get All Bookmarked Posts

### ☁️ Cloudinary Integration
- Avatar Upload
- Cover Image Upload
- Post Thumbnail Upload

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Cloudinary
- Multer
- bcrypt
- dotenv

---

# 📂 Project Structure

```
DevBlog API/
│
├── src/
│   ├── controller/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── constants/
│   ├── app.js
│   └── index.js
│
├── public/
│   └── temp/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DevBlog-API.git
```

Move into the project directory

```bash
cd DevBlog-API
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the development server

```bash
npm run dev
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/auth/register |
| POST | /api/v1/auth/login |
| POST | /api/v1/auth/refreshAccessToken |
| PATCH | /api/v1/auth/updatePassword |
| GET | /api/v1/auth/getCurrentUser |
| PATCH | /api/v1/auth/updateProfile |
| PATCH | /api/v1/auth/avatarUpdate |
| PATCH | /api/v1/auth/coverImageUpdate |

---

## Posts

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/posts |
| GET | /api/v1/posts |
| GET | /api/v1/posts/:id |
| PATCH | /api/v1/posts/:id |
| DELETE | /api/v1/posts/:id |

Supports:

- Search
- Pagination
- Sorting
- Category Filter
- Tag Filter

Example:

```
GET /api/v1/posts?page=1&limit=10&search=node&category=Programming&sort=newest
```

---

## Comments

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/comments |
| GET | /api/v1/comments/:postId |
| PATCH | /api/v1/comments/:commentId |
| DELETE | /api/v1/comments/:commentId |

---

## Likes

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/likes/:postId |
| DELETE | /api/v1/likes/:postId |
| GET | /api/v1/likes |

---

## Bookmarks

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/bookmarks/:postId |
| DELETE | /api/v1/bookmarks/:postId |
| GET | /api/v1/bookmarks |

---

# 🔒 Authentication

Protected routes require an Access Token.

```
Authorization: Bearer <your_access_token>
```

---

# 📸 Image Uploads

This project uses:

- Cloudinary
- Multer

Supported uploads:

- Avatar
- Cover Image
- Post Thumbnail

---

# 🚀 Future Improvements

- Email Verification
- Forgot Password
- OTP Authentication
- Admin Dashboard
- Rich Text Editor
- Notifications
- Swagger API Documentation
- Docker Support
- Unit Testing
- CI/CD Pipeline

---

# 👨‍💻 Author

**Mohit Rajput**

GitHub: https://github.com/YOUR_USERNAME

---

# ⭐ If you found this project useful

Please consider giving it a ⭐ on GitHub.
