import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GenealogyTree, createEmptyTree, getParentSlotsForChild, resizeTree } from "@/lib/genealogyTree";

type GenealogyTreeState = {
  targetIvCount: number;
  tree: GenealogyTree;
  fertilityUsage: Record<string, number>;

  setTargetIvCount: (count: number) => void;
  assignSlot: (genIndex: number, slotIndex: number, inventoryEntryId: string | undefined) => void;
  removeEntryFromTree: (inventoryEntryId: string) => void;
  loadTree: (targetIvCount: number, tree: GenealogyTree) => void;
};

function computeFertilityUsage(tree: GenealogyTree): Record<string, number> {
  const usage: Record<string, number> = {};

  for (let genIndex = 1; genIndex < tree.length; genIndex++) {
    tree[genIndex].forEach((slot, slotIndex) => {
      if (slot.inventoryEntryId) {
        const parentSlots = getParentSlotsForChild(tree, genIndex, slotIndex);
        if (parentSlots) {
          const [parentA, parentB] = parentSlots;

          if (parentA.inventoryEntryId) {
            usage[parentA.inventoryEntryId] = (usage[parentA.inventoryEntryId] ?? 0) + 1;
          }
          if (parentB.inventoryEntryId) {
            usage[parentB.inventoryEntryId] = (usage[parentB.inventoryEntryId] ?? 0) + 1;
          }
        }
      }
    });
  }

  return usage;
}

export const useGenealogyTreeStore = create<GenealogyTreeState>()(
  persist(
    (set) => ({
      targetIvCount: 6,
      tree: createEmptyTree(6),
      fertilityUsage: {},

      setTargetIvCount: (count) =>
        set((state) => {
          const newTree = resizeTree(state.tree, count);
          return {
            targetIvCount: count,
            tree: newTree,
            fertilityUsage: computeFertilityUsage(newTree),
          };
        }),

      assignSlot: (genIndex, slotIndex, inventoryEntryId) =>
        set((state) => {
          const newTree = state.tree.map((generation, g) =>
            g === genIndex ? generation.map((slot, s) => (s === slotIndex ? { inventoryEntryId } : slot)) : generation,
          );

          return {
            tree: newTree,
            fertilityUsage: computeFertilityUsage(newTree),
          };
        }),

      removeEntryFromTree: (entryId) =>
        set((state) => {
          const newTree = state.tree.map((generation) =>
            generation.map((slot) =>
              slot.inventoryEntryId === entryId ? { ...slot, inventoryEntryId: undefined } : slot,
            ),
          );

          return {
            tree: newTree,
            fertilityUsage: computeFertilityUsage(newTree),
          };
        }),

      loadTree: (targetIvCount, tree) =>
        set({
          targetIvCount,
          tree,
          fertilityUsage: computeFertilityUsage(tree),
        }),
    }),
    { name: "breedlemon-genealogy-tree" },
  ),
);
