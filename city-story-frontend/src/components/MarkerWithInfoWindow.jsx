import React, { useState, useEffect, useContext } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { RouteContext } from '../context/RouteContext';

const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 11);
};

const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const MarkerWithInfowindow = ({ uid, lat, lng, name, description }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const { addToRoute, removeFromRoute, isInRoute } = useContext(RouteContext);
  
  const isAddedToRoute = isInRoute({ uid, name, lat, lng });

  useEffect(() => {
    getOrCreateUserId();
  }, []);

  const handleRatingChange = async (e) => {
    const newRating = e.target.value;
    setRating(newRating);
    const userId = getOrCreateUserId();

    try {
      const response = await fetch(`https://city-story-server-1dab1cdfb3b7.herokuapp.com/landmarks/${uid}/ratings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, value: Number(newRating) })
      });
      if (response.ok) {
        setMessage("Rating submitted successfully!");
      } else {
        setMessage("Failed to submit rating.");
      }
    } catch (error) {
      setMessage("Error submitting rating: " + error.message);
    }
  };

  const handleRouteToggle = () => {
    if (isAddedToRoute) {
      removeFromRoute(uid);
    } else {
      addToRoute({ uid, name, lat, lng });
    }
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{ lat, lng }}
        title={name}
      />
      
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={300}
          onCloseClick={() => {
            setInfowindowOpen(false);
            setMessage('');
          }}
        >
          <div className="info-window-content" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '15px',
              maxWidth: '280px'
            }}>
            <div className="landmark-name">{name}</div>
            <p className="landmark-description">{description}</p>
            
            <button 
              onClick={handleRouteToggle}
              className={`route-button ${isAddedToRoute ? 'route-button-remove' : 'route-button-add'}`}
            >
              {isAddedToRoute ? 'Remove from Route' : 'Add to Route'}
            </button>
            
            <div className="rating-container">
              <label className="rating-label" htmlFor={`rating-${uid}`}>Rate this landmark: </label>
              <select 
                id={`rating-${uid}`} 
                value={rating} 
                onChange={handleRatingChange}
                className="rating-select"
              >
                <option value="" disabled>Select rating</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★</option>
                <option value="3">3 ★</option>
                <option value="4">4 ★</option>
                <option value="5">5 ★</option>
              </select>
            </div>
            {message && (
              <p className="message">{message}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};
