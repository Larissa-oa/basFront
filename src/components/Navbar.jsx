import React, { useState, useEffect, useRef, useContext } from 'react';
import { MdAccountCircle } from "react-icons/md";
import { NavLink, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosCloseCircleOutline } from "react-icons/io";
import '../components/ComponentsStyles/Navbar.css';
import { AuthContext } from '../Context/AuthContext';  // Import your AuthContext

const Navbar = () => {
  const { user } = useContext(AuthContext);  // Get user from context
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);  
  const menuRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleHamburgerClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(prev => !prev);
    // Close mobile menu when dropdown is opened
    if (!isMenuOpen) {
      setIsOpen(false);
    }
  };

  // Function to close all menus
  const closeAllMenus = () => {
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${isOpen || isMenuOpen ? 'menu-open' : ''} ${scrolled || !isHome ? 'scrolled' : ''}`}>
        <NavLink to="/" className="nav-logo" onClick={closeAllMenus}>食研</NavLink>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {isOpen && (
            <button
              className="close-btn-navbar"
              onClick={() => setIsOpen(false)}
            >
              <IoIosCloseCircleOutline />
            </button>
          )}
          <NavLink to="/about" className="nav-link" onClick={closeAllMenus}>About</NavLink>

          <button
            className="menu-btn-navbar"
            onClick={handleMenuClick}
            aria-expanded={isMenuOpen}
            aria-controls="menu-dropdown-list"
          >
            Menu +
          </button>

          <NavLink to={user ? "/profile" : "/signup"} className="nav-link" id="icon-account" title={user ? "Profile" : "Sign Up"} onClick={closeAllMenus}>
            <MdAccountCircle />
          </NavLink>
        </div>

        <button
          className="hamburger"
          onClick={handleHamburgerClick}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <GiHamburgerMenu />
        </button>
      </nav>

      {/* Dropdown menu as a separate element outside the navbar */}
      {isMenuOpen && (
        <div
          className="dropdown-list sidebar-mode"
          id="menu-dropdown-list"
          ref={menuRef}
        >
          <button
            className="close-btn-dropdown"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close dropdown"
          >
            <IoIosCloseCircleOutline />
          </button>
          <NavLink to="/journals" className="dropdown-link" onClick={closeAllMenus}>FoodLab</NavLink>
          <NavLink to="/recipes" className="dropdown-link" onClick={closeAllMenus}>Recipes</NavLink>
          <NavLink to="/flore" className="dropdown-link" onClick={closeAllMenus}>Restaurant Flore</NavLink>
          <NavLink to="/about" className="dropdown-link" onClick={closeAllMenus}>Bas Van Kranen</NavLink>
        </div>
      )}
    </>
  );
};

export default Navbar;
