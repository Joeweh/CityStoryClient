import './App.css'
import { useState, useEffect } from 'react';
import { 
  APIProvider,
  Map
} from '@vis.gl/react-google-maps';
import { MarkerWithInfowindow } from './components/MarkerWithInfoWindow';
import { RouteProvider } from './context/RouteContext';
import RoutePanel from './components/RoutePanel';
import { RouteDirections } from './components/RouteDirections';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#b3d1ff' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#e8e8dc' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#c9b18e' }]
    }
  ],
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  zoomControl: true,
  draggable: true,
  scrollwheel: true
};

function App() {
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://city-story-server-1dab1cdfb3b7.herokuapp.com/landmarks");
        const data = await response.json();
        setLandmarks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLandmarks();
  }, []);

  const handleMapLoad = (map) => {
    if (map && !mapInitialized) {
      map.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        gestureHandling: 'greedy'
      });
      setMapInitialized(true);
    }
  };

  return (
    <RouteProvider>
      <div className="app-container">
        <header className="header">
          <h1>CityStory: Boston</h1>
        </header>
        
        <div className="main-content">
          <div className="map-container">
            {loading ? (
              <div className="loading">Loading landmarks...</div>
            ) : (
              <APIProvider 
                apiKey={key}
                libraries={['places', 'directions']}
              >
                <Map
                  mapId={'6f0b5d4f2c4c0e9c'}
                  className="map"
                  center={{ lat: 42.3601, lng: -71.0589 }}
                  defaultZoom={14.5}
                  options={mapOptions}
                  onLoad={handleMapLoad}
                >
                  {landmarks.map((landmark) => (
                    <MarkerWithInfowindow
                      key={landmark.uid}
                      uid={landmark.uid}
                      lat={landmark.location.latitude}
                      lng={-landmark.location.longitude}
                      name={landmark.name}
                      description={landmark.description}
                      avgRating={landmark.averageRating}
                    />
                  ))}
                  <RouteDirections />
                </Map>
              </APIProvider>
            )}
          </div>
          <div className="sidebar">
            <RoutePanel />
          </div>
        </div>
      </div>
    </RouteProvider>
  );
}

export default App;
