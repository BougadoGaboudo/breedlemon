"use client";

import Image from "next/image";
import { PokemonSpecies } from "@/types";
import { InventoryEntry, formatDisplayNumber } from "@/stores/inventoryStore";
import { stats, statLabels, eggGroupLabels, genderLabels } from "@/data/stats";
import { breedingItems } from "@/data/breedingItems";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { TreeCardPreview } from "./TreeCardPreview";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TreeCardProps = {
  entry: InventoryEntry | undefined;
  allSpecies: PokemonSpecies[];
  onClick: () => void;
  canBreed?: boolean;
  onBreed?: () => void;
};

export function TreeCard({ entry, allSpecies, onClick, canBreed, onBreed }: TreeCardProps) {
  const fertilityUsage = useGenealogyTreeStore((s) => s.fertilityUsage);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewHorizontal, setPreviewHorizontal] = useState<"left" | "right">("right");
  const [previewVertical, setPreviewVertical] = useState<"top" | "bottom">("top");

  const PREVIEW_WIDTH_ESTIMATE = 340;
  const PREVIEW_HEIGHT_ESTIMATE = 340;

  const handleMouseEnter = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    setPreviewHorizontal(spaceRight >= PREVIEW_WIDTH_ESTIMATE || spaceRight >= spaceLeft ? "right" : "left");

    const spaceBelowTop = window.innerHeight - rect.top;
    setPreviewVertical(spaceBelowTop >= PREVIEW_HEIGHT_ESTIMATE ? "top" : "bottom");
  };

  if (!entry) {
    if (canBreed) {
      return (
        <button
          type="button"
          onClick={onBreed}
          className="flex items-center justify-center border-2 border-dark-500 rounded-lg w-full h-full cursor-pointer"
        >
          Breed
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center border-2 border-dashed border-dark-500/50 rounded-lg w-full h-full cursor-pointer"
      >
        <span className="text-3xl text-dark-500/50">+</span>
      </button>
    );
  }

  const species = allSpecies.find((s) => s.id === entry.draft.speciesId);
  const item = breedingItems.find((i) => i.stat === entry.draft.heldItemStat);
  const remainingFertility = Math.max(0, entry.draft.fertility - (fertilityUsage[entry.id] ?? 0));

  return (
    <div ref={containerRef} className="relative group w-full h-full" onMouseEnter={handleMouseEnter}>
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dark-500 rounded-lg bg-light-500 text-left w-full h-full cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {species?.sprite ? (
            <Image
              src={species.sprite}
              alt={species.name.fr}
              width={80}
              height={80}
              className="bg-primary-500/25 rounded-lg"
            />
          ) : (
            <span className="w-10 h-10 flex items-center justify-center bg-primary-500/25 rounded">?</span>
          )}
          <div className="flex flex-col gap-1">
            <p className="font-medium text-base ">
              {species?.name.fr ?? "?"}{" "}
              <span className="text-dark-500/60">{formatDisplayNumber(entry.displayNumber)}</span>
            </p>
            <p className="text-sm">
              {entry.draft.gender ? genderLabels[entry.draft.gender] : "?"} <span className="text-dark-500/50">|</span>{" "}
              F : {entry.draft.fertility} ({remainingFertility})
            </p>
            {item ? (
              <p className="text-sm">
                {item.nameFr} ({statLabels[item.stat]})
              </p>
            ) : (
              <span className="text-sm text-dark-500/75">Sans item</span>
            )}
            <p className="text-sm">IVs : {stats.map((s) => entry.draft.ivs[s]).join("/")}</p>
          </div>
        </div>
        {/*
        <div className="flex gap-1 flex-wrap">
          {(species?.eggGroups ?? []).map((g) => (
            <span key={g} className="px-4 py-2 bg-primary-500 rounded text-xs">
              {eggGroupLabels[g] ?? g}
            </span>
          ))}
        </div>
        <p className="text-xs">{stats.map((s) => entry.draft.ivs[s]).join("/")}</p>
        <p className="text-xs text-dark-500/70">{stats.map((s) => statLabels[s]).join("/")}</p> */}
      </button>
      <div
        className={cn(
          "absolute w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none z-50",
          previewHorizontal === "right" ? "left-full ml-2" : "right-full mr-2",
          previewVertical === "top" ? "top-0" : "bottom-0",
        )}
      >
        <TreeCardPreview entry={entry} allSpecies={allSpecies} />
      </div>
    </div>
  );
}
