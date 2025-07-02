import { Inter } from 'next/font/google'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/responsive.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Project Myriad',
  description: 'The definitive platform for manga and anime enthusiasts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="nav">
          <div className="container">
            <div className="nav-container">
              <a href="/" className="nav-brand">Project Myriad</a>
              <button className="nav-toggle" aria-label="Toggle navigation">
                ☰
              </button>
              <nav className="nav-menu">
                <a href="/dashboard" className="nav-link">Dashboard</a>
                <a href="/upload" className="nav-link">Upload</a>
                <a href="/settings" className="nav-link">Settings</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="container">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </body>
    </html>
  )
}
