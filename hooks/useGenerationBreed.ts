"use client";

import { useState } from "react";
import { PokemonSpecies } from "@/types";
import { useBreedingPlanStore } from "@/stores/breedingPlanStore";
import { getBreedErrorMessage } from "@/lib/breeding";

export function useGenerationBreed(allSpecies: PokemonSpecies[], generation: number) {
  const cards = useBreedingPlanStore((s) => s.cards);
  const selectedCardIds = useBreedingPlanStore((s) => s.selectedCardIds);
  const attemptBreed = useBreedingPlanStore((s) => s.attemptBreed);
  const [error, setError] = useState<string | null>(null);

  const selectedInThisGeneration = selectedCardIds.filter((id) => {
    const card = cards.find((c) => c.id === id);
    return card?.generation === generation;
  });
  const isReady = selectedInThisGeneration.length === 2;

  const handleClick = () => {
    if (!isReady) return;
    const result = attemptBreed(allSpecies);
    setError(result.success ? null : getBreedErrorMessage(result.reason));
  };

  return { isReady, error, handleClick };
}
