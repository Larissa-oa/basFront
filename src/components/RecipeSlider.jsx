import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';

const RecipeSlider = () => {
  const [recipes, setRecipes] = useState([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const recipesSliderRef = useRef(null);
  const navigate = useNavigate();

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

  // Check scroll position and update state
  const checkScrollPosition = () => {
    if (recipesSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = recipesSliderRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const slider = recipesSliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [recipes]);

  const slideLeft = (ref) => {
    if (ref.current) {
      const scrollAmount = Math.min(400, ref.current.clientWidth * 0.8);
      ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const slideRight = (ref) => {
    if (ref.current) {
      const scrollAmount = Math.min(400, ref.current.clientWidth * 0.8);
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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

  if (recipes.length === 0) {
    return null;
  }

  return (
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
          
          <div className={`slider-container ${isAtStart ? 'at-start' : ''} ${isAtEnd ? 'at-end' : ''}`}>
            <div className="slider" ref={recipesSliderRef}>
              {recipes.map((recipe) => (
                <div 
                  key={recipe._id} 
                  className="media-card"
                  onClick={() => {
                    scrollToTop();
                    navigate(`/recipes/${recipe._id}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToTop();
                      navigate(`/recipes/${recipe._id}`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View recipe: ${recipe.title}`}
                >
                  <div className="media-image">
                    <div className="media-date">
                      {formatDate(recipe.createdAt)}
                    </div>
                    {recipe.headerImage ? (
                      <img
                        src={recipe.headerImage.startsWith('http') ? recipe.headerImage : `${API_BASE_URL}${recipe.headerImage}`}
                        alt={recipe.title}
                        loading="lazy"
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
                className={`slider-btn prev ${isAtStart ? 'disabled' : ''}`}
                aria-label="Previous recipes"
                disabled={isAtStart}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => slideRight(recipesSliderRef)}
                className={`slider-btn ${isAtEnd ? 'disabled' : ''}`}
                aria-label="Next recipes"
                disabled={isAtEnd}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeSlider; 