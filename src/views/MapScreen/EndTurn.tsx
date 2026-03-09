import { useState, useEffect } from 'react'
import { useStore } from '../../store/store'
import { GamePhase } from '../../types/types'
import shared from '../../assets/styles/shared.module.scss'
import styles from './EndTurn.module.scss'

const EndTurn = () => {
  const { dispatch, state: { phase, regionDict } } = useStore()
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    setIsConfirming(false)
  }, [phase])

  const hasAttacks = Object.values(regionDict).some(
    r => r.attackingForces && Object.values(r.attackingForces).some(count => count > 0)
  )

  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' })
    setIsConfirming(false)
  }

  const onInitialClick = () => {
    if (phase === GamePhase.ATTACK_PHASE && !hasAttacks)
      setIsConfirming(true)
    else
      handleEndTurn()

  }

  if (isConfirming)
    return (
      <div className={styles.confirmWrapper}>
        <p>No battles started. End turn?</p>
        <div className={styles.buttons}>
          <button onClick={handleEndTurn} className={shared.button}>
            Yes
          </button>
          <button onClick={() => setIsConfirming(false)} className={shared.button}>
            No
          </button>
        </div>
      </div>
    )

  return (
    <button className={shared.roundButton} onClick={onInitialClick}>
      Next phase
    </button>
  )
}

export default EndTurn