import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';

const JournalSlider = () => {
  const [latestJournals, setLatestJournals] = useState([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const journalsSliderRef = useRef(null);
  const navigate = useNavigate();

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

  // Check scroll position and update state
  const checkScrollPosition = () => {
    if (journalsSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = journalsSliderRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const slider = journalsSliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [latestJournals]);

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

  if (latestJournals.length === 0) {
    return null;
  }

  return (
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
          
          <div className={`slider-container ${isAtStart ? 'at-start' : ''} ${isAtEnd ? 'at-end' : ''}`}>
            <div className="slider" ref={journalsSliderRef}>
              {latestJournals.map((journal) => (
                <div 
                  key={journal._id} 
                  className="media-card"
                  onClick={() => {
                    scrollToTop();
                    navigate(`/journals/${journal._id}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToTop();
                      navigate(`/journals/${journal._id}`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View experiment: ${journal.title}`}
                >
                  <div className="media-image">
                    <div className="media-date">
                      {formatDate(journal.createdAt)}
                    </div>
                    {journal.mainImage ? (
                      <img
                        src={journal.mainImage.startsWith('http') ? journal.mainImage : `${API_BASE_URL}${journal.mainImage}`}
                        alt={journal.title}
                        loading="lazy"
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
                className={`slider-btn prev ${isAtStart ? 'disabled' : ''}`}
                aria-label="Previous experiments"
                disabled={isAtStart}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => slideRight(journalsSliderRef)}
                className={`slider-btn ${isAtEnd ? 'disabled' : ''}`}
                aria-label="Next experiments"
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

export default JournalSlider; 