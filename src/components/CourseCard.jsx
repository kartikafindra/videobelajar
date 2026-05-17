function CourseCard({ course }) {
  const {
    urlFotoProduk,
    urlFotoMentor,
    judulProduk,
    deskripsi,
    namaMentor,
    roleMentor,
    rating = 0,
    reviews = 0,
    harga,
  } = course

  const fullStars = Math.floor(rating)
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)

  const formattedPrice = harga
    ? 'Rp ' + Number(harga).toLocaleString('id-ID')
    : 'Gratis'

  const initials = namaMentor
    ? namaMentor.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="course-card">
      <div className="course-image">
        {urlFotoProduk ? (
          <img src={urlFotoProduk} alt={judulProduk} />
        ) : (
          <div className="course-image-placeholder">{judulProduk?.[0] || '?'}</div>
        )}
      </div>

      <div className="course-body">
        <span className="title">{judulProduk}</span>
        <p>{deskripsi}</p>

        <div className="mentor">
          {urlFotoMentor ? (
            <img src={urlFotoMentor} alt={namaMentor} />
          ) : (
            <div className="mentor-avatar-fallback">{initials}</div>
          )}
          <div>
            <strong>{namaMentor}</strong>
            <span>{roleMentor}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="rating">
            {stars} <span>{rating} ({reviews})</span>
          </div>
          <div className="price">{formattedPrice}</div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
