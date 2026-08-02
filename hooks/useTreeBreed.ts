"use client";

import { useCallback, useState } from "react";
import { PokemonSpecies } from "@/types";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getParentSlotsForChild } from "@/lib/genealogyTree";
import { resolveInventoryEntry } from "@/lib/resolveInventoryEntry";
import { breed } from "@/lib/breeding";
import { childIVsToIVs } from "@/lib/iv";

export function useTreeBreed(allSpecies: PokemonSpecies[]) {
  const tree = useGenealogyTreeStore((s) => s.tree);
  const assignSlot = useGenealogyTreeStore((s) => s.assignSlot);

  const entries = useInventoryStore((s) => s.entries);
  const addBreedResult = useInventoryStore((s) => s.addBreedResult);

  const [error, setError] = useState<string | null>(null);

  const getBreedParents = useCallback(
    (genIndex: number, slotIndex: number) => {
      const parentSlots = getParentSlotsForChild(tree, genIndex, slotIndex);

      if (!parentSlots) return null;

      const [slotA, slotB] = parentSlots;

      if (!slotA.inventoryEntryId || !slotB.inventoryEntryId) {
        return null;
      }

      const parentA = entries.find((e) => e.id === slotA.inventoryEntryId);
      const parentB = entries.find((e) => e.id === slotB.inventoryEntryId);

      if (!parentA || !parentB) return null;

      return { parentA, parentB };
    },
    [tree, entries],
  );

  const breedSlot = useCallback(
    (genIndex: number, slotIndex: number) => {
      setError(null);

      const parents = getBreedParents(genIndex, slotIndex);

      if (!parents) {
        setError("Les deux parents sont nécessaires.");
        return;
      }

      const parentA = resolveInventoryEntry(parents.parentA);
      const parentB = resolveInventoryEntry(parents.parentB);

      if (!parentA || !parentB) {
        setError("Un des parents est incomplet.");
        return;
      }

      const speciesA = allSpecies.find((s) => s.id === parentA.speciesId);
      const speciesB = allSpecies.find((s) => s.id === parentB.speciesId);

      if (!speciesA || !speciesB) {
        setError("Espèce introuvable.");
        return;
      }

      const result = breed(parentA, speciesA, parentB, speciesB, allSpecies);

      if (!result.success) {
        setError(result.reason);
        return;
      }

      const childId = addBreedResult({
        speciesId: result.childSpeciesId,
        ivs: childIVsToIVs(result.ivs),
        fertility: result.fertility,
      });

      assignSlot(genIndex, slotIndex, childId);
    },
    [allSpecies, assignSlot, addBreedResult, getBreedParents],
  );

  const canBreedSlot = useCallback(
    (genIndex: number, slotIndex: number) => {
      const parents = getBreedParents(genIndex, slotIndex);

      if (!parents) return false;

      const parentA = resolveInventoryEntry(parents.parentA);
      const parentB = resolveInventoryEntry(parents.parentB);

      if (!parentA || !parentB) return false;

      const speciesA = allSpecies.find((s) => s.id === parentA.speciesId);
      const speciesB = allSpecies.find((s) => s.id === parentB.speciesId);

      if (!speciesA || !speciesB) return false;

      return breed(parentA, speciesA, parentB, speciesB, allSpecies).success;
    },
    [allSpecies, getBreedParents],
  );

  return {
    error,
    getBreedParents,
    breedSlot,
    canBreedSlot,
  };
}
