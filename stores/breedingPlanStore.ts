import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Gender, Pairing, ParentPokemonDraft, PlanCard, PokemonSpecies } from "@/types";
import { Stat, defaultFertility, defaultIVs } from "@/data/stats";
import { breed } from "@/lib/breeding";
import { resolveCard } from "@/lib/resolve";

function createLeafCard(generation: number): PlanCard {
  return {
    id: crypto.randomUUID(),
    generation,
    kind: "leaf",
    draft: { ivs: defaultIVs, fertility: defaultFertility },
  };
}

type BreedAttemptResult = { success: true } | { success: false; reason: string };

type PersistedPlan = {
  cards: PlanCard[];
  pairings: Pairing[];
  fertilityUsage: Record<string, number>;
};

type BreedingPlanState = PersistedPlan & {
  selectedCardIds: string[];

  addParentCard: (generation: number) => string;
  updateLeafDraft: (cardId: string, draft: ParentPokemonDraft) => void;
  updateEggGender: (cardId: string, gender: Gender) => void;
  updateEggItem: (cardId: string, stat: Stat | undefined) => void;
  toggleCardSelection: (cardId: string) => void;
  attemptBreed: (allSpecies: PokemonSpecies[]) => BreedAttemptResult;
  removeCard: (cardId: string) => void;
  reset: () => void;
  loadPlan: (plan: PersistedPlan) => void;
};

export const useBreedingPlanStore = create<BreedingPlanState>()(
  persist(
    (set, get) => ({
      cards: [createLeafCard(0), createLeafCard(0)],
      pairings: [],
      selectedCardIds: [],
      fertilityUsage: {},

      addParentCard: (generation) => {
        const newCard = createLeafCard(generation);
        set((state) => ({ cards: [...state.cards, newCard] }));
        return newCard.id;
      },

      updateLeafDraft: (cardId, draft) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === cardId && c.kind === "leaf" ? { ...c, draft } : c)),
        })),

      updateEggGender: (cardId, gender) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === cardId && c.kind === "egg" ? { ...c, gender } : c)),
        })),

      updateEggItem: (cardId, stat) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === cardId && c.kind === "egg" ? { ...c, heldItemStat: stat } : c)),
        })),

      toggleCardSelection: (cardId) => {
        const { selectedCardIds, cards } = get();

        if (selectedCardIds.includes(cardId)) {
          set({ selectedCardIds: selectedCardIds.filter((id) => id !== cardId) });
          return;
        }

        const card = cards.find((c) => c.id === cardId);
        if (!card) return;

        const alreadySelected = selectedCardIds
          .map((id) => cards.find((c) => c.id === id))
          .filter((c): c is PlanCard => !!c);

        if (alreadySelected.length > 0 && alreadySelected[0].generation !== card.generation) {
          set({ selectedCardIds: [cardId] });
          return;
        }

        if (alreadySelected.length >= 2) return;

        set({ selectedCardIds: [...selectedCardIds, cardId] });
      },

      attemptBreed: (allSpecies) => {
        const { selectedCardIds, cards, fertilityUsage } = get();
        if (selectedCardIds.length !== 2) return { success: false, reason: "selection_incomplete" };

        const [cardAId, cardBId] = selectedCardIds;
        const cardsById = new Map(cards.map((c) => [c.id, c]));

        const rawParentA = resolveCard(cardAId, cardsById, allSpecies);
        const rawParentB = resolveCard(cardBId, cardsById, allSpecies);
        if (!rawParentA || !rawParentB) return { success: false, reason: "incomplete_parent" };

        const parentA = { ...rawParentA, fertility: rawParentA.fertility - (fertilityUsage[cardAId] ?? 0) };
        const parentB = { ...rawParentB, fertility: rawParentB.fertility - (fertilityUsage[cardBId] ?? 0) };

        const speciesA = allSpecies.find((s) => s.id === parentA.speciesId);
        const speciesB = allSpecies.find((s) => s.id === parentB.speciesId);
        if (!speciesA || !speciesB) return { success: false, reason: "unknown_species" };

        const result = breed(parentA, speciesA, parentB, speciesB, allSpecies);
        if (!result.success) return { success: false, reason: result.reason };

        const cardA = cardsById.get(cardAId)!;
        const pairingId = crypto.randomUUID();
        const resultCardId = crypto.randomUUID();

        const newPairing: Pairing = { id: pairingId, cardAId, cardBId, resultCardId };

        const newEggCard: PlanCard = {
          id: resultCardId,
          generation: cardA.generation + 1,
          kind: "egg",
          pairingId,
          speciesId: result.childSpeciesId,
          ivs: result.ivs,
          fertility: result.fertility,
        };

        set({
          pairings: [...get().pairings, newPairing],
          cards: [...cards, newEggCard],
          selectedCardIds: [],
          fertilityUsage: {
            ...fertilityUsage,
            [cardAId]: (fertilityUsage[cardAId] ?? 0) + 1,
            [cardBId]: (fertilityUsage[cardBId] ?? 0) + 1,
          },
        });

        return { success: true };
      },

      removeCard: (cardId) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (!card) return state;

          if (card.kind === "egg") {
            const pairing = state.pairings.find((p) => p.resultCardId === cardId);
            if (pairing) {
              const usage = { ...state.fertilityUsage };
              usage[pairing.cardAId] = Math.max(0, (usage[pairing.cardAId] ?? 0) - 1);
              usage[pairing.cardBId] = Math.max(0, (usage[pairing.cardBId] ?? 0) - 1);

              return {
                pairings: state.pairings.filter((p) => p.id !== pairing.id),
                cards: state.cards.filter((c) => c.id !== cardId),
                selectedCardIds: state.selectedCardIds.filter((id) => id !== cardId),
                fertilityUsage: usage,
              };
            }
          }

          return {
            cards: state.cards.filter((c) => c.id !== cardId),
            selectedCardIds: state.selectedCardIds.filter((id) => id !== cardId),
          };
        }),

      reset: () =>
        set({ cards: [createLeafCard(0), createLeafCard(0)], pairings: [], selectedCardIds: [], fertilityUsage: {} }),

      loadPlan: (plan) => set({ ...plan, selectedCardIds: [] }),
    }),
    {
      name: "breedlemon-plan",
      partialize: (state) => ({
        cards: state.cards,
        pairings: state.pairings,
        fertilityUsage: state.fertilityUsage,
      }),
    },
  ),
);
