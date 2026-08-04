"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PokemonSpecies } from "@/types";

type SpeciesComboboxProps = {
  value: number | undefined;
  options: PokemonSpecies[];
  placeholder: string;
  onChange: (speciesId: number | undefined) => void;
};

export function SpeciesCombobox({ value, options, placeholder, onChange }: SpeciesComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((s) => s.id === value);

  useEffect(() => {
    setQuery(selected ? selected.name.fr : "");
  }, [selected?.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery(selected ? selected.name.fr : "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((s) => s.name.fr.toLowerCase().includes(q));
  }, [query, options]);

  const handleSelect = (species: PokemonSpecies) => {
    onChange(species.id);
    setQuery(species.name.fr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (value !== undefined) onChange(undefined);
        }}
        className="w-full border border-dark-500 rounded-sm px-2 py-1 bg-light-500"
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-light-500 border-2 border-dark-500 rounded-lg">
          {filtered.length === 0 && <p className="px-3 py-2 text-sm text-dark-500/60">Aucun résultat</p>}
          {filtered.map((species) => (
            <button
              key={species.id}
              type="button"
              onClick={() => handleSelect(species)}
              className={`block w-full text-left px-3 py-2 cursor-pointer hover:bg-primary-500/40 ${
                species.id === value ? "bg-primary-500/25" : ""
              }`}
            >
              {species.name.fr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
