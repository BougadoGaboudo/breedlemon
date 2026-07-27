"use client";

import Image from "next/image";
import { PlanFileControls } from "./PlanFileControls";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center gap-4 py-3">
      <Image src="/images/logo.png" alt="Logo" width={895} height={327} className="w-40 h-auto" />

      <div className="hidden md:flex">
        <PlanFileControls />
      </div>
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-dark-500/75 text-light md:hidden">
          <PlanFileControls />
        </div>
      )}
    </nav>
  );
}
