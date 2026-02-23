import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import flagId from '../assets/icons/flag-id.svg'
import chevronDown from '../assets/icons/chevron-down.svg'
import eyeOff from '../assets/icons/eye-off.svg'
import eye from '../assets/icons/eye.svg'
import googleIcon from '../assets/icons/google.svg'
import '../style/register.css'

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <Header />

      <main className="container">
        <div className="card">
          <h1 className="title-text">Pendaftaran Akun</h1>
          <p className="subtitle">Yuk, daftarkan akunmu sekarang juga!</p>

          <form>
            <div className="form-group">
              <label>
                Nama Lengkap <span>*</span>
              </label>
              <input type="text" name="fullname" placeholder="Nama lengkap" required />
            </div>

            <div className="form-group">
              <label>
                E-Mail <span>*</span>
              </label>
              <input type="email" name="email" placeholder="Email" required />
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
                />
                <img
                  className="eye-icon"
                  src={showConfirm ? eye : eyeOff}
                  alt="toggle password"
                  onClick={() => setShowConfirm((v) => !v)}
                />
              </div>
            </div>

            <button type="submit" className="btn primary">
              Daftar
            </button>
            <Link to="/login" className="btn secondary">
              Masuk
            </Link>

            <div className="divider">atau</div>

            <button type="button" className="btn google">
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
