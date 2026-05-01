"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Header.css"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <i className="fas fa-stethoscope"></i>
              <span>MediConnect</span>
            </Link>
          </div>

          <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </nav>

          <div className="menu-toggle" onClick={toggleMenu}>
            <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

