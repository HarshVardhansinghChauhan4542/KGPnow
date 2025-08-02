import React, { useState, useEffect } from 'react';
import './EventList.css';
import LocomotiveScroll from 'locomotive-scroll';

const EventList = ({ category, newEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scroll, setScroll] = useState(null);

  const fetchEvents = async () => {
    try {
      console.log(`Fetching events for category: ${category}`);
      const response = await fetch(`http://localhost:3001/api/events?category=${category}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Events response:', data);
        
        // Handle new backend response format { success, count, events }
        const eventsArray = data.events || data;
        setEvents(Array.isArray(eventsArray) ? eventsArray : []);
      } else {
        console.error('Failed to fetch events:', response.status, response.statusText);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchEvents();
    }
  }, [category]);

  // Refresh Locomotive Scroll when events are loaded
  useEffect(() => {
    const refreshScroll = () => {
      // Find the Locomotive Scroll instance from the main container
      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (scrollContainer && scrollContainer.locomotive) {
        setTimeout(() => {
          scrollContainer.locomotive.update();
        }, 100);
      }
    };

    if (!loading && events.length > 0) {
      refreshScroll();
    }
  }, [loading, events]);

  const addEvent = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      {events.length === 0 ? (
        <div className="no-events">
          <p>No events posted yet in this category.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              {event.poster && (
                <div className="event-poster">
                  <img src={`http://localhost:3001${event.poster}`} alt={event.name} />
                </div>
              )}
              <div className="event-content">
                <h3 className="event-title">{event.name}</h3>
                {event.organization && (
                  <p className="event-organization">by {event.organization}</p>
                )}
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                <div className="event-details">
                  {event.venue && (
                    <p className="event-venue">📍 {event.venue}</p>
                  )}
                  {event.date && (
                    <p className="event-date">📅 {event.date}</p>
                  )}
                  {event.registrationLink && (
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="registration-link"
                    >
                      Register Now
                    </a>
                  )}
                </div>
                <div className="event-meta">
                  <small>Posted {new Date(event.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
