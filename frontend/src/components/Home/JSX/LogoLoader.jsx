import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LogoLoader = () => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const logoFillRef = useRef(null);
  const barFillRef = useRef(null);

  useEffect(() => {
    // Animate logo gradient fill
    gsap.to(logoFillRef.current, {
      width: '100%',
      duration: 5,
      ease: 'power2.out',
    });

    // Percentage and loader logic
    let counter = 0;
    const interval = setInterval(() => {
      counter += 1;
      setProgress(counter);

      // Animate loader bar with progress
      gsap.to(barFillRef.current, {
        width: `${counter}%`,
        duration: 0.2,
        ease: 'power1.out',
      });

      if (counter >= 100) {
        clearInterval(interval);

        // Shrink loader screen
        gsap.to(loaderRef.current, {
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = 'none';
          },
        });
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container" ref={loaderRef}>
      <div className="logo-wrapper">
        <img src="/KGPnow.png" alt="Logo outline" className="logo-outline" />
        <div className="logo-fill" ref={logoFillRef} />
      </div>

      {/* Loader bar */}
      <div className="loader-bar">
        <div className="loader-bar-fill" ref={barFillRef} />
      </div>

      <p className="loader-percentage">{progress}%</p>
    </div>
  );
};

export default LogoLoader;
