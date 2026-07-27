"use client";

import { useMemo } from "react";
import { PokemonSpecies } from "@/types";
import { useBreedingPlanStore } from "@/stores/breedingPlanStore";
import { GenerationSection } from "./GenerationSection";

export function StepAccordion({ allSpecies }: { allSpecies: PokemonSpecies[] }) {
  const cards = useBreedingPlanStore((s) => s.cards);

  const generations = useMemo(() => {
    const maxGen = Math.max(0, ...cards.map((c) => c.generation));
    return Array.from({ length: maxGen + 1 }, (_, i) => i);
  }, [cards]);

  return (
    <div className="my-8 flex flex-col gap-8">
      {generations.map((generation) => (
        <GenerationSection key={generation} generation={generation} allSpecies={allSpecies} />
      ))}
    </div>
  );
}
