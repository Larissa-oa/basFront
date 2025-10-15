import { useEffect, useRef } from 'react'
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa'
import bas1 from '../assets/images/bas1.jpeg'
import bas2 from '../assets/images/bas2.jpeg'
import bas4 from '../assets/images/bas4.jpeg'
import aboutbasFlore from '../assets/images/aboutbas_flore.jpeg'
import aboutbasFish from '../assets/images/aboutbas_fish.jpeg'
import './PageStyles/AboutPage.css'

const AboutPage = () => {
  const introRef = useRef(null)
  const journeyRef = useRef(null)
  const floreRef = useRef(null)
  const ambassadorRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Smooth path line animation
      const pathLine = document.querySelector('.about-path-line')
      if (pathLine) {
        const pathProgress = Math.min(scrollY / (document.documentElement.scrollHeight - windowHeight), 1)
        // Smoother easing function for more fluid movement
        const smoothProgress = pathProgress < 0.5 
          ? 2 * pathProgress * pathProgress 
          : 1 - Math.pow(-2 * pathProgress + 2, 3) / 2
        pathLine.style.height = `${smoothProgress * 100}%`
      }

      // Elaborate section animations with playful effects
      const sections = [introRef, journeyRef, floreRef, ambassadorRef]
      sections.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2
          
          if (isVisible) {
            ref.current.classList.add('section-active')
            
            // Playful stagger animation with different effects for each section
            const contentElements = ref.current.querySelectorAll('.section-content > *')
            contentElements.forEach((element, elementIndex) => {
              setTimeout(() => {
                element.style.opacity = '1'
                
                // Mature, elegant Scandinavian-style entrance animations
                if (index === 0) { // Intro section - sophisticated fade with subtle scale
                  element.style.transform = 'translateY(0) scale(1)'
                  element.style.animation = 'elegantFadeIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                } else if (index === 1) { // Journey section - refined slide with parallax
                  const isText = element.classList.contains('journey-text')
                  element.style.transform = 'translateX(0) translateY(0)'
                  element.style.animation = isText ? 'scandinavianSlideLeft 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards' : 'scandinavianSlideRight 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                } else if (index === 2) { // Flore section - minimal rotation with depth
                  const isText = element.classList.contains('flore-text')
                  element.style.transform = 'translateY(0) rotate(0deg)'
                  element.style.animation = isText ? 'minimalRotateLeft 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards' : 'minimalRotateRight 1.6s cubic-bezier(0.19, 1, 0.22, 1) forwards'
                } else if (index === 3) { // Ambassador section - sophisticated reveal
                  element.style.transform = 'translateY(0)'
                  element.style.animation = 'sophisticatedReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }
              }, elementIndex * 200)
            })
          }
        }
      })

      // Playful floating elements
      const floatingElements = document.querySelectorAll('.floating-element')
      floatingElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < windowHeight && rect.bottom > 0
        if (isVisible) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
          const floatAmount = Math.sin(scrollProgress * Math.PI * 2 + index) * 10
          element.style.transform = `translateY(${floatAmount}px) rotate(${scrollProgress * 5}deg)`
        }
      })
    }

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [])

  return (
    <div className="about-page">
      {/* Path Line */}
      <div className="about-path-line"></div>
      
      {/* Floating decorative elements */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>
      
      {/* Section 1: Bas van Kranen (Intro) */}
      <section ref={introRef} className="about-section intro-section">
        <div className="section-number">01</div>
        <div className="section-content">
          <div className="intro-image-container">
            <img src={bas1} alt="Bas van Kranen" className="intro-image" />
          </div>
          <div className="intro-text">
            <h1 className="section-title">Bas van Kranen</h1>
            <p className="section-description">
              A visionary chef whose culinary philosophy transcends traditional boundaries, 
              creating experiences that connect the soul of ingredients with the heart of the diner.
            </p>
            <blockquote className="michelin-quote">
              "Bas van Kranen penetrates to the very essence of his ingredients and brings emotion to the plate."
              <cite>— Michelin Guide</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section 2: His Journey */}
      <section ref={journeyRef} className="about-section journey-section">
        <div className="section-number">02</div>
        <div className="section-content">
          <div className="journey-image-container">
            <img src={bas2} alt="Bas's Journey" className="journey-image" />
          </div>
          <div className="journey-text">
            <h2 className="section-subtitle">His Journey</h2>
            <p>
              From the kitchens of Michelin-starred restaurants to the fields where ingredients are born, 
              Bas van Kranen's journey is one of continuous discovery and reverence for nature's bounty.
            </p>
            <p>
              His culinary path has been marked by an unwavering commitment to understanding the true 
              character of each ingredient, forging connections with local producers and farmers who 
              share his passion for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Flore */}
      <section ref={floreRef} className="about-section flore-section">
        <div className="section-number">03</div>
        <div className="section-content">
          <div className="flore-image-container">
            <img src={aboutbasFlore} alt="Farm Connection" className="flore-image" />
          </div>
          <div className="flore-text">
            <h2 className="section-subtitle">Flore</h2>
            <p>
              The connection to the earth is fundamental to Bas's approach. His relationship with 
              local farmers and producers forms the foundation of his culinary philosophy, ensuring 
              that every dish tells the story of its origin.
            </p>
            <p>
              Through direct partnerships with growers and artisans, Bas ensures that the journey 
              from farm to plate is one of respect, quality, and authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Ambassador */}
      <section ref={ambassadorRef} className="about-section ambassador-section">
        <div className="section-number">04</div>
        <div className="section-content">
          <div className="ambassador-image-container">
            <img src={aboutbasFish} alt="Sustainable Sourcing" className="ambassador-image" />
          </div>
          <div className="ambassador-text">
            <h2 className="section-subtitle">Ambassador</h2>
            <p>
              As an ambassador of sustainable gastronomy, Bas van Kranen represents a new generation 
              of chefs who understand that great cooking begins long before the kitchen.
            </p>
            <p>
              His work extends beyond the restaurant, advocating for responsible sourcing, 
              environmental stewardship, and the preservation of culinary traditions that 
              honor both the land and the community.
            </p>
          </div>
        </div>
      </section>

      {/* Final Image */}
      <section className="about-section final-section">
        <div className="final-image-container">
          <img src={bas4} alt="Bas van Kranen" className="final-image" />
          <div className="final-quote">
            <p>"Where passion meets purpose, and every ingredient tells a story."</p>
          </div>
        </div>
    </section>
    </div>
  )
}

export default AboutPage