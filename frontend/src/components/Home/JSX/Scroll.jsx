import React, { useEffect } from 'react';
import gsap from 'gsap';

const Scroll = () => {
  useEffect(() => {
    gsap.set(".scroll-anim", { y: 30, opacity: 0 });
    gsap.to(".scroll-anim", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.3,
    });
  }, []);

  return (
    <div id="scrollDown">
      <div className="bounding">
        <h5 className="scroll-anim">(Scroll)</h5>
      </div>
    </div>
  );
};

export default Scroll;
