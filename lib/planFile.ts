import { Pairing, PlanCard } from "@/types";

export type BreedingPlanFile = {
  version: 1;
  cards: PlanCard[];
  pairings: Pairing[];
  fertilityUsage: Record<string, number>;
};

export function exportPlan(plan: Omit<BreedingPlanFile, "version">) {
  const file: BreedingPlanFile = { version: 1, ...plan };
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `breedlemon-plan-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedPlan(raw: string): BreedingPlanFile | null {
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1) return null;
    if (!Array.isArray(data.cards) || !Array.isArray(data.pairings)) return null;
    return data as BreedingPlanFile;
  } catch {
    return null;
  }
}
