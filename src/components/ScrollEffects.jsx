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

      // Rich background gradient evolution on scroll
      if (homepageRef.current) {
        const progress = scrollY / (documentHeight - windowHeight);
        const intensity = Math.min(progress * 0.25, 0.25);
        const colorShift = Math.min(progress * 3, 3);
        const saturation = 8 + colorShift * 1.5;
        
        homepageRef.current.style.background = `linear-gradient(180deg, 
          var(--color-off-white) 0%,
          hsl(40, ${saturation}%, ${96 - intensity * 12}%) 50%,
          hsl(35, ${Math.min(saturation * 1.2, 15)}%, ${94 - intensity * 15}%) 100%)`;
      }

      // Showcase section - sophisticated multi-layer animation
      if (showcaseRef.current) {
        const rect = showcaseRef.current.getBoundingClientRect();
        const showcaseTop = showcaseRef.current.offsetTop;
        const showcaseHeight = showcaseRef.current.offsetHeight;
        const showcaseProgress = Math.max(0, Math.min(1, (scrollY - showcaseTop + windowHeight * 0.5) / (showcaseHeight + windowHeight * 0.5)));
        
        // Check if section is in middle of screen
        const isInMiddle = rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4;
        
        if (isInMiddle) {
          // Reset all effects when in middle
          const showcaseItems = showcaseRef.current.querySelectorAll('.showcase-item');
          showcaseItems.forEach((item) => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
          });
          
          const showcaseImages = showcaseRef.current.querySelectorAll('.showcase-image img');
          showcaseImages.forEach((img) => {
            img.style.transform = 'translateY(0) translateZ(0) scale(1) rotateZ(0deg)';
            img.style.opacity = 1;
          });

          const showcaseContainer = showcaseRef.current.querySelector('.showcase-container');
          if (showcaseContainer) {
            showcaseContainer.style.boxShadow = 'none';
          }
        } else if (rect.top < windowHeight) {
          // Apply animations only when not in middle
          const easeProgress = 1 - Math.pow(1 - showcaseProgress, 3);
          
          const showcaseItems = showcaseRef.current.querySelectorAll('.showcase-item');
          showcaseItems.forEach((item, index) => {
            const delay = Math.min(index * 0.12, 0.36);
            const itemProgress = Math.max(0, easeProgress - delay);
            
            const itemEase = itemProgress < 0.5 
              ? 2 * itemProgress * itemProgress 
              : -1 + (4 - 2 * itemProgress) * itemProgress;
            
            const translateY = (1 - itemEase) * 32;
            const scale = 0.92 + itemEase * 0.08;
            const rotation = (1 - itemEase) * 2;
            
            item.style.opacity = itemEase;
            item.style.transform = `translateY(${translateY}px) scale(${scale}) rotateX(${rotation}deg)`;
            item.style.transition = 'none';
            item.style.perspective = '1000px';
          });
          
          const showcaseImages = showcaseRef.current.querySelectorAll('.showcase-image img');
          showcaseImages.forEach((img) => {
            const parallaxAmount = easeProgress * 15;
            const scaleAmount = 1 + easeProgress * 0.04;
            const rotationZ = easeProgress * 0.5;
            
            img.style.transform = `translateY(${parallaxAmount}px) translateZ(0) scale(${scaleAmount}) rotateZ(${rotationZ}deg)`;
            img.style.opacity = 1;
            img.style.transition = 'none';
            img.style.animation = 'none';
            img.style.filter = 'none';
          });

          const showcaseContainer = showcaseRef.current.querySelector('.showcase-container');
          if (showcaseContainer) {
            showcaseContainer.style.boxShadow = `0 ${easeProgress * 40}px ${easeProgress * 60}px rgba(212, 184, 150, ${easeProgress * 0.08})`;
          }
        }
      }

      // Process section - sophisticated circular animation
      if (processRef.current) {
        const rect = processRef.current.getBoundingClientRect();
        const processTop = processRef.current.offsetTop;
        const processHeight = processRef.current.offsetHeight;
        const processProgress = Math.max(0, Math.min(1, (scrollY - processTop + windowHeight * 0.5) / (processHeight + windowHeight * 0.5)));
        
        // Check if section is in middle of screen
        const isInMiddle = rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4;
        
        if (isInMiddle) {
          // Reset all effects when in middle
          processRef.current.style.setProperty('--process-scale', 1);
          processRef.current.style.setProperty('--process-rotate', '0deg');
          processRef.current.style.setProperty('--process-opacity', 1);
          processRef.current.style.setProperty('--process-blur', '0px');

          const processItems = processRef.current.querySelectorAll('.process-item');
          processItems.forEach((item) => {
            item.style.opacity = 1;
            item.style.transform = 'translateX(0) rotateZ(0deg)';
          });
        } else if (rect.top < windowHeight) {
          // Apply animations only when not in middle
          const easeProgress = 1 - Math.pow(1 - processProgress, 3);
          
          const scale = 1 + easeProgress * 0.12;
          const rotate = easeProgress * 6;
          const opacity = 0.2 + easeProgress * 0.5;
          const blur = (1 - easeProgress) * 8;
          
          processRef.current.style.setProperty('--process-scale', scale);
          processRef.current.style.setProperty('--process-rotate', `${rotate}deg`);
          processRef.current.style.setProperty('--process-opacity', opacity);
          processRef.current.style.setProperty('--process-blur', `${blur}px`);

          const processItems = processRef.current.querySelectorAll('.process-item');
          processItems.forEach((item, index) => {
            const itemDelay = Math.min(index * 0.1, 0.3);
            const itemProgress = Math.max(0, easeProgress - itemDelay);
            const itemEase = itemProgress < 0.5 
              ? 2 * itemProgress * itemProgress 
              : -1 + (4 - 2 * itemProgress) * itemProgress;
            
            const rotation = (1 - itemEase) * (index % 2 === 0 ? 15 : -15);
            const translateX = (1 - itemEase) * (index % 2 === 0 ? 30 : -30);
            
            item.style.opacity = itemEase;
            item.style.transform = `translateX(${translateX}px) rotateZ(${rotation}deg)`;
            item.style.transition = 'none';
          });
        }
      }

      // Flore section - cinematic reveal with depth
      if (floreRef.current) {
        const rect = floreRef.current.getBoundingClientRect();
        const floreTop = floreRef.current.offsetTop;
        const floreHeight = floreRef.current.offsetHeight;
        const floreProgress = Math.max(0, Math.min(1, (scrollY - floreTop + windowHeight * 0.6) / (floreHeight + windowHeight * 0.6)));
        
        // Check if section is in middle of screen
        const isInMiddle = rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4;
        
        if (isInMiddle) {
          // Reset all effects when in middle
          const floreContent = floreRef.current.querySelector('.flore-content');
          if (floreContent) {
            floreContent.style.transform = 'translateX(0) translateY(0) rotateX(0deg) scale(1)';
            floreContent.style.opacity = 1;
          }

          const floreImage = floreRef.current.querySelector('.flore-image-container');
          if (floreImage) {
            floreImage.style.transform = 'translateX(0) translateY(0) rotateX(0deg) scale(1)';
            floreImage.style.opacity = 1;
            floreImage.style.filter = 'none';
          }

          const floreTexts = floreRef.current.querySelectorAll('.flore-content h2, .flore-content p');
          floreTexts.forEach((text) => {
            text.style.opacity = 1;
            text.style.transform = 'translateY(0)';
          });
        } else if (rect.top < windowHeight) {
          // Apply animations only when not in middle
          const easeProgress = 1 - Math.pow(1 - floreProgress, 3);
          
          const floreContent = floreRef.current.querySelector('.flore-content');
          if (floreContent) {
            const contentOffset = (1 - easeProgress) * -60;
            const contentRotateX = (1 - easeProgress) * 8;
            const contentScale = 0.95 + easeProgress * 0.05;
            
            floreContent.style.transform = `translateX(${contentOffset}px) translateY(${easeProgress * 24}px) rotateX(${contentRotateX}deg) scale(${contentScale})`;
            floreContent.style.opacity = easeProgress;
            floreContent.style.perspective = '1200px';
          }

          const floreImage = floreRef.current.querySelector('.flore-image-container');
          if (floreImage) {
            const imageOffset = (1 - easeProgress) * 60;
            const imageRotateX = (1 - easeProgress) * -8;
            const imageScale = 0.93 + easeProgress * 0.07;
            const imageParallax = easeProgress * -18;
            
            floreImage.style.transform = `translateX(${imageOffset}px) translateY(${imageParallax}px) rotateX(${imageRotateX}deg) scale(${imageScale})`;
            floreImage.style.opacity = easeProgress > 0.9 ? 1 : easeProgress;
            floreImage.style.filter = 'none';
            floreImage.style.perspective = '1200px';
          }

          const floreTexts = floreRef.current.querySelectorAll('.flore-content h2, .flore-content p');
          floreTexts.forEach((text, index) => {
            const textDelay = Math.min(index * 0.08, 0.16);
            const textProgress = Math.max(0, easeProgress - textDelay);
            const textEase = textProgress < 0.5 
              ? 2 * textProgress * textProgress 
              : -1 + (4 - 2 * textProgress) * textProgress;
            
            text.style.opacity = textEase;
            text.style.transform = `translateY(${(1 - textEase) * 20}px)`;
            text.style.transition = 'none';
          });
        }
      }

      // Advanced section reveal - crisp when in view
      const sections = document.querySelectorAll('.section.flore, .process-divider, .showcase-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.7)));
        
        if (sectionProgress > 0.8) {
          // Fully visible and crisp
          section.style.opacity = 1;
          section.style.transform = 'scale(1) translateY(0)';
          section.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
          section.classList.add('in-view');
        } else if (sectionProgress > 0.1) {
          // Animating in
          const easeProgress = sectionProgress < 0.5
            ? 2 * sectionProgress * sectionProgress
            : -1 + (4 - 2 * sectionProgress) * sectionProgress;
          
          section.style.opacity = Math.min(1, sectionProgress * 1.3);
          section.style.transform = `scale(${0.98 + easeProgress * 0.02}) translateY(${(1 - easeProgress) * 12}px)`;
          section.style.transition = 'none';
          section.classList.add('in-view');
        } else {
          section.classList.remove('in-view');
        }
      });

      // Dynamic underline animations with sophisticated easing
      const dynamicLines = document.querySelectorAll('.showcase-subtitle::after, .flore-content h2::after, .section-title::after');
      dynamicLines.forEach((line, index) => {
        const rect = line.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.9 && rect.bottom > windowHeight * 0.1;
        
        if (isVisible) {
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top + 100) / (windowHeight + 200)));
          
          // Cubic ease-out for line animation
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          if (line.closest('.showcase-subtitle')) {
            const maxWidth = 240;
            line.style.width = `${easeProgress * maxWidth}px`;
            line.style.opacity = easeProgress * 0.9;
            line.style.boxShadow = `0 2px 12px rgba(212, 184, 150, ${easeProgress * 0.15})`;
          } else {
            const maxWidth = 100;
            line.style.width = `${easeProgress * maxWidth}%`;
            line.style.opacity = easeProgress * 0.7;
            line.style.boxShadow = `0 1px 6px rgba(212, 184, 150, ${easeProgress * 0.1})`;
          }
        }
      });
    };

    // Optimized scroll throttling
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

    window.addEventListener('scroll', throttledScroll, { passive: true });
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