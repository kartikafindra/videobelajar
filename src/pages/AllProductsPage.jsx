import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProducts } from '../services/api/productService'
import '../style/allproducts.css'

const CATEGORIES = ['Semua', 'Pemasaran', 'Desain', 'Pemrograman', 'Data', 'Keuangan', 'Manajemen', 'Kreatif', 'Soft Skill']
const DURATIONS = ['Kurang dari 4 Jam', '4 - 8 Jam', 'Lebih dari 8 Jam']
const SORT_OPTIONS = ['Harga Rendah', 'Harga Tinggi', 'A to Z', 'Z to A', 'Rating Tertinggi', 'Rating Terendah']
const PER_PAGE = 6

function StarRating({ rating }) {
  return (
    <span className="ap-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.floor(rating) ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  )
}

export default function AllProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedDurations, setSelectedDurations] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Harga Rendah')
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const sortRef = useRef(null)

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(() => setError('Gagal memuat produk.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  function toggleCategory(cat) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }

  function handleReset() {
    setSelectedCategories([])
    setSelectedDurations([])
    setSearch('')
    setSort('Harga Rendah')
    setPage(1)
  }

  // filter
  let filtered = products.filter(p => {
    const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category)
    const matchSearch = !search || p.judulProduk?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Harga Rendah') return a.harga - b.harga
    if (sort === 'Harga Tinggi') return b.harga - a.harga
    if (sort === 'A to Z') return a.judulProduk?.localeCompare(b.judulProduk)
    if (sort === 'Z to A') return b.judulProduk?.localeCompare(a.judulProduk)
    if (sort === 'Rating Tertinggi') return b.rating - a.rating
    if (sort === 'Rating Terendah') return a.rating - b.rating
    return 0
  })

  // paginate
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <Header showMenu />

      <div className="ap-wrapper">
        <div className="ap-heading">
          <h1>Koleksi Video Pembelajaran Unggulan</h1>
          <p>Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!</p>
        </div>

        <div className="ap-body">
          {/* ── Sidebar Filter ── */}
          <aside className="ap-sidebar">
            <div className="ap-filter-header">
              <span>Filter</span>
              <button className="ap-reset" onClick={handleReset}>Reset</button>
            </div>

            {/* Bidang Studi */}
            <div className="ap-filter-group">
              <div className="ap-filter-group-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22a72a" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                Bidang Studi
              </div>
              {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                <label key={cat} className="ap-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="ap-checkbox-custom" />
                  {cat}
                </label>
              ))}
            </div>

            {/* Harga */}
            <div className="ap-filter-group">
              <div className="ap-filter-group-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22a72a" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                Harga
              </div>
              {['Gratis', 'Berbayar'].map(opt => (
                <label key={opt} className="ap-checkbox-label">
                  <input type="checkbox" />
                  <span className="ap-checkbox-custom" />
                  {opt}
                </label>
              ))}
            </div>

            {/* Durasi */}
            <div className="ap-filter-group">
              <div className="ap-filter-group-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22a72a" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Durasi
              </div>
              {DURATIONS.map(dur => (
                <label key={dur} className="ap-radio-label">
                  <input
                    type="radio"
                    name="duration"
                    checked={selectedDurations.includes(dur)}
                    onChange={() => { setSelectedDurations([dur]); setPage(1) }}
                  />
                  <span className="ap-radio-custom" />
                  {dur}
                </label>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="ap-main">
            {/* Toolbar */}
            <div className="ap-toolbar">
              {/* Sort dropdown */}
              <div className="ap-sort-wrapper" ref={sortRef}>
                <button className="ap-sort-btn" onClick={() => setSortOpen(v => !v)}>
                  {sort}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {sortOpen && (
                  <div className="ap-sort-dropdown">
                    {SORT_OPTIONS.map(opt => (
                      <div
                        key={opt}
                        className={`ap-sort-option${sort === opt ? ' selected' : ''}`}
                        onClick={() => { setSort(opt); setSortOpen(false); setPage(1) }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="ap-search-wrapper">
                <input
                  type="text"
                  placeholder="Cari Kelas"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="ap-search"
                />
                <svg className="ap-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
            </div>

            {/* Grid */}
            {loading && <p className="ap-status">Memuat produk...</p>}
            {error && <p className="ap-status ap-error">{error}</p>}
            {!loading && !error && paginated.length === 0 && (
              <p className="ap-status">Tidak ada kelas yang sesuai.</p>
            )}

            <div className="ap-grid">
              {paginated.map(course => (
                <APCourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="ap-pagination">
                <button
                  className="ap-page-btn ap-page-nav"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`ap-page-btn${page === n ? ' active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="ap-page-btn ap-page-nav"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

function APCourseCard({ course }) {
  const {
    urlFotoProduk, urlFotoMentor,
    judulProduk, deskripsi,
    namaMentor, roleMentor,
    rating = 0, reviews = 0,
    harga, hargaDiskon,
  } = course

  const initials = namaMentor
    ? namaMentor.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const formattedPrice = 'Rp ' + Number(harga).toLocaleString('id-ID')
  const formattedDiskon = hargaDiskon
    ? 'Rp ' + Number(hargaDiskon).toLocaleString('id-ID')
    : null

  return (
    <div className="ap-card">
      <div className="ap-card-image">
        {urlFotoProduk
          ? <img src={urlFotoProduk} alt={judulProduk} />
          : <div className="ap-card-img-placeholder">{judulProduk?.[0] || '?'}</div>
        }
      </div>
      <div className="ap-card-body">
        <p className="ap-card-title">{judulProduk}</p>
        <p className="ap-card-desc">{deskripsi}</p>

        <div className="ap-card-mentor">
          {urlFotoMentor
            ? <img src={urlFotoMentor} alt={namaMentor} className="ap-card-avatar" />
            : <div className="ap-card-avatar-fallback">{initials}</div>
          }
          <div>
            <p className="ap-card-mentor-name">{namaMentor}</p>
            <p className="ap-card-mentor-role">{roleMentor}</p>
          </div>
        </div>

        <div className="ap-card-footer">
          <div className="ap-card-rating">
            <StarRating rating={rating} />
            <span className="ap-card-rating-text">{rating} ({reviews})</span>
          </div>
          <div className="ap-card-price">
            {formattedDiskon && <span className="ap-price-original">{formattedPrice}</span>}
            <span className="ap-price-final">{formattedDiskon || formattedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
