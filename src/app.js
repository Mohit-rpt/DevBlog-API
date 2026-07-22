import express from "express"
import postRouter from "./routes/post.routes.js"
import authRouter from "./routes/auth.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import bookmarkRouter from "./routes/bookmark.routes.js"
import cookieParser from "cookie-parser";
import { swaggerUi, specs } from "./docs/swagger.js";
import cors from "cors";

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : [];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            // Check exact match against allowed origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow any Vercel preview deployment for your project
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// Routes
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/bookmarks", bookmarkRouter)


export { app }