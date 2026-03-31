/**
 * Home page
 * Assembles the three main sections: Hero, ScrollSequence, FinalCTA.
 */

import { Hero } from "@/components/Hero";
import { ScrollSequence } from "@/components/ScrollSequence";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollSequence />
      <FinalCTA />
    </main>
  );
}
