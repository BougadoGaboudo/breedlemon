"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { SaveFileControls } from "./SaveFileControls";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center gap-4 py-3">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={895} height={327} className="w-40 h-auto" />
      </Link>

      <ul className="hidden md:flex md:items-center">
        <li>
          <Link href="/" className="px-4 py-2 transition-all duration-250 ease-out hover:text-primary-500">
            Accueil
          </Link>
        </li>
        <li>
          <Link href="/tree" className="px-4 py-2 transition-all duration-250 ease-out hover:text-primary-500">
            Arbre
          </Link>
        </li>
        <li>
          <Link
            href="/inventory"
            className="px-4 py-2 mr-4 transition-all duration-250 ease-out hover:text-primary-500"
          >
            Inventaire
          </Link>
        </li>

        <li>
          <SaveFileControls />
        </li>
      </ul>
      <button
        type="button"
        className="mx-4 group cursor-pointer relative z-60 flex h-10 w-10 items-center justify-center md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`absolute h-0.75 w-6 rounded transition-all duration-300 ${
            isOpen
              ? "rotate-45 bg-primary-500 group-hover:bg-dark-500"
              : "-translate-y-1.5 bg-dark-500 group-hover:bg-primary-500"
          }`}
        />
        <span
          className={`absolute h-0.75 w-6 rounded transition-all duration-300 ${
            isOpen ? "opacity-0 bg-dark-500" : "bg-dark-500 group-hover:bg-primary-500"
          }`}
        />

        <span
          className={`absolute h-0.75 w-6 rounded transition-all duration-300 ${
            isOpen
              ? "-rotate-45 bg-primary-500 group-hover:bg-dark-500"
              : "translate-y-1.5 bg-dark-500 group-hover:bg-primary-500"
          }`}
        />
      </button>
      {isOpen && (
        <ul className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-dark-500/90 text-light-500 md:hidden">
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/tree">Arbre</Link>
          </li>
          <li>
            <Link href="/inventory">Inventaire</Link>
          </li>

          <li>
            <SaveFileControls />
          </li>
        </ul>
      )}
    </nav>
  );
}
