function CourseCard({ course }) {
  const { image, title, description, mentorName, mentorRole, mentorCompany, mentorAvatar, rating, reviews, price } = course

  const fullStars = Math.floor(rating)
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)

  return (
    <div className="course-card">
      <div className="course-image">
        <img src={image} alt={title} />
      </div>

      <div className="course-body">
        <span className="title">{title}</span>
        <p>{description}</p>

        <div className="mentor">
          <img src={mentorAvatar} alt={mentorName} />
          <div>
            <strong>{mentorName}</strong>
            <span>
              {mentorRole} di <b>{mentorCompany}</b>
            </span>
          </div>
        </div>

        <div className="card-footer">
          <div className="rating">
            {stars} <span>{rating} ({reviews})</span>
          </div>
          <div className="price">{price}</div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
