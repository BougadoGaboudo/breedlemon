import fs from "node:fs/promises";
import path from "node:path";

const POKEAPI = "https://pokeapi.co/api/v2";
const TOTAL_SPECIES = 1025;

const ALLOWED_REGIONS = ["alola", "galar", "hisui", "paldea"] as const;
const REGION_INITIALS: Record<string, string> = {
  alola: "A",
  galar: "G",
  hisui: "H",
  paldea: "P",
};

const DROPPED_SUB_VARIANT_KEYWORDS = ["zen"];

const EXCLUDED_VARIETY_NAMES = ["tauros-paldea-blaze-breed", "tauros-paldea-aqua-breed"];

const EXCLUSIVE_REGIONAL_EVOLUTIONS: Record<number, string> = {
  980: "wooper-paldea",
  903: "sneasel-hisui",
  904: "qwilfish-hisui",
};

type PokemonOutput = {
  id: number;
  name: { en: string; fr: string };
  sprite: string;
  types: string[];
  eggGroups: string[];
  genderRate: number;
  abilities: { name: string; hidden: boolean }[];
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  isBreedable: boolean;
  canBreedWithDitto: boolean;
  baseFormId: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed fetching ${url}`);
  return response.json();
}

function getName(names: any[], language: string): string {
  return names.find((n) => n.language.name === language)?.name ?? "";
}

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Cannot extract id from ${url}`);
  return Number(match[1]);
}

function extractSuffix(pokemonName: string, speciesName: string): string | null {
  if (pokemonName === speciesName) return null;
  const prefix = `${speciesName}-`;
  return pokemonName.startsWith(prefix) ? pokemonName.slice(prefix.length) : null;
}

function isAllowedRegionalSuffix(suffix: string | null): boolean {
  if (!suffix) return false;
  const region = suffix.split("-")[0];
  return (ALLOWED_REGIONS as readonly string[]).includes(region);
}

function shouldDropSubVariant(suffix: string | null): boolean {
  if (!suffix) return false;
  const [, ...extra] = suffix.split("-");
  return extra.some((part) => DROPPED_SUB_VARIANT_KEYWORDS.includes(part));
}

function buildDisplayName(baseNameFr: string, suffix: string): string {
  const region = suffix.split("-")[0];
  const initial = REGION_INITIALS[region] ?? region[0].toUpperCase();
  return `${baseNameFr} (${initial})`;
}

const speciesCache = new Map<number, any>();

async function getSpecies(speciesId: number): Promise<any> {
  if (speciesCache.has(speciesId)) return speciesCache.get(speciesId);
  const species = await fetchJson<any>(`${POKEAPI}/pokemon-species/${speciesId}`);
  speciesCache.set(speciesId, species);
  return species;
}

const rootSpeciesIdCache = new Map<string, number>();

async function getRootSpeciesId(evolutionChainUrl: string): Promise<number> {
  if (rootSpeciesIdCache.has(evolutionChainUrl)) return rootSpeciesIdCache.get(evolutionChainUrl)!;
  const chain = await fetchJson<any>(evolutionChainUrl);
  const rootId = extractIdFromUrl(chain.chain.species.url);
  rootSpeciesIdCache.set(evolutionChainUrl, rootId);
  return rootId;
}

async function resolveBaseFormId(
  currentSpeciesId: number,
  rootSpeciesId: number,
  regionalSuffix: string | null,
): Promise<number> {
  const exclusiveParentName = EXCLUSIVE_REGIONAL_EVOLUTIONS[currentSpeciesId];
  if (exclusiveParentName) {
    const parentPokemon = await fetchJson<any>(`${POKEAPI}/pokemon/${exclusiveParentName}`);
    return parentPokemon.id;
  }

  const rootSpecies = await getSpecies(rootSpeciesId);
  const defaultVarietyId = extractIdFromUrl(rootSpecies.varieties.find((v: any) => v.is_default).pokemon.url);

  if (!regionalSuffix) return defaultVarietyId;

  const region = regionalSuffix.split("-")[0];
  const regionalVariety = rootSpecies.varieties.find((v: any) => {
    const varietySuffix = extractSuffix(v.pokemon.name, rootSpecies.name);
    return varietySuffix?.split("-")[0] === region;
  });

  return regionalVariety ? extractIdFromUrl(regionalVariety.pokemon.url) : defaultVarietyId;
}

function calculateBreedable(
  genderRate: number,
  isBaby: boolean,
  isLegendary: boolean,
  isMythical: boolean,
  name: string,
) {
  if (name.startsWith("ditto")) return false;
  if (isBaby || isLegendary || isMythical) return false;
  if (genderRate === -1) return false;
  return true;
}

async function generatePokemonVariant(
  varietyPokemonUrl: string,
  species: any,
  suffix: string | null,
): Promise<PokemonOutput> {
  const pokemon = await fetchJson<any>(varietyPokemonUrl);

  const rootSpeciesId = await getRootSpeciesId(species.evolution_chain.url);
  const baseFormId = await resolveBaseFormId(species.id, rootSpeciesId, suffix);

  const baseNameFr = getName(species.names, "fr");
  const nameFr = suffix ? buildDisplayName(baseNameFr, suffix) : baseNameFr;

  return {
    id: pokemon.id,
    name: { en: pokemon.name, fr: nameFr },
    sprite: pokemon.sprites.other?.["official-artwork"]?.front_default ?? null,
    types: pokemon.types.map((t: any) => t.type.name),
    eggGroups: species.egg_groups.map((g: any) => g.name),
    genderRate: species.gender_rate,
    abilities: pokemon.abilities.map((a: any) => ({ name: a.ability.name, hidden: a.is_hidden })),
    isBaby: species.is_baby,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    isBreedable: calculateBreedable(
      species.gender_rate,
      species.is_baby,
      species.is_legendary,
      species.is_mythical,
      pokemon.name,
    ),
    canBreedWithDitto: species.gender_rate !== -1 && !species.is_baby && !species.is_legendary && !species.is_mythical,
    baseFormId,
  };
}

async function generateSpeciesEntries(speciesId: number): Promise<PokemonOutput[]> {
  const species = await getSpecies(speciesId);

  const results: PokemonOutput[] = [];
  for (const variety of species.varieties) {
    const suffix = extractSuffix(variety.pokemon.name, species.name);

    if (!variety.is_default) {
      if (!isAllowedRegionalSuffix(suffix)) continue;
      if (shouldDropSubVariant(suffix)) continue;
      if (EXCLUDED_VARIETY_NAMES.includes(variety.pokemon.name)) continue;
    }

    const entry = await generatePokemonVariant(variety.pokemon.url, species, variety.is_default ? null : suffix);
    results.push(entry);
  }
  return results;
}

async function main() {
  console.log("Generating Pokémon database (regional forms only, form-aware breeding)...");
  const pokemons: PokemonOutput[] = [];

  for (let speciesId = 1; speciesId <= TOTAL_SPECIES; speciesId++) {
    try {
      const entries = await generateSpeciesEntries(speciesId);
      pokemons.push(...entries);
      console.log(
        `${speciesId}/${TOTAL_SPECIES} -> ${entries.map((e) => `${e.name.fr} (#${e.id}, base:${e.baseFormId})`).join(", ")}`,
      );
    } catch (error) {
      console.error(`Failed species ${speciesId}`, error);
    }
  }

  const outputPath = path.resolve("data/pokemon.json");
  await fs.writeFile(outputPath, JSON.stringify(pokemons, null, 2), "utf-8");
  console.log(`Done: ${outputPath} (${pokemons.length} entrées)`);
}

main();
