import logo from '../assets/images/logo.svg'
import linkedin from '../assets/icons/linkedin.svg'
import facebook from '../assets/icons/facebook.svg'
import ig from '../assets/icons/ig.svg'
import twitter from '../assets/icons/twitter.svg'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src={logo} alt="Logo" />
          <p className="desc">
            Gali Potensi Anda Melalui Pembelajaran
            Video di hariesok.id!
          </p>
          <p className="address">
            Jl. Usman Effendi No. 50 Lowokwaru, Malang<br />
            +62-877-7123-1234
          </p>
        </div>

        <div className="footer-links">
          <div>
            <b>Kategori</b>
            <span>Digital &amp; Teknologi</span>
            <span>Pemasaran</span>
            <span>Manajemen Bisnis</span>
            <span>Pengembangan Diri</span>
            <span>Desain</span>
          </div>

          <div>
            <b>Perusahaan</b>
            <span>Tentang Kami</span>
            <span>FAQ</span>
            <span>Kebijakan Privasi</span>
            <span>Ketentuan Layanan</span>
            <span>Bantuan</span>
          </div>

          <div>
            <b>Komunitas</b>
            <span>Tips Sukses</span>
            <span>Blog</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2023 Gerobak Sayur All Rights Reserved.</p>
        <div className="socials">
          <img src={linkedin} alt="LinkedIn" />
          <img src={facebook} alt="Facebook" />
          <img src={ig} alt="Instagram" />
          <img src={twitter} alt="Twitter" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
