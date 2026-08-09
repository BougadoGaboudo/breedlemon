"use client";

import { useEffect } from "react";
import { GenealogyTree } from "@/lib/genealogyTree";
import { InventoryEntry } from "@/stores/inventoryStore";
import { ParentPokemonDraft } from "@/types";
import { maxIV, stats } from "@/data/stats";

function isIvComplete(entry: InventoryEntry): boolean {
  const { speciesId, gender, ivs } = entry.draft;
  return speciesId !== undefined && gender !== undefined && stats.some((s) => ivs[s] === maxIV);
}

function findUniqueMaxStat(self: ParentPokemonDraft["ivs"], other: ParentPokemonDraft["ivs"]) {
  return stats.find((s) => self[s] === maxIV && other[s] !== maxIV);
}

export function useAutoHeldItems(
  tree: GenealogyTree,
  entries: InventoryEntry[],
  updateEntry: (id: string, draft: ParentPokemonDraft) => void,
) {
  useEffect(() => {
    for (let genIndex = 0; genIndex < tree.length - 1; genIndex++) {
      const generation = tree[genIndex];

      for (let i = 0; i < generation.length; i += 2) {
        const slotA = generation[i];
        const slotB = generation[i + 1];
        if (!slotA?.inventoryEntryId || !slotB?.inventoryEntryId) continue;

        const entryA = entries.find((e) => e.id === slotA.inventoryEntryId);
        const entryB = entries.find((e) => e.id === slotB.inventoryEntryId);
        if (!entryA || !entryB) continue;
        if (!isIvComplete(entryA) || !isIvComplete(entryB)) continue;

        if (entryA.draft.heldItemStat === undefined) {
          const stat = findUniqueMaxStat(entryA.draft.ivs, entryB.draft.ivs);
          if (stat) updateEntry(entryA.id, { ...entryA.draft, heldItemStat: stat });
        }

        if (entryB.draft.heldItemStat === undefined) {
          const stat = findUniqueMaxStat(entryB.draft.ivs, entryA.draft.ivs);
          if (stat) updateEntry(entryB.id, { ...entryB.draft, heldItemStat: stat });
        }
      }
    }
  }, [tree, entries, updateEntry]);
}
