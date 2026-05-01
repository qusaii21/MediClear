import { Link } from "react-router-dom"
import "../styles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-stethoscope"></i>
              <span>MediConnect</span>
            </div>
            <p>Centralized medical records with AI-driven insights for better healthcare management.</p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">HIPAA Compliance</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>
              123 Medical Plaza,
              <br />
              Healthcare District,
              <br />
              New York, NY 10001
            </p>
            <p>
              Email: info@mediconnect.com
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 MediConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

