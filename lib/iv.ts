import { stats } from "@/data/stats";
import { ChildIVs, IVs, ParentPokemon } from "@/types";

export function calculateChildIVs(parent1: ParentPokemon, parent2: ParentPokemon): ChildIVs {
  const result = {} as ChildIVs;

  for (const stat of stats) {
    const iv1 = parent1.ivs[stat];
    const iv2 = parent2.ivs[stat];

    if (parent1.heldItemStat === stat) {
      result[stat] = { value: iv1, source: "item" };
      continue;
    }
    if (parent2.heldItemStat === stat) {
      result[stat] = { value: iv2, source: "item" };
      continue;
    }

    result[stat] =
      iv1 === iv2 ? { value: iv1, source: "matching" } : { value: Math.floor((iv1 + iv2) / 2), source: "average" };
  }

  return result;
}

export function childIVsToIVs(childIVs: ChildIVs): IVs {
  return Object.fromEntries(stats.map((stat) => [stat, childIVs[stat].value])) as IVs;
}
