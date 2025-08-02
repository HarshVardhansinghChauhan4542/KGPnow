import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const AboutPart = () => {
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play();
      }
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.set(".boundingelem", { y: 100, opacity: 0 })
      .to(".boundingelem", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.2,
        delay: 0.3
      });
  }, []);

  return (
    <div id="aboutContainer">
      <div id="VideoPart">
        <div className="bounding">
          <h4 className="boundingelem">
            Play Reel <i className="ri-triangle-fill" />
          </h4>
        </div>
        <video src="/nuts-reel.mp4" autoPlay loop muted onClick={handleVideoClick} />
      </div>

      <div id="AboutText">
        <div className="bounding">
          <h5 className="boundingelem">KGPnow<sup>®</sup></h5>
        </div>
        <div className="bounding">
          <h1 className="boundingelem">KGP's LOUDEST</h1>
        </div>
        <div className="bounding">
          <h1 className="boundingelem">PLATFORM FOR DOERS</h1>
        </div>
        <div className="bounding">
          <h5 className="boundingelem" id="Description">
            All the news. All the chances. All of KGP.
          </h5>
        </div>
      </div>

      {isModalOpen && (
        <div className="fullscreen-modal" onClick={closeModal}>
          <div className="video-box" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              src="/nuts-reel.mp4"
              controls
              autoPlay
              className="fullscreen-video"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPart;
