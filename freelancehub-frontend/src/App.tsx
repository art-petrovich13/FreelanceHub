import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes/AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />

        {/* Toast уведомления — рендерятся поверх всего контента */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Стили для всех тостов
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '14px',
            },
            // Успешные тосты — зелёные, 3 секунды
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            // Ошибки — красные, 5 секунд
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}