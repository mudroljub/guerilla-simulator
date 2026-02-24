import Map from './views/Map/Map'
import { MapProvider } from "./store/store";
import { RegionData } from './types/types';
import { initRegions } from './utils/initRegions';

const regions: RegionData[] = initRegions()

function App() {
  return (
    <MapProvider regions={regions}>
      <Map regions={regions} />
    </MapProvider>
  );
}

export default App;
