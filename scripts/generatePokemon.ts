import fs from "node:fs/promises";
import path from "node:path";

const POKEAPI = "https://pokeapi.co/api/v2";
const TOTAL_POKEMON = 1025;

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

const evolutionChainCache = new Map<string, number>();

async function getBaseFormId(evolutionChainUrl: string): Promise<number> {
  if (evolutionChainCache.has(evolutionChainUrl)) {
    return evolutionChainCache.get(evolutionChainUrl)!;
  }

  const chain = await fetchJson<any>(evolutionChainUrl);
  const baseId = extractIdFromUrl(chain.chain.species.url);

  evolutionChainCache.set(evolutionChainUrl, baseId);
  return baseId;
}

function calculateBreedable(
  genderRate: number,
  isBaby: boolean,
  isLegendary: boolean,
  isMythical: boolean,
  name: string,
) {
  if (name === "ditto") return false;
  if (isBaby || isLegendary || isMythical) return false;
  if (genderRate === -1) return false;
  return true;
}

async function generatePokemon(id: number): Promise<PokemonOutput> {
  const [pokemon, species] = await Promise.all([
    fetchJson<any>(`${POKEAPI}/pokemon/${id}`),
    fetchJson<any>(`${POKEAPI}/pokemon-species/${id}`),
  ]);

  const baseFormId = await getBaseFormId(species.evolution_chain.url);

  return {
    id,
    name: { en: pokemon.name, fr: getName(species.names, "fr") },
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

async function main() {
  console.log("Generating Pokémon database...");
  const pokemons: PokemonOutput[] = [];

  for (let id = 1; id <= TOTAL_POKEMON; id++) {
    try {
      const pokemon = await generatePokemon(id);
      pokemons.push(pokemon);
      console.log(`${id}/${TOTAL_POKEMON} ${pokemon.name.en} -> base: ${pokemon.baseFormId}`);
    } catch (error) {
      console.error(`Failed Pokémon ${id}`, error);
    }
  }

  const outputPath = path.resolve("data/pokemon.json");
  await fs.writeFile(outputPath, JSON.stringify(pokemons, null, 2), "utf-8");
  console.log("Done:", outputPath);
}

main();
