import { Inter } from 'next/font/google'
import Link from 'next/link'
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
              <Link href="/" className="nav-brand">📚 Project Myriad</Link>
              <button className="nav-toggle" aria-label="Toggle navigation">
                ☰
              </button>
              <nav className="nav-menu">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <a href="#features" className="nav-link">Features</a>
                <a href="https://github.com/HeartlessVeteran2/Project-Myriad" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
              </nav>
            </div>
          </div>
        </header>
        <main>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </body>
    </html>
  )
}
