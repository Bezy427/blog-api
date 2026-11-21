import './index.css';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import Home from './pages/Home';
import About from './pages/About';
import PostDetails from './pages/PostDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">

          <Navbar />

          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/posts" element={<Posts />} />

            {/* Create a post */}
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* View a post */}
            <Route path="/posts/:id" element={<PostDetails />} />

            {/* Edit a post */}
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </div> 
  )
}

export default App
