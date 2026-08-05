"use client";

import { useThemeStore } from "@/stores/themeStore";
import Image from "next/image";
import Link from "next/link";

export default function HeroArea() {
  const { theme } = useThemeStore();
  return (
    <>
      <section className="py-24 max-w-7xl mx-auto flex flex-col gap-4 items-center justify-center text-center px-4 md:px-0">
        <h1>
          <Image src="/images/logo.png" alt="Breedlemon" width={895} height={327} className="w-100 h-auto" />
        </h1>
        <p className="text-lg">
          Planifie et optimise tes breedings Pokémon pour le serveur Minecraft Cobblemon PlasmaCube.
        </p>
        <Link
          href="/tree"
          className="px-4 py-2 rounded-lg transition-all duration-300 ease-out border border-primary-500 bg-primary-500 text-dark-500 hover:bg-dark-500 hover:text-primary-500 hover:border-dark-500"
        >
          Breed les tous !
        </Link>
      </section>
      <Image
        src={theme === "dark" ? "/images/bougado-dark.svg" : "/images/bougado-light.svg"}
        alt="Bougado"
        width={400}
        height={400}
        className="w-100 h-auto mx-auto px-4 md:px-0"
      />
    </>
  );
}
