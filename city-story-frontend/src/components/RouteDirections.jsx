import React, { useContext, useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { RouteContext } from '../context/RouteContext';

export const RouteDirections = () => {
  const { routePoints, showRoute, routeMode } = useContext(RouteContext);
  const [directions, setDirections] = useState(null);
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!map || !window.google) return;
    
    const renderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#8b0000',
        strokeOpacity: 0.8,
        strokeWeight: 5
      }
    });
    
    renderer.setMap(map);
    setDirectionsRenderer(renderer);
    
    return () => {
      renderer.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!showRoute || routePoints.length < 2 || !window.google || !directionsRenderer) {
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] });
      }
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const waypoints = routePoints.slice(1, -1).map(point => ({
      location: { lat: point.lat, lng: point.lng },
      stopover: true
    }));

    const request = {
      origin: { lat: routePoints[0].lat, lng: routePoints[0].lng },
      destination: { 
        lat: routePoints[routePoints.length - 1].lat, 
        lng: routePoints[routePoints.length - 1].lng 
      },
      waypoints: waypoints,
      travelMode: routeMode,
      optimizeWaypoints: true
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        setDirections(result);
      } else {
        console.error(`Directions request failed with status: ${status}`);
        alert(`Could not calculate route: ${status}`);
        directionsRenderer.setDirections({ routes: [] });
        setDirections(null);
      }
    });
  }, [routePoints, showRoute, routeMode, directionsRenderer]);

  useEffect(() => {
    if (!showRoute && directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [showRoute, directionsRenderer]);

  return null; 
}; 