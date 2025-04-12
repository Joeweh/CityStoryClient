import './App.css'
import { 
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin } from '@vis.gl/react-google-maps';
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

const getResponse = async () => {
  try {
    const response = await fetch("https://city-story-server-1dab1cdfb3b7.herokuapp.com/landmarks");
    const data = await response.json();
    console.log(data);}
  catch (error) {
    console.error('Error fetching data:', error);
  }
}
getResponse();

function App() {
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

    {/* Example Marker for Boston */}
     <MarkerWithInfowindow
        lat={42.3601}
        lng={-71.0589}
        name="Boston Marker"
        description="This marker is located in Boston."
      />

          </Map>
      </APIProvider>
      
    </>
  )
}

export default App;
