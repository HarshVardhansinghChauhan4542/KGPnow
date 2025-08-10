import React, { useRef, useEffect } from 'react';
import HeaderNew from '../../AboutPage/HeaderNew';
import UploadEvent from '../UploadEvent/UploadEvent';
import EventList from '../EventList/EventList';
import './EventPage.css';

const EventPage = ({ category, title }) => {
  const eventListRef = useRef();

  // Function to refresh Locomotive Scroll
  const refreshLocomotiveScroll = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer && scrollContainer.locomotive) {
      setTimeout(() => {
        scrollContainer.locomotive.update();
        scrollContainer.locomotive.start();
      }, 200);
    }
  };

  const handleEventAdded = (newEvent) => {
    // Refresh the event list when a new event is added
    if (eventListRef.current && eventListRef.current.addEvent) {
      eventListRef.current.addEvent(newEvent);
    }
    // Refresh Locomotive Scroll after new event is added
    setTimeout(refreshLocomotiveScroll, 300);
  };

  // Refresh Locomotive Scroll when component mounts
  useEffect(() => {
    refreshLocomotiveScroll();
  }, []);

  return (
    <div className="event-page">
      <HeaderNew />
      <div className="event-page-content">
        <div className="event-page-header">
          <h1 className="event-page-title">{title}</h1>
          <UploadEvent category={category} onEventAdded={handleEventAdded} />
        </div>
        <EventList ref={eventListRef} category={category} />
      </div>
    </div>
  );
};

export default EventPage;
