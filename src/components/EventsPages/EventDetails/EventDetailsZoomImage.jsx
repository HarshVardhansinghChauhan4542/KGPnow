import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * EventDetailsZoomImage
 * Reusable image component with lazy loading, WebP support, and GSAP ScrollTrigger zoom effect.
 *
 * @param {string} src - Image source URL (required)
 * @param {string} webpSrc - WebP version of the image (optional)
 * @param {string} alt - Alt text for accessibility (required)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 * @param {string|number} width - Image width
 * @param {string|number} height - Image height
 * @returns {React.ReactElement} Zoomable image component
 */
const EventDetailsZoomImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className = "", 
  style = {},
  width = "100%",
  height = "auto"
}) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const img = containerRef.current.querySelector('img');
    if (!img) return;

    // GSAP ScrollTrigger zoom effect
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1 },
        {
          scale: 1.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, containerRef.current);

    return () => {
      ctx.revert();
    };
  }, [isLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`zoom-image-scroll-container ${className}`}
      style={{ 
        position: "relative", 
        overflow: "hidden", 
        ...style 
      }}
    >
      <picture>
        {webpSrc && (
          <source 
            srcSet={webpSrc} 
            type="image/webp" 
            onLoad={handleLoad}
          />
        )}
        <LazyLoadImage
          src={src}
          alt={alt}
          effect="opacity"
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className={`zoom-image-scroll-img ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
        />
      </picture>
    </div>
  );
};

EventDetailsZoomImage.propTypes = {
  src: PropTypes.string.isRequired,
  webpSrc: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

EventDetailsZoomImage.defaultProps = {
  alt: "Event image",
  className: "",
  style: {},
  webpSrc: null,
  width: "100%",
  height: "auto",
};

export default EventDetailsZoomImage;
