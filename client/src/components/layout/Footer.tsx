export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Nosotros</h3>
          <p>Somos una empresa comprometida con la formación vial, brindando calidad y cercanía en cada clase.</p>
        </div>
        <div className="footer-column">
          <h3>Enlaces útiles</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="mailto:autoescuelaangu@gmail.com">Correo</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/people/Autoescuela-Angu/61555003352827/" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/facebook.png" alt="Facebook" width="40" />
            </a>
            <a href="https://wa.me/+34658093420" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/whatsup.png" alt="WhatsApp" width="40" />
            </a>
            <a href="https://www.instagram.com/autoescuelaangu/" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/icon-instagram.webp" alt="Instagram" width="40" />
            </a>
            <a href="https://www.tiktok.com/@autoescuelaangu" target="_blank" rel="noreferrer">
              <img className="ticktok" src="https://autoescuelaangu.com/img/tiktok-logo3.png" alt="TikTok" />
            </a>
          </div>
        </div>
        <div className="footer-column" id="contacto">
          <h3>Ubicación</h3>
          <p>C/ Pozo amarguillo nº 5</p>
          <p>Sanlúcar de Barrameda, Cádiz</p>
          <a className="telefono" href="tel:+34658093420">Tel: 658 09 34 20</a>
        </div>
      </div>
      <p className="copyright">© 2025 Autoescuela Angu. Todos los derechos reservados.</p>
    </footer>
  );
}
