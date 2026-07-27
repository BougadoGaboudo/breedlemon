"use client";

import { PokemonSpecies } from "@/types";
import { useBreedingPlanStore } from "@/stores/breedingPlanStore";
import { Card } from "./Card";
import { BreedButton } from "./BreedButton";
import SecondaryButton from "./SecondaryButton";
import { useGenerationBreed } from "@/hooks/useGenerationBreed";

type GenerationSectionProps = { generation: number; allSpecies: PokemonSpecies[] };

export function GenerationSection({ generation, allSpecies }: GenerationSectionProps) {
  const cards = useBreedingPlanStore((s) => s.cards);
  const addParentCard = useBreedingPlanStore((s) => s.addParentCard);
  const { isReady, error, handleClick } = useGenerationBreed(allSpecies, generation);

  const cardsInGeneration = cards.filter((c) => c.generation === generation);

  return (
    <section>
      <div className="sticky top-4 z-40 bg-primary-500 flex flex-col gap-1 px-4 py-2 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl">Étape n°{generation + 1}</h1>
          <div className="flex items-center gap-2">
            <SecondaryButton onClick={() => addParentCard(generation)}>Ajouter un parent</SecondaryButton>
            <BreedButton isReady={isReady} onClick={handleClick} />
          </div>
        </div>
        {error && <p className="text-xs text-dark-500 font-semibold">{error}</p>}
      </div>

      <div className="my-4">
        <p className="mb-2">
          {generation === 0
            ? "--> Renseigne tes parents de départ puis sélectionne-en deux pour les breed."
            : "--> Sélectionne deux parents dans la génération précédente pour créer un oeuf ici ou ajoute un parent que tu possèdes déjà."}
        </p>
        <p className="text-sm">
          PS : La fertilité que tu vois entre parenthèses correspond à la fertilité restante de ton pokémon après avoir
          breed.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cardsInGeneration.map((card) => (
          <Card key={card.id} card={card} allSpecies={allSpecies} />
        ))}
      </div>
    </section>
  );
}
