import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import "./PageStyles/FlorePage.css";

import imgFlore from "../assets/images/flore.jpg";
import imgRest from "../assets/images/restaurant.jpg";
import imgDining from "../assets/images/dining.jpg";
import accoladesBackground from "../assets/images/florebackground.jpg";
import gaultMillau from '../assets/images/gm.png';
import michelin from '../assets/images/michelin.png';
import wineSpectator from '../assets/images/wineS.png';
import starWineList from '../assets/images/swl.png';
import wereSmart from '../assets/images/ws.png';
import eat360 from '../assets/images/360.png';

const accolades = [
  { image: gaultMillau, alt: "Gault Millau", link: 'https://www.gault-millau.nl/en/restaurants/flore-amsterdam' },
  { image: michelin, alt: "Michelin", link: 'https://guide.michelin.com/en/noord-holland/amsterdam/restaurant/flore' },
  { image: wineSpectator, alt: "Wine Spectator", link: 'https://www.winespectator.com/articles/restaurant-spotlight-flore-amsterdam' },
  { image: wereSmart, alt: "We're Smart", link: 'https://weresmartworld.com/we-re-smart-green-guide/flore' },
  { image: eat360, alt: "Eat 360", link: 'https://360eatguide.com/restaurants/flore/' },
];

const FlorePage = () => {
  const [scrollDirection, setScrollDirection] = useState(0)
  const lastScrollY = useRef(0)
  const accoladesSlide = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Determine scroll direction
      const direction = scrollY > lastScrollY.current ? 1 : -1
      setScrollDirection(direction)
      lastScrollY.current = scrollY

      // Smooth path line animation
      const pathLine = document.querySelector('.flore-path-line')
      if (pathLine) {
        const pathProgress = Math.min(scrollY / (document.documentElement.scrollHeight - windowHeight), 1)
        // Smoother easing function for more fluid movement
        const smoothProgress = pathProgress < 0.5 
          ? 2 * pathProgress * pathProgress 
          : 1 - Math.pow(-2 * pathProgress + 2, 3) / 2
        pathLine.style.height = `${smoothProgress * 100}%`
      }

      // Control accolades slider based on scroll direction
      if (accoladesSlide.current && !isDragging.current) {
        const currentTransform = accoladesSlide.current.style.transform || 'translateX(0px)'
        const currentX = parseFloat(currentTransform.match(/-?\d+\.?\d*/)?.[0] || 0)
        const newX = currentX + (direction * 5) // Increased from 2px to 5px for faster movement
        
        accoladesSlide.current.style.transform = `translateX(${newX}px)`
      }
    }

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [])

  // Drag/Swipe functionality
  useEffect(() => {
    const slider = accoladesSlide.current
    if (!slider) return

    // Ensure slider starts visible at initial position
    slider.style.transform = 'translateX(0px)'

    const handleMouseDown = (e) => {
      isDragging.current = true
      slider.style.cursor = 'grabbing'
      startX.current = e.pageX || e.touches?.[0]?.pageX
      const currentTransform = slider.style.transform || 'translateX(0px)'
      scrollLeft.current = parseFloat(currentTransform.match(/-?\d+\.?\d*/)?.[0] || 0)
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      e.preventDefault()
      const x = e.pageX || e.touches?.[0]?.pageX
      const walk = (x - startX.current) * 1.5 // Multiply for faster drag
      slider.style.transform = `translateX(${scrollLeft.current + walk}px)`
    }

    const handleMouseUp = () => {
      isDragging.current = false
      slider.style.cursor = 'grab'
    }

    // Mouse events
    slider.addEventListener('mousedown', handleMouseDown)
    slider.addEventListener('mousemove', handleMouseMove)
    slider.addEventListener('mouseup', handleMouseUp)
    slider.addEventListener('mouseleave', handleMouseUp)

    // Touch events
    slider.addEventListener('touchstart', handleMouseDown, { passive: false })
    slider.addEventListener('touchmove', handleMouseMove, { passive: false })
    slider.addEventListener('touchend', handleMouseUp)

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown)
      slider.removeEventListener('mousemove', handleMouseMove)
      slider.removeEventListener('mouseup', handleMouseUp)
      slider.removeEventListener('mouseleave', handleMouseUp)
      slider.removeEventListener('touchstart', handleMouseDown)
      slider.removeEventListener('touchmove', handleMouseMove)
      slider.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  return (
    <section className="flore-page">
      {/* Path Line */}
      <div className="flore-path-line"></div>
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-image">
          <img src={imgFlore} alt="Flore dining room" />
          <div className="hero-overlay"></div>
          <div className="hero-text">
            <h1>Restaurant Flore</h1>
            <p>
              Conscious fine dining inspired by Nordic minimalism and Japanese subtlety — celebrating the pure essence of responsibly sourced Dutch ingredients.
            </p>
            <div className="hero-actions">
              <button className="primary-button">
                <a href="https://www.sevenrooms.com/explore/restaurantflore/reservations/create/search?lang=en&tracking=flore-website" target="_blank" rel="noopener noreferrer">
                  Reserve Table
                </a>
              </button>
              <button className="secondary-button">
                <a href="https://restaurantflore.com/#menus" target="_blank" rel="noopener noreferrer">
                  Explore Menu
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="philosophy-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Our Philosophy</span>
            <h2>Conscious Fine Dining</h2>
          </div>
          <div className="philosophy-content">
            <div className="philosophy-text">
              <blockquote>
                "At Flore, we believe in conscious fine dining, with a strong focus on Dutch micro-seasonality. We carefully select vegetables grown slowly for taste, foraged local ingredients, sustainable line-caught fish, and responsibly farmed animals. In our kitchen, every ingredient is presented at its best, capturing its purest essence while respecting its true nature. Through technique, creativity, and respect for the product, we source responsibly and cook with integrity to bring out each ingredient's full potential. Our kitchen is a place of continuous discovery, where we ferment, preserve, and innovate."
              </blockquote>
              <cite>— Bas van Kranen, Head Chef</cite>
            </div>
          </div>
        </div>
      </div>

      {/* Dining Spaces Section */}
      <div className="dining-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Dining Spaces</span>
            <h2>Intimate Experiences</h2>
          </div>
          
          <div className="dining-grid">
            <div className="dining-card">
              <div className="card-image">
                <img src={imgDining} alt="Main dining room" />
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="capacity">34 Guests</span>
                  <span className="tables">11 Tables</span>
                </div>
                <h3>The Main Dining Room</h3>
                <p>Our intimate dining room offers comfort and character, seating up to 34 guests with beautiful views over the heart of Amsterdam.</p>
              </div>
            </div>

            <div className="dining-card">
              <div className="card-image">
                <img src={imgRest} alt="Kitchen table" />
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="capacity">10 Seats</span>
                  <span className="experience">Chef's Table</span>
                </div>
                <h3>The Kitchen Table</h3>
                <p>With 10 seats right by the kitchen, our Kitchen Table offers a unique experience. Book it privately for 8–10 guests or join others for an unforgettable shared meal.</p>
              </div>
            </div>
          </div>
          <div className="accolades-container" style={{
            backgroundImage: `url(${accoladesBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
            <div className="accolades-track">
              <div className="accolades-slide" ref={accoladesSlide}>
                {accolades.map((accolade, index) => (
                  <a 
                    key={index} 
                    href={accolade.link} 
                    className="accolade-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img src={accolade.image} alt={accolade.alt} className="accolade-img" />
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {accolades.map((accolade, index) => (
                  <a 
                    key={`duplicate-${index}`} 
                    href={accolade.link} 
                    className="accolade-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img src={accolade.image} alt={accolade.alt} className="accolade-img" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlorePage;