"use client";

import { PokemonSpecies } from "@/types";
import { InventoryEntry, formatDisplayNumber } from "@/stores/inventoryStore";
import { InventoryCard } from "./InventoryCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useThemeStore } from "@/stores/themeStore";

type SlotPickerProps = {
  eligibleEntries: InventoryEntry[];
  allSpecies: PokemonSpecies[];
  selectedEntryId?: string;
  onSelect: (entryId: string | undefined) => void;
  onAddParent: () => void;
  onClose: () => void;
};

export function SlotPicker({
  eligibleEntries,
  allSpecies,
  selectedEntryId,
  onSelect,
  onAddParent,
  onClose,
}: SlotPickerProps) {
  const { theme } = useThemeStore();

  return (
    <div
      className="flex flex-col gap-2 bg-light-500 rounded-lg py-4 px-6 w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Sélectionne un Pokémon</h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer px-3 py-1.5 rounded-sm font-bold transition-all duration-300 ease-out hover:bg-primary-500/50"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2 pb-4 border-b border-dark-500/20">
        <SecondaryButton onClick={() => onSelect(undefined)} className="w-[33%]">
          Vider ce slot
        </SecondaryButton>

        <PrimaryButton onClick={onAddParent} className="w-[67%]">
          Créer un nouveau parent
        </PrimaryButton>
      </div>

      <div className="bg-light-500 max-h-[70vh] overflow-y-auto flex flex-col gap-2">
        {eligibleEntries.length === 0 && (
          <p className="text-sm text-dark-500/60">Aucun Pokémon compatible dans ton inventaire.</p>
        )}

        <Accordion key={selectedEntryId ?? "none"} defaultValue={selectedEntryId ? [selectedEntryId] : []}>
          {eligibleEntries.map((entry) => {
            const species = allSpecies.find((s) => s.id === entry.draft.speciesId);
            const isSelected = entry.id === selectedEntryId;

            return (
              <AccordionItem key={entry.id} value={entry.id}>
                <AccordionTrigger
                  className={`flex-1 px-4 py-2 cursor-pointer text-base {text-dark-500 hover:text-light-500} ${isSelected ? "bg-primary-500 rounded-lg" : ""}`}
                >
                  <span className={`text-dark-500/70 mr-2`}>{formatDisplayNumber(entry.displayNumber)}</span>
                  <span>{species?.name.fr ?? "?"}</span>
                </AccordionTrigger>

                <AccordionContent>
                  <InventoryCard
                    entry={entry}
                    allSpecies={allSpecies}
                    onSelect={isSelected ? null : () => onSelect(entry.id)}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
