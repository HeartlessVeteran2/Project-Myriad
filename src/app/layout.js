import { Inter } from 'next/font/google'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Project Myriad',
  description: 'The definitive platform for manga and anime enthusiasts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <h1>Project Myriad</h1>
          </nav>
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
