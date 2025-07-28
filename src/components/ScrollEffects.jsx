import React, { useEffect, useRef } from 'react';

const ScrollEffects = () => {
  const homepageRef = useRef(null);
  const showcaseRef = useRef(null);
  const processRef = useRef(null);
  const floreRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Subtle background color change on scroll
      if (homepageRef.current) {
        const progress = scrollY / (documentHeight - windowHeight);
        const intensity = Math.min(progress * 0.3, 0.3);
        homepageRef.current.style.background = `linear-gradient(180deg, 
          var(--color-off-white) 0%, 
          hsl(0, 0%, ${95 - intensity * 10}%) 100%)`;
      }

      // Enhanced showcase section - DISABLED ALL EFFECTS
      if (showcaseRef.current) {
        // Completely disable all showcase effects
        const showcaseItems = showcaseRef.current.querySelectorAll('.showcase-item');
        showcaseItems.forEach((item) => {
          item.style.transform = 'none';
          item.style.opacity = '1';
          item.style.transition = 'none';
        });
        
        const showcaseImages = showcaseRef.current.querySelectorAll('.showcase-image img');
        showcaseImages.forEach((img) => {
          img.style.transform = 'none';
          img.style.opacity = '1';
          img.style.transition = 'none';
          img.style.animation = 'none';
        });
      }

      // Process section background animation
      if (processRef.current) {
        const processTop = processRef.current.offsetTop;
        const processHeight = processRef.current.offsetHeight;
        const processProgress = (scrollY - processTop + windowHeight) / (processHeight + windowHeight);
        
        if (processProgress > 0 && processProgress < 1) {
          const scale = 1 + processProgress * 0.1;
          const rotate = processProgress * 2;
          processRef.current.style.setProperty('--process-scale', scale);
          processRef.current.style.setProperty('--process-rotate', `${rotate}deg`);
        }
      }

      // Enhanced Flore section animation with side reveal
      if (floreRef.current) {
        const floreTop = floreRef.current.offsetTop;
        const floreHeight = floreRef.current.offsetHeight;
        const floreProgress = (scrollY - floreTop + windowHeight) / (floreHeight + windowHeight);
        
        if (floreProgress > 0 && floreProgress < 1) {
          // Content slides in from left
          const floreContent = floreRef.current.querySelector('.flore-content');
          if (floreContent) {
            const contentOffset = (1 - floreProgress) * -50;
            floreContent.style.transform = `translateX(${contentOffset}px) translateY(${floreProgress * 20}px)`;
            floreContent.style.opacity = floreProgress;
          }

          // Image slides in from right
          const floreImage = floreRef.current.querySelector('.flore-image-container');
          if (floreImage) {
            const imageOffset = (1 - floreProgress) * 50;
            floreImage.style.transform = `translateX(${imageOffset}px) translateY(${floreProgress * -10}px)`;
            floreImage.style.opacity = floreProgress;
          }
        }
      }

      // Add scroll-based classes for animations with enhanced detection - SHOWCASE REMOVED
      const sections = document.querySelectorAll('.section.flore, .process-divider');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
        
        if (isVisible) {
          section.classList.add('in-view');
        } else {
          // Remove class when section is out of view for re-animation
          section.classList.remove('in-view');
        }
      });

      // Dynamic line animations based on scroll position - SHOWCASE LINE ENHANCED
      const dynamicLines = document.querySelectorAll('.showcase-subtitle::after, .flore-content h2::after');
      dynamicLines.forEach(line => {
        const rect = line.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          // Enhanced showcase line animation - more pronounced
          if (line.closest('.showcase-subtitle')) {
            const enhancedProgress = Math.min(1, progress * 1.5); // Faster animation
            const maxWidth = 250; // Even wider
            line.style.width = `${enhancedProgress * maxWidth}px`;
            line.style.opacity = enhancedProgress;
          } else {
            // Regular animation for other lines
            line.style.width = `${Math.min(100, progress * 100)}%`;
          }
        }
      });
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('resize', throttledScroll);

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledScroll);
    };
  }, []);

  return (
    <>
      <div ref={homepageRef} className="homepage-background" />
      <div ref={showcaseRef} className="showcase-parallax" />
      <div ref={processRef} className="process-animation" />
      <div ref={floreRef} className="flore-animation" />
    </>
  );
};

export default ScrollEffects; 