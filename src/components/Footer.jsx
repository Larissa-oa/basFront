import React, { useState } from 'react'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../config/api.js'
import './ComponentsStyles/Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, {
        email: email.trim()
      })

      setMessage(response.data.message || 'Successfully subscribed to newsletter!')
      setMessageType('success')
      setEmail('')
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 5000)

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage(
        error.response?.data?.message || 'Failed to subscribe. Please try again.'
      )
      setMessageType('error')
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Main Footer Grid */}
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h3>Bas van Kranen</h3>
            <p>Through technique, creativity, and respect for the product, we source responsibly and cook with integrity to bring out each ingredient's full potential.</p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Personal</h4>
            <ul className="footer-list">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/recipes" className="footer-link">Food Journal</Link></li>
              <li><a href="mailto:info@restaurantflore.com" className="footer-link">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Restaurant Flore</h4>
            <ul className="footer-list">
              <li>
                <a href="https://restaurantflore.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </li>
              <li>
                <a href="https://www.sevenrooms.com/explore/restaurantflore/reservations/create/search?lang=en&tracking=flore-website" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Reservations
                </a>
              </li>
              <li>
                <a href="https://restaurantflore.com/#menus" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Menu
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Follow</h4>
            <div className="footer-social">
              <a href="https://instagram.com/basvankranen" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com/in/basvankranen" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-wrapper">
            <span className="newsletter-label">Newsletter</span>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="newsletter-button" disabled={loading}>
                {loading ? '...' : '→'}
              </button>
            </form>
            {message && (
              <div className={`newsletter-message ${messageType}`}>
                {message}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bas van Kranen — Amsterdam, NL</p>
      </div>
    </footer>
  )
}

export default Footer
