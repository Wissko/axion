/**
 * Données produits partagées — utilisées par Home, Shop, et pages produit
 */

export interface ProductData {
  id: string;
  slug: string;
  number: string;
  label: string;
  name: string;
  tagline: string;
  description: string;
  specs: string;
  cta: string;
  accent: string;
  background: string;
  modelPath: string;
  imageLeft: boolean;
  ingredients: { name: string; dose: string; role: string }[];
}

export const PRODUCTS: ProductData[] = [
  {
    id: "blue-razz",
    slug: "blue-razz",
    number: "01",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Blue Razz",
    tagline: "Razor sharp focus.",
    description:
      "Engineered for athletes who demand precision. Blue Razz delivers clean, sustained energy with zero crash — powered by 200mg caffeine, L-Theanine, and 4g Citrulline Malate.",
    specs: "200mg Caffeine  ·  150mg L-Theanine  ·  4g Citrulline",
    cta: "Shop Blue Razz",
    accent: "#4F9EF8",
    background: "#040810",
    modelPath: "/models/blue-razz.glb",
    imageLeft: true,
    ingredients: [
      { name: "Caffeine Anhydrous", dose: "200mg", role: "Rapid energy, CNS stimulation" },
      { name: "L-Theanine", dose: "150mg", role: "Smooth focus without jitters" },
      { name: "Beta-Alanine", dose: "2,000mg", role: "Delays muscular fatigue" },
      { name: "Citrulline Malate", dose: "4,000mg", role: "Nitric oxide, blood flow, pump" },
      { name: "Alpha GPC", dose: "200mg", role: "Cognitive enhancement, mind-muscle" },
    ],
  },
  {
    id: "mango",
    slug: "mango",
    number: "02",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Mango",
    tagline: "Tropical surge, peak output.",
    description:
      "Fuel your longest sessions with a tropical explosion of performance. 6g Citrulline Malate, Beta-Alanine complex, and B-vitamins to keep you locked in from rep one to the last.",
    specs: "200mg Caffeine  ·  2.5g Beta-Alanine  ·  6g Citrulline",
    cta: "Shop Mango",
    accent: "#F5B942",
    background: "#0D0800",
    modelPath: "/models/mango.glb",
    imageLeft: false,
    ingredients: [
      { name: "Caffeine Anhydrous", dose: "200mg", role: "Rapid energy, CNS stimulation" },
      { name: "Beta-Alanine", dose: "2,500mg", role: "Delays muscular fatigue" },
      { name: "Citrulline Malate", dose: "6,000mg", role: "Maximum pump and blood flow" },
      { name: "Vitamin B6", dose: "5mg", role: "Metabolic energy pathways" },
      { name: "Vitamin B12", dose: "100mcg", role: "Sustained energy metabolism" },
    ],
  },
  {
    id: "grape",
    slug: "grape",
    number: "03",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Grape",
    tagline: "Dark focus. Night mode power.",
    description:
      "When the lights go down, your performance doesn't. Alpha GPC, L-Tyrosine, and Grape Seed Extract combined with 6g Citrulline for an unmatched mind-muscle connection.",
    specs: "200mg Caffeine  ·  1g L-Tyrosine  ·  300mg Alpha GPC",
    cta: "Shop Grape",
    accent: "#9B72F5",
    background: "#07040F",
    modelPath: "/models/grape.glb",
    imageLeft: true,
    ingredients: [
      { name: "Caffeine Anhydrous", dose: "200mg", role: "Rapid energy, CNS stimulation" },
      { name: "L-Tyrosine", dose: "1,000mg", role: "Dopamine precursor, stress resilience" },
      { name: "Alpha GPC", dose: "300mg", role: "Cognitive enhancement, mind-muscle" },
      { name: "Citrulline Malate", dose: "6,000mg", role: "Maximum pump and blood flow" },
      { name: "Grape Seed Extract", dose: "100mg", role: "Antioxidant recovery" },
    ],
  },
];
