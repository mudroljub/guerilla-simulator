import { Fraction, RegionData, RegionState } from "../types/types"
import { initGarrison } from "./initGarrison"

export const initRegionState = (region: RegionData) : RegionState => {
    const fraction = region.size < 0.1 && Math.random() < 0.1
        ? Fraction.Partisan
        : Fraction.German

    return {
      ...region,
      fraction,
      garrison: initGarrison(region.population, fraction),
    }
}
