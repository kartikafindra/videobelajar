function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-box">
        <span className="newsletter-label">NEWSLETTER</span>
        <span className="newsletter-title">Mau Belajar Lebih Banyak?</span>
        <span className="newsletter-desc">
          Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program-program terbaik hariesok.id
        </span>

        <div className="newsletter-form">
          <input placeholder="Masukkan Emailmu" />
          <button>Subscribe</button>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
