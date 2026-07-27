import { BreedResult, ParentPokemon, PokemonSpecies } from "@/types";
import { calculateChildIVs } from "./iv";
import { calculateChildFertility } from "./fertility";
import { checkBreedingCompatibility } from "./compatibility";

export function breed(
  parent1: ParentPokemon,
  species1: PokemonSpecies,
  parent2: ParentPokemon,
  species2: PokemonSpecies,
  allSpecies: PokemonSpecies[],
): BreedResult {
  const check = checkBreedingCompatibility(parent1, species1, parent2, species2, allSpecies);
  if (!check.canBreed) return { success: false, reason: check.reason };

  return {
    success: true,
    childSpeciesId: check.childSpeciesId,
    ivs: calculateChildIVs(parent1, parent2),
    fertility: calculateChildFertility(parent1.fertility, parent2.fertility),
  };
}

const messages: Record<string, string> = {
  selection_incomplete: "Sélectionne 2 Pokémon avant de breed",
  incomplete_parent: "Un des deux Pokémon n'est pas encore complètement rempli",
  unknown_species: "Espèce introuvable",
  not_breedable: "Un des deux Pokémon n'est pas reproductible",
  fertility_zero: "Un des deux Pokémon n'a plus de fertilité",
  ditto_x_ditto: "Impossible de faire breed 2 Métamorph ensemble",
  cannot_breed_with_ditto: "Ce Pokémon ne peut pas se reproduire avec un Métamorph",
  no_common_egg_group: "Ces deux Pokémon n'ont aucun groupe d'oeuf en commun",
  genderless_non_ditto: "Un Pokémon asexué ne peut breed qu'avec un Métamorph",
  same_gender: "Les deux Pokémon sont du même sexe",
};

export function getBreedErrorMessage(reason: string): string {
  return messages[reason] ?? "Breed impossible.";
}
