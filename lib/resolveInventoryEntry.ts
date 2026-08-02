import { InventoryEntry } from "@/stores/inventoryStore";
import { ParentPokemon } from "@/types";
import { isCompleteParent } from "./compatibility";

export function resolveInventoryEntry(entry: InventoryEntry): ParentPokemon | null {
  if (!isCompleteParent(entry.draft)) return null;
  return entry.draft;
}
