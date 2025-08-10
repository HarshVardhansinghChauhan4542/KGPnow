import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Header.css';

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create a simple theme context as fallback
const FallbackThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});

// Custom hook to handle theme state
const useTheme = () => {
  // First, try to use the actual theme context if it exists
  let context;
  try {
    // This will only work if ThemeContext is properly imported in the app
    const ThemeContext = React.createContext(); // This is just for the hook to not throw
    context = useContext(ThemeContext);
  } catch (error) {
    console.warn('Using fallback theme context');
  }

  // Fallback implementation
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update the theme when isDarkMode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Toggle function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Use the actual context if available, otherwise use fallback
  return context || { isDarkMode, toggleTheme };
};

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // Get theme context with fallback
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle cursor effects and click outside
  useEffect(() => {
    const getCursorElement = () => {
      // Try multiple possible cursor element selectors
      return (
        document.getElementById('miniCircle') ||
        document.querySelector('.cursor') ||
        document.querySelector('.cursor-circle') ||
        document.querySelector('.custom-cursor')
      );
    };

    const handleCursorEffect = (e) => {
      const cursorElement = getCursorElement();
      
      if (!cursorElement) {
        // Don't log warnings on every mousemove, just the first time
        if (!window.cursorWarningShown) {
          console.warn('Cursor element not found - ensure CursorDesign component is mounted');
          window.cursorWarningShown = true;
        }
        return;
      }

      // Get positions of mobile controls
      const hamburger = document.querySelector('.hamburger-menu');
      const themeToggle = document.querySelector('.theme-toggle');
      
      // Check if we're near any mobile control
      let isNearControl = false;
      const controls = [hamburger, themeToggle];
      
      for (const control of controls) {
        if (!control) continue;
        
        const rect = control.getBoundingClientRect();
        // Calculate center of the control
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from cursor to center of control
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + 
          Math.pow(e.clientY - centerY, 2)
        );
        
        // If within 60px of the control
        if (distance < 60) {
          isNearControl = true;
          break;
        }
      }

      // Toggle shrink class based on proximity
      if (isNearControl) {
        cursorElement.classList.add('shrink');
      } else {
        cursorElement.classList.remove('shrink');
      }
    };

    // Handle click outside menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger-menu')) {
        setIsMenuOpen(false);
      }
    };

    // Add event listeners with debounce to improve performance
    const debouncedCursorEffect = debounce(handleCursorEffect, 16); // ~60fps
    
    // Initial check for cursor element
    let retryCount = 0;
    const maxRetries = 10;
    
    const checkForCursorElement = () => {
      if (getCursorElement() || retryCount >= maxRetries) {
        // Cursor found or max retries reached
        document.addEventListener('mousemove', debouncedCursorEffect);
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        // Retry finding the cursor element
        retryCount++;
        setTimeout(checkForCursorElement, 100);
      }
    };
    
    // Start checking for cursor element
    checkForCursorElement();
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', debouncedCursorEffect);
      document.removeEventListener('mousedown', handleClickOutside);
      if (debouncedCursorEffect.cancel) {
        debouncedCursorEffect.cancel();
      }
    };
  }, []);

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
};

export default Header;
