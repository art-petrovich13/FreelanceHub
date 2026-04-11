import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/**
 * Основной Layout приложения.
 * Оборачивает все страницы: Header → <контент страницы> → Footer.
 * Outlet — это место куда React Router вставляет содержимое текущего роута.
 *
 * min-h-screen + flex flex-col — чтобы Footer всегда был внизу,
 * даже если контент короткий.
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Основной контент страницы */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}