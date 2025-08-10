import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EventList.css';
import Image from '../../common/Image';

const EventList = forwardRef(({ category, newEvent }, ref) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());

  // Helper function to parse date from various formats
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Try parsing as ISO string
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;
    
    // Try parsing as timestamp (if it's a number)
    if (!isNaN(dateString)) {
      date = new Date(parseInt(dateString));
      if (!isNaN(date.getTime())) return date;
    }
    
    // Try parsing as DD/MM/YYYY or MM/DD/YYYY
    const parts = dateString.split(/\D+/);
    if (parts.length >= 3) {
      // Try DD/MM/YYYY
      date = new Date(parts[2], parts[1] - 1, parts[0]);
      if (!isNaN(date.getTime())) return date;
      
      // Try MM/DD/YYYY
      date = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(date.getTime())) return date;
    }
    
    console.warn('Could not parse date:', dateString);
    return null;
  };

  // Filter events based on active filter
  const filterEvents = (eventsToFilter, filterType) => {
    if (!Array.isArray(eventsToFilter)) {
      console.error('Invalid events array provided to filterEvents');
      setFilteredEvents([]);
      return;
    }
    
    // Create current date at midnight for accurate date comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    console.log('Current date for comparison (YYYY-MM-DD):', now.toISOString().split('T')[0]);
    
    const filtered = eventsToFilter.filter(event => {
      if (!event) return false;
      
      if (!event.date) {
        console.log('No date found for event:', event.name);
        return false;
      }
      
      try {
        // Parse the date using our helper function
        const eventDate = parseDate(event.date);
        
        if (!eventDate || isNaN(eventDate.getTime())) {
          console.log('Invalid date for event:', event.name, 'Date string:', event.date);
          return false;
        }
        
        // Normalize to midnight for accurate comparison
        const eventDateAtMidnight = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate()
        );
        
        // Log dates in YYYY-MM-DD format for easier reading
        const eventDateStr = eventDateAtMidnight.toISOString().split('T')[0];
        const nowStr = now.toISOString().split('T')[0];
        
        console.log(`Event: ${event.name}`);
        console.log(`  Date: ${eventDateStr} (from: ${event.date})`);
        console.log(`  Today: ${nowStr}`);
        
        switch(filterType) {
          case 'bookmarked':
            // Show only bookmarked events
            return bookmarkedEvents.has(event._id);
          default:
            return true; // 'all' filter
        }
      } catch (error) {
        console.error('Error filtering event:', error, event);
        return false;
      }
    });
    
    // Sort events by date (most recent first)
    const sorted = [...filtered].sort((a, b) => {
      try {
        if (!a.date || !b.date) return 0;
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Sort by most recent first
        return dateB - dateA;
      } catch (error) {
        console.error('Error sorting events:', error);
        return 0;
      }
    });
    
    setFilteredEvents(sorted);
  };

  const fetchEvents = async () => {
    try {
      // Use 'all' as default category if not provided
      const categoryParam = category || 'all';
      console.log(`Fetching events for category: ${categoryParam}`);
      
      const response = await fetch(`http://localhost:3001/api/events?category=${categoryParam}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Events response:', data);

        // Handle new backend response format { success, count, events }
        const eventsArray = data.events || data;
        const validEvents = Array.isArray(eventsArray) ? eventsArray : [];
        setEvents(validEvents);
        // Apply current filter to the new events
        filterEvents(validEvents, activeFilter);
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
    // Fetch events on component mount and when category changes
    fetchEvents();
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

  // Toggle bookmark status for an event
  const toggleBookmark = useCallback((eventId, e) => {
    e.stopPropagation(); // Prevent event card click when clicking bookmark
    setBookmarkedEvents(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(eventId)) {
        newBookmarks.delete(eventId);
      } else {
        newBookmarks.add(eventId);
      }
      // Save to localStorage
      localStorage.setItem('bookmarkedEvents', JSON.stringify(Array.from(newBookmarks)));
      return newBookmarks;
    });
  }, []);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedEvents');
    if (savedBookmarks) {
      setBookmarkedEvents(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    filterEvents(events, filterType);
  };

  // Format date for display with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If the date is already in the desired format (e.g., "2nd August, 2025 & 5:00PM")
    if (dateString.includes('&')) {
      return dateString;
    }
    
    try {
      // Try to parse the date string
      let date;
      
      // If it's a timestamp (number)
      if (typeof dateString === 'number') {
        date = new Date(dateString);
      } 
      // If it's a date string in ISO format (e.g., '2023-08-07T00:00:00.000Z')
      else if (dateString.includes('T')) {
        date = new Date(dateString);
      }
      // If it's a date string in a different format (e.g., '2023-08-07')
      else {
        // Try to handle different date string formats
        const dateParts = dateString.split('-');
        if (dateParts.length === 3) {
          // Assuming YYYY-MM-DD format
          date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        } else {
          // Last resort - let the Date constructor try to parse it
          date = new Date(dateString);
        }
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return '';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata' // Adjust timezone as needed
      };
      
      // Format the date part
      const formattedDate = date.toLocaleDateString('en-US', options);
      
      // Format the time part
      const timeOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      };
      const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
      
      return `${formattedDate} & ${formattedTime}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Get first two words for the tag
  const getEventTag = (name) => {
    if (!name) return 'Event';
    const words = name.split(' ').slice(0, 2);
    return words.join(' ');
  };

  // Update filtered events when events or activeFilter changes
  useEffect(() => {
    filterEvents(events, activeFilter);
  }, [events, activeFilter]);

  // Expose the addEvent method to parent via ref
  useImperativeHandle(ref, () => ({
    addEvent: (newEvent) => {
      setEvents(prev => [newEvent, ...prev]);
    }
  }));

  return (
    <div className="event-gallery">
      <div className="gallery-header">
        <h1>Events</h1>
        <div className="gallery-filters">
          <button 
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={activeFilter === 'bookmarked' ? 'active' : ''}
            onClick={() => handleFilterChange('bookmarked')}
          >
            Bookmarked
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <motion.div 
              key={event._id} 
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => navigate(`/events/details/${event._id}`)}
            >
              <div className="event-image-container">
                <button 
                  className={`bookmark-button ${bookmarkedEvents.has(event._id) ? 'bookmarked' : ''}`}
                  onClick={(e) => toggleBookmark(event._id, e)}
                  aria-label={bookmarkedEvents.has(event._id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <i className={`ri-${bookmarkedEvents.has(event._id) ? 'bookmark-fill' : 'bookmark-line'}`}></i>
                </button>
                {event.poster ? (
                  <Image
                    src={`http://localhost:3001${event.poster}`}
                    webpSrc={event.poster ? `http://localhost:3001${event.poster.replace(/\.(jpg|jpeg|png)$/i, '.webp')}` : null}
                    alt={event.name}
                    className="event-image"
                  />
                ) : (
                  <div className="event-image-placeholder">
                    <span>{event.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="event-info">
                <div className="event-date">{formatDate(event.date)}</div>
                <h3 className="event-title">{event.name}</h3>
                <div className="event-meta">
                  {event.venue && (
                    <div className="event-venue">
                      <i className="ri-map-pin-line"></i>
                      <span>{event.venue}</span>
                    </div>
                  )}
                  {event.organization && (
                    <div className="event-organization">
                      <i className="ri-group-line"></i>
                      <span>{event.organization}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No events found matching your criteria.</p>
        </div>
      )}
    </div>
  )
});

export default EventList;
