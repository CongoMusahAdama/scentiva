export type Product = {
  id: string;
  name: string;
  actual: number;
  original: number;
  tag: string;
  category: string;
  image: string;
  desc: string;
  pros: string[];
  cons: string[];
  whenToApply: { icon: string; label: string; detail: string }[];
  perfectOccasion: string;
  status?: "in-stock" | "sold-out";
  image2?: string;
};
