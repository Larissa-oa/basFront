import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import RecipeSlider from '../components/RecipeSlider';
import ScrollEffects from '../components/ScrollEffects';
import HomepageBar from '../components/HomepageBar';
import AboutTeaser from '../components/AboutTeaser';
import flore from '../assets/images/flore.jpg';
import restaurant from '../assets/images/restaurant.jpg';
import dining from '../assets/images/dining.jpg';
import floreVideo from '../assets/videos/Flore_homepage.mp4';
import './PageStyles/HomePage.css';

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFloreImage, setCurrentFloreImage] = useState(0);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const floreImages = [flore, restaurant, dining];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Set video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // 75% speed - adjust this value to make it slower or faster
    }
  }, []);

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
        <video 
          ref={videoRef}
          className="hero-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={floreVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="hero-overlay"></div>
        
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <h1 className="hero-title">
            Everyone is an artist
          </h1>
          </div>

        {/*Parallax Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line"></div>
        </div>

      </section>

      {/* Homepage Bar */}
      <HomepageBar />

      {/* Main Content */}
      <main className="main-content">
        
        {/* Recipe Slider Component */}
        <RecipeSlider />

        {/* Flore Section */}
        <section className="section flore">
          <div className="container">
            <div className="flore-section">
              <div className="section-header-content">
                <h2 className="slider-title">Restaurant Flore</h2>
                <p className="section-intro" id="flore-intro">
                  Discover our flagship restaurant in the heart of Amsterdam, where culinary innovation meets conscious fine dining in an intimate setting.
                </p>
                <button className="explore-button" onClick={() => {
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

        {/* About Teaser Component */}
        <AboutTeaser />

      </main>
    </div>
  );
};

export default Homepage;