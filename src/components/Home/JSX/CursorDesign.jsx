import React, { useEffect, useRef } from "react";

const CursorDesign = () => {
  const coords = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const observerRef = useRef(null);
  const addedElementsRef = useRef(new Set());
  const isNearLink = useRef(false);

  const globalCursorState = {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    isNearLink: false
  };

  useEffect(() => {
    const updateCircleColors = () => {
      const isDarkTheme = document.documentElement.getAttribute("data-theme") === "dark";
      circlesRef.current.forEach(circle => {
        if (circle) {
          circle.style.backgroundColor = isDarkTheme ? "#fff" : "#000";
          circle.style.borderColor = isDarkTheme ? "#fff" : "#000";
        }
      });
    };

    updateCircleColors();
    const themeObserver = new MutationObserver(updateCircleColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const shrinkCircles = () => {
      globalCursorState.isNearLink = true;
      circlesRef.current.forEach((circle) => {
        if (circle) {
          const transform = circle.style.transform.replace(/scale\([^)]+\)/g, '').trim();
          circle.style.transform = `${transform} scale(0.5)`;
        }
      });
    };
    
    const restoreCircles = () => {
      globalCursorState.isNearLink = false;
      circlesRef.current.forEach((circle) => {
        if (circle) {
          // Remove any scale and reset to default scale (1)
          const transform = circle.style.transform.replace(/scale\([^)]+\)/g, '').trim();
          circle.style.transform = transform;
        }
      });
    };
    
    // Restore cursor state if needed
    if (globalCursorState.isNearLink) {
      shrinkCircles();
    }

    // Check if cursor is near any interactive element
    const checkProximityToInteractive = (x, y) => {
      const elements = [
        ...document.querySelectorAll('a, button, [role="button"], .hamburger-menu, .hamburger, .menu-btn, .theme-toggle, #themeToggle, #toggleBtn, [data-cursor-shrink]'),
        document.getElementById('toggleBtn'),
        document.querySelector('.hamburger-menu'),
        document.querySelector('.hamburger'),
        document.querySelector('.menu-btn'),
        document.querySelector('.theme-toggle'),
        document.getElementById('themeToggle')
      ].filter((el, index, self) => el && self.indexOf(el) === index); // Remove duplicates
      
      const proximityThreshold = 40; // Increased threshold for better touch targets
      let nearInteractive = false;

      elements.forEach(el => {
        if (!el) return;
        
        const rect = el.getBoundingClientRect();
        // Expand the hit area slightly more for better UX
        const expandedRect = {
          left: rect.left - proximityThreshold,
          right: rect.right + proximityThreshold,
          top: rect.top - proximityThreshold,
          bottom: rect.bottom + proximityThreshold
        };

        if (x >= expandedRect.left && x <= expandedRect.right &&
            y >= expandedRect.top && y <= expandedRect.bottom) {
          nearInteractive = true;
        }
      });

      if (nearInteractive && !isNearLink.current) {
        shrinkCircles();
        isNearLink.current = true;
      } else if (!nearInteractive && isNearLink.current) {
        restoreCircles();
        isNearLink.current = false;
      }
    };

    const addHoverListeners = () => {
      // Media elements and interactive elements
      const interactiveElements = [
        ...document.querySelectorAll('img, video, a, button, [role="button"], [data-cursor-shrink]'),
        document.getElementById('toggleBtn'),
        document.querySelector('.hamburger-menu'),
        document.querySelector('.hamburger'),
        document.querySelector('.menu-btn'),
        document.querySelector('.theme-toggle'),
        document.getElementById('themeToggle')
      ].filter((el, index, self) => el && self.indexOf(el) === index);
      
      interactiveElements.forEach((el) => {
        if (!addedElementsRef.current.has(el)) {
          el.addEventListener("mouseenter", shrinkCircles);
          el.addEventListener("mouseleave", restoreCircles);
          addedElementsRef.current.add(el);
        }
      });
    };

    const removeHoverListeners = (el) => {
      el.removeEventListener("mouseenter", shrinkCircles);
      el.removeEventListener("mouseleave", restoreCircles);
      addedElementsRef.current.delete(el);
    };

    // MutationObserver to detect new images/videos dynamically
    observerRef.current = new MutationObserver(() => setTimeout(addHoverListeners, 50));
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    /** ====== CIRCLE INITIAL SETUP ====== **/
    circlesRef.current.forEach((circle, index) => {
      circle.x = 0;
      circle.y = 0;

      // Gradually shrink tail size
      const size = 20 * (1 - index / circlesRef.current.length);
      const finalSize = Math.max(size, 4);

      circle.style.width = `${finalSize}px`;
      circle.style.height = `${finalSize}px`;
      circle.style.borderRadius = "50%";
      circle.style.position = "fixed";
      circle.style.pointerEvents = "none";
      circle.style.zIndex = 99999999;
    });

    /** ====== MOUSE FOLLOW ANIMATION ====== **/
    const handleMouseMove = (e) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
      globalCursorState.x = e.clientX;
      globalCursorState.y = e.clientY;
      checkProximityToInteractive(e.clientX, e.clientY);
    };

    // Initialize with current mouse position or center of screen
    const initCursorPosition = () => {
      coords.current.x = globalCursorState.x;
      coords.current.y = globalCursorState.y;
      checkProximityToInteractive(globalCursorState.x, globalCursorState.y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Initialize cursor position when component mounts or when tab becomes visible
    initCursorPosition();
    document.addEventListener('visibilitychange', initCursorPosition);

    const animateCircles = () => {
      let x = coords.current.x;
      let y = coords.current.y;

      circlesRef.current.forEach((circle, index) => {
        circle.style.left = `${x - circle.offsetWidth / 2}px`;
        circle.style.top = `${y - circle.offsetHeight / 2}px`;

        const nextCircle = circlesRef.current[index + 1] || circlesRef.current[0];
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;

        circle.x = x;
        circle.y = y;
      });

      requestAnimationFrame(animateCircles);
    };

    animateCircles();
    addHoverListeners();

    /** ====== CLEANUP ====== **/
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener('visibilitychange', initCursorPosition);
      if (observerRef.current) observerRef.current.disconnect();
      themeObserver.disconnect();
      addedElementsRef.current.forEach(removeHoverListeners);
    };
  }, []);

  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} ref={(el) => (circlesRef.current[i] = el)} className="circle"></div>
      ))}
    </>
  );
};

export default CursorDesign;
