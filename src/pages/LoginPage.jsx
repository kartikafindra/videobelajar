import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import eyeOff from '../assets/icons/eye-off.svg'
import eye from '../assets/icons/eye.svg'
import googleIcon from '../assets/icons/google.svg'
import '../style/index.css'

function LoginPage() {
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  if (isLoggedIn) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    login()
    navigate('/')
  }

  const handleGoogle = () => {
    login()
    navigate('/')
  }

  return (
    <>
      <Header />

      <main className="container">
        <div className="login-card">
          <div className="text-title">Masuk ke Akun</div>
          <p className="subtitle">Yuk, lanjutin belajarmu di videobelajar.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                E-Mail <span>*</span>
              </label>
              <input type="email" name="email" placeholder="Masukkan email" required />
            </div>

            <div className="form-group">
              <label>
                Kata Sandi <span>*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Masukkan kata sandi"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <img src={showPassword ? eye : eyeOff} alt="toggle password" />
                </button>
              </div>
            </div>

            <div className="forgot">
              <a href="#">Lupa Password?</a>
            </div>

            <button type="submit" className="btn btn-primary">
              Masuk
            </button>

            <Link to="/register" className="btn btn-secondary">
              Daftar
            </Link>

            <div className="divider">atau</div>

            <button type="button" className="btn btn-google" onClick={handleGoogle}>
              <img src={googleIcon} alt="Google" />
              <span className="text-google">Masuk dengan Google</span>
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default LoginPage
