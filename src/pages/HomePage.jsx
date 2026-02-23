import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import Newsletter from '../components/Newsletter'
import { courses } from '../data/courses'
import '../style/homepage.css'

const TABS = ['Semua Kelas', 'Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis']

function HomePage() {
  const [activeTab, setActiveTab] = useState('Semua Kelas')

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

        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  )
}

export default HomePage
