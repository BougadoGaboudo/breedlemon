"use client";

import { PokemonSpecies } from "@/types";
import { useInventoryStore } from "@/stores/inventoryStore";
import { InventoryCard } from "./InventoryCard";
import SecondaryButton from "./SecondaryButton";

export function InventorySection({ allSpecies }: { allSpecies: PokemonSpecies[] }) {
  const entries = useInventoryStore((s) => s.entries);
  const addEntry = useInventoryStore((s) => s.addEntry);

  return (
    <section className="max-w-7xl mx-auto my-8 min-h-[74.8vh]">
      <div className="sticky top-4 z-40 bg-primary-500 flex items-center justify-between gap-4 px-4 py-2 rounded-md">
        <h1 className="text-xl">Mon inventaire</h1>
        <SecondaryButton onClick={addEntry}>Ajouter un Pokémon</SecondaryButton>
      </div>

      <div className="my-4">
        <p>
          --&gt; Liste ici tous les Pokémon que tu possèdes déjà et que tu souhaites utiliser pour tes breeds.
          <br />
          N'oublie pas de renseigner les IV, le sexe, la fertilité et l'item IV (si nécessaire) de chaque Pokémon !
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {entries.map((entry) => (
          <InventoryCard key={entry.id} entry={entry} allSpecies={allSpecies} />
        ))}
      </div>
    </section>
  );
}
