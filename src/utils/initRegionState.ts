import { Fraction, RegionData, RegionState, Troops } from '../types/types'

const rand = (min: number, max: number) => Math.random() * (max - min) + min

const getTroops = (population: number, minPercent: number, maxPercent: number) =>
  Math.floor(population * rand(minPercent, maxPercent))

/**
  Pešadija    oko 90%
  Artiljerija oko 6%
  Tenkovi     oko 3%
  Avijacija   oko 1%
*/
export function initGarrison(
  population: number,
  fraction: Fraction
): Troops {
  const minPercent = 0.005
  const maxPercent = 0.02
  const total = getTroops(population, minPercent, maxPercent)

  return fraction === Fraction.Partisan
    ? { infantry: total }
    : {
      infantry: getTroops(total, 0.85, 0.95),
      artillery: getTroops(total, 0.05, 0.07),
      tanks: getTroops(total, 0.025, 0.035),
      aircraft: getTroops(total, 0.005, 0.015),
    }
}

export const initRegionState = (region: RegionData): RegionState => {
  const isPartisan = region.size < 0.1 && Math.random() < 0.1
  const fraction = isPartisan ? Fraction.Partisan : Fraction.German

  const garrison = initGarrison(region.population, fraction)

  const totalMobilized = fraction === Fraction.Partisan ? garrison.infantry : 0

  return {
    ...region,
    fraction,
    garrison,
    totalMobilized,
    population: region.population - totalMobilized,
    lastMobilizedCount: totalMobilized,
  }
}