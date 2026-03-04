import { useEffect } from "react"
import { useStore } from "../store/store"

export const BattleLogic = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, isProcessingBattles } = state

  useEffect(() => {
    if (!isProcessingBattles) return

    if (battleQueue.length === 0) {
      dispatch({ type: "FINISH_BATTLES" })
      return
    }

    const currentRegionName = battleQueue[0]

    // Tajmer za pauzu (da igrač može da isprati šta se dešava)
    const timer = setTimeout(() => {
      // Razreši bitku u toj trenutnoj regiji, nakon čega ide sledeća
      dispatch({ type: "RESOLVE_BATTLE", regionName: currentRegionName })      
    }, 1500)

    return () => clearTimeout(timer)
    
  }, [isProcessingBattles, battleQueue, dispatch])

  return null
}