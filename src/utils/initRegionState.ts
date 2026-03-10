import { Fraction, RegionData, RegionState } from '../types/types'
import { initGarrison } from './initGarrison'

export const initRegionState = (region: RegionData): RegionState => {
  const isPartisan = region.size < 0.1 && Math.random() < 0.1
  const fraction = isPartisan ? Fraction.Partisan : Fraction.German

  const initialGarrison = initGarrison(region.population, fraction)

  const mobilized = fraction === Fraction.Partisan ? initialGarrison.infantry : 0

  return {
    ...region,
    fraction,
    garrison: initialGarrison,
    population: region.population - mobilized,
    totalMobilized: mobilized,
  }
}