import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/img/logo.png" alt="Lions Club of Homagama Diamonds" />
            <p>Lions Club of Homagama Diamonds is committed to serving the community through volunteer programs, charitable donations, and impactful humanitarian projects.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link href="/about"><i className="fa-solid fa-chevron-right"></i> About Us</Link>
              <Link href="/projects"><i className="fa-solid fa-chevron-right"></i> Projects</Link>
              <Link href="/short-videos"><i className="fa-solid fa-video"></i> Short Videos</Link>
              <Link href="/gallery"><i className="fa-solid fa-chevron-right"></i> Gallery</Link>
              <Link href="/contact"><i className="fa-solid fa-chevron-right"></i> Contact</Link>
            </div>
          </div>
          <div>
            <h4>Get Involved</h4>
            <div className="footer-links">
              <Link href="/join"><i className="fa-solid fa-chevron-right"></i> Join Us</Link>
              <Link href="/donate"><i className="fa-solid fa-chevron-right"></i> Donate</Link>
              <Link href="/projects"><i className="fa-solid fa-chevron-right"></i> Volunteer</Link>
              <Link href="/dashboard/login"><i className="fa-solid fa-chevron-right"></i> Admin Login</Link>
            </div>
          </div>
          <div>
            <h4>Contact Us</h4>
            <div className="footer-links">
              <a href="tel:+94776719921"><i className="fa-solid fa-phone"></i> +94 77 671 9921</a>
              <a href="mailto:lionsdiamondshomagama@gmail.com"><i className="fa-solid fa-envelope"></i> lionsdiamondshomagama@gmail.com</a>
              <a href="#"><i className="fa-solid fa-location-dot"></i> 119/1, Godagama, Homagama, Sri Lanka</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lions Club of Homagama Diamonds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
