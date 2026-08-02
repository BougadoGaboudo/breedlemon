import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Breedlemon",
  description: "Planifie et organise tes breeds Pokémon sur le serveur Minecraft Cobblemon PlasmaCube !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <header className="bg-light-500 border-b-2 border-dark-500/20 px-8">
          <Navbar />
        </header>
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
