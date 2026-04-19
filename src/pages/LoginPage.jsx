import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import { useAppContext } from '../context/AppContext'

function LoginPage() {
  const { login, currentUser } = useAppContext()
  const [email, setEmail] = useState('admin@office.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const redirectPath = useMemo(() => {
    if (!currentUser) {
      return null
    }

    return currentUser.role === 'admin' ? '/dashboard' : '/calendar'
  }, [currentUser])

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const result = login({ email, password })

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
  }

  return (
    <div className="auth-page">
      <Card
        title="Welcome Back"
        subtitle="Sign in to Office Interactive Calendar"
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <InputField
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <InputField
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="message error">{error}</p>}
          <Button type="submit" fullWidth>
            Login
          </Button>
          <p className="hint">
            Demo admin credentials: admin@office.local / admin123
          </p>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
