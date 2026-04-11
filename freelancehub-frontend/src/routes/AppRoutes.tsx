import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

// Layout
import Layout from '../components/layout/Layout'

// Публичные страницы
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import GigsListPage from '../pages/gigs/GigsListPage'
import GigDetailPage from '../pages/gigs/GigDetailPage'
import OrdersListPage from '../pages/orders/OrdersListPage'
import OrderDetailPage from '../pages/orders/OrderDetailPage'
import ProfilePage from '../pages/profile/ProfilePage'

// Защищённые страницы (авторизованный пользователь)
import CreateGigPage from '../pages/gigs/CreateGigPage'
import CreateOrderPage from '../pages/orders/CreateOrderPage'
import EditProfilePage from '../pages/profile/EditProfilePage'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import EmployerDashboard from '../pages/dashboard/EmployerDashboard'

// Admin страницы
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminGigs from '../pages/admin/AdminGigs'
import AdminOrders from '../pages/admin/AdminOrders'

export function AppRoutes() {
  return (
    <Routes>

      {/* ── Публичные страницы БЕЗ Layout (полноэкранные) ─────────── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Admin (только роль Admin) ──────────────────────────────── */}
      <Route element={<RoleRoute allowedRoles={['Admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin"         element={<AdminDashboard />} />
          <Route path="/admin/users"   element={<AdminUsers />} />
          <Route path="/admin/gigs"    element={<AdminGigs />} />
          <Route path="/admin/orders"  element={<AdminOrders />} />
        </Route>
      </Route>

      {/* ── Защищённые роуты (любой авторизованный) ───────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/gigs/create"        element={<CreateGigPage />} />
          <Route path="/orders/create"      element={<CreateOrderPage />} />
          <Route path="/profile/edit"       element={<EditProfilePage />} />
          <Route path="/dashboard/student"  element={<StudentDashboard />} />
          <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        </Route>
      </Route>

      {/* ── Публичные страницы С Layout (Header + Footer) ─────────── */}
      <Route element={<Layout />}>
        <Route index             element={<HomePage />} />
        <Route path="/gigs"      element={<GigsListPage />} />
        <Route path="/gigs/:id"  element={<GigDetailPage />} />
        <Route path="/orders"    element={<OrdersListPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}