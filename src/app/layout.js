import './globals.css'

export const metadata = {
  title: 'Project Myriad',
  description: 'The definitive platform for manga and anime enthusiasts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
