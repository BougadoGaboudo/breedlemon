import { IVs, ParentPokemon, PlanCard, PokemonSpecies } from "@/types";
import { stats } from "@/data/stats";
import { isCompleteParent } from "./compatibility";

export function resolveCard(
  cardId: string,
  cardsById: Map<string, PlanCard>,
  allSpecies: PokemonSpecies[],
): ParentPokemon | null {
  const card = cardsById.get(cardId);
  if (!card) return null;

  if (card.kind === "leaf") {
    return isCompleteParent(card.draft) ? card.draft : null;
  }

  if (!card.gender) return null;

  return {
    speciesId: card.speciesId,
    gender: card.gender,
    ivs: Object.fromEntries(stats.map((s) => [s, card.ivs[s].value])) as IVs,
    fertility: card.fertility,
    heldItemStat: card.heldItemStat,
  };
}
