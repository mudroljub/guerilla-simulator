import { v4 as uuidv4 } from 'uuid'
import { useStore } from "../../store/store"
import styles from "./Battle.module.scss"
import Unit from '../Unit/Unit'
import { Fraction, UnitType } from "../../types/types"
import { randomInRange, range } from "../../utils/math"

const createUnits = (
  num: number,
  fraction: Fraction,
  unitType: UnitType,
  xRange: [number, number],
  yRange = [0, window.innerHeight],
) =>
  range(num, () =>
    <Unit
      key={uuidv4()}
      fraction={fraction}
      unitType={unitType}
      position={{
        x: randomInRange(xRange[0], xRange[1]),
        y: randomInRange(yRange[0], yRange[1]),
      }}
    />
  )

const Battle = () => {
  const { state } = useStore()
  const { battleQueue, regionDict } = state

  const current = battleQueue[0]
  const region = regionDict[current]

  const { attackingForces, garrison } = region
  
  const partisans = createUnits(
    attackingForces!.infantry,
    Fraction.Partisan,
    UnitType.infantry,
    [window.innerWidth * 0.66, window.innerWidth]
  )

  const germans = createUnits(
    garrison.infantry,
    Fraction.German,
    UnitType.infantry,
    [0, window.innerWidth * 0.33]
  )

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      {germans}
      {partisans}
    </div>
  )
}

export default Battle