"use client";

import { useRef } from "react";
import { useBreedingPlanStore } from "@/stores/breedingPlanStore";
import { exportPlan, parseImportedPlan } from "@/lib/planFile";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

export function PlanFileControls() {
  const cards = useBreedingPlanStore((s) => s.cards);
  const pairings = useBreedingPlanStore((s) => s.pairings);
  const fertilityUsage = useBreedingPlanStore((s) => s.fertilityUsage);
  const loadPlan = useBreedingPlanStore((s) => s.loadPlan);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportPlan({ cards, pairings, fertilityUsage });

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text().then((raw) => {
      const parsed = parseImportedPlan(raw);
      if (!parsed) {
        alert("Fichier invalide ou format non reconnu.");
        return;
      }
      loadPlan(parsed);
    });

    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 flex-col md:flex-row">
      <SecondaryButton onClick={handleExport}>Exporter</SecondaryButton>
      <PrimaryButton onClick={() => fileInputRef.current?.click()}>Importer</PrimaryButton>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}
