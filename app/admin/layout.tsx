import { Metadata } from 'next'
import Link from 'next/link'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Queen of Lingeria',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-100 flex min-h-screen font-sans antialiased text-gray-900">
        <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-center">
            <h1 className="text-xl font-bold text-brand-hotpink" style={{ fontFamily: 'var(--font-playfair)' }}>
              Queen of Lingeria
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-pinkishwhite text-brand-darkred font-semibold transition-colors"
            >
              <span className="text-xl">🛒</span>
              الطلبيات
            </Link>
            
            <a 
              href="/studio" 
              target="_blank" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <span className="text-xl">📦</span>
              إدارة المنتجات (Sanity)
            </a>
            
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <span className="text-xl">🏠</span>
              العودة للمتجر
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
              Admin Dashboard v1.0
            </p>
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
