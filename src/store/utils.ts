import { RegionState } from '../types/types'

export const getBombingResult = (name: string, region: RegionState) => {
  const roll = Math.floor(Math.random() * 6) + 1
  const chance = (region.garrison.infantry / 50) * 0.05
  const needed = Math.max(2, 7 - Math.floor(chance * 6))

  const isShotDown = roll >= needed
  const damage = isShotDown ? 0 : Math.floor(region.garrison.infantry * (0.05 + Math.random() * 0.05))

  return { regionName: name, isShotDown, damage }
}
