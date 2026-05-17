import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import Newsletter from '../components/Newsletter'
import NotesSection from '../components/NotesSection'
import { fetchCourses } from '../store/redux/slices/coursesSlice'
import { useAuth } from '../context/AuthContext'
import '../style/homepage.css'

const TABS = ['Semua Kelas', 'Pemasaran', 'Desain', 'Pemrograman', 'Data', 'Keuangan', 'Manajemen', 'Kreatif', 'Soft Skill']

function HomePage() {
  const [activeTab, setActiveTab] = useState('Semua Kelas')
  const [apiTestResult, setApiTestResult] = useState('')
  const [apiTestLoading, setApiTestLoading] = useState(false)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function handleTestApi() {
    setApiTestLoading(true)
    setApiTestResult('')
    try {
      const res = await fetch('https://stg-ai-analyzer.rmb-lab.jp/api/l?id=wcae782e7-5ad8-4580-bb05-29e5c575e1e3')
      setApiTestResult(`✓ Success — Status: ${res.status} ${res.statusText}`)
    } catch (err) {
      setApiTestResult(`✗ Failed — ${err.message}`)
    } finally {
      setApiTestLoading(false)
    }
  }


  const courses = useSelector((state) => state.courses.items)
  const loading = useSelector((state) => state.courses.loading)
  const error = useSelector((state) => state.courses.error)

  useEffect(() => {
    if (courses.length === 0) dispatch(fetchCourses())
  }, [dispatch, courses.length])

  const filtered = (activeTab === 'Semua Kelas'
    ? courses
    : courses.filter(c => c.category === activeTab)).slice(0, 6)

  return (
    <>
      <Header showMenu />

      <section className="hero">
        <div className="hero-overlay">
          <h1>
            Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video
            Interaktif!
          </h1>
          <p>
            Temukan ilmu baru yang menarik dan mendalam melalui koleksi video
            pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat
            berpartisipasi dalam latihan interaktif yang akan meningkatkan
            pemahaman Anda.
          </p>
          <button>Temukan Video Course untuk Dipelajari!</button>
        </div>
      </section>

      <section className="course-section">
        <div className="section-head">
          <h2>Koleksi Video Pembelajaran Unggulan</h2>
          <p>Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!</p>
        </div>

        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p className="courses-status">Memuat kelas...</p>}
        {error && <p className="courses-status courses-error">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="courses-status">Tidak ada kelas untuk kategori ini.</p>
        )}

        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="see-all-wrapper">
          <button className="btn-see-all" onClick={() => navigate('/products')}>
            Lihat Semua Produk
          </button>
        </div>
      </section>

      {isLoggedIn && <NotesSection />}

      <div style={{ padding: '0 120px 40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
        <button
          onClick={handleTestApi}
          disabled={apiTestLoading}
          style={{
            background: '#3ecf4c',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: apiTestLoading ? 'not-allowed' : 'pointer',
            opacity: apiTestLoading ? 0.7 : 1,
          }}
        >
          {apiTestLoading ? 'Testing...' : 'Test Call API'}
        </button>
        {apiTestResult && (
          <p style={{
            fontSize: 13,
            color: apiTestResult.startsWith('✓') ? '#15803d' : '#e53e3e',
            background: apiTestResult.startsWith('✓') ? '#dcfce7' : '#ffe4e4',
            border: `1px solid ${apiTestResult.startsWith('✓') ? '#86efac' : '#fca5a5'}`,
            borderRadius: 8,
            padding: '8px 14px',
            margin: 0,
          }}>
            {apiTestResult}
          </p>
        )}
      </div>

      <Newsletter />
      <Footer />
    </>
  )
}

export default HomePage
