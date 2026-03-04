import { useEffect } from "react"
import { useStore } from "../store/store"

export const BattleLogic = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, isConductingCombat } = state

  useEffect(() => {
    if (!isConductingCombat) return

    if (battleQueue.length === 0) {
      dispatch({ type: "END_CONDUCT_COMBAT" })
      return
    }

    const currentRegionName = battleQueue[0]

    const element = document.getElementById(currentRegionName)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }

    // tajmer za pauzu (da igrač može da isprati šta se dešava)
    const timer = setTimeout(() => {
      dispatch({ type: "SIMULATE_BATTLE", regionName: currentRegionName })      
    }, 1500)

    return () => clearTimeout(timer)
    
  }, [isConductingCombat, battleQueue, dispatch])

  return null
}