"use client";

import Image from "next/image";
import { Gender, PokemonSpecies } from "@/types";
import { stats, eggGroupLabels, genderLabels, statLabels } from "@/data/stats";
import { getAvailableGenders, isDitto } from "@/lib/compatibility";
import { useInventoryStore, InventoryEntry, formatDisplayNumber } from "@/stores/inventoryStore";
import { StatSlider } from "./StatSlider";
import { Select } from "./Select";
import SecondaryButton from "./SecondaryButton";
import { breedingItems } from "@/data/breedingItems";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import PrimaryButton from "./PrimaryButton";
import { useThemeStore } from "@/stores/themeStore";
import { SpeciesCombobox } from "./SpeciesCombobox";
import { ivsSnapshotKey } from "@/hooks/useAutoHeldItem";

type InventoryCardProps = {
  entry: InventoryEntry;
  allSpecies: PokemonSpecies[];
  onSelect?: (() => void) | null;
  allowedSpecies?: PokemonSpecies[] | null;
  getForcedGender?: (speciesId: number) => Gender | null;
  deleteLabel?: string;
};

export function InventoryCard({
  entry,
  allSpecies,
  onSelect,
  allowedSpecies,
  getForcedGender,
  deleteLabel = "Supprimer",
}: InventoryCardProps) {
  const { theme } = useThemeStore();

  const updateEntry = useInventoryStore((s) => s.updateEntry);
  const removeEntry = useInventoryStore((s) => s.removeEntry);
  const removeEntryFromTree = useGenealogyTreeStore((s) => s.removeEntryFromTree);

  const species = allSpecies.find((s) => s.id === entry.draft.speciesId) ?? null;
  const availableGenders = species ? getAvailableGenders(species.genderRate) : [];

  const update = (partial: Partial<typeof entry.draft>) => updateEntry(entry.id, { ...entry.draft, ...partial });

  const fertilityUsage = useGenealogyTreeStore((s) => s.fertilityUsage);

  const remainingFertility = Math.max(0, entry.draft.fertility - (fertilityUsage[entry.id] ?? 0));

  const handleDelete = () => {
    removeEntryFromTree(entry.id);
    removeEntry(entry.id);
  };

  const speciesOptions = allowedSpecies ?? allSpecies.filter((s) => s.isBreedable || isDitto(s));

  const forcedGender = species && getForcedGender ? getForcedGender(species.id) : null;

  const isUsedInTree = useGenealogyTreeStore((s) =>
    s.tree.some((generation) => generation.some((slot) => slot.inventoryEntryId === entry.id)),
  );

  return (
    <section className="bg-light-500 flex flex-col gap-4 p-4 border-2 border-dark-500 rounded-lg">
      <div className="grid grid-cols-3 gap-4 items-center">
        {species?.sprite ? (
          <Image src={species.sprite} alt={species.name.fr} width={96} height={96} />
        ) : (
          <span className="h-full w-full content-center text-center bg-primary-500/25 rounded-lg">?</span>
        )}
        <div className="col-span-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-lg text-dark-500/60">{formatDisplayNumber(entry.displayNumber)}</p>
            {isUsedInTree && <span className="text-sm text-dark-500/70">Déjà utilisé</span>}
          </div>
          <div className="flex items-center gap-2">
            <label className="w-fit whitespace-nowrap">Pokémon : </label>
            <SpeciesCombobox
              value={entry.draft.speciesId}
              options={speciesOptions}
              placeholder="Pokémon"
              onChange={(speciesId) => {
                const forced = speciesId !== undefined && getForcedGender ? getForcedGender(speciesId) : null;
                update({ speciesId, gender: forced ?? undefined });
              }}
            />
            {/* <Select
              value={entry.draft.speciesId}
              options={speciesOptions.map((s) => ({ value: s.id, label: s.name.fr }))}
              placeholder="Pokémon"
              onChange={(speciesId) => {
                const forced = speciesId !== undefined && getForcedGender ? getForcedGender(speciesId) : null;
                update({ speciesId, gender: forced ?? undefined });
              }}
            /> */}
          </div>
          <div className="flex items-center gap-2">
            <label className="w-fit whitespace-nowrap">Sexe : </label>
            <Select
              value={forcedGender ?? entry.draft.gender}
              options={availableGenders.map((g) => ({ value: g, label: genderLabels[g] }))}
              placeholder="Choisir"
              disabled={!species || !!forcedGender}
              onChange={(g) => update({ gender: g as Gender })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-fit whitespace-nowrap">Fertilité :</label>
            <input
              type="number"
              min={0}
              value={entry.draft.fertility}
              onChange={(e) => update({ fertility: Number(e.target.value) || 0 })}
              className="w-12 text-center border border-dark-500 rounded-sm"
            />
            <span>({remainingFertility})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p>Groupe d'oeuf :</p>

        <div className="flex gap-2 flex-wrap">
          {species && species.eggGroups.length > 0 ? (
            species.eggGroups.map((group) => (
              <span
                key={group}
                className={`px-4 py-2 ${theme === "dark" ? "text-light-500" : "text-dark-500"} bg-primary-500 rounded-lg text-sm`}
              >
                {eggGroupLabels[group] ?? group}
              </span>
            ))
          ) : (
            <span className="px-4 py-2 text-sm text-center bg-primary-500 rounded-lg">?</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="w-fit whitespace-nowrap">Item IV : </label>
        <Select
          value={entry.draft.heldItemStat}
          options={breedingItems.map((item) => ({
            value: item.stat,
            label: `${item.nameFr} (${statLabels[item.stat]})`,
          }))}
          placeholder="Choisir"
          clearLabel="Aucun item"
          onChange={(stat) =>
            update({
              heldItemStat: stat,
              heldItemIvsSnapshot: ivsSnapshotKey(entry.draft.ivs),
            })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {stats.map((stat) => (
          <StatSlider
            key={stat}
            stat={stat}
            value={entry.draft.ivs[stat]}
            onChange={(v) => update({ ivs: { ...entry.draft.ivs, [stat]: v } })}
          />
        ))}
      </div>

      {onSelect === undefined ? (
        <SecondaryButton onClick={handleDelete}>{deleteLabel}</SecondaryButton>
      ) : onSelect ? (
        <PrimaryButton onClick={onSelect}>Sélectionner</PrimaryButton>
      ) : null}
    </section>
  );
}
