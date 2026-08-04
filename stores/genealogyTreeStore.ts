import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GenealogyTree,
  PairingStatus,
  createEmptyTree,
  getPairingKey,
  getParentSlotsForChild,
  resizeTree,
  shiftPairingStatus,
} from "@/lib/genealogyTree";

type GenealogyTreeState = {
  targetIvCount: number;
  tree: GenealogyTree;
  fertilityUsage: Record<string, number>;
  pairingStatus: Record<string, PairingStatus>;

  setTargetIvCount: (count: number) => void;
  assignSlot: (genIndex: number, slotIndex: number, inventoryEntryId: string | undefined) => void;
  removeEntryFromTree: (inventoryEntryId: string) => void;
  loadTree: (targetIvCount: number, tree: GenealogyTree, pairingStatus?: Record<string, PairingStatus>) => void;
  setPairingStatus: (genIndex: number, slotIndex: number, status: PairingStatus) => void;
  clearAllSlots: () => void;
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
      pairingStatus: {},

      setTargetIvCount: (count) =>
        set((state) => {
          const newTree = resizeTree(state.tree, count);
          return {
            targetIvCount: count,
            tree: newTree,
            fertilityUsage: computeFertilityUsage(newTree),
            pairingStatus: shiftPairingStatus(state.pairingStatus, state.tree.length, newTree.length),
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

      loadTree: (targetIvCount, tree, pairingStatus) =>
        set({
          targetIvCount,
          tree,
          fertilityUsage: computeFertilityUsage(tree),
          pairingStatus: pairingStatus ?? {},
        }),

      setPairingStatus: (genIndex, slotIndex, status) =>
        set((state) => ({
          pairingStatus: { ...state.pairingStatus, [getPairingKey(genIndex, slotIndex)]: status },
        })),

      clearAllSlots: () =>
        set((state) => {
          const newTree = state.tree.map((generation) => generation.map(() => ({ inventoryEntryId: undefined })));
          return { tree: newTree, fertilityUsage: {}, pairingStatus: {} };
        }),
    }),
    { name: "breedlemon-genealogy-tree" },
  ),
);
