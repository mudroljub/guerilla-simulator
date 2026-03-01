import { Fraction, Garrison } from "../types/types";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const getTroops = (population: number, minPercent: number, maxPercent: number) =>
  Math.floor(population * rand(minPercent, maxPercent));

/**
  Pešadija  90%
  Artiljerija 6%
  Tenkovi   3%
  Avijacija 1%
*/
export function initGarrison(
  population: number,
  fraction: Fraction
): Garrison {
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