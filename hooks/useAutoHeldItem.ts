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

export function ivsSnapshotKey(ivs: ParentPokemonDraft["ivs"]): string {
  return stats.map((s) => ivs[s]).join(",");
}

function findUniqueMaxStat(self: ParentPokemonDraft["ivs"], other: ParentPokemonDraft["ivs"]) {
  return stats.find((s) => self[s] === maxIV && other[s] !== maxIV);
}

function needsRecompute(entry: InventoryEntry): boolean {
  return entry.draft.heldItemIvsSnapshot !== ivsSnapshotKey(entry.draft.ivs);
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

        if (needsRecompute(entryA)) {
          const stat = findUniqueMaxStat(entryA.draft.ivs, entryB.draft.ivs);
          updateEntry(entryA.id, {
            ...entryA.draft,
            heldItemStat: stat,
            heldItemIvsSnapshot: ivsSnapshotKey(entryA.draft.ivs),
          });
        }

        if (needsRecompute(entryB)) {
          const stat = findUniqueMaxStat(entryB.draft.ivs, entryA.draft.ivs);
          updateEntry(entryB.id, {
            ...entryB.draft,
            heldItemStat: stat,
            heldItemIvsSnapshot: ivsSnapshotKey(entryB.draft.ivs),
          });
        }
      }
    }
  }, [tree, entries, updateEntry]);
}
