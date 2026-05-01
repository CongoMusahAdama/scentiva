export class CreateProductDto {
  id: string;
  name: string;
  actual: number;
  original: number;
  costPrice?: number;
  tag: string;
  category: string;
  image: string;
  image2?: string;
  desc: string;
  pros: string[];
  cons: string[];
  whenToApply: { icon: string; label: string; detail: string }[];
  perfectOccasion: string;
  status: string;
}

export class UpdateProductDto extends CreateProductDto {}
