"use client";

import { useRef } from "react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { exportBreedlemonData, parseImportedBreedlemonData } from "@/lib/breedlemonFile";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

export function SaveFileControls() {
  const entries = useInventoryStore((s) => s.entries);
  const nextDisplayNumber = useInventoryStore((s) => s.nextDisplayNumber);
  const loadEntries = useInventoryStore((s) => s.loadEntries);

  const targetIvCount = useGenealogyTreeStore((s) => s.targetIvCount);
  const tree = useGenealogyTreeStore((s) => s.tree);
  const loadTree = useGenealogyTreeStore((s) => s.loadTree);
  const pairingStatus = useGenealogyTreeStore((s) => s.pairingStatus);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () =>
    exportBreedlemonData({
      inventory: { entries, nextDisplayNumber },
      genealogyTree: { targetIvCount, tree, pairingStatus },
    });

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text().then((raw) => {
      const parsed = parseImportedBreedlemonData(raw);
      if (!parsed) {
        alert("Fichier invalide ou format non reconnu.");
        return;
      }
      loadEntries(parsed.inventory.entries, parsed.inventory.nextDisplayNumber);
      loadTree(parsed.genealogyTree.targetIvCount, parsed.genealogyTree.tree, parsed.genealogyTree.pairingStatus);
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
