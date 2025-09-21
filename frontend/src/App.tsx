// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
      </Routes>
    </Router>
  );
}

export default App;
