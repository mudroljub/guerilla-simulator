import Map from './components/Map/Map'
import { Provider } from "./store/store";
import { RegionData } from './types/types';
import { initRegions } from './utils/initRegions';
import legend from './assets/images/legenda.webp';
import styles from "./App.module.scss";

const regions: RegionData[] = initRegions()

function App() {
  return (
    <Provider regions={regions}>
      <Map regions={regions} />
      <img src={legend} alt="legend" className={styles.legend} />
    </Provider>
  );
}

export default App;
