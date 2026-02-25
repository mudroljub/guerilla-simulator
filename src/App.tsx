import Map from './views/Map/Map'
import { Provider } from "./store/store";
import { RegionData } from './types/types';
import { initRegions } from './utils/initRegions';

const regions: RegionData[] = initRegions()

function App() {
  return (
    <Provider regions={regions}>
      <Map regions={regions} />
    </Provider>
  );
}

export default App;
