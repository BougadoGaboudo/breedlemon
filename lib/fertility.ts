const REPRODUCTION_COST = 1;

export function calculateChildFertility(parent1Fertility: number, parent2Fertility: number): number {
  const lowest = Math.min(parent1Fertility, parent2Fertility);
  return Math.max(0, lowest - REPRODUCTION_COST);
}
