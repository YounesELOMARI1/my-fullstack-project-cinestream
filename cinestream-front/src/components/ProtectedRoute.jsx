import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#11131c]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#00daf3]"/>
    </div>
  )

  if (!user) return <Navigate to="/login" />
  if (admin && user.role !== 'admin') return <Navigate to="/" />
  return children
}