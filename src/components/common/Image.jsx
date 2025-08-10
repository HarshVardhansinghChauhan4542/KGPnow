import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

/**
 * Optimized Image component with lazy loading and WebP support
 * @param {Object} props - Component props
 * @param {string} props.src - Source URL for the fallback image (required)
 * @param {string} [props.webpSrc] - WebP version of the image (optional)
 * @param {string} [props.alt] - Alt text for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @param {string|number} [props.width] - Image width
 * @param {string|number} [props.height] - Image height
 * @param {string} [props.loading] - Loading behavior ('eager'|'lazy')
 * @param {Object} [props.style] - Inline styles
 * @returns {React.ReactElement} Optimized image component
 */
const Image = ({ 
  src, 
  webpSrc, 
  alt = '', 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  style = {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <picture className={`image-container ${isLoaded ? 'loaded' : 'loading'}`}>
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
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        effect="opacity"
        width={width}
        height={height}
        loading={loading}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0.7,
          ...style
        }}
        onLoad={handleLoad}
        {...props}
      />
    </picture>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  webpSrc: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  style: PropTypes.object
};

export default Image;