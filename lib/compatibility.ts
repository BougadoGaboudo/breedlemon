import { Gender, ParentPokemon, ParentPokemonDraft, PokemonSpecies } from "@/types";

const DITTO_ID = 132;

export function getAvailableGenders(genderRate: number): Gender[] {
  if (genderRate === -1) return ["genderless"];
  if (genderRate === 0) return ["male"];
  if (genderRate === 8) return ["female"];
  return ["male", "female"];
}

export function isCompleteParent(draft: ParentPokemonDraft): draft is ParentPokemon {
  return draft.speciesId !== undefined && draft.gender !== undefined;
}

export function resolveBaseForm(species: PokemonSpecies, allSpecies: PokemonSpecies[]): number {
  return allSpecies.find((s) => s.id === species.baseFormId)?.id ?? species.id;
}

type CompatibilityResult = { canBreed: false; reason: string } | { canBreed: true; childSpeciesId: number };

export function checkBreedingCompatibility(
  parent1: ParentPokemon,
  species1: PokemonSpecies,
  parent2: ParentPokemon,
  species2: PokemonSpecies,
  allSpecies: PokemonSpecies[],
): CompatibilityResult {
  const isDitto1 = species1.id === DITTO_ID;
  const isDitto2 = species2.id === DITTO_ID;

  if (!isDitto1 && !isDitto2 && (!species1.isBreedable || !species2.isBreedable)) {
    return { canBreed: false, reason: "not_breedable" };
  }

  if (parent1.fertility <= 0 || parent2.fertility <= 0) {
    return { canBreed: false, reason: "fertility_zero" };
  }

  if (isDitto1 && isDitto2) return { canBreed: false, reason: "ditto_x_ditto" };

  if (isDitto1 || isDitto2) {
    const other = isDitto1 ? species2 : species1;
    if (!other.canBreedWithDitto) return { canBreed: false, reason: "cannot_breed_with_ditto" };
    return { canBreed: true, childSpeciesId: resolveBaseForm(other, allSpecies) };
  }

  const sharesEggGroup = species1.eggGroups.some((g) => species2.eggGroups.includes(g));
  if (!sharesEggGroup) return { canBreed: false, reason: "no_common_egg_group" };
  if (parent1.gender === "genderless" || parent2.gender === "genderless") {
    return { canBreed: false, reason: "genderless_non_ditto" };
  }
  if (parent1.gender === parent2.gender) return { canBreed: false, reason: "same_gender" };

  const motherSpecies = parent1.gender === "female" ? species1 : species2;
  return { canBreed: true, childSpeciesId: resolveBaseForm(motherSpecies, allSpecies) };
}

export function getEligibleMateSpecies(chosenSpecies: PokemonSpecies, allSpecies: PokemonSpecies[]): PokemonSpecies[] {
  if (chosenSpecies.id === DITTO_ID) {
    return allSpecies.filter((s) => s.id !== DITTO_ID && s.canBreedWithDitto && s.isBreedable);
  }
  return allSpecies.filter((s) => {
    if (!s.isBreedable) return false;
    if (s.id === DITTO_ID) return chosenSpecies.canBreedWithDitto;
    return s.eggGroups.some((g) => chosenSpecies.eggGroups.includes(g));
  });
}

export function isDitto(species: PokemonSpecies): boolean {
  return species.eggGroups.includes("ditto");
}
