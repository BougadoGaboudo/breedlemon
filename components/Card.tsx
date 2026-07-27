"use client";

import Image from "next/image";
import { Gender, PlanCard, PokemonSpecies } from "@/types";
import { stats, statLabels, eggGroupLabels, genderLabels, Stat } from "@/data/stats";
import { breedingItems } from "@/data/breedingItems";
import { getAvailableGenders } from "@/lib/compatibility";
import { useBreedingPlanStore } from "@/stores/breedingPlanStore";
import { StatSlider } from "./StatSlider";
import { Select } from "./Select";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

type CardProps = { card: PlanCard; allSpecies: PokemonSpecies[] };

export function Card({ card, allSpecies }: CardProps) {
  const selectedCardIds = useBreedingPlanStore((s) => s.selectedCardIds);
  const fertilityUsage = useBreedingPlanStore((s) => s.fertilityUsage);
  const toggleCardSelection = useBreedingPlanStore((s) => s.toggleCardSelection);
  const updateLeafDraft = useBreedingPlanStore((s) => s.updateLeafDraft);
  const updateEggGender = useBreedingPlanStore((s) => s.updateEggGender);
  const updateEggItem = useBreedingPlanStore((s) => s.updateEggItem);
  const removeCard = useBreedingPlanStore((s) => s.removeCard);

  const isSelected = selectedCardIds.includes(card.id);
  const usedFertility = fertilityUsage[card.id] ?? 0;

  let species: PokemonSpecies | null | undefined;
  let ivs: Record<Stat, number>;
  let baseFertility: number;
  let gender: Gender | undefined;
  let availableGenders: Gender[];
  let heldItemStat: Stat | undefined;
  let nameNode: React.ReactNode;
  let onGenderChange: (g: Gender | undefined) => void;
  let onItemChange: (stat: Stat | undefined) => void;
  let onStatChange: ((stat: Stat, value: number) => void) | undefined;
  let onFertilityChange: ((value: number) => void) | undefined;

  if (card.kind === "leaf") {
    species = allSpecies.find((s) => s.id === card.draft.speciesId) ?? null;
    ivs = card.draft.ivs;
    baseFertility = card.draft.fertility;
    gender = card.draft.gender;
    availableGenders = species ? getAvailableGenders(species.genderRate) : [];
    heldItemStat = card.draft.heldItemStat;

    nameNode = (
      <Select
        value={card.draft.speciesId}
        options={allSpecies.filter((s) => s.isBreedable).map((s) => ({ value: s.id, label: s.name.fr }))}
        placeholder="Pokémon"
        onChange={(speciesId) => updateLeafDraft(card.id, { ...card.draft, speciesId, gender: undefined })}
      />
    );

    onGenderChange = (g) => updateLeafDraft(card.id, { ...card.draft, gender: g });
    onItemChange = (stat) => updateLeafDraft(card.id, { ...card.draft, heldItemStat: stat });
    onStatChange = (stat, value) =>
      updateLeafDraft(card.id, { ...card.draft, ivs: { ...card.draft.ivs, [stat]: value } });
    onFertilityChange = (value) => updateLeafDraft(card.id, { ...card.draft, fertility: value });
  } else {
    species = allSpecies.find((s) => s.id === card.speciesId);
    ivs = Object.fromEntries(stats.map((stat) => [stat, card.ivs[stat].value])) as Record<Stat, number>;
    baseFertility = card.fertility;
    gender = card.gender;
    availableGenders = species ? getAvailableGenders(species.genderRate) : [];
    heldItemStat = card.heldItemStat;

    nameNode = <p>{species?.name.fr ?? "Espèce inconnue"}</p>;

    onGenderChange = (g) => g && updateEggGender(card.id, g);
    onItemChange = (stat) => updateEggItem(card.id, stat);
    onStatChange = undefined; // IV verrouillées sur un oeuf
    onFertilityChange = undefined; // fertilité verrouillée sur un oeuf
  }

  const remainingFertility = baseFertility - usedFertility;

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
            <label className="w-fit whitespace-nowrap">Pokémon : </label>
            {nameNode}
          </div>
          <div className="flex items-center gap-2">
            <label className="w-fit whitespace-nowrap">Sexe : </label>
            <Select
              value={gender}
              options={availableGenders.map((g) => ({ value: g, label: genderLabels[g] }))}
              placeholder="Choisir"
              disabled={!species}
              onChange={onGenderChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-fit whitespace-nowrap">Fertilité :</label>

            {onFertilityChange ? (
              <input
                type="number"
                min={0}
                value={baseFertility}
                onChange={(e) => onFertilityChange!(Number(e.target.value) || 0)}
                className="w-12 text-center border border-dark-500 rounded-sm"
              />
            ) : (
              <span>{baseFertility}</span>
            )}
            <span>({remainingFertility})</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <p>Groupe d'oeuf : </p>
        {species && species.eggGroups.length > 0 ? (
          <>
            {species.eggGroups.map((group) => (
              <span key={group} className="px-4 py-2 bg-primary-500 rounded-lg text-sm">
                {eggGroupLabels[group] ?? group}
              </span>
            ))}
          </>
        ) : (
          <span className="px-4 py-2 text-sm text-center bg-primary-500 rounded-lg">?</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {stats.map((stat) => (
          <StatSlider
            key={stat}
            stat={stat}
            value={ivs[stat]}
            disabled={!onStatChange}
            onChange={onStatChange ? (v) => onStatChange(stat, v) : undefined}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="w-fit whitespace-nowrap">Item IV : </label>
        <Select
          value={heldItemStat}
          options={breedingItems.map((item) => ({
            value: item.stat,
            label: `${item.nameFr} (${statLabels[item.stat]})`,
          }))}
          placeholder="Choisir"
          clearLabel="Aucun"
          onChange={onItemChange}
        />
      </div>

      <div className="flex gap-2">
        <SecondaryButton className="flex-35" onClick={() => removeCard(card.id)}>
          Supprimer
        </SecondaryButton>

        <PrimaryButton className="flex-65" onClick={() => toggleCardSelection(card.id)} isSelected={isSelected}>
          {isSelected ? "Choisis comme parent" : "Choisir comme parent"}
        </PrimaryButton>
      </div>
    </section>
  );
}
