import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Home,
  BookOpen,
  ChefHat,
  Building2,
  UserCircle
} from 'lucide-react';
import '../components/ComponentsStyles/Navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: 'FoodLab', path: '/journals', icon: BookOpen },
    { name: 'Recipes', path: '/recipes', icon: ChefHat },
    { name: 'Restaurant Flore', path: '/flore', icon: Building2 },
    { name: 'Bas Van Kranen', path: '/about', icon: UserCircle },
  ];

  return (
    <>
      {/* Desktop Thin Sidebar */}
      <nav className={`navbar-sidebar ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'expanded' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo" onClick={closeMenu}>
            食研
          </NavLink>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-nav">
            <NavLink 
              to="/" 
              className="sidebar-nav-item"
              onClick={closeMenu}
            >
              <Home size={18} />
            </NavLink>

            <button
              className="sidebar-nav-item menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <NavLink 
              to={user ? "/profile" : "/signup"} 
              className="sidebar-nav-item"
              onClick={closeMenu}
            >
              <User size={18} />
            </NavLink>
          </div>

          {/* Expandable Menu */}
          <div className={`expanded-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-items">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="menu-item"
                  onClick={closeMenu}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navigation */}
      <nav className={`navbar-mobile ${scrolled ? 'scrolled' : ''}`}>
        <div className="mobile-nav-content">
          <NavLink to="/" className="mobile-logo" onClick={closeMenu}>
            食研
          </NavLink>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button 
                  className="close-mobile-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mobile-menu-items">
                <NavLink 
                  to="/" 
                  className="mobile-menu-item"
                  onClick={closeMenu}
                >
                  <Home size={18} />
                  <span>Home</span>
                </NavLink>

                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="mobile-menu-item"
                    onClick={closeMenu}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}

                <NavLink 
                  to={user ? "/profile" : "/signup"} 
                  className="mobile-menu-item"
                  onClick={closeMenu}
                >
                  <User size={18} />
                  <span>{user ? 'Profile' : 'Sign Up'}</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
