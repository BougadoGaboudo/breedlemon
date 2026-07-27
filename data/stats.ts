import { Gender } from "@/types";

export const stats = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"] as const;
export type Stat = (typeof stats)[number];

export const statLabels: Record<Stat, string> = {
  hp: "PV",
  attack: "Atq",
  defense: "Def",
  special_attack: "SpA",
  special_defense: "SpD",
  speed: "Vit",
};

export const genderLabels: Record<Gender, string> = {
  male: "Mâle",
  female: "Femelle",
  genderless: "Asexué",
};

export const eggGroupLabels: Record<string, string> = {
  monster: "Monstrueux",
  water1: "Aquatique 1",
  water2: "Aquatique 2",
  water3: "Aquatique 3",
  bug: "Insectoïde",
  flying: "Aérien",
  ground: "Terrestre",
  fairy: "Féerique",
  plant: "Végétal",
  humanshape: "Humanoïde",
  mineral: "Minéral",
  indeterminate: "Amorphe",
  ditto: "Métamorph",
  dragon: "Draconique",
  "no-eggs": "Inconnu",
};

export const defaultIVs: Record<Stat, number> = Object.fromEntries(stats.map((s) => [s, 0])) as Record<Stat, number>;
export const defaultFertility = 4;
