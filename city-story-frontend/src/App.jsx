import './App.css'
import { useState, useEffect } from 'react';
import { 
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin 
} from '@vis.gl/react-google-maps';
import { MarkerWithInfowindow } from './components/MarkerWithInfoWindow';

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
    }
  ]
};

function App() {
  const [landmarks, setLandmarks] = useState([]);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const response = await fetch("https://city-story-server-1dab1cdfb3b7.herokuapp.com/landmarks");
        const data = await response.json();
        setLandmarks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchLandmarks();
  }, []);

  return (
    <>
      <APIProvider apiKey={key}>
        <Map
          mapId={'6f0b5d4f2c4c0e9c'}
          style={{ width: '75vw', height: '75vh' }}
          center={{ lat: 42.3601, lng: -71.0589 }}
          defaultZoom={14.5}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          options={mapOptions}
        >
          {landmarks.map((landmark) => (
            <MarkerWithInfowindow
              key={landmark.uid}
              uid={landmark.uid}
              lat={landmark.location.latitude}
              lng={-landmark.location.longitude}
              name={landmark.name}
              description={landmark.description}
            />
          ))}
        </Map>
      </APIProvider>
    </>
  );
}

export default App;
