import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./components/ProtectedRoute";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";
import Bookmarks from "./pages/Bookmark";
import { Toaster } from "react-hot-toast";
import MyPosts from "./pages/MyPosts";


function App() {
  return (
    <>
      <Routes>
        <Route
    path="/my-posts"
    element={
        <ProtectedRoute>
            <MyPosts />
        </ProtectedRoute>
    }
/>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
