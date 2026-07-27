import { Stat } from "@/data/stats";

export type BreedingItem = {
  id: string;
  nameFr: string;
  nameEn: string;
  stat: Stat;
  sprite: string;
};

export const breedingItems: BreedingItem[] = [
  {
    id: "power_weight",
    nameFr: "Poids Pouvoir",
    nameEn: "Power Weight",
    stat: "hp",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-weight.png",
  },
  {
    id: "power_bracer",
    nameFr: "Poignet Pouvoir",
    nameEn: "Power Bracer",
    stat: "attack",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-bracer.png",
  },
  {
    id: "power_belt",
    nameFr: "Ceinture Pouvoir",
    nameEn: "Power Belt",
    stat: "defense",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-belt.png",
  },
  {
    id: "power_lens",
    nameFr: "Lentille Pouvoir",
    nameEn: "Power Lens",
    stat: "special_attack",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-lens.png",
  },
  {
    id: "power_band",
    nameFr: "Bandeau Pouvoir",
    nameEn: "Power Band",
    stat: "special_defense",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-band.png",
  },
  {
    id: "power_anklet",
    nameFr: "Chaîne Pouvoir",
    nameEn: "Power Anklet",
    stat: "speed",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-anklet.png",
  },
];
