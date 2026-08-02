"use client";

import { useMemo, useState } from "react";
import { PokemonSpecies } from "@/types";
import { useGenealogyTreeStore } from "@/stores/genealogyTreeStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getEligibleEntriesForSlot, getEligibleSpeciesForSlot, getForcedGenderForSlot } from "@/lib/genealogyTree";
import { computeLayout } from "@/lib/layout";
import { Canvas } from "./Canvas";
import { CanvasEdges } from "./CanvasEdges";
import { SlotPicker } from "./SlotPicker";
import { TreeCard } from "./TreeCard";
import { useTreeBreed } from "@/hooks/useTreeBreed";
import { InventoryCardModal } from "./InventoryCardModal";
import { ModalOverlay } from "./ModalOverlay";

const NODE_WIDTH = 300;
const NODE_HEIGHT = 140;

type SelectedSlot = { genIndex: number; slotIndex: number };

export function GenealogyTreeView({ allSpecies }: { allSpecies: PokemonSpecies[] }) {
  const tree = useGenealogyTreeStore((s) => s.tree);
  const assignSlot = useGenealogyTreeStore((s) => s.assignSlot);
  const entries = useInventoryStore((s) => s.entries);
  const addEntry = useInventoryStore((s) => s.addEntry);
  const { breedSlot, canBreedSlot } = useTreeBreed(allSpecies);

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [creatingEntryId, setCreatingEntryId] = useState<string | null>(null);
  const currentSlotEntryId = selectedSlot
    ? tree[selectedSlot.genIndex][selectedSlot.slotIndex].inventoryEntryId
    : undefined;

  const { nodes, edges } = useMemo(() => {
    const rawNodes: { id: string; width: number; height: number; genIndex: number; slotIndex: number }[] = [];
    const rawEdges: { id: string; source: string; target: string }[] = [];

    tree.forEach((generation, genIndex) => {
      generation.forEach((_, slotIndex) => {
        rawNodes.push({
          id: `gen${genIndex}-slot${slotIndex}`,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          genIndex,
          slotIndex,
        });
      });
    });

    // chaque slot d'une génération est produit par 2 slots de la génération précédente (indices 2k et 2k+1)
    for (let genIndex = 1; genIndex < tree.length; genIndex++) {
      tree[genIndex].forEach((_, slotIndex) => {
        const childA = slotIndex * 2;
        const childB = slotIndex * 2 + 1;

        rawEdges.push({
          id: `gen${genIndex - 1}-slot${childA}->gen${genIndex}-slot${slotIndex}`,
          source: `gen${genIndex - 1}-slot${childA}`,
          target: `gen${genIndex}-slot${slotIndex}`,
        });
        rawEdges.push({
          id: `gen${genIndex - 1}-slot${childB}->gen${genIndex}-slot${slotIndex}`,
          source: `gen${genIndex - 1}-slot${childB}`,
          target: `gen${genIndex}-slot${slotIndex}`,
        });
      });
    }

    const positions = computeLayout(rawNodes, rawEdges);
    const nodes = rawNodes.map((n) => ({ ...n, ...positions.get(n.id)! }));

    return { nodes, edges: rawEdges };
  }, [tree]);

  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const worldWidth = Math.max(0, ...nodes.map((n) => n.x + n.width)) + 200;
  const worldHeight = Math.max(0, ...nodes.map((n) => n.y + n.height)) + 200;

  const eligibleEntries = selectedSlot
    ? getEligibleEntriesForSlot(tree, selectedSlot.genIndex, selectedSlot.slotIndex, entries, allSpecies)
    : [];

  const eligibleSpecies = selectedSlot
    ? getEligibleSpeciesForSlot(tree, selectedSlot.genIndex, selectedSlot.slotIndex, entries, allSpecies)
    : null;

  const getForcedGender = selectedSlot
    ? (speciesId: number) =>
        getForcedGenderForSlot(tree, selectedSlot.genIndex, selectedSlot.slotIndex, speciesId, entries, allSpecies)
    : undefined;

  return (
    <div style={{ width: "100%", height: "91vh" }}>
      <Canvas worldWidth={worldWidth} worldHeight={worldHeight}>
        <CanvasEdges edges={edges} nodesById={nodesById} />
        {nodes.map((node) => {
          const slot = tree[node.genIndex][node.slotIndex];
          const entry = entries.find((e) => e.id === slot.inventoryEntryId);

          return (
            <div
              key={node.id}
              data-canvas-node
              style={{ position: "absolute", left: node.x, top: node.y, width: node.width, height: node.height }}
            >
              <TreeCard
                entry={entry}
                allSpecies={allSpecies}
                onClick={() => setSelectedSlot({ genIndex: node.genIndex, slotIndex: node.slotIndex })}
                canBreed={!entry && canBreedSlot(node.genIndex, node.slotIndex)}
                onBreed={() => breedSlot(node.genIndex, node.slotIndex)}
              />
            </div>
          );
        })}
      </Canvas>

      {creatingEntryId ? (
        <ModalOverlay
          onClose={() => {
            setCreatingEntryId(null);
            setSelectedSlot(null);
          }}
        >
          <InventoryCardModal
            entryId={creatingEntryId}
            allSpecies={allSpecies}
            allowedSpecies={eligibleSpecies}
            getForcedGender={getForcedGender}
            variant="create"
            onClose={() => {
              setCreatingEntryId(null);
              setSelectedSlot(null);
            }}
          />
        </ModalOverlay>
      ) : (
        selectedSlot && (
          <ModalOverlay onClose={() => setSelectedSlot(null)}>
            <SlotPicker
              eligibleEntries={eligibleEntries}
              allSpecies={allSpecies}
              selectedEntryId={currentSlotEntryId}
              onSelect={(entryId) => {
                assignSlot(selectedSlot.genIndex, selectedSlot.slotIndex, entryId);
                setSelectedSlot(null);
              }}
              onAddParent={() => {
                const newEntryId = addEntry();
                assignSlot(selectedSlot.genIndex, selectedSlot.slotIndex, newEntryId);
                setCreatingEntryId(newEntryId);
              }}
              onClose={() => setSelectedSlot(null)}
            />
          </ModalOverlay>
        )
      )}
    </div>
  );
}
