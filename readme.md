Route → Middleware → Controller → Model/DB


POST /api/auth/login
        ↓
auth route
        ↓
validation middleware
        ↓
loginController()
        ↓
User model
        ↓
response


src/
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── post.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── bookmark.controller.js
│   ├── category.controller.js
│   ├── upload.controller.js
│   └── admin.controller.js