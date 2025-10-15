import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../components/ComponentsStyles/Navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isFlore = location.pathname === '/flore';
  const isTransparentPage = isHome || isFlore;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      
      // Check if we're in the top 70vh on transparent pages (matches hero height)
      if (isTransparentPage) {
        const vh70 = window.innerHeight * 0.7;
        setIsLightBackground(scrollY < vh70);
      } else {
        setIsLightBackground(false);
      }
    };

    handleScroll(); // Call on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransparentPage]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: 'Recipes', path: '/recipes', label: 'R' },
    { name: 'Restaurant Flore', path: '/flore', label: 'F' },
    { name: 'Bas Van Kranen', path: '/about', label: 'B' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`navbar-sidebar ${scrolled ? 'scrolled' : ''} ${isLightBackground ? 'light-icons' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo" onClick={closeMenu}>
            <span className="logo-kanji">食研</span>
          </NavLink>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-nav">
            <NavLink 
              to="/" 
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <div className="nav-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <span className="nav-label">Home</span>
            </NavLink>

            <div className="nav-separator"></div>

            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="nav-icon-wrapper">
                  <span className="nav-letter">{item.label}</span>
                </div>
                <span className="nav-label">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="sidebar-nav sidebar-nav-bottom">
            <NavLink 
              to={user ? "/profile" : "/signup"} 
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <div className="nav-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <span className="nav-label">{user ? "Profile" : "Sign Up"}</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navigation */}
      <nav className={`navbar-mobile ${scrolled ? 'scrolled' : ''} ${isLightBackground ? 'light-icons' : ''}`}>
        <div className="mobile-nav-content">
          <NavLink to="/" className="mobile-logo" onClick={closeMenu}>
            <span className="logo-kanji">食研</span>
          </NavLink>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={closeMenu}></div>
            <div className="mobile-menu-container">
              {/* Close Button */}
              <button 
                className="mobile-menu-close-btn"
                onClick={closeMenu}
                aria-label="Close mobile menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="mobile-menu">
                <div className="mobile-menu-items">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <div className="mobile-nav-icon-wrapper">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </div>
                    <span className="mobile-item-text">Home</span>
                  </NavLink>

                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
                      onClick={closeMenu}
                    >
                      <div className="mobile-nav-icon-wrapper">
                        <span className="mobile-nav-letter">{item.label}</span>
                      </div>
                      <span className="mobile-item-text">{item.name}</span>
                    </NavLink>
                  ))}

                  <div className="mobile-menu-separator"></div>

                  <NavLink 
                    to={user ? "/profile" : "/signup"} 
                    className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <div className="mobile-nav-icon-wrapper">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                    </div>
                    <span className="mobile-item-text">{user ? 'Profile' : 'Sign Up'}</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;