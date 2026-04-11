import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

// Публичные страницы
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import GigsListPage from '../pages/gigs/GigsListPage'
import GigDetailPage from '../pages/gigs/GigDetailPage'
import OrdersListPage from '../pages/orders/OrdersListPage'
import OrderDetailPage from '../pages/orders/OrderDetailPage'
import ProfilePage from '../pages/profile/ProfilePage'

// Страницы, требующие авторизации
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

export const router = createBrowserRouter([
  // ===== Публичные страницы с Layout (Header + Footer) =====
  {
    path: '/',
    element: <Layout />,
    children: [
      // Главная
      { index: true, element: <HomePage /> },

      // Список и детали услуг — публичные (без авторизации)
      { path: 'gigs', element: <GigsListPage /> },
      { path: 'gigs/:id', element: <GigDetailPage /> },

      // Список и детали заказов — публичные
      { path: 'orders', element: <OrdersListPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },

      // Публичный профиль пользователя
      { path: 'profile/:id', element: <ProfilePage /> },
    ],
  },

  // ===== Страницы без Layout (полноэкранные) =====
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ===== Защищённые роуты — требуют авторизации =====
  // ProtectedRoute → проверяет токен → если нет → /login
  {
    element: <ProtectedRoute />,
    children: [
      // Внутри Layout
      {
        element: <Layout />,
        children: [
          // Страницы студента
          { path: '/gigs/create', element: <CreateGigPage /> },
          { path: '/dashboard/student', element: <StudentDashboard /> },

          // Страницы работодателя
          { path: '/orders/create', element: <CreateOrderPage /> },
          { path: '/dashboard/employer', element: <EmployerDashboard /> },

          // Общие защищённые страницы
          { path: '/profile/edit', element: <EditProfilePage /> },
        ],
      },
    ],
  },

  // ===== Роуты только для Admin =====
  // RoleRoute → проверяет роль → если не Admin → /
  {
    element: <RoleRoute allowedRoles={['Admin']} />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/gigs', element: <AdminGigs /> },
          { path: '/admin/orders', element: <AdminOrders /> },
        ],
      },
    ],
  },
])