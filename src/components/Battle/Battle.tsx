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

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const germanX: [number, number] = [0, screenWidth * 0.4]
  const partisanX: [number, number] = [screenWidth * 0.6, screenWidth]

  const germanUnits = Object.entries(UnitType).map(([key, type]) => {
    const yRange: [number, number] = type === UnitType.aircraft 
      ? [0, screenHeight * 0.25] 
      : [0, screenHeight]

    return renderUnits(
      region.garrison[type] || 0,
      Fraction.German,
      type,
      germanX,
      yRange
    )
  })

  const partisans = renderUnits(
    region.attackingForces?.infantry || 0,
    Fraction.Partisan,
    UnitType.infantry,
    partisanX
  )

  return (
    <div className={styles.container}>
      <h1>Battle for {region.name}</h1>
      {germanUnits}
      {partisans}
    </div>
  )
}

export default Battle