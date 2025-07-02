import Link from 'next/link'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Project Myriad</h1>
      <p>The definitive platform for manga and anime enthusiasts</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/dashboard" style={{ 
          margin: '0 1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px' 
        }}>
          Go to Dashboard
        </Link>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Authentication</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4>Login</h4>
            <LoginForm />
          </div>
          <div>
            <h4>Register</h4>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
