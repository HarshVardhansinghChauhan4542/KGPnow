import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import LocomotiveScroll from 'locomotive-scroll';

import CursorDesign from './components/Home/JSX/CursorDesign';
import LogoLoader from './components/Home/JSX/LogoLoader';
import AppRoutes from './AppRoutes.jsx';

// Component to handle Locomotive Scroll updates on route changes
const ScrollHandler = ({ containerRef, locomotiveRef }) => {
  const location = useLocation();

  useEffect(() => {
    if (locomotiveRef.current) {
      // Small delay to ensure DOM is updated after route change
      setTimeout(() => {
        locomotiveRef.current.update();
        locomotiveRef.current.scrollTo(0, { duration: 0, disableLerp: true });
      }, 100);
    }
  }, [location.pathname]);

  return null;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const locomotiveRef = useRef(null);

  // Loader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Locomotive Scroll setup
  useEffect(() => {
    if (!loading && containerRef.current && !locomotiveRef.current) {
      try {
        locomotiveRef.current = new LocomotiveScroll({
          el: containerRef.current,
          smooth: true,
          lerp: 0.1,
          multiplier: 0.8,
          smartphone: { smooth: true },
          tablet: { smooth: true },
        });

        // Refresh after images/videos load
        window.addEventListener('load', () => {
          locomotiveRef.current?.update();
        });
      } catch (error) {
        console.warn('Locomotive Scroll init failed:', error);
      }
    }

    return () => {
      locomotiveRef.current?.destroy();
      locomotiveRef.current = null;
    };
  }, [loading]);

  return loading ? (
    <LogoLoader />
  ) : (
    <Router>
      <CursorDesign />
      <main data-scroll-container ref={containerRef}>
        <ScrollHandler containerRef={containerRef} locomotiveRef={locomotiveRef} />
        <AppRoutes />
      </main>
    </Router>
  );
};

export default App;
