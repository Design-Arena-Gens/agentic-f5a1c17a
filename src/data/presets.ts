export type CategoryOption = {
  value: string;
  label: string;
  description: string;
  departmentParam?: string;
};

export const categoryOptions: CategoryOption[] = [
  {
    value: "all",
    label: "All Departments",
    description: "Broad search across every Amazon department.",
    departmentParam: "aps",
  },
  {
    value: "electronics",
    label: "Electronics",
    description: "Flagship TVs, audio systems, cinema projectors, and more.",
    departmentParam: "electronics",
  },
  {
    value: "luxury-stores",
    label: "Luxury Stores",
    description: "Curated storefront for designer goods and accessories.",
    departmentParam: "stripbooks", // fall back to broad store if Amazon drops the luxury index
  },
  {
    value: "designer-fashion",
    label: "Designer Fashion",
    description: "Luxury apparel, handbags, and runway accessories.",
    departmentParam: "fashion-womens-intl-ship",
  },
  {
    value: "sports",
    label: "Pro Sports & Fitness",
    description: "Specialty equipment for elite training facilities.",
    departmentParam: "sporting-intl-ship",
  },
  {
    value: "studio",
    label: "Studio & Instruments",
    description: "High-end studio hardware and performance instruments.",
    departmentParam: "musical-instruments",
  },
  {
    value: "industrial",
    label: "Industrial & Scientific",
    description: "Lab gear, heavy-duty tools, and manufacturing equipment.",
    departmentParam: "industrial",
  },
];

export type PricePreset = {
  label: string;
  value: number;
};

export const pricePresets: PricePreset[] = [
  { label: "$1,000+", value: 1000 },
  { label: "$2,500+", value: 2500 },
  { label: "$5,000+", value: 5000 },
  { label: "$10,000+", value: 10000 },
  { label: "$25,000+", value: 25000 },
  { label: "$50,000+", value: 50000 },
];

export type CuratedIdea = {
  title: string;
  subtitle: string;
  query: string;
  categoryValue?: string;
  minPrice?: number;
  chips: string[];
};

export const curatedIdeas: CuratedIdea[] = [
  {
    title: "Ultimate Home Theater",
    subtitle: "MicroLED walls, audiophile amps, and cinema seating.",
    query: "MicroLED home theater system",
    categoryValue: "electronics",
    minPrice: 25000,
    chips: ["microLED", "Dolby Atmos", "audiophile"],
  },
  {
    title: "Exotic Timepieces",
    subtitle: "Limited edition watches from Swiss ateliers.",
    query: "tourbillon watch limited edition",
    categoryValue: "luxury-stores",
    minPrice: 15000,
    chips: ["tourbillon", "mechanical", "Swiss"],
  },
  {
    title: "Next-Level Gaming",
    subtitle: "Water-cooled rigs and immersive flight decks.",
    query: "professional flight simulator cockpit",
    categoryValue: "electronics",
    minPrice: 8000,
    chips: ["sim rig", "hydraulics", "RGB"],
  },
  {
    title: "Recording Studio Royale",
    subtitle: "Reference monitors, consoles, and mastering gear.",
    query: "audiophile mastering console",
    categoryValue: "studio",
    minPrice: 12000,
    chips: ["Neve", "SSL", "tube preamp"],
  },
  {
    title: "Collector's Instruments",
    subtitle: "Signed guitars and rare violins for virtuosos.",
    query: "collector electric guitar limited edition",
    categoryValue: "studio",
    minPrice: 6000,
    chips: ["limited run", "autographed", "boutique"],
  },
  {
    title: "Luxury Fitness Lab",
    subtitle: "Smart training systems and recovery technology.",
    query: "smart gym system professional",
    categoryValue: "sports",
    minPrice: 7000,
    chips: ["AI coach", "cryotherapy", "performance"],
  },
  {
    title: "Architectural Lighting",
    subtitle: "Design-grade fixtures for gallery spaces.",
    query: "architectural lighting fixture chandelier",
    categoryValue: "industrial",
    minPrice: 4000,
    chips: ["bespoke", "led array", "art gallery"],
  },
  {
    title: "Pro Kitchen Suite",
    subtitle: "Chef-grade appliances and smart cooking tools.",
    query: "professional kitchen suite",
    categoryValue: "electronics",
    minPrice: 9000,
    chips: ["induction", "sous vide", "smart kitchen"],
  },
];
