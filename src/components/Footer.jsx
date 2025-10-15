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
              disabled={loading}
            />
            <button type="submit" className="newsletter-button" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {message && (
            <div className={`newsletter-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Personal</h4>
          <ul className="footer-list">
            <li><Link to="/about" className="footer-link">About</Link></li>
            <li><a href="mailto:info@restaurantflore.com" className="footer-link">Contact Bas</a></li>
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
              <a href="https://www.sevenrooms.com/explore/restaurantflore/reservations/create/search?lang=en&tracking=flore-website" className="footer-link" target="_blank" rel="noopener noreferrer">
                Reservations
              </a>
            </li>
            <li>
              <a href="https://restaurantflore.com/#menus" className="footer-link" target="_blank" rel="noopener noreferrer">
                Explore Menu
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
