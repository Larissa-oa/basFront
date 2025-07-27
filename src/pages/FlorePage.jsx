import React from "react";
import { Link } from "react-router-dom";

import "./PageStyles/FlorePage.css";

import imgFlore from "../assets/images/flore.jpg";
import imgRest from "../assets/images/restaurant.jpg";
import imgDining from "../assets/images/dining.jpg";
import accoladesBackground from "../assets/images/florebackground.jpg";
import gaultMillau from '../assets/images/gm.png';
import michelin from '../assets/images/michelin.png';
import wineSpectator from '../assets/images/wineS.png';
import starWineList from '../assets/images/swl.png';
import wereSmart from '../assets/images/ws.png';
import eat360 from '../assets/images/360.png';

const accolades = [
  { image: gaultMillau, alt: "Gault Millau", link: 'https://www.gault-millau.nl/en/restaurants/flore-amsterdam' },
  { image: michelin, alt: "Michelin", link: 'https://guide.michelin.com/en/noord-holland/amsterdam/restaurant/flore' },
  { image: wineSpectator, alt: "Wine Spectator", link: 'https://www.winespectator.com/articles/restaurant-spotlight-flore-amsterdam' },
  { image: wereSmart, alt: "We're Smart", link: 'https://weresmartworld.com/we-re-smart-green-guide/flore' },
  { image: eat360, alt: "Eat 360", link: 'https://360eatguide.com/restaurants/flore/' },
];

const FlorePage = () => {
  return (
    <section className="flore-page">
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-image">
          <img src={imgFlore} alt="Flore dining room" />
          <div className="hero-overlay"></div>
          <div className="hero-text">
            <div className="hero-badge">Amsterdam</div>
            <h1>Restaurant Flore</h1>
            <p>
              Conscious fine dining inspired by Nordic minimalism and Japanese subtlety — celebrating the pure essence of responsibly sourced Dutch ingredients.
            </p>
            <div className="hero-actions">
              <button className="primary-button">
                <Link to="https://www.sevenrooms.com/explore/restaurantflore/reservations/create/search?lang=en&tracking=flore-website">
                  Reserve Table
                </Link>
              </button>
              <button className="secondary-button">
                <Link to="https://restaurantflore.com">
                  Explore Menu
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="philosophy-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Our Philosophy</span>
            <h2>Conscious Fine Dining</h2>
          </div>
          <div className="philosophy-content">
            <div className="philosophy-text">
              <blockquote>
                "At Flore, we believe in conscious fine dining, with a strong focus on Dutch micro-seasonality. We carefully select vegetables grown slowly for taste, foraged local ingredients, sustainable line-caught fish, and responsibly farmed animals. In our kitchen, every ingredient is presented at its best, capturing its purest essence while respecting its true nature. Through technique, creativity, and respect for the product, we source responsibly and cook with integrity to bring out each ingredient's full potential. Our kitchen is a place of continuous discovery, where we ferment, preserve, and innovate."
              </blockquote>
              <cite>— Bas van Kranen, Head Chef</cite>
            </div>
          </div>
        </div>
      </div>

      {/* Dining Spaces Section */}
      <div className="dining-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Dining Spaces</span>
            <h2>Intimate Experiences</h2>
          </div>
          
          <div className="dining-grid">
            <div className="dining-card">
              <div className="card-image">
                <img src={imgDining} alt="Main dining room" />
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="capacity">34 Guests</span>
                  <span className="tables">11 Tables</span>
                </div>
                <h3>The Main Dining Room</h3>
                <p>Our intimate dining room offers comfort and character, seating up to 34 guests with beautiful views over the heart of Amsterdam.</p>
              </div>
            </div>

            <div className="dining-card">
              <div className="card-image">
                <img src={imgRest} alt="Kitchen table" />
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="capacity">10 Seats</span>
                  <span className="experience">Chef's Table</span>
                </div>
                <h3>The Kitchen Table</h3>
                <p>With 10 seats right by the kitchen, our Kitchen Table offers a unique experience. Book it privately for 8–10 guests or join others for an unforgettable shared meal.</p>
              </div>
            </div>
          </div>
          <div className="accolades-container" style={{
            backgroundImage: `url(${accoladesBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
            <div className="accolades-track">
              <div className="accolades-slide">
                {accolades.map((accolade, index) => (
                  <a 
                    key={index} 
                    href={accolade.link} 
                    className="accolade-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img src={accolade.image} alt={accolade.alt} className="accolade-img" />
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {accolades.map((accolade, index) => (
                  <a 
                    key={`duplicate-${index}`} 
                    href={accolade.link} 
                    className="accolade-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img src={accolade.image} alt={accolade.alt} className="accolade-img" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlorePage;