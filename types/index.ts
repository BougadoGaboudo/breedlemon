import { Stat } from "@/data/stats";

export type IVs = Record<Stat, number>;
export type Gender = "male" | "female" | "genderless";

export type ParentPokemon = {
  speciesId: number;
  gender: Gender;
  ivs: IVs;
  fertility: number;
  heldItemStat?: Stat;
  hasHiddenAbility?: boolean;
};

export type ParentPokemonDraft = Omit<ParentPokemon, "speciesId" | "gender"> & {
  speciesId?: number;
  gender?: Gender;
};

export type ChildIVs = Record<Stat, { value: number; source: "matching" | "item" | "average" }>;

export type PokemonName = { en: string; fr: string };
export type PokemonAbility = { name: string; hidden: boolean };

export type PokemonSpecies = {
  id: number;
  name: PokemonName;
  sprite: string;
  types: string[];
  eggGroups: string[];
  genderRate: number;
  abilities: PokemonAbility[];
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  isBreedable: boolean;
  canBreedWithDitto: boolean;
  baseFormId: number;
};

export type BreedResult =
  | { success: false; reason: string }
  | { success: true; childSpeciesId: number; ivs: ChildIVs; fertility: number };

// une card = un parent utilisable pour breed (saisi à la main ou issu d'un breed)
export type PlanCard =
  | { id: string; generation: number; kind: "leaf"; draft: ParentPokemonDraft }
  | {
      id: string;
      generation: number;
      kind: "egg";
      pairingId: string; // trace de l'accouplement d'origine
      speciesId: number;
      ivs: ChildIVs;
      fertility: number;
      gender?: Gender;
      heldItemStat?: Stat;
    };

// un pairing relie 2 cards existantes et produit 1 card oeuf dans la génération suivante
export type Pairing = {
  id: string;
  cardAId: string;
  cardBId: string;
  resultCardId: string;
};
