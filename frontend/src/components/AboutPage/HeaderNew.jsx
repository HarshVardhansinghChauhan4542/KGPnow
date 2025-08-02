
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useNavigate } from 'react-router-dom';

const HeaderNew = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

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
    // <section data-scroll-section>
      <div id="headerContainer">
        <div id="logoImg">
          <img src="/KGPnow.png" alt="logo" />
        </div>
        <div id="navLinks">
          <div className="bounding">
            <Link to="/" className="header-anim">Home</Link>
          </div>
          <div className="bounding">
            <Link to="/about" className="header-anim">About</Link>
          </div>

          <div className="bounding">
            <button className="logout-button header-anim" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="bounding">
            <div
              id="toggleBtn"
              className={`header-anim ${isDarkMode ? 'dark' : 'light'}`}
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            ></div>
          </div>
        </div>
      </div>
    // </section>
  );
};

export default HeaderNew;
