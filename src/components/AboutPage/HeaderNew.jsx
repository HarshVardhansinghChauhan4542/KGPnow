
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useNavigate } from 'react-router-dom';

const HeaderNew = () => {
  // Set viewport height variable for mobile browsers
  useEffect(() => {
    // First set viewport height
    const setViewportHeight = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Force full viewport height
      const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
      };
      
      window.addEventListener('resize', appHeight);
      appHeight();
      
      return () => window.removeEventListener('resize', appHeight);
    };
    
    // Set initial height and add event listeners
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    tl.set(".header-anim", { y: 30, opacity: 0 })
      .to(".header-anim", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.2,
        delay: 0.2
      });
  }, []);

  return (
    <div id="headerContainer">
      <div id="logoImg" className="header-anim">
        <Link to="/">
          <img src="/KGPnow.png" alt="logo" />
        </Link>
      </div>
      
      {/* Mobile Controls - Hamburger Menu and Theme Toggle */}
      <div className="mobile-controls">
        {/* Hamburger Menu Button */}
        <div 
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-button header-anim"
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Navigation Links */}
      <div 
        id="navLinks" 
        ref={menuRef}
        className={`${isMenuOpen ? 'mobile-visible' : ''}`}
      >
        <div className="bounding">
          <Link to="/" className="header-anim" onClick={() => setIsMenuOpen(false)}>Home</Link>
        </div>
        <div className="bounding">
          <Link to="/about" className="header-anim" onClick={() => setIsMenuOpen(false)}>About</Link>
        </div>
        <div className="bounding">
        </div>
        <div className="bounding">
          <button 
            className="logout-button header-anim" 
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
        <div className="bounding desktop-only">
          <button 
            className="theme-toggle-button header-anim"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
  
  // Helper function to detect mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
};

export default HeaderNew;
