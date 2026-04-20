export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img
                className="footer-logo-img"
                src="https://autoescuelaangu.com/img/logo.jpg"
                alt="Logo Autoescuela Angu"
              />
              <span className="footer-logo-name">Autoescuela Angu</span>
            </div>
            <p className="footer-tagline">
              Formación vial de calidad en Sanlúcar de Barrameda. Contigo desde el primer día hasta el carnet.
            </p>
          </div>

          <div>
            <p className="footer-col-title">Navegación</p>
            <ul className="footer-col-list">
              <li><a href="/">Inicio</a></li>
              <li><a href="/courses">Cursos</a></li>
              <li><a href="/register">Registrarse</a></li>
              <li><a href="mailto:autoescuelaangu@gmail.com">Correo</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Síguenos</p>
            <div className="footer-social-row">
              <a
                className="footer-social-link"
                href="https://www.facebook.com/people/Autoescuela-Angu/61555003352827/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img src="https://autoescuelaangu.com/img/facebook.png" alt="Facebook" />
              </a>
              <a
                className="footer-social-link"
                href="https://wa.me/+34658093420"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <img src="https://autoescuelaangu.com/img/whatsup.png" alt="WhatsApp" />
              </a>
              <a
                className="footer-social-link"
                href="https://www.instagram.com/autoescuelaangu/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <img src="https://autoescuelaangu.com/img/icon-instagram.webp" alt="Instagram" />
              </a>
              <a
                className="footer-social-link"
                href="https://www.tiktok.com/@autoescuelaangu"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <img src="https://autoescuelaangu.com/img/tiktok-logo3.png" alt="TikTok" />
              </a>
            </div>
          </div>

          <div id="contacto">
            <p className="footer-col-title">Ubicación</p>
            <p className="footer-col-text">C/ Pozo Amarguillo nº 5</p>
            <p className="footer-col-text">Sanlúcar de Barrameda, Cádiz</p>
            <a className="footer-phone" href="tel:+34658093420">
              📞 658 09 34 20
            </a>
          </div>
        </div>

        <div className="footer-divider" />
        <p className="footer-copy">© 2025 Autoescuela Angu. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
