import { InventorySection } from "@/components/InventorySection";
import pokemonData from "@/data/pokemon.json";
import { PokemonSpecies } from "@/types";

const allSpecies = pokemonData as PokemonSpecies[];

export default function InventoryPage() {
  return (
    <>
      <InventorySection allSpecies={allSpecies} />
    </>
  );
}
