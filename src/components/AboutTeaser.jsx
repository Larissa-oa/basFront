import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// Minimal typographic teaser – no image, poetry-forward
import './ComponentsStyles/AboutTeaser.css';

const AboutTeaser = () => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className={`about-teaser about-teaser--minimal ${visible ? 'visible' : ''}`}>
      <div className="about-teaser__rule" aria-hidden="true" />
      <div className="about-teaser__content">
        <h2 className="about-teaser__title">
          Sharing moves us.
        </h2>
        <p className="about-teaser__text">
        From our kitchen to yours, we share stories as much as flavors —
quiet craft, patient time, and the small gestures that turn food into feeling.
Step a little closer, and get to meet what truly moves us.
        </p>
        <div className="about-teaser__actions">
          <Link to="/about" className="about-teaser__cta" aria-label="Discover more on the About page">
            Discover more
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" className="about-teaser__cta-icon">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="about-teaser__rule" aria-hidden="true" />
    </section>
  );
};

export default AboutTeaser;


