import { useEffect } from "react"
import { useStore } from "../store/store"
import { GamePhase } from "../types/types"

export const BattleSimulator = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, phase } = state

  useEffect(() => {
    if (phase !== GamePhase.CONDUCT_COMBAT) return

    if (battleQueue.length === 0) {
      dispatch({ type: "END_CONDUCT_COMBAT" })
      return
    }

    const timer = setTimeout(() => {
      dispatch({ type: "SIMULATE_BATTLE", regionName: battleQueue[0] })      
    }, 1500)

    return () => clearTimeout(timer)
    
  }, [phase, battleQueue, dispatch])

  return null
}