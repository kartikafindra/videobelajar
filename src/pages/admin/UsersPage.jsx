import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchUsers,
  addUser,
  removeUser,
} from '../../store/redux/slices/usersSlice'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  avatar: '',
  password: '',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function UsersPage() {
  const dispatch = useDispatch()

  // ── Read from Redux state ──────────────────────────────────
  const users = useSelector((state) => state.users.items)
  const loading = useSelector((state) => state.users.loading)
  const apiError = useSelector((state) => state.users.error)

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ── GET: fetch all users from API → store in Redux ─────────
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama lengkap wajib diisi'
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Format email tidak valid'
    if (users.some((u) => u.email === form.email.trim())) newErrors.email = 'Email sudah terdaftar'
    if (!form.phone.trim()) newErrors.phone = 'No telepon wajib diisi'
    if (!form.password.trim()) newErrors.password = 'Password wajib diisi'
    else if (form.password.length < 6) newErrors.password = 'Password minimal 6 karakter'
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setSubmitting(true)
    try {
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

      // ── ADD: post to API → prepend to Redux state ──────────
      await dispatch(addUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar.trim(),
        password: form.password,
        joined: today,
        courses: 0,
      })).unwrap()

      setSubmitted(true)
      setForm(INITIAL_FORM)
      setErrors({})
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      setErrors({ submit: 'Gagal menambahkan user. Coba lagi.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus user ini?')) return
    // ── DELETE: delete via API → remove from Redux state ──────
    dispatch(removeUser(id))
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-subtitle">Kelola pengguna yang terdaftar di VideoBelajar.</p>

      {/* ── Create User Form ── */}
      <div className="product-form-card" style={{ marginBottom: 28 }}>
        <h2 className="form-section-title">Manajemen Users</h2>

        {submitted && <div className="alert alert--success">User baru berhasil ditambahkan!</div>}
        {errors.submit && <div className="alert alert--error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap <span className="required">*</span></label>
              <input
                id="name" name="name" type="text"
                placeholder="Masukkan nama lengkap"
                value={form.name} onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                id="email" name="email" type="email"
                placeholder="nama@email.com"
                value={form.email} onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">No Telepon <span className="required">*</span></label>
              <input
                id="phone" name="phone" type="tel"
                placeholder="08xxxxxxxxxx"
                value={form.phone} onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <p className="error-msg">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                id="avatar" name="avatar" type="url"
                placeholder="https://example.com/avatar.jpg"
                value={form.avatar} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <div className="password-wrapper">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button" className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-tambah" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Tambah User'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Users List — data from useSelector ── */}
      <div className="users-table-card">
        <div className="users-table-header">
          <span className="users-table-count">{users.length} pengguna terdaftar</span>
        </div>

        {loading && <p style={{ padding: '20px', color: '#888' }}>Memuat data pengguna...</p>}
        {apiError && <p style={{ padding: '20px', color: '#e53e3e' }}>{apiError}</p>}

        {!loading && !apiError && (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>No Telepon</th>
                <th>Bergabung</th>
                <th>Kursus</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      {user.avatar ? (
                        <img
                          src={user.avatar} alt={user.name}
                          className="user-avatar"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                        />
                      ) : null}
                      <div
                        className="user-avatar-fallback"
                        style={{ display: user.avatar ? 'none' : 'flex' }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.joined}</td>
                  <td>{user.courses ?? 0}</td>
                  <td>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(user.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
