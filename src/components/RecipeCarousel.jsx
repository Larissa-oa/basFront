import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';
import './ComponentsStyles/RecipeCarousel.css'; 

const RecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`) 
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecipes(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch recipes:', err);
      });
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrameId;

    const scrollStep = () => {
      if (!scrollContainer) return;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const duplicatedRecipes = [...recipes, ...recipes];

  return (
    <div className="carousel-container" aria-label="Recipe carousel">
      <div className="carousel-track" ref={scrollRef}>
        {duplicatedRecipes.map((recipe, index) => (
          <div
            key={`${recipe._id}-${index}`}
            className="carousel-card"
            onClick={() => { navigate(`/recipes/${recipe._id}`); scrollToTop(); }}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') { navigate(`/recipes/${recipe._id}`); scrollToTop(); }; }}
            style={{ cursor: 'pointer' }}
            aria-label={`View details for ${recipe.title}`}
          >
            <img
              src={recipe.image?.[0] || 'https://via.placeholder.com/280x180?text=No+Image'}
              alt={recipe.title}
              className="carousel-image"
              loading="lazy"
              draggable={false}
            />
            <div className="carousel-caption">
              <span>{recipe.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;
