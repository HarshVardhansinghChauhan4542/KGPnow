import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Tabs = () => {
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  // Mapping between image labels and their corresponding routes
  const labelToRoute = {
    'Red Oak': '/events/red-oak',
    'Amazon Forest': '/events/amazon-forest',
    'Cherry Blossom': '/events/cherry-blossom',
    'Cascading Waterfall': '/events/waterfall',
    'Sunset Over the Ocean': '/events/sunset',
    'Mountains': '/events/mountains',
    'Fog Forest': '/events/fog-forest',
    'Autumn Leaves': '/events/autumn-leaves',
    'Winter Forest': '/events/winter-forest'
  };

  const handleImageClick = (label) => {
    const route = labelToRoute[label];
    if (route) {
      navigate(route);
    }
  };

  const images = [
    { src: 'https://images.unsplash.com/photo-1746699421299-ac9d7e868855?w=600&auto=format&fit=crop&q=60', label: 'Red Oak' },
    { src: 'https://images.unsplash.com/photo-1743485753903-379f8aa68ad1?w=1000&auto=format&fit=crop&q=60', label: 'Amazon Forest' },
    { src: 'https://images.unsplash.com/photo-1743525046953-e2ef425c6953?w=1000&auto=format&fit=crop&q=60', label: 'Cherry Blossom' },
    { src: 'https://images.unsplash.com/photo-1743953273017-6a5e0c14ce40?w=1000&auto=format&fit=crop&q=60', label: 'Cascading Waterfall' },
    { src: 'https://images.unsplash.com/photo-1744105874825-f72b712ab662?w=1000&auto=format&fit=crop&q=60', label: 'Sunset Over the Ocean' },
    { src: 'https://images.unsplash.com/photo-1743878206228-5f36b5f5c830?w=1000&auto=format&fit=crop&q=60', label: 'Mountains' },
    { src: 'https://images.unsplash.com/photo-1743191771058-d06e793dda2d?w=1000&auto=format&fit=crop&q=60', label: 'Fog Forest' },
    { src: 'https://images.unsplash.com/photo-1744140390489-fc279d403107?w=1000&auto=format&fit=crop&q=60', label: 'Autumn Leaves' },
    { src: 'https://plus.unsplash.com/premium_photo-1746111961796-25b5977f4ecc?w=1000&auto=format&fit=crop&q=60', label: 'Winter Forest' },
  ];

  const repeatedImages = [...images, ...images, ...images];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollToMiddle = () => {
      const oneThird = scroller.scrollWidth / 3;
      scroller.scrollLeft = oneThird;
    };

    scrollToMiddle();

    const handleWheel = (e) => {
      e.preventDefault();

      const speed = 2;
      scroller.scrollLeft += e.deltaY * speed;

      const scrollLeft = scroller.scrollLeft;
      const scrollWidth = scroller.scrollWidth;
      const oneThird = scrollWidth / 3;
      const twoThirds = 2 * oneThird;

      if (scrollLeft <= oneThird - 200) {
        scroller.scrollLeft = scrollLeft + oneThird;
      } else if (scrollLeft >= twoThirds + 200) {
        scroller.scrollLeft = scrollLeft - oneThird;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section id="TabsContainer">
      <div id="scroller" ref={scrollerRef}>
        {repeatedImages.map(({ src, label }, i) => (
          <div className="image-wrapper" key={i}>
            <img 
              src={src} 
              alt={`img-${i}`} 
              onClick={() => handleImageClick(label)}
              style={{ cursor: 'pointer' }}
            />
            <p className="image-label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tabs;
