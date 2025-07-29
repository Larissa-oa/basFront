import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import JournalSlider from '../components/JournalSlider';
import RecipeSlider from '../components/RecipeSlider';
import ScrollEffects from '../components/ScrollEffects';
import image6 from '../assets/images/image6.jpg';
import image7 from '../assets/images/image7.jpg';
import image8 from '../assets/images/image8.jpg';
import flore from '../assets/images/flore.jpg';
import restaurant from '../assets/images/restaurant.jpg';
import dining from '../assets/images/dining.jpg';
import observer from '../assets/images/observer.webp';
import dscene from '../assets/images/dscene.webp';
import flore3 from '../assets/images/flore3.webp';
import './PageStyles/HomePage.css';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFloreImage, setCurrentFloreImage] = useState(0);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  const heroImages = [image6, image7, image8];
  const floreImages = [flore, restaurant, dining];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Flore images auto-change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFloreImage((prev) => (prev + 1) % floreImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [floreImages.length]);

  const nextFloreImage = () => {
    setCurrentFloreImage((prev) => (prev + 1) % floreImages.length);
  };

  const prevFloreImage = () => {
    setCurrentFloreImage((prev) => (prev - 1 + floreImages.length) % floreImages.length);
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('.experiments') || document.querySelector('.showcase');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="homepage">
      {/* Scroll Effects Component */}
      <ScrollEffects />
      
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-slides">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${currentSlide === index ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
        </div>
        
        <div className="hero-overlay"></div>
        
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <h1 className="hero-title">
            Crafting the Future of Flavor
          </h1>
          </div>

        {/* Sleek Parallax Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line"></div>
        </div>

      </section>

      {/* Journal Slider Component */}
      <JournalSlider />

      {/* Main Content */}
      <main className="main-content">
        
        {/* Featured Showcase */}
        <section className="showcase">
          <div className="container">
            <div className="showcase-header">
              <p className="showcase-subtitle">Wanna get to know us better?</p>
            </div>
            <div className="showcase-grid">
              <div 
                className="showcase-item large"
                onClick={() => window.open('https://observer.com/2025/06/bas-van-kranen-flore-amsterdam-restaurant-vegetables-interview/', '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className="showcase-image">
                  <img src={observer} alt="Observer interview" />
                  <div className="showcase-overlay">
                    <h3>At Amsterdam's Flore, Bas van Kranen Puts Vegetables in the Fine Dining Spotlight</h3>
                    <p>Produce is the star of the show at Amsterdam's two-Michelin-starred Flore.</p>
                  </div>
                </div>
              </div>
              <div 
                className="showcase-item"
                onClick={() => window.open('https://www.designscene.net/2025/04/chef-bas-van-kranen.html', '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className="showcase-image">
                  <img src={dscene} alt="DSCENE interview" />
                  <div className="showcase-overlay">
                    <h3>Chef Bas van Kranen on Flore's Reinvention and the Future of Fine Dining</h3>
                    <p>DSCENE meets the chef behind Amsterdam's most thoughtful kitchen to talk preservation, space, and purpose.</p>
                  </div>
                </div>
              </div>
              <div 
                className="showcase-item"
                onClick={() => window.open('https://www.forbes.com/sites/rachel-dube/2025/07/18/bas-van-kranens-flore-intends-to-push-boundaries-in-every-way/', '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className="showcase-image">
                  <img src={flore3} alt="Forbes interview" />
                  <div className="showcase-overlay">
                    <h3>Bas Van Kranen's Flore Intends To Push Boundaries In Every Way</h3>
                    <p>FORBES - The chef wants to spark a larger conversation on awareness of what goes on in the dairy industry.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recipe Slider Component */}
        <RecipeSlider />

        {/* Flore Section */}
        <section className="section flore">
          <div className="container">
            <div className="flore-section">
              <div className="flore-content">
                <h2>Restaurant Flore</h2>
                <p className="flore-intro">
                  Discover our flagship restaurant in the heart of Amsterdam, where culinary innovation meets conscious fine dining in an intimate setting.
                </p>
                <button className="flore-button" onClick={() => {
                  scrollToTop();
                  navigate('/flore');
                }}>
                  Visit Restaurant Flore
                  <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="flore-image-container">
                {floreImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Flore restaurant ${index + 1}`}
                    className={`flore-image ${currentFloreImage === index ? 'active' : 'inactive'}`}
                  />
                ))}
                
                <div className="flore-controls">
                  <button 
                    onClick={prevFloreImage}
                    className="flore-control-btn"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={nextFloreImage}
                    className="flore-control-btn"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Homepage;