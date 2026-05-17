import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { createUser, getUsers } from '../services/api/userService'
import flagId from '../assets/icons/flag-id.svg'
import chevronDown from '../assets/icons/chevron-down.svg'
import eyeOff from '../assets/icons/eye-off.svg'
import eye from '../assets/icons/eye.svg'
import googleIcon from '../assets/icons/google.svg'
import '../style/register.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm_password) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    try {
      const users = await getUsers()
      if (users.some((u) => u.email === form.email.trim())) {
        setError('Email sudah terdaftar.')
        return
      }

      await createUser({
        name: form.fullname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        avatar: '',
        courses: 0,
        joined: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      })

      navigate('/login')
    } catch {
      setError('Gagal mendaftarkan akun. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="container">
        <div className="card">
          <h1 className="title-text">Pendaftaran Akun</h1>
          <p className="subtitle">Yuk, daftarkan akunmu sekarang juga!</p>

          {error && (
            <p style={{ color: '#e53e3e', fontSize: 14, marginBottom: 12 }}>{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Nama Lengkap <span>*</span>
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="Nama lengkap"
                required
                value={form.fullname}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                E-Mail <span>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                No. Hp <span>*</span>
              </label>
              <div className="phone-container">
                <div className="phone-wrapper">
                  <div className="flag-box">
                    <img src={flagId} alt="Indonesia" />
                  </div>
                  <div className="country-code">
                    <span>+62</span>
                    <img src={chevronDown} alt="dropdown" className="dropdown-icon" />
                  </div>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="812xxxxxxxx"
                  required
                  className="phone-input"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Kata Sandi <span>*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="********"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
                <img
                  className="eye-icon"
                  src={showPassword ? eye : eyeOff}
                  alt="toggle password"
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Konfirmasi Kata Sandi <span>*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password"
                  placeholder="********"
                  required
                  value={form.confirm_password}
                  onChange={handleChange}
                />
                <img
                  className="eye-icon"
                  src={showConfirm ? eye : eyeOff}
                  alt="toggle password"
                  onClick={() => setShowConfirm((v) => !v)}
                />
              </div>
            </div>

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Memuat...' : 'Daftar'}
            </button>
            <Link to="/login" className="btn secondary">
              Masuk
            </Link>

            <div className="divider">atau</div>

            <button type="button" className="btn google" disabled>
              <img src={googleIcon} alt="Google" />
              <span className="text-google">Daftar dengan Google</span>
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default RegisterPage
