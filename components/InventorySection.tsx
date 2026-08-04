"use client";

import { PokemonSpecies } from "@/types";
import { useInventoryStore } from "@/stores/inventoryStore";
import { InventoryCard } from "./InventoryCard";
import SecondaryButton from "./SecondaryButton";
import { useThemeStore } from "@/stores/themeStore";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { ModalOverlay } from "./ModalOverlay";

export function InventorySection({ allSpecies }: { allSpecies: PokemonSpecies[] }) {
  const { theme } = useThemeStore();
  const entries = useInventoryStore((s) => s.entries);
  const addEntry = useInventoryStore((s) => s.addEntry);
  const clearEntries = useInventoryStore((s) => s.clearEntries);
  const clearAllSlots = useGenealogyTreeStore((s) => s.clearAllSlots);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    clearAllSlots();
    clearEntries();
    setShowClearConfirm(false);
  };

  return (
    <section className="max-w-7xl mx-auto my-8 min-h-[74.8vh]">
      <div className="sticky top-4 z-40 bg-primary-500 flex items-center justify-between gap-4 px-4 py-2 rounded-md">
        <h1 className={`text-xl ${theme === "dark" ? "text-light-500" : "text-dark-500"}`}>Mon inventaire</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer p-2 border border-dark-500 rounded-lg"
            onClick={() => setShowClearConfirm(true)}
            title="Vider tout l'inventaire"
          >
            <Trash2 size={24} />
          </button>
          <SecondaryButton onClick={addEntry}>Ajouter un Pokémon</SecondaryButton>
        </div>
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

      {showClearConfirm && (
        <ModalOverlay onClose={() => setShowClearConfirm(false)}>
          <ConfirmDialog
            title="Vider tout l'inventaire ?"
            description={`Tous tes ${entries.length} Pokémon seronts supprimés, ainsi que tous les slots de l'arbre qui les utilisent. Cette action est irréversible.`}
            confirmLabel="Tout supprimer"
            onConfirm={handleClearAll}
            onCancel={() => setShowClearConfirm(false)}
          />
        </ModalOverlay>
      )}
    </section>
  );
}
