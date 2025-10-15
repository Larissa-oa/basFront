import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';
import './ComponentsStyles/RecipeSlider.css';

const RecipeSlider = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Fetch recipes
  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes?limit=8&sort=-createdAt`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => {
            const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta; // newest first (left)
          });
          setRecipes(sorted);
        }
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setRecipes([]);
      });
  }, []);

  // Update button states based on current index
  useEffect(() => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < recipes.length - 1);
  }, [currentIndex, recipes.length]);

  // Scroll left
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Format date
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
          {/* Header Content */}
          <div className="section-header-content">
            <h2 className="slider-title">From our kitchen</h2>
            <p className="section-intro">
            A glimpse into dishes that tell a story — rooted in nature, and guided by flavor.
            </p>
            <button 
              className="explore-button" 
              onClick={() => {
                scrollToTop();
                navigate('/recipes');
              }}
            >
              Explore all
              <ArrowRight size={14} />
            </button>
          </div>
          
          {/* Slider Container */}
          <div className="slider-wrapper">
            <div className="slider-container">
              <div 
                className="slider-track"
                style={{ 
                  transform: `translateX(-${currentIndex * (260 + 16)}px)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
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
                {/* Add white space after last card */}
                <div className="slider-whitespace"></div>
              </div>
            </div>
            
            {/* Slider Controls */}
            <div className="slider-controls">
              <button 
                onClick={scrollLeft}
                className="slider-btn prev"
                aria-label="Previous recipes"
                disabled={!canScrollLeft}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={scrollRight}
                className="slider-btn"
                aria-label="Next recipes"
                disabled={!canScrollRight}
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
