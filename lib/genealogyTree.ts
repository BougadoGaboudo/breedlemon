import { Gender, PokemonSpecies } from "@/types";
import { InventoryEntry } from "@/stores/inventoryStore";
import { checkBreedingCompatibility, isCompleteParent, isDitto, resolveBaseForm } from "./compatibility";

export type TreeSlot = {
  inventoryEntryId?: string;
};

export type TreeGeneration = TreeSlot[];

export type GenealogyTree = TreeGeneration[];

export type TreeBreed = {
  id: string;

  parentA: {
    genIndex: number;
    slotIndex: number;
  };

  parentB: {
    genIndex: number;
    slotIndex: number;
  };

  child: {
    genIndex: number;
    slotIndex: number;
  };
};

export function createEmptyTree(targetIvCount: number): GenealogyTree {
  if (targetIvCount < 2 || targetIvCount > 6) {
    throw new Error("targetIvCount doit être entre 2 et 6");
  }

  const tree: GenealogyTree = [];
  let size = 2 ** (targetIvCount - 1);

  while (size >= 1) {
    tree.push(Array.from({ length: size }, () => ({ inventoryEntryId: undefined })));
    size = size / 2;
  }

  return tree;
}

export function getSiblingSlotIndex(slotIndex: number): number {
  return slotIndex % 2 === 0 ? slotIndex + 1 : slotIndex - 1;
}

function getTargetChildSpecies(
  tree: GenealogyTree,
  genIndex: number,
  slotIndex: number,
  inventory: InventoryEntry[],
  allSpecies: PokemonSpecies[],
): PokemonSpecies | null {
  let currentGenIndex = genIndex;
  let currentSlotIndex = slotIndex;

  while (currentGenIndex + 1 < tree.length) {
    const childGenIndex = currentGenIndex + 1;
    const childSlotIndex = Math.floor(currentSlotIndex / 2);
    const childEntryId = tree[childGenIndex][childSlotIndex]?.inventoryEntryId;

    if (!childEntryId) {
      currentGenIndex = childGenIndex;
      currentSlotIndex = childSlotIndex;
      continue;
    }

    const childEntry = inventory.find((e) => e.id === childEntryId);
    if (!childEntry?.draft.speciesId) return null;

    return allSpecies.find((s) => s.id === childEntry.draft.speciesId) ?? null;
  }

  return null;
}

function canPlausiblyProduce(candidateSpecies: PokemonSpecies, targetSpecies: PokemonSpecies): boolean {
  if (isDitto(candidateSpecies)) return targetSpecies.canBreedWithDitto;
  if (isDitto(targetSpecies)) return candidateSpecies.canBreedWithDitto;
  return candidateSpecies.eggGroups.some((g) => targetSpecies.eggGroups.includes(g));
}

export function getEligibleEntriesForSlot(
  tree: GenealogyTree,
  genIndex: number,
  slotIndex: number,
  inventory: InventoryEntry[],
  allSpecies: PokemonSpecies[],
): InventoryEntry[] {
  const currentEntry = inventory.find((e) => e.id === tree[genIndex][slotIndex]?.inventoryEntryId);
  const withCurrent = (list: InventoryEntry[]) =>
    currentEntry && !list.some((e) => e.id === currentEntry.id) ? [currentEntry, ...list] : list;

  const targetSpecies = getTargetChildSpecies(tree, genIndex, slotIndex, inventory, allSpecies);
  const targetBaseFormId = targetSpecies ? resolveBaseForm(targetSpecies, allSpecies) : null;

  const matchesTarget = (entry: InventoryEntry): boolean => {
    if (!targetSpecies) return true;
    const species = allSpecies.find((s) => s.id === entry.draft.speciesId);
    return !!species && canPlausiblyProduce(species, targetSpecies);
  };

  if (tree[genIndex].length === 1) {
    return withCurrent(inventory.filter((entry) => isCompleteParent(entry.draft)));
  }

  const siblingIndex = getSiblingSlotIndex(slotIndex);
  const siblingEntryId = tree[genIndex][siblingIndex]?.inventoryEntryId;

  if (!siblingEntryId) {
    return withCurrent(inventory.filter((entry) => isCompleteParent(entry.draft) && matchesTarget(entry)));
  }

  const siblingEntry = inventory.find((e) => e.id === siblingEntryId);
  if (!siblingEntry || !isCompleteParent(siblingEntry.draft)) {
    return withCurrent(inventory.filter(matchesTarget));
  }
  const siblingParent = siblingEntry.draft;

  const siblingSpecies = allSpecies.find((s) => s.id === siblingParent.speciesId);
  if (!siblingSpecies) return withCurrent(inventory.filter(matchesTarget));

  return withCurrent(
    inventory.filter((entry) => {
      if (entry.id === siblingEntryId) return false;
      if (!isCompleteParent(entry.draft)) return false;
      const parent = entry.draft;

      const species = allSpecies.find((s) => s.id === parent.speciesId);
      if (!species) return false;

      const check = checkBreedingCompatibility(parent, species, siblingParent, siblingSpecies, allSpecies);
      if (!check.canBreed) return false;
      if (targetBaseFormId !== null && check.childSpeciesId !== targetBaseFormId) return false;

      return true;
    }),
  );
}

export function getParentSlotsForChild(
  tree: GenealogyTree,
  genIndex: number,
  slotIndex: number,
): [TreeSlot, TreeSlot] | null {
  if (genIndex === 0) return null;

  const parentGeneration = tree[genIndex - 1];

  const parentAIndex = slotIndex * 2;
  const parentBIndex = slotIndex * 2 + 1;

  const parentA = parentGeneration[parentAIndex];
  const parentB = parentGeneration[parentBIndex];

  if (!parentA || !parentB) return null;

  return [parentA, parentB];
}

export function getForcedGenderForSlot(
  tree: GenealogyTree,
  genIndex: number,
  slotIndex: number,
  speciesId: number,
  inventory: InventoryEntry[],
  allSpecies: PokemonSpecies[],
): Gender | null {
  const candidate = allSpecies.find((s) => s.id === speciesId);
  if (!candidate || isDitto(candidate)) return null;

  if (tree[genIndex].length === 1) return null;

  const siblingIndex = getSiblingSlotIndex(slotIndex);
  const siblingEntryId = tree[genIndex][siblingIndex]?.inventoryEntryId;
  const siblingEntry = inventory.find((e) => e.id === siblingEntryId);

  if (siblingEntry && isCompleteParent(siblingEntry.draft)) {
    if (siblingEntry.draft.gender === "male") return "female";
    if (siblingEntry.draft.gender === "female") return "male";
    return null;
  }

  const targetSpecies = getTargetChildSpecies(tree, genIndex, slotIndex, inventory, allSpecies);
  if (!targetSpecies) return null;

  const candidateBase = resolveBaseForm(candidate, allSpecies);
  const targetBase = resolveBaseForm(targetSpecies, allSpecies);

  return candidateBase === targetBase ? "female" : "male";
}

export function getEligibleSpeciesForSlot(
  tree: GenealogyTree,
  genIndex: number,
  slotIndex: number,
  inventory: InventoryEntry[],
  allSpecies: PokemonSpecies[],
): PokemonSpecies[] | null {
  if (tree[genIndex].length === 1) return null;

  const targetSpecies = getTargetChildSpecies(tree, genIndex, slotIndex, inventory, allSpecies);
  const targetBaseFormId = targetSpecies ? resolveBaseForm(targetSpecies, allSpecies) : null;

  const siblingIndex = getSiblingSlotIndex(slotIndex);
  const siblingEntryId = tree[genIndex][siblingIndex]?.inventoryEntryId;
  const siblingEntry = inventory.find((e) => e.id === siblingEntryId);
  const siblingComplete = !!siblingEntry && isCompleteParent(siblingEntry.draft);
  const siblingSpecies = siblingEntry?.draft.speciesId
    ? (allSpecies.find((s) => s.id === siblingEntry.draft.speciesId) ?? null)
    : null;

  if (siblingComplete && siblingEntry!.draft.gender === "male" && targetBaseFormId !== null) {
    return allSpecies.filter((s) => resolveBaseForm(s, allSpecies) === targetBaseFormId);
  }

  if (!targetSpecies && !siblingSpecies) return null;

  return allSpecies.filter((species) => {
    if (!species.isBreedable && !isDitto(species)) return false;
    if (targetSpecies && !canPlausiblyProduce(species, targetSpecies)) return false;
    if (siblingSpecies && !canPlausiblyProduce(species, siblingSpecies)) return false;
    return true;
  });
}
