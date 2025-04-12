import React, { useState } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({ lat, lng, name, description }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

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
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px',
            }}
          >
            <strong style={{ fontSize: '16px' }}>{name}</strong>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{description}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
