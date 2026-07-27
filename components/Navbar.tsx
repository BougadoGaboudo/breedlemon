"use client";

import Image from "next/image";
import { PlanFileControls } from "./PlanFileControls";

export default function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center gap-4 py-3">
      <Image src="/images/logo.png" alt="Logo" width={895} height={327} className="w-40 h-auto" />

      <PlanFileControls />
    </nav>
  );
}
