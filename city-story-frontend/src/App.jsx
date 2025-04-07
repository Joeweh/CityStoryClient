import './App.css'
import { APIProvider, Map } from '@vis.gl/react-google-maps';

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
  return (
    <>
      <APIProvider apiKey={key}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          center={{ lat: 42.3601, lng: -71.0589 }}
          defaultZoom={14.5}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          options={mapOptions}
        />
      </APIProvider>
    </>
  )
}

export default App;
