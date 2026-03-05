import { useStore } from "../../store/store"
import styles from "./Battle.module.scss";

const Battle = () => {
  const { state, dispatch } = useStore()
  const { battleQueue, regionDict } = state

  const current = battleQueue[0]
  const region = regionDict[current]

  const { garrison, attackingForces } = region
  console.log(garrison, attackingForces)

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
    </div>
  )
}

export default Battle