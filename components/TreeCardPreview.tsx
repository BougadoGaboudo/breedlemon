"use client";

import Image from "next/image";
import { PokemonSpecies } from "@/types";
import { stats, eggGroupLabels, genderLabels, statLabels, maxIV } from "@/data/stats";
import { InventoryEntry, formatDisplayNumber } from "@/stores/inventoryStore";
import { breedingItems } from "@/data/breedingItems";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { useThemeStore } from "@/stores/themeStore";

type TreeCardPreviewProps = { entry: InventoryEntry; allSpecies: PokemonSpecies[] };

export function TreeCardPreview({ entry, allSpecies }: TreeCardPreviewProps) {
  const { theme } = useThemeStore();
  const species = allSpecies.find((s) => s.id === entry.draft.speciesId) ?? null;
  const item = breedingItems.find((i) => i.stat === entry.draft.heldItemStat);

  const fertilityUsage = useGenealogyTreeStore((s) => s.fertilityUsage);
  const remainingFertility = Math.max(0, entry.draft.fertility - (fertilityUsage[entry.id] ?? 0));

  return (
    <section className="bg-light-500 flex flex-col gap-4 p-4 border-2 border-dark-500 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-4 items-center">
        {species?.sprite ? (
          <Image src={species.sprite} alt={species.name.fr} width={96} height={96} />
        ) : (
          <span className="h-full w-full content-center text-center bg-primary-500/25 rounded-lg">?</span>
        )}
        <div className="col-span-2 flex flex-col gap-1">
          <p className="font-medium">
            {species?.name.fr ?? "?"}{" "}
            <span className="text-dark-500/60">{formatDisplayNumber(entry.displayNumber)}</span>
          </p>
          <p className="text-sm">{entry.draft.gender ? genderLabels[entry.draft.gender] : "?"}</p>
          <p className="text-sm">
            Fertilité : {entry.draft.fertility} ({remainingFertility})
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-1">
        {stats.map((stat) => {
          const value = entry.draft.ivs[stat];
          const percent = (value / maxIV) * 100;

          return (
            <div key={stat} className="grid grid-cols-8 gap-4 items-center text-sm">
              <span>{statLabels[stat]}</span>
              <span className="text-right">{value}</span>
              <div className="col-span-6 h-3 rounded-full border border-dark-500 bg-light-500 overflow-hidden">
                <div className="h-full bg-primary-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {item && (
        <p className="text-sm">
          Item IV : {item.nameFr} ({statLabels[item.stat]})
        </p>
      )}
    </section>
  );
}
