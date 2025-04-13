import React, { useState, useEffect } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
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

  useEffect(() => {
    getOrCreateUserId();
  }, []);

  const handleRatingChange = async (e) => {
    const newRating = e.target.value;
    setRating(newRating);
    const userId = getOrCreateUserId();

    try {
      const response = await fetch(`https://placeholder-url.com/api/ratings/${uid}`, {
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
          maxWidth={200}
          onCloseClick={() => {
            setInfowindowOpen(false);
            setMessage('');
          }}
        >
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px'
            }}>
            <strong style={{ fontSize: '16px' }}>{name}</strong>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{description}</p>
            <div>
              <label htmlFor="rating">Rate (1-5): </label>
              <select id="rating" value={rating} onChange={handleRatingChange}>
                <option value="" disabled>Select rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            {message && (
              <p style={{ margin: 0, fontSize: '12px', color: '#333' }}>{message}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};
