import { PokemonSpecies } from "@/types";
import pokemonData from "@/data/pokemon.json";
import { StepAccordion } from "@/components/StepAccordion";

const allSpecies = pokemonData as PokemonSpecies[];

export default function Home() {
  return (
    <>
      <StepAccordion allSpecies={allSpecies} />
    </>
  );
}
