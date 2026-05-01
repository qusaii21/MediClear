import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../styles/LandingPage.css"

function LandingPage() {
  return (
    <div className="page-container">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>
                  Your Health Records, <span>Unified</span>
                </h1>
                <p>
                  Centralized medical records with AI-driven insights. Connect with doctors, access your health data,
                  and take control of your healthcare journey.
                </p>
                <div className="hero-buttons">
                  <Link to="/signup" className="btn btn-primary">
                    Get Started
                  </Link>
                  <a href="#features" className="btn btn-secondary">
                    Learn More
                  </a>
                </div>
                <div className="hero-features">
                  <div className="hero-feature">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure</span>
                  </div>
                  <div className="hero-feature">
                    <i className="fas fa-heartbeat"></i>
                    <span>AI-Powered</span>
                  </div>
                  <div className="hero-feature">
                    <i className="fas fa-file-medical"></i>
                    <span>Centralized</span>
                  </div>
                </div>
              </div>

              <div className="hero-image">
                <div className="dashboard-preview">
                  <div className="dashboard-header">
                    <div className="dashboard-logo">
                      <i className="fas fa-stethoscope"></i>
                      <div>
                        <h3>MediConnect</h3>
                        <p>Healthcare Platform</p>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-chart">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="dashboard-stats">
                    <div className="stat-card">
                      <div className="stat-label">Prescriptions</div>
                      <div className="stat-value">12</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Reports</div>
                      <div className="stat-value">8</div>
                    </div>
                  </div>
                  <div className="dashboard-appointment">
                    <div className="appointment-indicator"></div>
                    <span>Next Appointment: Today, 3:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Features</div>
              <h2 className="section-title">Everything You Need in One Place</h2>
              <p className="section-subtitle">
                Our platform provides a comprehensive solution for managing your healthcare journey with advanced
                features and AI-driven insights.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-medical"></i>
                </div>
                <h3>Centralized Records</h3>
                <p>Store all your medical records in one secure location, accessible anytime.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h3>AI-Powered Insights</h3>
                <p>Get simplified explanations of your prescriptions and medical reports.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <h3>Blockchain Security</h3>
                <p>Your records are secured with blockchain technology for tamper-proof auditing.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-comment-medical"></i>
                </div>
                <h3>Smart Chatbot</h3>
                <p>Get answers to your health queries based on your medical history.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <h3>Doctor Connectivity</h3>
                <p>Connect with healthcare providers for consultations and follow-ups.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3>Appointment Management</h3>
                <p>Schedule and manage your medical appointments with ease.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Our platform simplifies healthcare management in just a few steps</p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Create Your Account</h3>
                  <p>Sign up as a patient or doctor and complete your profile</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Connect Your Records</h3>
                  <p>Upload existing medical records or connect with your healthcare providers</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Get AI Insights</h3>
                  <p>Receive simplified explanations of your medical data and personalized recommendations</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Manage Your Health</h3>
                  <p>Schedule appointments, chat with doctors, and take control of your healthcare journey</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to take control of your healthcare?</h2>
              <p>Join thousands of patients and doctors already using MediConnect</p>
              <Link to="/signup" className="btn btn-primary">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage

