import React, { useEffect, useRef } from 'react';
import HeaderNew from './HeaderNew';
import './About.css';
import gsap from 'gsap';

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const [text1, text2] = container.children;

    gsap.set([text1, text2], { xPercent: -100 });

    gsap.to([text1, text2], {
      xPercent: 0,
      duration: 40,
      repeat: -1,
      ease: 'linear',
      modifiers: {
        xPercent: gsap.utils.wrap(-100, 0),
      },
    });
  }, []);

  return (
    <>
      <HeaderNew />
      <div className="BigContainer">
      <div className="moving-container" ref={containerRef}>
          <h1 className="MovingLine">KGPnow &nbsp; KGPnow &nbsp; KGPnow &nbsp; KGPnow &nbsp; KGPnow</h1>
          <h1 className="MovingLine">KGPnow &nbsp; KGPnow &nbsp; KGPnow &nbsp; KGPnow &nbsp; KGPnow</h1>
        </div>
        <div className="BambooDiv">
          <img src="https://plus.unsplash.com/premium_photo-1694864661950-288ec8a06e5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFtYm9vc3xlbnwwfHwwfHx8MA%3D%3D" alt="AboutMeImage" className="Photo"></img>
        </div>

        <div className="AboutText">
          <h1>About Us</h1>
          <p>KGPnow is a platform for doers. It is a platform for all the news, all the chances, all of KGP.</p>
        </div>
      </div>
    </>
  );
};

export default About;
