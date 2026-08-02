"use client";

import { useEffect } from "react";
import { Gender, PokemonSpecies } from "@/types";
import { useInventoryStore } from "@/stores/inventoryStore";
import { InventoryCard } from "./InventoryCard";
import PrimaryButton from "./PrimaryButton";

type InventoryCardModalProps = {
  entryId: string;
  allSpecies: PokemonSpecies[];
  allowedSpecies?: PokemonSpecies[] | null;
  getForcedGender?: (speciesId: number) => Gender | null;
  variant?: "edit" | "create";
  onClose: () => void;
};

export function InventoryCardModal({
  entryId,
  allSpecies,
  allowedSpecies,
  getForcedGender,
  variant = "edit",
  onClose,
}: InventoryCardModalProps) {
  const entry = useInventoryStore((s) => s.entries.find((e) => e.id === entryId));

  useEffect(() => {
    if (!entry) onClose();
  }, [entry, onClose]);

  if (!entry) return null;

  return (
    <div
      className="bg-light-500 rounded-lg px-8 pb-8 pt-4 w-full max-w-md max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg">{variant === "create" ? "Nouveau parent" : "Modifier ce Pokémon"}</h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer px-3 py-1.5 rounded-sm font-bold transition-all duration-300 ease-out hover:bg-primary-500/50"
        >
          ✕
        </button>
      </div>

      <InventoryCard
        entry={entry}
        allSpecies={allSpecies}
        allowedSpecies={allowedSpecies}
        getForcedGender={getForcedGender}
        deleteLabel={variant === "create" ? "Annuler la création" : "Supprimer"}
      />

      {variant === "create" && (
        <PrimaryButton onClick={onClose} className="w-full mt-4">
          Placer ce parent dans l'arbre
        </PrimaryButton>
      )}
    </div>
  );
}
