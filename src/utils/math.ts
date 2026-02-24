export function getGarrison(population: number, minPercent = 0.005, maxPercent = 0.02): number {
    const percent = Math.random() * (maxPercent - minPercent) + minPercent;

    return Math.floor(population * percent)
}