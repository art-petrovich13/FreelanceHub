import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes/router'

/**
 * QueryClient — клиент для React Query.
 * Настраиваем глобальное поведение:
 * - staleTime: 60 сек — данные считаются свежими 1 минуту (не рефетчатся)
 * - retry: 1 — повторить запрос 1 раз при ошибке
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,   // 1 минута
      retry: 1,
      refetchOnWindowFocus: false,  // Не рефетчить при фокусе вкладки
    },
    mutations: {
      retry: 0,  // Мутации не повторяем при ошибке
    },
  },
})

/**
 * App — корневой компонент.
 * Оборачивает всё приложение в QueryClientProvider (React Query)
 * и RouterProvider (React Router).
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}