import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNew from '../../AboutPage/HeaderNew';
import './EventDetails.css';
import EventDetailsZoomImage from './EventDetailsZoomImage';
import gsap from 'gsap';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation refs
  const titleRef = useRef(null);
  const orgRef = useRef(null);
  const imgContainerRef = useRef(null);

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/events/${id}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Entrance animation for title/org/image (after event loads)
  useEffect(() => {
    if (!event) return;
    gsap.set([titleRef.current, orgRef.current], { y: 40, opacity: 0 });
    gsap.set(imgContainerRef.current, { x: -80, opacity: 0 });
    gsap.to([titleRef.current, orgRef.current], {
      y: 0,
      opacity: 1,
      duration: 2,
      ease: "power3.out",
      stagger: 0.28,
      delay: 0.22
    });
    gsap.to(imgContainerRef.current, {
      x: 0,
      opacity: 1,
      duration: 2,
      ease: "power3.out",
      delay: 0.45
    });
  }, [event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/events/${id}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="event-details-loading">Loading event details...</div>;
  if (error) return <div className="event-details-error">{error}</div>;
  if (!event) return null;

  return (
    <>
      <HeaderNew />
      <div className="event-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}><i class="ri-arrow-left-line"></i> Back to all Events</button>
        <div className="event-details-card">
          {event.poster && (
            <div className="event-details-poster-header-group">
              <h1 className="event-details-title event-anim-text" ref={titleRef}>{event.name}</h1>
              {event.organization && <h3 className="event-details-organization event-anim-text" ref={orgRef}>by {event.organization}</h3>}
              <div className="event-details-poster event-anim-img" ref={imgContainerRef}>
                <EventDetailsZoomImage 
                  src={`http://localhost:3001${event.poster}`}
                  webpSrc={event.poster ? `http://localhost:3001${event.poster.replace(/\.(jpg|jpeg|png)$/i, '.webp')}` : null}
                  alt={event.name}
                  width="100%"
                  height="auto"
                />
              </div>
            </div>
          )}
          <div className="event-details-content">
            <div className="event-details-meta">
              {event.date && <p><strong>Date & Time:</strong> {event.date}</p>}
              {event.venue && <p><strong>Venue:</strong> {event.venue}</p>}
            </div>
            <p className="event-details-description">{event.description}</p>
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="event-details-register"
              >
                Register Now
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
