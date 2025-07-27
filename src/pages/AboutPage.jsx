import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa'
import Bas1 from '../assets/images/Bas1.jpg'
import Bas2 from '../assets/images/Bas2.jpg'
import './PageStyles/AboutPage.css'

const AboutPage = () => {
  return (
    <section className="about-container">
      <div className="about-content">
        <div className="about-images">
          <div className="image-wrapper">
            <img src={Bas1} alt="Chef portrait" className="about-img primary" />
          </div>
          <div className="image-wrapper secondary">
            <img src={Bas2} alt="Chef in the kitchen" className="about-img" />
          </div>
        </div>
        
        <div className="about-text">
          <div className="name-section">
            <h1 className="about-name">Bas van Kranen</h1>
            <div className="about-divider"></div>
          </div>
          
          <div className="description-section">
            <p className="about-description">
              Bas van Kranen's cooking is a journey — one rooted in respect for the land, the sea, and the hands that nurture them. His kitchen moves with the seasons, capturing fleeting moments through fresh, local ingredients sourced directly from farmers and fishermen who share his commitment to sustainability.
            </p>
            
            <p className="about-description">
              Beyond technique and taste, Bas creates a space where food becomes a language of connection — an invitation to explore, question, and grow together. With every dish, he opens a door to something greater: a shared love for honest flavors, thoughtful choices, and the endless possibilities that come from working in harmony with nature.
            </p>
          </div>
          
          <div className="about-social">
            <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://facebook.com/username" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage