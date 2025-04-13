import React, { createContext, useState } from 'react';

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [routePoints, setRoutePoints] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [routeMode, setRouteMode] = useState('WALKING');

  const addToRoute = (landmark) => {
    setRoutePoints(prev => [...prev.filter(point => point.uid !== landmark.uid), landmark]);
  };

  const removeFromRoute = (landmarkId) => {
    setRoutePoints(prev => prev.filter(point => point.uid !== landmarkId));
  };

  const clearRoute = () => {
    setRoutePoints([]);
    setShowRoute(false);
  };

  const isInRoute = (landmark) => {
    return routePoints.some(point => point.uid === landmark.uid);
  };

  const toggleShowRoute = () => {
    if (routePoints.length < 2) {
        return false;
    }
    setShowRoute(prev => !prev);
    return true;
  };

  const changeRouteMode = (mode) => {
    setRouteMode(mode);
  };

  return (
    <RouteContext.Provider
      value={{
        routePoints,
        showRoute,
        routeMode,
        addToRoute,
        removeFromRoute,
        clearRoute,
        isInRoute,
        toggleShowRoute,
        changeRouteMode
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}; 