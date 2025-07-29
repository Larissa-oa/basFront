import React, { useState } from 'react'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './ComponentsStyles/Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h3>Bas van Kranen</h3>
          <p>Celebrating Dutch gastronomy through precision, creativity, and an unwavering commitment to excellence. Where tradition meets innovation in every carefully crafted dish.</p>
          
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Personal</h4>
          <ul className="footer-list">
            <li><Link to="/about" className="footer-link">About</Link></li>
            <li><a href="mailto:info@restaurantflore.com" className="footer-link">Contact Bas</a></li>
            <li><Link to="/journal" className="footer-link">Journal</Link></li>
            <li><Link to="/recipes" className="footer-link">Recipes</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Restaurant</h4>
          <ul className="footer-list">
            <li>
              <a href="https://restaurantflore.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </li>
            <li>
              <a href="https://restaurantflore.com/reservations" className="footer-link" target="_blank" rel="noopener noreferrer">
                Reservations
              </a>
            </li>
            <li>
              <a href="mailto:info@restaurantflore.com" className="footer-link">
                Contact Flore
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Connect</h4>
          <div className="footer-social">
            <a href="https://instagram.com/basvankranen" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/in/basvankranen" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bas van Kranen. Crafted with care in Amsterdam.</p>
      </div>
    </footer>
  )
}

export default Footer
