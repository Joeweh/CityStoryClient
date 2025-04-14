import React, { useState, useEffect, useContext } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef, useMap } from '@vis.gl/react-google-maps';
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

export const MarkerWithInfowindow = ({ uid, lat, lng, name, description, avgRating, isOpen, onOpen }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const { addToRoute, removeFromRoute, isInRoute } = useContext(RouteContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const map = useMap();
  
  const isAddedToRoute = isInRoute({ uid, name, lat, lng });
  const imagePath = `/${uid}.png`;

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Sync internal state with props
  useEffect(() => {
    setInfowindowOpen(isOpen);
    if (isOpen) {
      // Reset image state when opening
      setImageLoaded(false);
      setImageError(false);
    }
  }, [isOpen]);

  // Pan map when InfoWindow opens to ensure it's visible
  useEffect(() => {
    if (infowindowOpen && map && marker) {
      const position = { lat, lng };
      const bounds = map.getBounds();
      
      if (bounds) {
        const topPadding = 180; // Pixels of padding at the top
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        
        // If marker is near the top edge of the map
        if (lat > (northEast.lat() - (northEast.lat() - southWest.lat()) * 0.3)) {
          // Calculate a position that puts the InfoWindow in view
          map.panTo({ lat: lat - 0.003, lng });
          map.panBy(0, -topPadding);
        }
      }
    }
  }, [infowindowOpen, map, marker, lat, lng]);

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

  const handleMarkerClick = () => {
    onOpen(uid);
  };

  const handleInfoWindowClose = () => {
    onOpen(null);
    setMessage('');
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={handleMarkerClick}
        position={{ lat, lng }}
        title={name}
      />
      
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={270}
          pixelOffset={{ x: 0, y: -20 }}
          onCloseClick={handleInfoWindowClose}
          options={{
            disableAutoPan: false
          }}
        >
          <div className="info-window-content">
            {!imageError && (
              <div className="landmark-image-container">
                <img 
                  src={imagePath} 
                  alt={name}
                  className={`landmark-image ${imageLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {!imageLoaded && !imageError && (
                  <div className="image-loading">Loading image...</div>
                )}
              </div>
            )}
            
            <div className="landmark-name">{name}</div>
            <p className="landmark-description">{description}</p>
            
            <button 
              onClick={handleRouteToggle}
              className={`route-button ${isAddedToRoute ? 'route-button-remove' : 'route-button-add'}`}
            >
              {isAddedToRoute ? 'Remove from Route' : 'Add to Route'}
            </button>
            
            <div className="rating-container">
              <p className="average-rating">Rating: {avgRating ? Number(avgRating).toFixed(1) + ' ★' : 'None yet'}</p>
              <label className="rating-label" htmlFor={`rating-${uid}`}>Rate: </label>
              <select 
                id={`rating-${uid}`} 
                value={rating} 
                onChange={handleRatingChange}
                className="rating-select"
              >
                <option value="" disabled>Select</option>
                <option value="1">1★</option>
                <option value="2">2★</option>
                <option value="3">3★</option>
                <option value="4">4★</option>
                <option value="5">5★</option>
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
