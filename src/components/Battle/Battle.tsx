import { v4 as uuidv4 } from 'uuid'
import { useStore } from "../../store/store"
import styles from "./Battle.module.scss"
import Unit from '../Unit/Unit'
import { Fraction, UnitType } from "../../types/types"
import { randomInRange, range } from "../../utils/math"

const renderUnits = (
  count: number,
  fraction: Fraction,
  type: UnitType,
  xRange: [number, number],
  yRange: [number, number] = [0, window.innerHeight]
) =>
  range(count || 0, () => (
    <Unit
      key={uuidv4()}
      fraction={fraction}
      unitType={type}
      position={{
        x: randomInRange(xRange[0], xRange[1]),
        y: randomInRange(yRange[0], yRange[1]),
      }}
    />
  ))

const Battle = () => {
  const { state } = useStore()
  const { battleQueue, regionDict } = state
  const region = regionDict[battleQueue[0]]

  const germans = [UnitType.infantry, UnitType.artillery, UnitType.tanks].map((type) => 
    renderUnits(
      region.garrison[type] || 0,
      Fraction.German,
      type,
      [0, window.innerWidth * 0.4],
      [0, window.innerHeight]
    ))

  const partisans = renderUnits(
    region.attackingForces?.infantry || 0,
    Fraction.Partisan,
    UnitType.infantry,
    [window.innerWidth * 0.6, window.innerWidth]
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