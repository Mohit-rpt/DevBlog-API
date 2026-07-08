import express from "express"
import postRouter from "./routes/post.routes.js"
import authRouter from "./routes/auth.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import bookmarkRouter from "./routes/bookmark.routes.js"

const app = express()

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



app.use("/api/v1/posts", postRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/bookmarks", bookmarkRouter)


export { app }