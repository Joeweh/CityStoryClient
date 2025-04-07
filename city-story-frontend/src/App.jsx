import './App.css'
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function App() {
  return (
    <>
      <APIProvider apiKey={key}>
    <Map
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
  </APIProvider>
    </>
  )
}

export default App
