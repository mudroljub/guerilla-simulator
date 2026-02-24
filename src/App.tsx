import Map from './views/Map/Map'
import Modal from './components/Modal/Modal'
import { MapProvider } from "./store/store";
import { RegionData } from './types/types';
import { initRegions } from './views/Map/utils';

const regions: RegionData[] = initRegions()

function App() {
  return (
    <MapProvider regions={regions}>
      <Modal />
      <Map regions={regions} />
    </MapProvider>
  );
}

export default App;
