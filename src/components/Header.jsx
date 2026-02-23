import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/images/logo.svg'
import avatarProfile from '../assets/icons/avatar-profile.png'

function Header({ showMenu = false }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = (
    <>
      <div className="dropdown-item">Profile Saya</div>
      <div className="dropdown-item">Kelas Saya</div>
      <div className="dropdown-item">Pesanan Saya</div>
      <div className="dropdown-divider" />
      <div className="dropdown-item dropdown-logout" onClick={handleLogout}>
        Logout
      </div>
    </>
  )

  return (
    <>
      <header className="header">
        <Link to="/">
          <img src={logo} className="logo" alt="Logo" />
        </Link>

        {showMenu && (
          <div className="header-right">
            <span className="menu">Kategori</span>

            {/* Desktop avatar dropdown */}
            <div className="avatar-wrapper" ref={dropdownRef}>
              <img
                src={avatarProfile}
                className="avatar"
                alt="Profile"
                onClick={() => setDropdownOpen((v) => !v)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">{menuItems}</div>
              )}
            </div>

            {/* Mobile hamburger */}
            <div
              className="hamburger"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </div>
          </div>
        )}
      </header>

      {/* Mobile slide-down menu */}
      {showMenu && mobileMenuOpen && (
        <div className="mobile-menu">{menuItems}</div>
      )}
    </>
  )
}

export default Header
