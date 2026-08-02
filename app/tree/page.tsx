import { GenealogyTreeView } from "@/components/GenealogyTreeView";
import pokemonData from "@/data/pokemon.json";
import { PokemonSpecies } from "@/types";

const allSpecies = pokemonData as PokemonSpecies[];

export default function TreePage() {
  return (
    <>
      <GenealogyTreeView allSpecies={allSpecies} />
    </>
  );
}
