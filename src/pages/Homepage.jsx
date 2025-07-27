import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ArrowDown, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';
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
  const [latestJournals, setLatestJournals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [currentFloreImage, setCurrentFloreImage] = useState(0);
  const journalsSliderRef = useRef(null);
  const recipesSliderRef = useRef(null);
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

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch latest journals
    axios.get(`${API_BASE_URL}/journals?limit=8&sort=-createdAt`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setLatestJournals(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching journals:', err);
        setLatestJournals([]);
      });
  }, []);

  useEffect(() => {
    // Fetch latest recipes
    axios.get(`${API_BASE_URL}/recipes?limit=8&sort=-createdAt`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecipes(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setRecipes([]);
      });
  }, []);

  const slideLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const slideRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const nextFloreImage = () => {
    setCurrentFloreImage((prev) => (prev + 1) % floreImages.length);
  };

  const prevFloreImage = () => {
    setCurrentFloreImage((prev) => (prev - 1 + floreImages.length) % floreImages.length);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
          <div className="hero-cta">
            <button className="cta-button" onClick={scrollToNextSection}>
              Explore Our Work
              <ArrowDown size={18} />
            </button>
          </div>
        </div>

        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Experiments Section */}
      {latestJournals.length > 0 && (
        <section className="section experiments">
          <div className="container">
            <div className="slider-section">
              <div className="section-header-content">
                <h2 className="slider-title">Latest Experiments</h2>
                <p className="section-intro">
                  Discover our latest culinary innovations and experimental techniques that push the boundaries of flavor and presentation.
                </p>
                <button className="explore-button" onClick={() => {
                  scrollToTop();
                  navigate('/journals');
                }}>
                  Explore all
                  <ArrowRight size={14} />
                </button>
              </div>
              
              <div className="slider-container">
                <div className="slider" ref={journalsSliderRef}>
                  {latestJournals.map((journal) => (
                    <div 
                      key={journal._id} 
                      className="media-card"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/journals/${journal._id}`);
                      }}
                    >
                      <div className="media-image">
                        <div className="media-date">
                          {formatDate(journal.createdAt)}
                        </div>
                        {journal.mainImage ? (
                          <img
                            src={`${API_BASE_URL}${journal.mainImage}`}
                            alt={journal.title}
                          />
                        ) : (
                          <div className="media-placeholder">
                            <span>No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="media-content">
                        <h3>{journal.title}</h3>
                        <span className="media-timestamp">{formatDate(journal.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="slider-controls">
                  <button 
                    onClick={() => slideLeft(journalsSliderRef)}
                    className="slider-btn prev"
                    aria-label="Previous experiments"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => slideRight(journalsSliderRef)}
                    className="slider-btn"
                    aria-label="Next experiments"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="main-content">
        
        {/* Featured Showcase */}
        <section className="showcase">
          <div className="container">
            <div className="showcase-header">
              <p className="showcase-subtitle">Wanna get to know us better?</p>
            </div>
            <div className="showcase-grid">
              <div className="showcase-item large">
                <div className="showcase-image">
                  <img src={observer} alt="Observer interview" />
                  <div className="showcase-overlay">
                    <h3>At Amsterdam's Flore, Bas van Kranen Puts Vegetables in the Fine Dining Spotlight</h3>
                    <p>Produce is the star of the show at Amsterdam's two-Michelin-starred Flore.</p>
                  </div>
                </div>
              </div>
              <div className="showcase-item">
                <div className="showcase-image">
                  <img src={dscene} alt="DSCENE interview" />
                  <div className="showcase-overlay">
                    <h3>Chef Bas van Kranen on Flore's Reinvention and the Future of Fine Dining</h3>
                    <p>DSCENE meets the chef behind Amsterdam's most thoughtful kitchen to talk preservation, space, and purpose.</p>
                  </div>
                </div>
              </div>
              <div className="showcase-item">
                <div className="showcase-image">
                  <img src={flore3} alt="Elite Traveler interview" />
                  <div className="showcase-overlay">
                    <h3>Flore: A Sustainable Fine Dining Success in Amsterdam</h3>
                    <p>Restaurant of the Week: Hotel De L'Europe's latest fine dining concept offers locally sourced, carefully considered cuisine.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recipes Section */}
        {recipes.length > 0 && (
          <section className="section recipes">
            <div className="container">
              <div className="slider-section">
                <div className="section-header-content">
                  <h2 className="slider-title">Featured Recipes</h2>
                  <p className="section-intro">
                    Explore our curated collection of innovative recipes that showcase our unique approach to modern gastronomy.
                  </p>
                  <button className="explore-button" onClick={() => {
                    scrollToTop();
                    navigate('/recipes');
                  }}>
                    Explore all
                    <ArrowRight size={14} />
                  </button>
                </div>
                
                <div className="slider-container">
                  <div className="slider" ref={recipesSliderRef}>
                    {recipes.map((recipe) => (
                      <div 
                        key={recipe._id} 
                        className="media-card"
                        onClick={() => {
                          scrollToTop();
                          navigate(`/recipes/${recipe._id}`);
                        }}
                      >
                        <div className="media-image">
                          <div className="media-date">
                            {formatDate(recipe.createdAt)}
                          </div>
                          {recipe.headerImage ? (
                            <img
                              src={`${API_BASE_URL}${recipe.headerImage}`}
                              alt={recipe.title}
                            />
                          ) : (
                            <div className="media-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="media-content">
                          <h3>{recipe.title}</h3>
                          <span className="media-timestamp">{formatDate(recipe.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="slider-controls">
                    <button 
                      onClick={() => slideLeft(recipesSliderRef)}
                      className="slider-btn prev"
                      aria-label="Previous recipes"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => slideRight(recipesSliderRef)}
                      className="slider-btn"
                      aria-label="Next recipes"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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