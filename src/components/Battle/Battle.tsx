import { useStore } from "../../store/store"
import styles from "./Battle.module.scss"
import Unit from '../Unit/Unit'
import { Fraction, UnitType } from "../../types/types"

const Battle = () => {
  const { state } = useStore()
  const { battleQueue, regionDict } = state

  const current = battleQueue[0]
  const region = regionDict[current]

  const { garrison, attackingForces } = region
  console.log(garrison, attackingForces)

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      <Unit fraction={Fraction.German} unitType={UnitType.infantry} position={region.position} />
    </div>
  )
}

export default Battle