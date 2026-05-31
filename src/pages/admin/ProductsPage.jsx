import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchCourses,
  addCourse,
  editCourse,
  removeCourse,
} from '../../store/redux/slices/coursesSlice'
import axiosInstance from '../../services/api/axiosInstance'

const INITIAL_FORM = {
  judulProduk: '',
  subJudul: '',
  harga: '',
  roleMentor: '',
  deskripsi: '',
  namaMentor: '',
  urlFotoMentor: '',
  urlFotoProduk: '',
}

export default function ProductsPage() {
  const dispatch = useDispatch()

  //Read from Redux state 
  const products = useSelector((state) => state.courses.items)
  const loading = useSelector((state) => state.courses.loading)
  const error = useSelector((state) => state.courses.error)

  const [form, setForm] = useState(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const fileInputRef = useRef(null)

  // GET: fetch all products from API → store in Redux
  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = `http://localhost:3000${res.data.data.url}`
      setForm((prev) => ({ ...prev, urlFotoProduk: url }))
      setPhotoPreview(url)
    } catch {
      alert('Gagal upload foto. Coba lagi.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  function validate() {
    const errs = {}
    if (!form.judulProduk.trim()) errs.judulProduk = 'Judul produk wajib diisi'
    if (!form.harga.trim()) errs.harga = 'Harga wajib diisi'
    else if (isNaN(Number(form.harga))) errs.harga = 'Harga harus berupa angka'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    setSubmitting(true)
    try {
      const payload = { ...form, harga: Number(form.harga) }

      if (editingId) {
        // EDIT: update via API → update Redux state
        await dispatch(editCourse({ id: editingId, payload })).unwrap()
        setSuccessMsg('Produk berhasil diperbarui!')
        setEditingId(null)
      } else {
        // ADD: post to API → prepend to Redux state 
        await dispatch(addCourse(payload)).unwrap()
        setSuccessMsg('Produk berhasil ditambahkan!')
      }

      setForm(INITIAL_FORM)
      setFormErrors({})
      setPhotoPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      // error already in Redux state via rejected case
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setForm({
      judulProduk: product.judulProduk || '',
      subJudul: product.subJudul || '',
      harga: String(product.harga || ''),
      roleMentor: product.roleMentor || '',
      deskripsi: product.deskripsi || '',
      namaMentor: product.namaMentor || '',
      urlFotoMentor: product.urlFotoMentor || '',
      urlFotoProduk: product.urlFotoProduk || '',
    })
    setPhotoPreview(product.urlFotoProduk || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(INITIAL_FORM)
    setFormErrors({})
    setPhotoPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus produk ini?')) return
    // ── DELETE: delete via API → remove from Redux state ──
    dispatch(removeCourse(id))
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Products</h1>
      <p className="admin-page-subtitle">Kelola produk video pembelajaran.</p>

      {/* ── Form ── */}
      <div className="product-form-card" style={{ marginBottom: 28 }}>
        <h2 className="form-section-title">
          {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>

        {successMsg && <div className="alert alert--success">{successMsg}</div>}
        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="judulProduk">Judul Produk <span className="required">*</span></label>
              <input
                id="judulProduk" name="judulProduk" type="text"
                placeholder="Masukkan judul produk"
                value={form.judulProduk} onChange={handleChange}
                className={formErrors.judulProduk ? 'input-error' : ''}
              />
              {formErrors.judulProduk && <p className="error-msg">{formErrors.judulProduk}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="subJudul">Sub-Judul</label>
              <input
                id="subJudul" name="subJudul" type="text"
                placeholder="Masukkan sub-judul"
                value={form.subJudul} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="harga">Harga (IDR) <span className="required">*</span></label>
              <input
                id="harga" name="harga" type="text"
                placeholder="Contoh: 150000"
                value={form.harga} onChange={handleChange}
                className={formErrors.harga ? 'input-error' : ''}
              />
              {formErrors.harga && <p className="error-msg">{formErrors.harga}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="roleMentor">Role Mentor</label>
              <input
                id="roleMentor" name="roleMentor" type="text"
                placeholder="Contoh: Senior Frontend Developer"
                value={form.roleMentor} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi" name="deskripsi" rows={4}
              placeholder="Tuliskan deskripsi produk"
              value={form.deskripsi} onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="namaMentor">Nama Mentor</label>
              <input
                id="namaMentor" name="namaMentor" type="text"
                placeholder="Masukkan nama mentor"
                value={form.namaMentor} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="urlFotoMentor">URL Foto Mentor</label>
              <input
                id="urlFotoMentor" name="urlFotoMentor" type="url"
                placeholder="https://example.com/avatar-mentor.jpg"
                value={form.urlFotoMentor} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fotoProduk">Foto Produk</label>
            {/* Upload file  */}
            <input
              id="fotoProduk"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
            />
            {uploadingPhoto && <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Mengupload foto...</p>}
            {photoPreview && (
              <img
                src={photoPreview}
                alt="preview"
                style={{ marginTop: 8, width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }}
              />
            )}
            {/* URL Foto Produk (input manual) */}
            {/* <input
              id="urlFotoProduk" name="urlFotoProduk" type="url"
              placeholder="https://example.com/cover-kelas.jpg"
              value={form.urlFotoProduk} onChange={handleChange}
            /> */}
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-tambah" disabled={submitting}>
              {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Product List — data from useSelector ── */}
      <div className="users-table-card">
        <div className="users-table-header">
          <span className="users-table-count">{products.length} produk terdaftar</span>
        </div>

        {loading ? (
          <p className="table-loading">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="table-loading">Belum ada produk.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Judul</th>
                <th>Mentor</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.urlFotoProduk ? (
                      <img
                        src={product.urlFotoProduk}
                        alt={product.judulProduk}
                        className="user-avatar"
                        style={{ borderRadius: 6 }}
                      />
                    ) : (
                      <div className="user-avatar-fallback" style={{ display: 'flex', borderRadius: 6 }}>
                        {product.judulProduk?.[0] || '?'}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{product.judulProduk}</div>
                    {product.subJudul && <div style={{ fontSize: 12, color: '#888' }}>{product.subJudul}</div>}
                  </td>
                  <td>
                    <div>{product.namaMentor || '-'}</div>
                    {product.roleMentor && <div style={{ fontSize: 12, color: '#888' }}>{product.roleMentor}</div>}
                  </td>
                  <td>Rp {Number(product.harga).toLocaleString('id-ID')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(product.id)}>Hapus</button>
                    </div>
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
