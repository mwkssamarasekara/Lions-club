import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="/assets/img/logo.png" alt="Lions Diamonds Homagama" />
            <p>Lions Diamonds Homagama is committed to serving the community through volunteer programs, charitable donations, and impactful projects.</p>
            <div class="footer-social">
              <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div class="footer-links">
              <Link href="/about"><i class="fa-solid fa-chevron-right"></i> About Us</Link>
              <Link href="/projects"><i class="fa-solid fa-chevron-right"></i> Projects</Link>
              <Link href="/gallery"><i class="fa-solid fa-chevron-right"></i> Gallery</Link>
              <Link href="/contact"><i class="fa-solid fa-chevron-right"></i> Contact</Link>
            </div>
          </div>
          <div>
            <h4>Get Involved</h4>
            <div class="footer-links">
              <Link href="/join"><i class="fa-solid fa-chevron-right"></i> Join Us</Link>
              <Link href="/donate"><i class="fa-solid fa-chevron-right"></i> Donate</Link>
              <Link href="/projects"><i class="fa-solid fa-chevron-right"></i> Volunteer</Link>
              <Link href="/dashboard/login"><i class="fa-solid fa-chevron-right"></i> Admin Login</Link>
            </div>
          </div>
          <div>
            <h4>Contact Us</h4>
            <div class="footer-links">
              <a href="tel:+94771234567"><i class="fa-solid fa-phone"></i> +94 77 671 9921</a>
              <a href="mailto:lionsdiamondshomagama@gmail.com"><i class="fa-solid fa-envelope"></i> lionsdiamondshomagama@gmail.com</a>
              <a href="#"><i class="fa-solid fa-location-dot"></i>119/1,Gogadama, Homagama, Sri Lanka</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Zettachyper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
