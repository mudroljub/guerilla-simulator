import { useStore } from './store/store'
import { GamePhase } from './types/types'
import MapScreen from './views/MapScreen/MapScreen'
import BattleScreen from './views/BattleScreen/BattleScreen'

function App() {
  const { state: { phase } } = useStore()

  return (
    <>
      {phase !== GamePhase.COMBAT_PHASE && <MapScreen />}
      {phase === GamePhase.COMBAT_PHASE && <BattleScreen />}
    </>
  )
}

export default App