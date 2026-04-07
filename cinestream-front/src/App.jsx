import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Login from './pages/Login'
import Register from './pages/Register'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Dashboard from './pages/admin/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppLayout() {
  const location = useLocation()
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#11131c] text-white">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/home"      element={<Home />} />
        <Route path="/movies"    element={<Movies />} />
        <Route path="/series"    element={<Series />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/search"    element={<Search />} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin"     element={<ProtectedRoute admin><Dashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}