import React, { useState, useEffect } from 'react';
import './ComponentsStyles/HomepageBar.css';

const HomepageBar = () => {
  const words = ['experiments', 'reflections', 'recipes'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 400);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="homepage-bar">
      <div className="homepage-bar-content">
        <p className="homepage-bar-text">
          A journal of{' '}
          <span className={`alternating-word ${isAnimating ? 'animating' : ''}`}>
            {words[currentWordIndex]}
          </span>
          {' '}to inspire creativity.
        </p>
      </div>
    </div>
  );
};

export default HomepageBar;