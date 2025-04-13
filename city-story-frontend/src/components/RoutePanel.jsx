import React, { useContext } from 'react';
import { RouteContext } from '../context/RouteContext';

const RoutePanel = () => {
  const { 
    routePoints, 
    showRoute, 
    routeMode, 
    clearRoute, 
    toggleShowRoute, 
    changeRouteMode,
    removeFromRoute
  } = useContext(RouteContext);

  const handleModeChange = (e) => {
    changeRouteMode(e.target.value);
  };

  const handleToggleRoute = () => {
    if (!toggleShowRoute() && routePoints.length < 2) {
      alert("Please add at least 2 landmarks to create a route.");
    }
  };

  return (
    <div className="route-panel">
      <h2>Your Route</h2>
      
      <div className="route-controls">
        <div className="route-mode-selector">
          <label htmlFor="route-mode">Travel mode:</label>
          <select 
            id="route-mode" 
            value={routeMode} 
            onChange={handleModeChange}
            className="route-mode-select"
          >
            <option value="WALKING">Walking</option>
            <option value="TRANSIT">Public Transit</option>
          </select>
        </div>
        
        <div className="route-actions">
          <button 
            className={`route-button ${showRoute ? 'route-button-hide' : 'route-button-show'}`}
            onClick={handleToggleRoute}
            disabled={routePoints.length < 2}
          >
            {showRoute ? 'Hide Route' : 'Show Route'}
          </button>
          
          <button 
            className="route-button route-button-clear"
            onClick={clearRoute}
            disabled={routePoints.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      
      {routePoints.length === 0 ? (
        <p className="route-empty-message">Click landmarks on the map to add them to your route.</p>
      ) : (
        <ul className="route-list">
          {routePoints.map((point, index) => (
            <li key={point.uid} className="route-item">
              <span className="route-number">{index + 1}</span>
              <span className="route-name">{point.name}</span>
              <button 
                className="route-remove-button" 
                onClick={() => removeFromRoute(point.uid)}
                aria-label="Remove from route"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoutePanel; 