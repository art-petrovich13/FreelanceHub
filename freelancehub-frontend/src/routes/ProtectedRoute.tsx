import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated()) {
    // state={{ from: location }} — запоминаем куда пользователь хотел попасть
    // После логина можно будет редиректнуть обратно
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}