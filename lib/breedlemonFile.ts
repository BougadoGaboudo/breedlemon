import { InventoryEntry } from "@/stores/inventoryStore";
import { GenealogyTree, PairingStatus } from "@/lib/genealogyTree";

export type BreedlemonFile = {
  version: 1;
  inventory: {
    entries: InventoryEntry[];
    nextDisplayNumber: number;
  };
  genealogyTree: {
    targetIvCount: number;
    tree: GenealogyTree;
    pairingStatus?: Record<string, PairingStatus>;
  };
};

export function exportBreedlemonData(data: Omit<BreedlemonFile, "version">) {
  const file: BreedlemonFile = { version: 1, ...data };
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `breedlemon-save-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedBreedlemonData(raw: string): BreedlemonFile | null {
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1) return null;
    if (!Array.isArray(data.inventory?.entries)) return null;
    if (typeof data.inventory?.nextDisplayNumber !== "number") return null;
    if (!Array.isArray(data.genealogyTree?.tree)) return null;
    if (typeof data.genealogyTree?.targetIvCount !== "number") return null;
    return data as BreedlemonFile;
  } catch {
    return null;
  }
}
