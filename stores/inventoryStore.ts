import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ParentPokemonDraft } from "@/types";
import { defaultFertility, defaultIVs } from "@/data/stats";

export type InventoryEntry = {
  id: string;
  displayNumber: number;
  draft: ParentPokemonDraft;
};

type InventoryState = {
  entries: InventoryEntry[];
  nextDisplayNumber: number;
  addEntry: () => string;
  addBreedResult: (draft: ParentPokemonDraft) => string;
  updateEntry: (id: string, draft: ParentPokemonDraft) => void;
  removeEntry: (id: string) => void;
  loadEntries: (entries: InventoryEntry[], nextDisplayNumber: number) => void;
  clearEntries: () => void;
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      nextDisplayNumber: 1,

      addEntry: () => {
        const displayNumber = get().nextDisplayNumber;
        const newEntry: InventoryEntry = {
          id: crypto.randomUUID(),
          displayNumber,
          draft: { ivs: defaultIVs, fertility: defaultFertility },
        };
        set((state) => ({ entries: [...state.entries, newEntry], nextDisplayNumber: state.nextDisplayNumber + 1 }));
        return newEntry.id;
      },

      addBreedResult: (draft) => {
        const displayNumber = get().nextDisplayNumber;

        const newEntry: InventoryEntry = {
          id: crypto.randomUUID(),
          displayNumber,
          draft,
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
          nextDisplayNumber: state.nextDisplayNumber + 1,
        }));

        return newEntry.id;
      },

      updateEntry: (id, draft) =>
        set((state) => ({ entries: state.entries.map((e) => (e.id === id ? { ...e, draft } : e)) })),

      removeEntry: (id) => set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      loadEntries: (entries, nextDisplayNumber) => set({ entries, nextDisplayNumber }),

      clearEntries: () => set({ entries: [] }),
    }),
    { name: "breedlemon-inventory" },
  ),
);

export function formatDisplayNumber(displayNumber: number): string {
  return `#${String(displayNumber).padStart(2, "0")}`;
}
